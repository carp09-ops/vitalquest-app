import { describe, expect, it } from 'vitest'
import { evaluateXPTrust, type VerificationEvidence, type VerificationSource } from '../../xpTrust'
import { evaluateSessionIntegrity } from '../../sessionIntegrity'
import { runTrustPipelineDetailed } from '../pipeline'
import { sessionSaveTrustInput, sessionSaveVerifiers, type TrustSaveInput } from '../sessionSave'
import type { TrustVerifier } from '../types'
import type { ActivityModality } from '../../xpTrust'

// ---------------------------------------------------------------------------
// The legacy assembly, copied verbatim from writeSessionBase before migration
// (mergeVerificationEvidence lives in sensorVerification, which needs native
// modules, so its 5-line semantics are inlined here).
// ---------------------------------------------------------------------------
function legacyMerge(
  primary: VerificationEvidence,
  secondary?: VerificationEvidence | null,
): VerificationEvidence {
  if (!secondary) return primary
  const p = (s?: VerificationSource) =>
    s === 'wearable' ? 4 : s === 'healthkit' ? 3 : s === 'gps' ? 2 : s === 'live_app' ? 1 : 0
  return {
    ...primary,
    ...secondary,
    source: p(secondary.source) >= p(primary.source) ? secondary.source : primary.source,
    sensorMinutes: Math.max(Number(primary.sensorMinutes || 0), Number(secondary.sensorMinutes || 0)),
  }
}

async function legacyTrust(
  db: { getAllAsync: (sql: string) => Promise<unknown[]> },
  input: TrustSaveInput,
  modality: ActivityModality,
  totalXP: number,
  healthEvidence: VerificationEvidence | null,
) {
  const integrity = await evaluateSessionIntegrity(db as never, {
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMinutes: input.durationMinutes,
  })
  const baseEvidence: VerificationEvidence = {
    source: 'live_app',
    modality,
    durationMinutes: input.durationMinutes,
    totalVolume: input.totalVolume,
    liveTracked: true,
    ...input.verificationEvidence,
  }
  const evidence = legacyMerge(baseEvidence, healthEvidence)
  const trust = evaluateXPTrust(totalXP, {
    ...evidence,
    duplicateDetected: integrity.duplicateDetected || Boolean(evidence.duplicateDetected),
    clockMismatch: integrity.clockMismatch || Boolean(evidence.clockMismatch),
  })
  return { trust, integrity }
}

const MIN = 60000
const now = Date.now()
const iso = (t: number) => new Date(t).toISOString()
const emptyDb = { getAllAsync: async () => [] }

// Mirrors the ActiveWorkoutV2 save call: caller-supplied cadence evidence.
function workoutInput(): TrustSaveInput {
  const stamps = Array.from({ length: 12 }, (_, i) => iso(now - 45 * MIN + (i + 1) * 3.5 * MIN))
  return {
    startedAt: iso(now - 45 * MIN),
    completedAt: iso(now),
    durationMinutes: 45,
    totalVolume: 18500,
    verificationEvidence: {
      source: 'live_app',
      modality: 'resistance',
      liveTracked: true,
      completedUnits: 12,
      totalVolume: 18500,
      setTimestamps: stamps,
      medianSetGapSeconds: 210,
      cadenceCoverage: 1,
      implausibleSpike: false,
    },
  }
}

function stripEvidence<T extends { evidence: unknown; ruleBreakdown?: unknown; baseScore?: unknown }>(r: T) {
  const { evidence: _dropped, ruleBreakdown: _b, baseScore: _s, ...rest } = r
  return rest
}

describe('session-save migration equivalence', () => {
  it('matches the legacy assembly on a live-tracked lift', async () => {
    const input = workoutInput()
    const verifiers = sessionSaveVerifiers(emptyDb, input, 'resistance')
    const next = await runTrustPipelineDetailed(120, sessionSaveTrustInput(input, 'resistance'), verifiers)
    const { trust: prev } = await legacyTrust(emptyDb, input, 'resistance', 120, null)
    expect(stripEvidence(next)).toEqual(stripEvidence(prev))
    expect(next.reasons).toEqual(prev.reasons)
  })

  it('matches the legacy assembly when health evidence wins the merge', async () => {
    const stubHealth: TrustVerifier = {
      id: 'stub_health',
      priority: 3,
      collect: async () => ({ source: 'healthkit', sensorMinutes: 30 }),
    }
    const input = workoutInput()
    const verifiers = [...sessionSaveVerifiers(emptyDb, input, 'resistance'), stubHealth]
    const next = await runTrustPipelineDetailed(120, sessionSaveTrustInput(input, 'resistance'), verifiers)
    const { trust: prev } = await legacyTrust(emptyDb, input, 'resistance', 120, {
      source: 'healthkit',
      sensorMinutes: 30,
    })
    expect(stripEvidence(next)).toEqual(stripEvidence(prev))
    expect(next.evidence.source).toBe('healthkit')
  })

  it('matches the legacy assembly on an endurance session with a duplicate', async () => {
    const dupDb = {
      getAllAsync: async () => [
        { id: 'prior', started_at: iso(now - 60 * MIN), completed_at: iso(now - 20 * MIN) },
      ],
    }
    const input: TrustSaveInput = {
      startedAt: iso(now - 30 * MIN),
      completedAt: iso(now),
      durationMinutes: 30,
      totalVolume: 0,
      verificationEvidence: {
        modality: 'endurance',
        completedUnits: 1,
        distanceMiles: 3.1,
        avgPaceSeconds: 540,
      },
    }
    const verifiers = sessionSaveVerifiers(dupDb, input, 'endurance')
    const next = await runTrustPipelineDetailed(90, sessionSaveTrustInput(input, 'endurance'), verifiers)
    const { trust: prev } = await legacyTrust(dupDb, input, 'endurance', 90, null)
    expect(stripEvidence(next)).toEqual(stripEvidence(prev))
    expect(next.tier).toBe(prev.tier)
  })

  it('preserves the integrity ledger fields for the verification record', async () => {
    const dupDb = {
      getAllAsync: async () => [
        { id: 'prior', started_at: iso(now - 60 * MIN), completed_at: iso(now - 20 * MIN) },
      ],
    }
    const input = workoutInput()
    const next = await runTrustPipelineDetailed(
      120,
      sessionSaveTrustInput(input, 'resistance'),
      sessionSaveVerifiers(dupDb, input, 'resistance'),
    )
    const { integrity } = await legacyTrust(dupDb, input, 'resistance', 120, null)
    const ledger = next.evidence as VerificationEvidence & { overlapCount: number; overlapSeconds: number }
    expect({
      duplicateDetected: ledger.duplicateDetected,
      clockMismatch: ledger.clockMismatch,
      overlapCount: ledger.overlapCount,
      overlapSeconds: ledger.overlapSeconds,
    }).toEqual(integrity)
  })
})
