import { describe, expect, it } from 'vitest'
import { adjudicate, applyRules } from '../scoring'
import { defaultRules, type ScoringRule } from '../rules'

describe('applyRules', () => {
  it('sums deltas and concatenates reasons in rule order', () => {
    const rules: ScoringRule[] = [
      { id: 'a', score: () => ({ delta: 10, reasons: ['first'] }) },
      { id: 'b', score: () => ({ delta: -4, reasons: ['second', 'third'] }) },
    ]
    expect(applyRules(rules, {})).toEqual({ score: 6, reasons: ['first', 'second', 'third'] })
  })
})

describe('adjudicate', () => {
  const evidence = {}
  it('maps score bands to tiers and multipliers', () => {
    expect(adjudicate(100, 97, [], evidence).tier).toBe('VERIFIED')
    expect(adjudicate(100, 85, [], evidence).tier).toBe('VERIFIED')
    expect(adjudicate(100, 84, [], evidence).tier).toBe('CORROBORATED')
    expect(adjudicate(100, 65, [], evidence).tier).toBe('CORROBORATED')
    expect(adjudicate(100, 64, [], evidence).tier).toBe('TRACKED')
    expect(adjudicate(100, 45, [], evidence).tier).toBe('TRACKED')
    expect(adjudicate(100, 44, [], evidence).tier).toBe('SELF_REPORTED')
    expect(adjudicate(100, 97, [], evidence).multiplier).toBe(1)
    expect(adjudicate(100, 50, [], evidence).multiplier).toBe(0.75)
    expect(adjudicate(100, 20, [], evidence).multiplier).toBe(0.55)
  })
  it('clamps confidence to 0..100', () => {
    expect(adjudicate(100, 250, [], evidence).confidence).toBe(100)
    expect(adjudicate(100, -40, [], evidence).confidence).toBe(0)
  })
  it('splits raw XP into awarded and withheld', () => {
    const r = adjudicate(120, 50, ['a reason'], evidence)
    expect(r.awardedXP).toBe(90)
    expect(r.withheldXP).toBe(30)
    expect(r.rawXP).toBe(120)
    expect(r.reasons).toEqual(['a reason'])
    expect(r.evidence).toBe(evidence)
  })
  it('floors awarded XP at zero', () => {
    const r = adjudicate(0, 0, [], evidence)
    expect(r.awardedXP).toBe(0)
    expect(r.withheldXP).toBe(0)
    // the 0.55 minimum multiplier means positive XP is never zeroed by a bad score
    expect(adjudicate(120, -100, [], evidence).awardedXP).toBe(66)
  })
})

describe('defaultRules end-to-end sanity', () => {
  it('scores a believable live-tracked lift as VERIFIED', () => {
    const stamps = Array.from({ length: 12 }, (_, i) => new Date(Date.now() + i * 210000).toISOString())
    const { score } = applyRules(defaultRules, {
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
    // 45 + 10 + 10 + 8 + 7 + 8 + 6 + 3
    expect(score).toBe(97)
    expect(adjudicate(120, score, [], {}).tier).toBe('VERIFIED')
  })
})
