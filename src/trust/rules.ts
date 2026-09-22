import type { VerificationEvidence } from '../xpTrust'

/**
 * A ScoringRule contributes a score delta (and optionally reasons) for one
 * aspect of the evidence. Rules are pure, independent, and order-free —
 * tuning anti-cheat sensitivity means editing one small rule, not the
 * 100-line evaluateXPTrust it was extracted from.
 */
export interface ScoringRule {
  id: string
  score(evidence: VerificationEvidence): { delta: number; reasons: string[] }
}

const SENSOR_SOURCES = ['wearable', 'healthkit', 'gps']

export const baseSourceRule: ScoringRule = {
  id: 'base_source',
  score(e) {
    const s = e.source ?? ''
    if (SENSOR_SOURCES.includes(s)) return { delta: 72, reasons: ['Independent device or sensor source attached.'] }
    if (s === 'live_app') return { delta: 45, reasons: [] }
    return { delta: 25, reasons: [] }
  },
}

export const liveTrackedBonusRule: ScoringRule = {
  id: 'live_tracked_bonus',
  score(e) {
    if (SENSOR_SOURCES.includes(e.source ?? '')) return { delta: 0, reasons: [] }
    if (e.liveTracked) return { delta: 10, reasons: ['Session was tracked live inside VitalQuest.'] }
    return { delta: 0, reasons: ['Session relies primarily on user-entered data.'] }
  },
}

export const durationPlausibilityRule: ScoringRule = {
  id: 'duration_plausibility',
  score(e) {
    const d = Number(e.durationMinutes || 0)
    if (d >= 8 && d <= 240) return { delta: 10, reasons: ['Session duration is within a plausible training range.'] }
    if (d > 0 && d < 3) return { delta: -20, reasons: ['Duration is too short for the reported work.'] }
    if (d > 240) return { delta: -15, reasons: ['Duration is unusually long and receives reduced confidence.'] }
    return { delta: 0, reasons: [] }
  },
}

export const workDensityRule: ScoringRule = {
  id: 'work_density',
  score(e) {
    const reasons: string[] = []
    let delta = 0
    const units = Number(e.completedUnits || 0)
    const duration = Number(e.durationMinutes || 0)
    if (units >= 2) {
      delta += 8
      reasons.push('Multiple completed work units support the session.')
    }
    if (duration > 0 && units / duration > 2) {
      delta -= 18
      reasons.push('Reported work density is implausibly high.')
    }
    return { delta, reasons }
  },
}

export const resistanceVolumeRule: ScoringRule = {
  id: 'resistance_volume',
  score(e) {
    if (e.modality !== 'resistance') return { delta: 0, reasons: [] }
    const reasons: string[] = []
    let delta = 0
    const volume = Number(e.totalVolume || 0)
    if (volume > 0) {
      delta += 7
      reasons.push('Logged resistance volume corroborates completion.')
    }
    if (volume > 250000) {
      delta -= 20
      reasons.push('Single-session lifting volume is outside normal plausibility bounds.')
    }
    return { delta, reasons }
  },
}

export const resistanceCadenceRule: ScoringRule = {
  id: 'resistance_cadence',
  score(e) {
    if (e.modality !== 'resistance') return { delta: 0, reasons: [] }
    const reasons: string[] = []
    let delta = 0
    const units = Number(e.completedUnits || 0)
    if (units < 3) return { delta: 0, reasons: [] }
    const coverage = Math.min(1, Math.max(0, Number(e.cadenceCoverage || 0)))
    const medianGap = Number(e.medianSetGapSeconds || 0)
    if (coverage >= 0.6) {
      delta += 8
      reasons.push('Per-set timestamps cover most of the lifting session.')
    }
    if (medianGap >= 20 && medianGap <= 600) {
      delta += 6
      reasons.push('Set cadence is consistent with live resistance training.')
    } else if (medianGap > 0 && medianGap < 8) {
      delta -= 25
      reasons.push('Sets were completed too rapidly to support the reported workout.')
    }
    if (Array.isArray(e.setTimestamps) && e.setTimestamps.length === units) {
      delta += 3
      reasons.push('Every completed set has live timing evidence.')
    }
    return { delta, reasons }
  },
}

export const endurancePlausibilityRule: ScoringRule = {
  id: 'endurance_plausibility',
  score(e) {
    if (e.modality !== 'endurance') return { delta: 0, reasons: [] }
    const reasons: string[] = []
    let delta = 0
    const distance = Number(e.distanceMiles || 0)
    const pace = Number(e.avgPaceSeconds || 0)
    if (distance > 0.15) {
      delta += 7
      reasons.push('Distance data supports the endurance session.')
    }
    if (pace >= 240 && pace <= 1800) {
      delta += 8
      reasons.push('Recorded pace is within a plausible human range.')
    } else if (pace > 0) {
      delta -= 25
      reasons.push('Recorded pace falls outside configured plausibility bounds.')
    }
    return { delta, reasons }
  },
}

export const recoveryRule: ScoringRule = {
  id: 'recovery',
  score(e) {
    if (e.modality === 'recovery' && Number(e.durationMinutes || 0) >= 5)
      return { delta: 5, reasons: ['Recovery duration supports the completed protocol.'] }
    return { delta: 0, reasons: [] }
  },
}

export const sensorCorroborationRule: ScoringRule = {
  id: 'sensor_corroboration',
  score(e) {
    const duration = Number(e.durationMinutes || 0)
    if (Number(e.sensorMinutes || 0) >= Math.max(5, duration * 0.6))
      return { delta: 13, reasons: ['Sensor-active time corroborates most of the session.'] }
    return { delta: 0, reasons: [] }
  },
}

export const integrityPenaltyRule: ScoringRule = {
  id: 'integrity_penalties',
  score(e) {
    const reasons: string[] = []
    let delta = 0
    if (e.duplicateDetected) {
      delta -= 45
      reasons.push('Duplicate-session evidence detected.')
    }
    if (e.clockMismatch) {
      delta -= 30
      reasons.push('Session timestamps conflict with elapsed-time evidence.')
    }
    if (e.implausibleSpike) {
      delta -= 25
      reasons.push('Performance spike exceeds configured progression bounds.')
    }
    return { delta, reasons }
  },
}

/** The full rule set, in the same evaluation order as the original function. */
export const defaultRules: ScoringRule[] = [
  baseSourceRule,
  liveTrackedBonusRule,
  durationPlausibilityRule,
  workDensityRule,
  resistanceVolumeRule,
  resistanceCadenceRule,
  endurancePlausibilityRule,
  recoveryRule,
  sensorCorroborationRule,
  integrityPenaltyRule,
]
