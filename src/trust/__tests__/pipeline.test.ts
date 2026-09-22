import { describe, expect, it } from 'vitest'
import { evaluateXPTrust } from '../../xpTrust'
import { runTrustPipeline, runTrustPipelineDetailed } from '../pipeline'
import { liveAppVerifier, manualEntryVerifier, sessionIntegrityVerifier } from '../verifiers'
import type { TrustSessionInput, TrustVerifier } from '../types'
import type { VerificationEvidence } from '../../xpTrust'

const MIN = 60000
const now = Date.now()
const iso = (t: number) => new Date(t).toISOString()

function liftSession(stamps?: string[]): TrustSessionInput {
  return {
    modality: 'resistance',
    startedAt: iso(now - 45 * MIN),
    completedAt: iso(now),
    durationMinutes: 45,
    completedUnits: 12,
    totalVolume: 18500,
    setTimestamps: stamps,
  }
}

const realisticStamps = () => Array.from({ length: 12 }, (_, i) => iso(now - 45 * MIN + (i + 1) * 3.5 * MIN))
const emptyDb = { getAllAsync: async () => [] }

const v = (id: string, priority: number, evidence: Partial<VerificationEvidence>): TrustVerifier => ({
  id,
  priority,
  collect: async () => evidence,
})

describe('merge precedence', () => {
  it('lets higher priority win scalar fields like source', async () => {
    const r = await runTrustPipelineDetailed(
      100,
      liftSession(),
      [v('a', 0, { source: 'manual_entry' }), v('b', 3, { source: 'healthkit' })],
    )
    expect(r.evidence.source).toBe('healthkit')
  })
  it('takes the max of sensorMinutes and ORs boolean flags', async () => {
    const r = await runTrustPipelineDetailed(100, liftSession(), [
      v('a', 0, { sensorMinutes: 10, duplicateDetected: false }),
      v('b', 3, { sensorMinutes: 30, duplicateDetected: true }),
    ])
    expect(r.evidence.sensorMinutes).toBe(30)
    expect(r.evidence.duplicateDetected).toBe(true)
  })
  it('ignores nullish values so they never clobber real evidence', async () => {
    const r = await runTrustPipelineDetailed(100, liftSession(), [
      v('a', 0, { distanceMiles: 3.1 }),
      v('b', 3, { distanceMiles: undefined }),
    ])
    expect(r.evidence.distanceMiles).toBe(3.1)
  })
})

describe('verifier isolation', () => {
  it('a throwing verifier contributes nothing instead of failing the session', async () => {
    const bad: TrustVerifier = {
      id: 'bad',
      priority: 5,
      collect: async () => {
        throw new Error('sensor exploded')
      },
    }
    const r = await runTrustPipeline(120, liftSession(realisticStamps()), [
      manualEntryVerifier,
      liveAppVerifier,
      bad,
      sessionIntegrityVerifier(emptyDb),
    ])
    expect(r.tier).toBe('VERIFIED')
    expect(r.awardedXP).toBe(120)
  })
})

describe('equivalence with the original scorer', () => {
  it('matches evaluateXPTrust exactly on a live-tracked lift', async () => {
    const session = liftSession(realisticStamps())
    const verifiers = [manualEntryVerifier, liveAppVerifier, sessionIntegrityVerifier(emptyDb)]
    const detail = await runTrustPipelineDetailed(120, session, verifiers)
    const expected = evaluateXPTrust(120, detail.evidence)
    expect({ ...detail, ruleBreakdown: undefined, baseScore: undefined }).toEqual({
      ...expected,
      ruleBreakdown: undefined,
      baseScore: undefined,
    })
  })
  it('matches evaluateXPTrust exactly on a penalized session', async () => {
    const dupDb = {
      getAllAsync: async () => [
        { id: 'prior', started_at: iso(now - 60 * MIN), completed_at: iso(now - 20 * MIN) },
      ],
    }
    const session = liftSession()
    const verifiers = [manualEntryVerifier, sessionIntegrityVerifier(dupDb)]
    const detail = await runTrustPipelineDetailed(120, session, verifiers)
    const expected = evaluateXPTrust(120, detail.evidence)
    expect(detail.tier).toBe(expected.tier)
    expect(detail.confidence).toBe(expected.confidence)
    expect(detail.awardedXP).toBe(expected.awardedXP)
    expect(detail.reasons).toEqual(expected.reasons)
  })
})

describe('custom rule sets', () => {
  it('lets callers swap the scoring rules without touching anything else', async () => {
    const strict = [
      { id: 'paranoid', score: () => ({ delta: -100, reasons: ['nothing is trusted'] }) },
    ]
    const r = await runTrustPipeline(120, liftSession(realisticStamps()), [manualEntryVerifier], strict)
    expect(r.tier).toBe('SELF_REPORTED')
    expect(r.awardedXP).toBe(66)
    expect(r.reasons).toEqual(['nothing is trusted'])
  })
})

describe('runTrustPipelineDetailed', () => {
  it('exposes a per-rule breakdown that sums to the base score', async () => {
    const detail = await runTrustPipelineDetailed(120, liftSession(realisticStamps()), [
      manualEntryVerifier,
      liveAppVerifier,
      sessionIntegrityVerifier(emptyDb),
    ])
    expect(detail.ruleBreakdown).toHaveLength(10)
    expect(detail.ruleBreakdown.reduce((n, b) => n + b.delta, 0)).toBe(detail.baseScore)
    expect(detail.baseScore).toBe(detail.confidence)
    const cadence = detail.ruleBreakdown.find((b) => b.id === 'resistance_cadence')
    expect(cadence?.delta).toBe(17)
  })
})
