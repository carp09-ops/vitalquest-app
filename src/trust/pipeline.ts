import { type VerificationEvidence, type XPTrustResult } from '../xpTrust'
import { applyRules, adjudicate } from './scoring'
import { defaultRules, type ScoringRule } from './rules'
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

export interface RuleBreakdown {  id: string
  delta: number
  reasons: string[]
}

export interface TrustPipelineDetail extends XPTrustResult {
  ruleBreakdown: RuleBreakdown[]
  baseScore: number
}

/**
 * Full-fidelity run: same result as runTrustPipeline, plus the per-rule
 * breakdown. This is the "why did I get this score?" view — it only exists
 * because scoring is now discrete rules.
 */
export async function runTrustPipelineDetailed(
  rawXP: number,
  session: TrustSessionInput,
  verifiers: TrustVerifier[],
  rules: ScoringRule[] = defaultRules,
): Promise<TrustPipelineDetail> {
  const settled = await Promise.all(
    verifiers.map(async (v) => {
      try {
        return { evidence: await v.collect(session), priority: v.priority }
      } catch {
        return { evidence: {}, priority: v.priority }
      }
    }),
  )
  const evidence = mergeEvidences(settled)
  let baseScore = 0
  const ruleBreakdown: RuleBreakdown[] = []
  const reasons: string[] = []
  for (const rule of rules) {
    const r = rule.score(evidence)
    baseScore += r.delta
    ruleBreakdown.push({ id: rule.id, delta: r.delta, reasons: r.reasons })
    reasons.push(...r.reasons)
  }
  return { ...adjudicate(rawXP, baseScore, reasons, evidence), ruleBreakdown, baseScore }
}

/**
 * Convenience wrapper returning just the XPTrustResult.
 */
export async function runTrustPipeline(
  rawXP: number,
  session: TrustSessionInput,
  verifiers: TrustVerifier[],
  rules: ScoringRule[] = defaultRules,
): Promise<XPTrustResult> {
  return runTrustPipelineDetailed(rawXP, session, verifiers, rules)
}
