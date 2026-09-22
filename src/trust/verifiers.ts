import { evaluateSessionIntegrity } from '../sessionIntegrity'
import type { VerificationEvidence } from '../xpTrust'
import type { TrustSessionInput, TrustVerifier } from './types'

/** Baseline: the user typed it in. Always present, lowest precedence. */
export const manualEntryVerifier: TrustVerifier = {
  id: 'manual_entry',
  priority: 0,
  async collect(session) {
    return {
      source: 'manual_entry',
      modality: session.modality,
      durationMinutes: session.durationMinutes,
      completedUnits: session.completedUnits,
      totalVolume: session.totalVolume,
      distanceMiles: session.distanceMiles,
      avgPaceSeconds: session.avgPaceSeconds,
    }
  },
}

/**
 * Derives cadence evidence from per-set timestamps captured live in the app.
 * Pure function of the session input — no DB, no native modules.
 */
export const liveAppVerifier: TrustVerifier = {
  id: 'live_app',
  priority: 1,
  async collect(session) {
    const stamps = (session.setTimestamps ?? [])
      .map((s) => new Date(s).getTime())
      .filter(Number.isFinite)
      .sort((a, b) => a - b)
    const units = session.completedUnits ?? stamps.length
    const gaps: number[] = []
    for (let i = 1; i < stamps.length; i++) gaps.push((stamps[i] - stamps[i - 1]) / 1000)
    gaps.sort((a, b) => a - b)
    const median = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0
    return {
      source: 'live_app',
      liveTracked: stamps.length > 0,
      setTimestamps: session.setTimestamps,
      cadenceCoverage: units > 0 ? Math.min(1, stamps.length / units) : 0,
      medianSetGapSeconds: median,
    }
  },
}

type MinimalDb = { getAllAsync: (sql: string) => Promise<unknown[]> }

/** Ledger fields the integrity verifier contributes beyond VerificationEvidence. */
export interface IntegrityLedgerFields {
  overlapCount: number
  overlapSeconds: number
}

/**
 * Wraps the existing duplicate/clock integrity check as a verifier.
 * Takes a minimal DB interface so it stays testable without expo-sqlite.
 * Priority is high because it only contributes flags and ledger fields,
 * never `source`. The overlap counts flow through the merge untouched by
 * scoring so the session_verification record keeps its exact shape.
 */
export function sessionIntegrityVerifier(db: MinimalDb): TrustVerifier {
  return {
    id: 'session_integrity',
    priority: 10,
    async collect(session): Promise<Partial<VerificationEvidence> & IntegrityLedgerFields> {
      const r = await evaluateSessionIntegrity(db as never, {
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        durationMinutes: session.durationMinutes,
      })
      return {
        duplicateDetected: r.duplicateDetected,
        clockMismatch: r.clockMismatch,
        overlapCount: r.overlapCount,
        overlapSeconds: r.overlapSeconds,
      }
    },
  }
}
