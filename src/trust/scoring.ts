import type { VerificationEvidence, VerificationTier, XPTrustResult } from '../xpTrust'
import type { ScoringRule } from './rules'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function multiplierFor(confidence: number) {
  if (confidence >= 65) return 1
  if (confidence >= 45) return 0.75
  return 0.55
}

function tierFor(confidence: number): VerificationTier {
  if (confidence >= 85) return 'VERIFIED'
  if (confidence >= 65) return 'CORROBORATED'
  if (confidence >= 45) return 'TRACKED'
  return 'SELF_REPORTED'
}

/** Runs every rule against the evidence and totals the deltas. Order-free. */
export function applyRules(
  rules: ScoringRule[],
  evidence: VerificationEvidence,
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  for (const rule of rules) {
    const r = rule.score(evidence)
    score += r.delta
    reasons.push(...r.reasons)
  }
  return { score, reasons }
}

/** Converts a raw score into the XPTrustResult the rest of the app consumes. */
export function adjudicate(
  rawXP: number,
  score: number,
  reasons: string[],
  evidence: VerificationEvidence,
): XPTrustResult {
  const confidence = clamp(Math.round(score), 0, 100)
  const multiplier = multiplierFor(confidence)
  const awardedXP = Math.max(0, Math.floor(rawXP * multiplier))
  return {
    rawXP,
    awardedXP,
    withheldXP: Math.max(0, rawXP - awardedXP),
    confidence,
    multiplier,
    tier: tierFor(confidence),
    reasons,
    evidence,
  }
}
