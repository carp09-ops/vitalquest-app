import { describe, expect, it } from 'vitest'
import {
  baseSourceRule,
  defaultRules,
  durationPlausibilityRule,
  endurancePlausibilityRule,
  integrityPenaltyRule,
  liveTrackedBonusRule,
  recoveryRule,
  resistanceCadenceRule,
  resistanceVolumeRule,
  sensorCorroborationRule,
  workDensityRule,
} from '../rules'
import type { VerificationEvidence } from '../../xpTrust'

const ev = (partial: Partial<VerificationEvidence> = {}): VerificationEvidence => ({ ...partial })

describe('baseSourceRule', () => {
  it('trusts independent sensor sources at 72', () => {
    for (const source of ['wearable', 'healthkit', 'gps'] as const) {
      const r = baseSourceRule.score(ev({ source }))
      expect(r.delta).toBe(72)
      expect(r.reasons).toEqual(['Independent device or sensor source attached.'])
    }
  })
  it('scores live_app at 45 with no reason of its own', () => {
    expect(baseSourceRule.score(ev({ source: 'live_app' }))).toEqual({ delta: 45, reasons: [] })
  })
  it('defaults manual entry and missing source to 25', () => {
    expect(baseSourceRule.score(ev({ source: 'manual_entry' })).delta).toBe(25)
    expect(baseSourceRule.score(ev()).delta).toBe(25)
  })
})

describe('liveTrackedBonusRule', () => {
  it('adds nothing for sensor sources', () => {
    expect(liveTrackedBonusRule.score(ev({ source: 'gps' }))).toEqual({ delta: 0, reasons: [] })
  })
  it('rewards live tracking', () => {
    const r = liveTrackedBonusRule.score(ev({ source: 'live_app', liveTracked: true }))
    expect(r).toEqual({ delta: 10, reasons: ['Session was tracked live inside VitalQuest.'] })
  })
  it('explains when the session is self-reported', () => {
    const r = liveTrackedBonusRule.score(ev({ source: 'live_app' }))
    expect(r).toEqual({ delta: 0, reasons: ['Session relies primarily on user-entered data.'] })
  })
})

describe('durationPlausibilityRule', () => {
  it('rewards plausible durations including boundaries', () => {
    for (const d of [8, 45, 240]) {
      const r = durationPlausibilityRule.score(ev({ durationMinutes: d }))
      expect(r.delta).toBe(10)
      expect(r.reasons).toHaveLength(1)
    }
  })
  it('penalizes too-short sessions', () => {
    const r = durationPlausibilityRule.score(ev({ durationMinutes: 2 }))
    expect(r.delta).toBe(-20)
    expect(r.reasons[0]).toMatch(/too short/)
  })
  it('penalizes marathon sessions', () => {
    expect(durationPlausibilityRule.score(ev({ durationMinutes: 241 })).delta).toBe(-15)
  })
  it('is neutral for missing or middling durations', () => {
    expect(durationPlausibilityRule.score(ev())).toEqual({ delta: 0, reasons: [] })
    expect(durationPlausibilityRule.score(ev({ durationMinutes: 5 })).delta).toBe(0)
  })
})

describe('workDensityRule', () => {
  it('rewards multiple completed units', () => {
    const r = workDensityRule.score(ev({ completedUnits: 12, durationMinutes: 45 }))
    expect(r.delta).toBe(8)
    expect(r.reasons).toEqual(['Multiple completed work units support the session.'])
  })
  it('penalizes implausible density on top of the reward', () => {
    const r = workDensityRule.score(ev({ completedUnits: 60, durationMinutes: 10 }))
    expect(r.delta).toBe(-10)
    expect(r.reasons).toHaveLength(2)
  })
  it('skips the density check when duration is zero', () => {
    expect(workDensityRule.score(ev({ completedUnits: 10, durationMinutes: 0 })).delta).toBe(8)
  })
  it('is neutral for a single unit', () => {
    expect(workDensityRule.score(ev({ completedUnits: 1, durationMinutes: 45 }))).toEqual({ delta: 0, reasons: [] })
  })
})

