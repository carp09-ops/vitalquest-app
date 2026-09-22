import { evaluateXPTrust, type VerificationEvidence, type XPTrustResult } from '../xpTrust'
import type { TrustSessionInput, TrustVerifier } from './types'

/**
 * Priority-ordered merge. Higher-priority verifiers overwrite scalar fields
 * (notably `source`); sensorMinutes takes the max; boolean flags OR together.
 * This reproduces today's mergeVerificationEvidence + integrity-OR semantics.
 */
function mergeEvidences(parts: { evidence: Partial<VerificationEvidence>; priority: number }[]): VerificationEvidence {
  const merged: Record<string, unknown> = {}
  for (const { evidence } of [...parts].sort((a, b) => a.priority - b.priority)) {
    for (const [key, value] of Object.entries(evidence)) {
      if (value === undefined || value === null) continue
      if (key === 'sensorMinutes') merged[key] = Math.max(Number(merged[key] ?? 0), Number(value))
      else if (typeof value === 'boolean') merged[key] = Boolean(merged[key]) || value
      else merged[key] = value
    }
  }
  return merged as VerificationEvidence
}

/**
 * Collect → merge → score. The scorer (evaluateXPTrust) is intentionally
 * untouched: this slice only changes how evidence is gathered and combined.
 * A verifier that throws is isolated — it contributes nothing rather than
 * failing the whole session.
 */
export async function runTrustPipeline(
  rawXP: number,
  session: TrustSessionInput,
  verifiers: TrustVerifier[],
): Promise<XPTrustResult> {
  const settled = await Promise.all(
    verifiers.map(async (v) => {
      try {
        return { evidence: await v.collect(session), priority: v.priority }
      } catch {
        return { evidence: {}, priority: v.priority }
      }
    }),
  )
  return evaluateXPTrust(rawXP, mergeEvidences(settled))
}
