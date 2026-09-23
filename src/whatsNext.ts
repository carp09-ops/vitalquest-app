import type { SQLiteDatabase } from 'expo-sqlite';
import {
  ATTRIBUTE_THRESHOLDS, ATTRIBUTE_TIER_TITLES, attributeTierForXP, formTierForLevel,
  nextHeroFormMilestone, type HeroArchetype, type HeroAttribute,
} from './heroEvolution';
import { cumulativeXpForLevel, levelFromTotalXP } from './gameEngine';
import { getMilestones, type Milestone } from './milestones';

export interface NextForm {
  title: string;
  tier: number;
  targetLevel: number;
  xpRemaining: number;
  /** 0..1 progress from the current form's floor to the next. */
  progress: number;
  /** e.g. "AT YOUR PACE · ~3 WEEKS" — undefined when no training pace yet. */
  paceLabel?: string;
}

export interface NextMilestone {
  title: string;
  howTo: string;
  progress: number;
  remainingText: string;
}

export interface NextAttribute {
  attribute: HeroAttribute;
  nextTier: number;
  nextTierTitle: string;
  xpRemaining: number;
}

export interface WhatsNext {
  form: NextForm | null;
  milestone: NextMilestone | null;
  attribute: NextAttribute | null;
  paceXpPerDay: number;
}

/** Human-friendly ETA from a day count. */
export function paceLabelForDays(days: number): string {
  if (days <= 1) return 'AT YOUR PACE · DAYS AWAY';
  if (days <= 14) return `AT YOUR PACE · ~${days} DAYS`;
  const weeks = Math.round(days / 7);
  if (weeks <= 8) return `AT YOUR PACE · ~${weeks} WEEK${weeks === 1 ? '' : 'S'}`;
  const months = Math.max(1, Math.round(days / 30));
  return `AT YOUR PACE · ~${months} MONTH${months === 1 ? '' : 'S'}`;
}

/** The locked milestone closest to falling. */
export function pickNextMilestone(milestones: Milestone[]): Milestone | null {
  const locked = milestones.filter((m) => !m.earned && typeof m.progress === 'number' && m.remainingText);
  if (locked.length === 0) return null;
  return locked.reduce((a, b) => (b.progress! > a.progress! ? b : a));
}

/** The attribute closest to its next tier. */
export function nextAttributeTier(totals: Record<string, number>): NextAttribute | null {
  let best: NextAttribute | null = null;
  for (const [name, xp] of Object.entries(totals)) {
    const attribute = name as HeroAttribute;
    if (!(attribute in ATTRIBUTE_TIER_TITLES)) continue;
    const tier = attributeTierForXP(xp);
    if (tier >= 5) continue;
    const idx = Math.min(tier, 4) as 1 | 2 | 3 | 4;
    const xpRemaining = ATTRIBUTE_THRESHOLDS[idx] - xp;
    if (!best || xpRemaining < best.xpRemaining) {
      best = {
        attribute,
        nextTier: (tier + 1) as NextAttribute['nextTier'],
        nextTierTitle: ATTRIBUTE_TIER_TITLES[attribute][idx],
        xpRemaining: Math.max(0, Math.round(xpRemaining)),
      };
    }
  }
  return best;
}

export async function getWhatsNext(db: SQLiteDatabase, archetype: HeroArchetype): Promise<WhatsNext> {
  const [totals, xpWindow, attrRows, milestones] = await Promise.all([
    db.getFirstAsync<{ xp: number }>(`SELECT COALESCE(SUM(amount),0) AS xp FROM xp_events`),
    db.getFirstAsync<{ recent: number; first: string | null }>(
      `SELECT COALESCE(SUM(CASE WHEN created_at >= datetime('now','-28 days') THEN amount ELSE 0 END),0) AS recent, MIN(created_at) AS first FROM xp_events`),
    db.getAllAsync<{ attribute: string; total: number }>(
      `SELECT attribute, COALESCE(SUM(amount),0) AS total FROM attribute_events GROUP BY attribute`),
    getMilestones(db),
  ]);

  const totalXP = totals?.xp ?? 0;
  const level = levelFromTotalXP(totalXP);

  // Training pace: last 28 days first, all-time as fallback.
  let pace = (xpWindow?.recent ?? 0) / 28;
  if (pace <= 0 && xpWindow?.first && totalXP > 0) {
    const days = Math.max(1, (Date.now() - new Date(xpWindow.first).getTime()) / 86400000);
    pace = totalXP / days;
  }

  // Next form ascension.
  let form: NextForm | null = null;
  const milestone = nextHeroFormMilestone(level, totalXP, archetype);
  if (milestone) {
    const currentTier = formTierForLevel(level);
    const tierFloorXP = cumulativeXpForLevel([1, 5, 9, 13, 17][currentTier - 1] ?? 1);
    const span = Math.max(1, milestone.targetXP - tierFloorXP);
    let paceLabel: string | undefined;
    if (pace > 0 && milestone.xpRemaining > 0) {
      paceLabel = paceLabelForDays(Math.ceil(milestone.xpRemaining / pace));
    }
    form = {
      title: milestone.nextTitle,
      tier: milestone.nextTier,
      targetLevel: milestone.targetLevel,
      xpRemaining: Math.round(milestone.xpRemaining),
      progress: Math.min(1, Math.max(0, (milestone.targetXP - milestone.xpRemaining - tierFloorXP) / span)),
      paceLabel,
    };
  }

  // Next milestone on the wall.
  const next = pickNextMilestone(milestones);
  const nextMilestone: NextMilestone | null = next
    ? { title: next.title, howTo: next.howTo, progress: next.progress ?? 0, remainingText: next.remainingText ?? '' }
    : null;

  const attrTotals: Record<string, number> = {};
  for (const row of attrRows) attrTotals[row.attribute] = row.total;
  const attribute = nextAttributeTier(attrTotals);

  return { form, milestone: nextMilestone, attribute, paceXpPerDay: Math.round(pace * 10) / 10 };
}
