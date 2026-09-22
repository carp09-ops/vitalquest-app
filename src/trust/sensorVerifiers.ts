import { collectHealthVerificationEvidence } from '../sensorVerification'
import type { TrustVerifier } from './types'

/**
 * Adapter over the existing HealthKit collector. The native code is untouched;
 * this just makes it a pipeline citizen. GPS capture stays session-scoped
 * (it wraps a live capture), so a gps verifier would wrap an already-captured
 * result rather than this post-hoc shape — see README.
 */
export const healthKitVerifier: TrustVerifier = {
  id: 'healthkit',
  priority: 3,
  async collect(session) {
    const evidence = await collectHealthVerificationEvidence({
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      modality: session.modality,
    })
    return evidence ?? {}
  },
}
