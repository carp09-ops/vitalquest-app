import type { SQLiteDatabase } from 'expo-sqlite';
import type { VQIconName } from './IconArt';
import { attributeTierForXP, ATTRIBUTE_TIER_TITLES, FORM_LEVELS, formTierForLevel, type HeroAttribute, type HeroTier } from './heroEvolution';
import { levelFromTotalXP } from './gameEngine';
import { ATTRIBUTE_AURA } from './attributeAuras';
import { formatLegendDate, getLegendTimeline, longestStreak, type LegendEntry } from './legend';

export interface Milestone {
  id: string;
  title: string;
  flavor: string;
  howTo: string;
  icon: VQIconName;
  accent: string;
  earned: boolean;
  /** ISO date earned. */
  date?: string;
  /** 0..1 progress for locked milestones. */
  progress?: number;
  progressLabel?: string;
}

export interface MilestoneContext {
  level: number;
  formTier: number;
  maxAttributeTier: number;
  paragonAttribute?: HeroAttribute;
  sessionCount: number;
  totalVolume: number;
  longestStreakDays: number;
}

const ROMAN: Record<number, string> = { 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };
const GOLD = '#E7B858';

function attrIcon(attribute: HeroAttribute): VQIconName {
  return attribute === 'strength' || attribute === 'stamina' || attribute === 'agility' ? attribute : 'trophy';
}

/**
 * The curated wall: 13 milestones spanning first steps to titanhood.
 * Earned ones carry their date; locked ones show progress toward the goal.
 */
export function buildMilestones(entries: LegendEntry[], ctx: MilestoneContext): Milestone[] {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const at = (id: string) => byId.get(id)?.date;
  const milestones: Milestone[] = [];

  milestones.push({
    id: 'first-steps', title: 'FIRST STEPS',
    flavor: 'Every legend starts with a single trial.',
    howTo: 'Complete your first trial',
    icon: 'streak', accent: GOLD,
    earned: !!at('beginning'), date: at('beginning'),
  });

  milestones.push({
    id: 'record-breaker', title: 'RECORD BREAKER',
    flavor: 'The first time you beat yourself. It never gets old.',
    howTo: 'Set a personal record',
    icon: 'trophy', accent: GOLD,
    earned: !!at('pr-first'), date: at('pr-first'),
  });

  const level10 = at('level-10');
  milestones.push({
    id: 'rising', title: 'RISING',
    flavor: 'Level 10. The warm-up is over.',
    howTo: 'Reach level 10',
    icon: 'xp', accent: '#4EA8FF',
    earned: !!level10, date: level10,
    ...(!level10 ? { progress: Math.min(1, ctx.level / 10), progressLabel: `LEVEL ${ctx.level} / 10` } : {}),
  });

  (FORM_LEVELS as readonly number[]).slice(1).forEach((formLevel, i) => {
    const formTier = (i + 2) as HeroTier;
    const date = at(`form-${formLevel}`);
    milestones.push({
      id: `ascension-${formTier}`, title: `ASCENSION ${ROMAN[formTier]}`,
      flavor: `Form ${ROMAN[formTier]}. The hero takes a new shape.`,
      howTo: `Reach level ${formLevel}`,
      icon: 'strength', accent: GOLD,
      earned: !!date, date,
      ...(!date ? { progress: Math.min(1, ctx.level / formLevel), progressLabel: `LEVEL ${ctx.level} / ${formLevel}` } : {}),
    });
  });

  const paragonEntry = entries.find((e) => e.id.startsWith('attr-') && e.id.endsWith('-5'));
  const paragonAttr = paragonEntry ? (paragonEntry.id.split('-')[1] as HeroAttribute) : ctx.paragonAttribute;
  milestones.push({
    id: 'paragon', title: 'PARAGON',
    flavor: paragonAttr
      ? `${paragonAttr.toUpperCase()} Tier V — ${ATTRIBUTE_TIER_TITLES[paragonAttr][4]}. Mastery, embodied.`
      : 'Mastery, embodied. Push one attribute to its peak.',
    howTo: 'Reach tier V in any attribute',
    icon: paragonAttr ? attrIcon(paragonAttr) : 'trophy',
    accent: paragonAttr ? ATTRIBUTE_AURA[paragonAttr].aura : GOLD,
    earned: !!paragonEntry, date: paragonEntry?.date,
    ...(!paragonEntry ? { progress: Math.min(1, ctx.maxAttributeTier / 5), progressLabel: `TIER ${ctx.maxAttributeTier} / V` } : {}),
  });

  const sessionDefs = [
    { count: 25, title: 'DEDICATED', flavor: '25 trials. Showing up is the skill.', icon: 'quest' as VQIconName },
    { count: 50, title: 'VETERAN', flavor: '50 trials. The work is who you are now.', icon: 'armory' as VQIconName },
    { count: 100, title: 'CENTURION', flavor: '100 trials. You are the work.', icon: 'trophy' as VQIconName },
  ];
  for (const def of sessionDefs) {
    const date = at(`sessions-${def.count}`);
    milestones.push({
      id: `sessions-${def.count}`, title: def.title, flavor: def.flavor,
      howTo: `Complete ${def.count} trials`,
      icon: def.icon, accent: GOLD,
      earned: !!date, date,
      ...(!date ? { progress: Math.min(1, ctx.sessionCount / def.count), progressLabel: `${ctx.sessionCount} / ${def.count}` } : {}),
    });
  }

  const streakBest = ctx.longestStreakDays >= 30;
  const streakDate = byId.get('streak-best')?.date;
  milestones.push({
    id: 'unbroken', title: 'UNBROKEN',
    flavor: '30 days. Not a single one missed.',
    howTo: 'Reach a 30-day streak',
    icon: 'streak', accent: '#3EE6C4',
    earned: streakBest, date: streakBest ? streakDate : undefined,
    ...(!streakBest ? { progress: Math.min(1, ctx.longestStreakDays / 30), progressLabel: `${ctx.longestStreakDays} / 30 DAYS` } : {}),
  });

  const titanDate = at('volume-25000');
  milestones.push({
    id: 'titan', title: 'TITAN',
    flavor: '25,000 volume moved. Mountains, relocated.',
    howTo: 'Lift 25,000 lifetime volume',
    icon: 'strength', accent: '#FF6B35',
    earned: !!titanDate, date: titanDate,
    ...(!titanDate ? { progress: Math.min(1, ctx.totalVolume / 25000), progressLabel: `${Math.round(ctx.totalVolume).toLocaleString()} / 25,000` } : {}),
  });

  return milestones;
}

