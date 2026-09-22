import { describe, expect, it } from 'vitest'
import { runTrustPipelineDetailed } from '../pipeline'
import { sessionSaveTrustInput, sessionSaveVerifiers, type TrustSaveInput } from '../sessionSave'
import type { VerificationEvidence } from '../../xpTrust'

// Pins the cadence-derivation decision: set cadence is derived from persisted
// set rows instead of trusting caller-computed fields.

const MIN = 60000
const now = Date.now()
const iso = (t: number) => new Date(t).toISOString()
const start = now - 45 * MIN
const emptyDb = { getAllAsync: async (): Promise<unknown[]> => [] }

type SetRow = { completedAt?: string | null }
const stamped = (n: number, gapMs: number): SetRow[] =>
  Array.from({ length: n }, (_, i) => ({ completedAt: iso(start + (i + 1) * gapMs) }))
const unstamped = (n: number): SetRow[] => Array.from({ length: n }, () => ({ completedAt: null }))

function callerEvidence(o: {
  source?: VerificationEvidence['source']
  volume?: number
  gapSeconds?: number
  coverage?: number
}): VerificationEvidence {
  const n = 12
  const gapMs = (o.gapSeconds ?? 210) * 1000
  const count = Math.round(n * (o.coverage ?? 1))
  return {
    source: o.source ?? 'live_app',
    modality: 'resistance',
    liveTracked: true,
    completedUnits: n,
    totalVolume: o.volume ?? 18500,
    setTimestamps: Array.from({ length: count }, (_, i) => iso(start + (i + 1) * gapMs)),
    medianSetGapSeconds: o.gapSeconds ?? 210,
    cadenceCoverage: o.coverage ?? 1,
    implausibleSpike: false,
  }
}

function baseInput(ve: VerificationEvidence, sets?: SetRow[]): TrustSaveInput {
  return {
    startedAt: iso(start),
    completedAt: iso(now),
    durationMinutes: 45,
    totalVolume: ve.totalVolume ?? 0,
    verificationEvidence: ve,
    sets,
  }
}

/** Old world: caller-computed cadence fields, sets invisible to the pipeline. */
function legacyScoring(rawXP: number, ve: VerificationEvidence) {
  const input = baseInput(ve)
  return runTrustPipelineDetailed(rawXP, sessionSaveTrustInput(input, 'resistance'), sessionSaveVerifiers(emptyDb, input, 'resistance'))
}

/** New world: no caller cadence fields; derived from set rows. */
function derivedScoring(rawXP: number, ve: VerificationEvidence, sets: SetRow[]) {
  const stripped: VerificationEvidence = { ...ve }
  delete stripped.setTimestamps
  delete stripped.medianSetGapSeconds
  delete stripped.cadenceCoverage
  const input = baseInput(stripped, sets)
  return runTrustPipelineDetailed(rawXP, sessionSaveTrustInput(input, 'resistance'), sessionSaveVerifiers(emptyDb, input, 'resistance'))
}

function summary(r: { confidence: number; tier: string; awardedXP: number }) {
  return { confidence: r.confidence, tier: r.tier, awardedXP: r.awardedXP }
}

describe('cadence derivation', () => {
  it('is behavior-preserving for an honest paced lift', async () => {
    const ve = callerEvidence({})
    const legacy = await legacyScoring(120, ve)
    const derived = await derivedScoring(120, ve, stamped(12, 210000))
    expect(summary(derived)).toEqual({ confidence: 97, tier: 'VERIFIED', awardedXP: 120 })
    expect(summary(derived)).toEqual(summary(legacy))
  })

  it('is behavior-preserving for an honest rushed lift', async () => {
    const ve = callerEvidence({ gapSeconds: 5 })
    const legacy = await legacyScoring(120, ve)
    const derived = await derivedScoring(120, ve, stamped(12, 5000))
    expect(summary(derived)).toEqual({ confidence: 66, tier: 'CORROBORATED', awardedXP: 120 })
    expect(summary(derived)).toEqual(summary(legacy))
  })

  it('ignores a lying caller: rushed sets can no longer claim paced cadence', async () => {
    const ve = callerEvidence({}) // claims 3.5-minute gaps...
    const sets = stamped(12, 5000) // ...but sets are 5 seconds apart
    const legacy = await legacyScoring(120, ve)
    const derived = await derivedScoring(120, ve, sets)
    expect(legacy.confidence).toBe(97)
    expect(derived.confidence).toBe(66)
    expect(derived.tier).toBe('CORROBORATED')
  })

  it('costs a lying caller real XP on a bodyweight session', async () => {
    const ve = callerEvidence({ volume: 0 })
    const sets = stamped(12, 5000)
    const legacy = await legacyScoring(120, ve)
    const derived = await derivedScoring(120, ve, sets)
    expect(summary(legacy)).toEqual({ confidence: 90, tier: 'VERIFIED', awardedXP: 120 })
    expect(summary(derived)).toEqual({ confidence: 59, tier: 'TRACKED', awardedXP: 90 })
  })

  it('rewards timestamped manual entries automatically', async () => {
    const ve: VerificationEvidence = {
      source: 'manual_entry',
      modality: 'resistance',
      completedUnits: 12,
      totalVolume: 18500,
    }
    const legacy = await legacyScoring(120, ve)
    const derived = await derivedScoring(120, ve, stamped(12, 210000))
    expect(summary(legacy)).toEqual({ confidence: 60, tier: 'TRACKED', awardedXP: 90 })
    expect(summary(derived)).toEqual({ confidence: 77, tier: 'CORROBORATED', awardedXP: 120 })
  })

  it('treats bulk-logged sessions (no timestamps) exactly as before', async () => {
    const ve: VerificationEvidence = {
      source: 'manual_entry',
      modality: 'resistance',
      completedUnits: 12,
      totalVolume: 18500,
    }
    const legacy = await legacyScoring(120, ve)
    const derived = await derivedScoring(120, ve, unstamped(12))
    expect(summary(derived)).toEqual(summary(legacy))
    expect(summary(derived)).toEqual({ confidence: 60, tier: 'TRACKED', awardedXP: 90 })
  })

  it('does not punish honest data loss', async () => {
    const ve = callerEvidence({ gapSeconds: 0, coverage: 0 })
    const legacy = await legacyScoring(120, ve)
    const derived = await derivedScoring(120, ve, unstamped(12))
    expect(summary(derived)).toEqual(summary(legacy))
    expect(summary(derived)).toEqual({ confidence: 80, tier: 'CORROBORATED', awardedXP: 120 })
  })

  it('gives partial credit for partially timestamped sessions', async () => {
    const ve = callerEvidence({})
    const sets = [...stamped(6, 210000), ...unstamped(6)]
    const derived = await derivedScoring(120, ve, sets)
    // coverage 0.5 misses the 0.6 bonus threshold, but believable gaps -> +6
    expect(summary(derived)).toEqual({ confidence: 86, tier: 'VERIFIED', awardedXP: 120 })
  })
})

describe('sessionSaveTrustInput timestamp mapping', () => {
  it('uses only real timestamps, never nulls', () => {
    const input = baseInput({ modality: 'resistance' }, [
      { completedAt: iso(start + 1000) },
      { completedAt: null },
      {},
    ])
    expect(sessionSaveTrustInput(input, 'resistance').setTimestamps).toEqual([iso(start + 1000)])
  })
  it('omits setTimestamps when no set has a timestamp', () => {
    const input = baseInput({ modality: 'resistance' }, unstamped(12))
    expect(sessionSaveTrustInput(input, 'resistance').setTimestamps).toBeUndefined()
  })
})