describe('resistanceVolumeRule', () => {
  it('rewards logged volume', () => {
    expect(resistanceVolumeRule.score(ev({ modality: 'resistance', totalVolume: 18500 })).delta).toBe(7)
  })
  it('applies both the reward and the implausibility penalty for absurd volume', () => {
    const r = resistanceVolumeRule.score(ev({ modality: 'resistance', totalVolume: 300000 }))
    expect(r.delta).toBe(-13)
    expect(r.reasons).toHaveLength(2)
  })
  it('ignores non-resistance sessions', () => {
    expect(resistanceVolumeRule.score(ev({ modality: 'endurance', totalVolume: 18500 })).delta).toBe(0)
  })
})

describe('resistanceCadenceRule', () => {
  const goodStamps = Array.from({ length: 12 }, (_, i) => new Date(Date.now() + i * 210000).toISOString())
  const good = ev({
    modality: 'resistance',
    completedUnits: 12,
    setTimestamps: goodStamps,
    cadenceCoverage: 1,
    medianSetGapSeconds: 210,
  })
  it('fully rewards believable live cadence', () => {
    const r = resistanceCadenceRule.score(good)
    expect(r.delta).toBe(17)
    expect(r.reasons).toHaveLength(3)
  })
  it('heavily penalizes rushed sets', () => {
    const r = resistanceCadenceRule.score({ ...good, medianSetGapSeconds: 5 })
    expect(r.delta).toBe(-14)
    expect(r.reasons.some((x) => x.match(/too rapidly/))).toBe(true)
  })
  it('requires at least 3 units before judging cadence', () => {
    expect(resistanceCadenceRule.score({ ...good, completedUnits: 2 }).delta).toBe(0)
  })
  it('ignores non-resistance sessions', () => {
    expect(resistanceCadenceRule.score({ ...good, modality: 'endurance' }).delta).toBe(0)
  })
})

describe('endurancePlausibilityRule', () => {
  it('rewards distance and plausible pace', () => {
    const r = endurancePlausibilityRule.score(ev({ modality: 'endurance', distanceMiles: 3.1, avgPaceSeconds: 540 }))
    expect(r.delta).toBe(15)
  })
  it('penalizes impossible pace', () => {
    const r = endurancePlausibilityRule.score(ev({ modality: 'endurance', distanceMiles: 3.1, avgPaceSeconds: 60 }))
    expect(r.delta).toBe(-18)
  })
  it('ignores non-endurance sessions', () => {
    expect(endurancePlausibilityRule.score(ev({ modality: 'resistance', distanceMiles: 3.1 })).delta).toBe(0)
  })
})

describe('recoveryRule', () => {
  it('rewards sufficiently long recovery', () => {
    expect(recoveryRule.score(ev({ modality: 'recovery', durationMinutes: 10 })).delta).toBe(5)
  })
  it('is neutral for short or non-recovery sessions', () => {
    expect(recoveryRule.score(ev({ modality: 'recovery', durationMinutes: 3 })).delta).toBe(0)
    expect(recoveryRule.score(ev({ modality: 'resistance', durationMinutes: 30 })).delta).toBe(0)
  })
})

describe('sensorCorroborationRule', () => {
  it('rewards sensor coverage of most of the session', () => {
    expect(sensorCorroborationRule.score(ev({ sensorMinutes: 30, durationMinutes: 45 })).delta).toBe(13)
  })
  it('requires the 60% coverage bar', () => {
    expect(sensorCorroborationRule.score(ev({ sensorMinutes: 10, durationMinutes: 45 })).delta).toBe(0)
  })
})

describe('integrityPenaltyRule', () => {
  it('penalizes each integrity flag', () => {
    expect(integrityPenaltyRule.score(ev({ duplicateDetected: true })).delta).toBe(-45)
    expect(integrityPenaltyRule.score(ev({ clockMismatch: true })).delta).toBe(-30)
    expect(integrityPenaltyRule.score(ev({ implausibleSpike: true })).delta).toBe(-25)
  })
  it('stacks all three', () => {
    const r = integrityPenaltyRule.score(ev({ duplicateDetected: true, clockMismatch: true, implausibleSpike: true }))
    expect(r.delta).toBe(-100)
    expect(r.reasons).toHaveLength(3)
  })
  it('is neutral when clean', () => {
    expect(integrityPenaltyRule.score(ev())).toEqual({ delta: 0, reasons: [] })
  })
})

describe('defaultRules', () => {
  it('ships ten uniquely-identified rules', () => {
    expect(defaultRules).toHaveLength(10)
    expect(new Set(defaultRules.map((r) => r.id)).size).toBe(10)
  })
})
