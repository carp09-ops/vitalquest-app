import type { SQLiteDatabase } from 'expo-sqlite';
import { cumulativeXpForLevel } from './gameEngine';
import { ATTRIBUTE_THRESHOLDS, ATTRIBUTE_TIER_TITLES, FORM_LEVELS, type HeroAttribute } from './heroEvolution';
import { ATTRIBUTE_AURA } from './attributeAuras';

export type LegendKind = 'beginning' | 'level' | 'form' | 'attribute' | 'pr' | 'sessions' | 'streak' | 'volume';

export interface LegendEntry {
  id: string;
  /** ISO timestamp of the moment. */
  date: string;
  kind: LegendKind;
  title: string;
  detail: string;
  /** Optional accent color for the timeline dot. */
  accent?: string;
}

export interface LegendInput {
  xpEvents: { created_at: string; amount: number }[];
  attributeEvents: { created_at: string; attribute: string; amount: number }[];
  sessions: { completed_at: string; name: string; total_volume: number }[];
  prs: { completed_at: string; exercise_name: string; weight: number; reps: number }[];
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const;
const SESSION_MILESTONES = [10, 25, 50, 100, 250, 500];
const PR_MILESTONES = [10, 25, 50, 100];
const VOLUME_MILESTONES = [1000, 5000, 10000, 25000, 50000, 100000];

function isHeroAttribute(value: string): value is HeroAttribute {
  return value in ATTRIBUTE_TIER_TITLES;
}

function longestStreak(sessions: { completed_at: string }[]): { days: number; endDate: string } {
  const days = [...new Set(sessions.map((s) => s.completed_at.slice(0, 10)))].sort();
  let best = 0; let bestEnd = ''; let run = 0; let prev = '';
  for (const day of days) {
    if (prev) {
      const diff = (new Date(day).getTime() - new Date(prev).getTime()) / 86400000;
      run = Math.round(diff) === 1 ? run + 1 : 1;
    } else run = 1;
    if (run > best) { best = run; bestEnd = day; }
    prev = day;
  }
  return { days: best, endDate: bestEnd };
}

/**
 * Builds the hero's legend: every level-up, form ascension, attribute
 * tier-up, PR milestone, session milestone, volume milestone, and the
 * longest streak — derived purely from timestamped history rows.
 * Entries come back newest-first.
 */
export function buildLegendTimeline(input: LegendInput): LegendEntry[] {
  const entries: LegendEntry[] = [];
  const { xpEvents, attributeEvents, sessions, prs } = input;

  if (sessions.length > 0) {
    const first = sessions[0];
    entries.push({
      id: 'beginning', date: first.completed_at, kind: 'beginning',
      title: 'THE JOURNEY BEGINS',
      detail: `First trial: ${first.name}. Everything after is earned.`,
    });
  }

  // Level-ups and form ascensions from cumulative XP over time.
  const formLevels = new Set<number>(FORM_LEVELS as readonly number[]);
  let cumulative = 0; let level = 1;
  for (const event of xpEvents) {
    cumulative += event.amount;
    while (cumulative >= cumulativeXpForLevel(level + 1)) {
      level += 1;
      if (formLevels.has(level)) {
        const formTier = FORM_LEVELS.indexOf(level as (typeof FORM_LEVELS)[number]) + 1;
        entries.push({
          id: `form-${level}`, date: event.created_at, kind: 'form',
          title: `ASCENDED TO FORM ${ROMAN[formTier - 1]}`,
          detail: `Reached level ${level}. The hero takes a new shape.`,
          accent: '#E7B858',
        });
      } else {
        entries.push({
          id: `level-${level}`, date: event.created_at, kind: 'level',
          title: `REACHED LEVEL ${level}`,
          detail: `${Math.round(cumulative).toLocaleString()} lifetime XP.`,
        });
      }
    }
  }

  // Attribute tier-ups from cumulative attribute XP over time.
  const attrTotals = new Map<HeroAttribute, number>();
  const attrTiers = new Map<HeroAttribute, number>();
  for (const event of attributeEvents) {
    if (!isHeroAttribute(event.attribute)) continue;
    const total = (attrTotals.get(event.attribute) ?? 0) + event.amount;
    attrTotals.set(event.attribute, total);
    const before = attrTiers.get(event.attribute) ?? 1;
    let tier = 1;
    for (let t = 5; t >= 2; t--) { if (total >= ATTRIBUTE_THRESHOLDS[t - 1]) { tier = t; break; } }
    if (tier > before) {
      attrTiers.set(event.attribute, tier);
      entries.push({
        id: `attr-${event.attribute}-${tier}`, date: event.created_at, kind: 'attribute',
        title: `${event.attribute.toUpperCase()} · TIER ${ROMAN[tier - 1]}`,
        detail: `${ATTRIBUTE_TIER_TITLES[event.attribute][tier - 1]}. ${Math.round(total).toLocaleString()} ${event.attribute} XP.`,
        accent: ATTRIBUTE_AURA[event.attribute].aura,
      });
    }
  }

  // PRs: the first ever, plus count milestones.
  if (prs.length > 0) {
    const first = prs[0];
    entries.push({
      id: 'pr-first', date: first.completed_at, kind: 'pr',
      title: 'FIRST PERSONAL RECORD',
      detail: `${first.exercise_name}: ${first.weight} × ${first.reps}. The first of many.`,
      accent: '#E7B858',
    });
    for (const milestone of PR_MILESTONES) {
      if (prs.length >= milestone) {
        const at = prs[milestone - 1];
        entries.push({
          id: `pr-${milestone}`, date: at.completed_at, kind: 'pr',
          title: `${milestone} PERSONAL RECORDS`,
          detail: `Latest: ${at.exercise_name} ${at.weight} × ${at.reps}.`,
        });
      }
    }
  }

  // Session count milestones.
  for (const milestone of SESSION_MILESTONES) {
    if (sessions.length >= milestone) {
      const at = sessions[milestone - 1];
      entries.push({
        id: `sessions-${milestone}`, date: at.completed_at, kind: 'sessions',
        title: `${milestone} TRIALS COMPLETED`,
        detail: at.name,
      });
    }
  }

  // Volume milestones from cumulative session volume.
  let volume = 0; let volumeIdx = 0;
  for (const session of sessions) {
    volume += session.total_volume;
    while (volumeIdx < VOLUME_MILESTONES.length && volume >= VOLUME_MILESTONES[volumeIdx]) {
      entries.push({
        id: `volume-${VOLUME_MILESTONES[volumeIdx]}`, date: session.completed_at, kind: 'volume',
        title: `${VOLUME_MILESTONES[volumeIdx].toLocaleString()} VOLUME LIFTED`,
        detail: 'Lifetime tonnage under the bar.',
      });
      volumeIdx += 1;
    }
  }

  // Longest streak.
  const streak = longestStreak(sessions);
  if (streak.days >= 7) {
    entries.push({
      id: 'streak-best', date: streak.endDate, kind: 'streak',
      title: `${streak.days}-DAY STREAK`,
      detail: 'Your longest unbroken run of training days.',
      accent: '#E7B858',
    });
  }

  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return entries;
}

export interface LiftComparison {
  name: string;
  first: string;
  best: string;
  deltaPct: number;
}

export interface DayOneComparison {
  firstSession: { date: string; name: string; volume: number; xp: number; minutes: number } | null;
  now: { sessions: number; volume: number; xp: number; level: number; streakDays: number };
  lifts: LiftComparison[];
}

export async function getLegendTimeline(db: SQLiteDatabase): Promise<LegendEntry[]> {
  const [xpEvents, attributeEvents, sessions, prs] = await Promise.all([
    db.getAllAsync<{ created_at: string; amount: number }>(
      `SELECT created_at, amount FROM xp_events ORDER BY created_at ASC`),
    db.getAllAsync<{ created_at: string; attribute: string; amount: number }>(
      `SELECT created_at, attribute, amount FROM attribute_events ORDER BY created_at ASC`),
    db.getAllAsync<{ completed_at: string; name: string; total_volume: number }>(
      `SELECT completed_at, name, total_volume FROM workout_sessions ORDER BY completed_at ASC`),
    db.getAllAsync<{ completed_at: string; exercise_name: string; weight: number; reps: number }>(
      `SELECT completed_at, exercise_name, weight, reps FROM exercise_sets WHERE is_pr = 1 ORDER BY completed_at ASC`),
  ]);
  return buildLegendTimeline({ xpEvents, attributeEvents, sessions, prs });
}

export async function getDayOneComparison(db: SQLiteDatabase): Promise<DayOneComparison> {
  const first = await db.getFirstAsync<{ completed_at: string; name: string; total_volume: number; total_xp: number; duration_minutes: number }>(
    `SELECT completed_at, name, total_volume, total_xp, duration_minutes FROM workout_sessions ORDER BY completed_at ASC LIMIT 1`);
  const totals = await db.getFirstAsync<{ sessions: number; volume: number; xp: number }>(
    `SELECT COUNT(*) AS sessions, COALESCE(SUM(total_volume),0) AS volume, COALESCE(SUM(total_xp),0) AS xp FROM workout_sessions`);
  const sets = await db.getAllAsync<{ exercise_name: string; weight: number; reps: number; completed_at: string }>(
    `SELECT exercise_name, weight, reps, completed_at FROM exercise_sets WHERE weight > 0 ORDER BY completed_at ASC`);

  const byExercise = new Map<string, { first: { weight: number; reps: number }; best: { weight: number; reps: number }; count: number }>();
  for (const set of sets) {
    const entry = byExercise.get(set.exercise_name);
    if (!entry) {
      byExercise.set(set.exercise_name, { first: { weight: set.weight, reps: set.reps }, best: { weight: set.weight, reps: set.reps }, count: 1 });
    } else {
      entry.count += 1;
      if (set.weight > entry.best.weight) entry.best = { weight: set.weight, reps: set.reps };
    }
  }
  const lifts: LiftComparison[] = [...byExercise.entries()]
    .filter(([, v]) => v.best.weight > v.first.weight)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([name, v]) => ({
      name,
      first: `${v.first.weight} × ${v.first.reps}`,
      best: `${v.best.weight} × ${v.best.reps}`,
      deltaPct: Math.round(((v.best.weight - v.first.weight) / v.first.weight) * 100),
    }));

  return {
    firstSession: first ? {
      date: first.completed_at, name: first.name,
      volume: Math.round(first.total_volume), xp: first.total_xp, minutes: first.duration_minutes,
    } : null,
    now: {
      sessions: totals?.sessions ?? 0,
      volume: Math.round(totals?.volume ?? 0),
      xp: totals?.xp ?? 0,
      level: 1,
      streakDays: 0,
    },
    lifts,
  };
}

/** "2026-09-12T..." -> "12 SEP 2026" */
export function formatLegendDate(iso: string): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
