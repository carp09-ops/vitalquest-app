import { describe, expect, it } from 'vitest'
import { evaluateXPTrust, scaleTrustedAmount } from '../../xpTrust'

// Golden tests for the original scorer. The pipeline refactor must never
// change these numbers; pipeline.test.ts asserts equivalence directly.
describe('evaluateXPTrust (original scorer, golden)', () => {
  const stamps = Array.from({ length: 12 }, (_, i) => new Date(Date.now() + i * 210000).toISOString())

  it('scores a believable live-tracked lift at 97 / VERIFIED', () => {
    const r = evaluateXPTrust(120, {
      source: 'live_app',
      modality: 'resistance',
      durationMinutes: 45,
      completedUnits: 12,
      totalVolume: 18500,
      liveTracked: true,
      setTimestamps: stamps,
      cadenceCoverage: 1,
      medianSetGapSeconds: 210,
    })
    expect(r.confidence).toBe(97)
    expect(r.tier).toBe('VERIFIED')
    expect(r.multiplier).toBe(1)
    expect(r.awardedXP).toBe(120)
    expect(r.withheldXP).toBe(0)
  })

  it('scores a bare manual entry at 25 / SELF_REPORTED', () => {
    const r = evaluateXPTrust(120, {})
    expect(r.confidence).toBe(25)
    expect(r.tier).toBe('SELF_REPORTED')
    expect(r.multiplier).toBe(0.55)
    expect(r.awardedXP).toBe(66)
    expect(r.withheldXP).toBe(54)
  })

  it('applies the duplicate penalty', () => {
    const clean = evaluateXPTrust(120, { source: 'live_app', durationMinutes: 45, liveTracked: true })
    const duped = evaluateXPTrust(120, {
      source: 'live_app',
      durationMinutes: 45,
      liveTracked: true,
      duplicateDetected: true,
    })
    expect(duped.confidence).toBe(clean.confidence - 45)
  })
})

describe('scaleTrustedAmount', () => {
  it('floors the scaled amount', () => {
    expect(scaleTrustedAmount(100, 0.75)).toBe(75)
    expect(scaleTrustedAmount(10, 0.55)).toBe(5)
    expect(scaleTrustedAmount(0, 1)).toBe(0)
  })
})