export async function getMilestones(db: SQLiteDatabase): Promise<Milestone[]> {
  const [entries, totals, attrRows, sessionDates] = await Promise.all([
    getLegendTimeline(db),
    db.getFirstAsync<{ xp: number; sessions: number; volume: number }>(
      `SELECT COALESCE((SELECT SUM(amount) FROM xp_events),0) AS xp, COUNT(*) AS sessions, COALESCE(SUM(total_volume),0) AS volume FROM workout_sessions`),
    db.getAllAsync<{ attribute: string; total: number }>(
      `SELECT attribute, COALESCE(SUM(amount),0) AS total FROM attribute_events GROUP BY attribute`),
    db.getAllAsync<{ completed_at: string }>(
      `SELECT completed_at FROM workout_sessions ORDER BY completed_at ASC`),
  ]);

  const level = levelFromTotalXP(totals?.xp ?? 0);
  let maxAttributeTier = 1; let paragonAttribute: HeroAttribute | undefined;
  for (const row of attrRows) {
    const attribute = row.attribute as HeroAttribute;
    if (!(attribute in ATTRIBUTE_TIER_TITLES)) continue;
    const tier = attributeTierForXP(row.total);
    if (tier > maxAttributeTier) maxAttributeTier = tier;
    if (tier >= 5 && !paragonAttribute) paragonAttribute = attribute;
  }

  const ctx: MilestoneContext = {
    level,
    formTier: formTierForLevel(level),
    maxAttributeTier,
    paragonAttribute,
    sessionCount: totals?.sessions ?? 0,
    totalVolume: Math.round(totals?.volume ?? 0),
    longestStreakDays: longestStreak(sessionDates).days,
  };
  return buildMilestones(entries, ctx);
}

export { formatLegendDate };
