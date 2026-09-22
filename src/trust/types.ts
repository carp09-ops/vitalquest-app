import type { VerificationEvidence } from '../xpTrust'

/** Minimal session shape a verifier needs. Deliberately smaller than the DB row. */
export interface TrustSessionInput {
  modality: 'resistance' | 'endurance' | 'recovery' | 'other'
  startedAt: string
  completedAt: string
  durationMinutes: number
  completedUnits?: number
  totalVolume?: number
  distanceMiles?: number
  avgPaceSeconds?: number
  setTimestamps?: string[]
}

/**
 * A TrustVerifier contributes one slice of evidence about a session.
 * Adding a new verification source = writing one object that satisfies
 * this interface. No changes to the pipeline, the scorer, or db.ts.
 */
export interface TrustVerifier {
  /** Stable id, e.g. 'manual_entry' | 'live_app' | 'healthkit' | 'strava_import' */
  id: string
  /**
   * Merge precedence. Higher wins when two verifiers disagree on `source`.
   * Mirrors today's ordering: wearable 4 > healthkit 3 > gps 2 > live_app 1 > manual 0.
   */
  priority: number
  /** Return a partial evidence slice. Throwing is safe: the pipeline isolates failures. */
  collect(session: TrustSessionInput): Promise<Partial<VerificationEvidence>>
}
