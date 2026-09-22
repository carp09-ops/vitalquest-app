import type { ActivityModality, VerificationEvidence } from '../xpTrust'
import { liveAppVerifier, manualEntryVerifier, sessionIntegrityVerifier } from './verifiers'
import type { TrustSessionInput, TrustVerifier } from './types'

/** Minimal shape of the session-save input the trust layer needs. */
export interface TrustSaveInput {
  startedAt: string
  completedAt: string
  durationMinutes: number
  totalVolume: number
  verificationEvidence?: VerificationEvidence
}

type MinimalDb = { getAllAsync: (sql: string) => Promise<unknown[]> }

/**
 * Verifiers for the session-save path, in merge-priority order.
 *
 * This reproduces the legacy assembly in writeSessionBase exactly:
 *   base     = {source:'live_app', modality, durationMinutes, totalVolume,
 *               liveTracked:true, ...verificationEvidence}
 *   merged   = mergeVerificationEvidence(base, healthEvidence)  // sensor wins on source
 *   final    = {...merged, duplicateDetected: integrity || evidence,
 *               clockMismatch: integrity || evidence}            // flags OR together
 *
 * The HealthKit verifier is appended by the caller: it needs native modules,
 * and keeping it out keeps this module (and its tests) node-safe.
 */
export function sessionSaveVerifiers(
  db: MinimalDb,
  input: TrustSaveInput,
  modality: ActivityModality,
): TrustVerifier[] {
  const sessionOverride: TrustVerifier = {
    id: 'session_override',
    priority: 2,
    async collect() {
      return {
        source: 'live_app',
        modality,
        durationMinutes: input.durationMinutes,
        totalVolume: input.totalVolume,
        liveTracked: true,
        ...input.verificationEvidence,
      }
    },
  }
  const integrity: TrustVerifier = sessionIntegrityVerifier(db)
  return [manualEntryVerifier, liveAppVerifier, sessionOverride, integrity]
}

/**
 * Builds the pipeline session input from the save input.
 * Only node-safe scalar fields are mapped; caller-supplied evidence
 * (set timestamps, cadence, overrides) flows through session_override.
 */
export function sessionSaveTrustInput(input: TrustSaveInput, modality: ActivityModality): TrustSessionInput {
  return {
    modality,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMinutes: input.durationMinutes,
    completedUnits: input.verificationEvidence?.completedUnits,
    totalVolume: input.totalVolume,
    distanceMiles: input.verificationEvidence?.distanceMiles,
    avgPaceSeconds: input.verificationEvidence?.avgPaceSeconds,
  }
}
