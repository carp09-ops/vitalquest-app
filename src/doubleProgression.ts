import type { SQLiteDatabase } from 'expo-sqlite';
import { EXERCISE_CATALOG, type ExerciseCatalogItem } from './trainingPreferences';

/**
 * Double progression: work a rep range at a fixed load; when every working
 * set hits the top of the range, add load. When reps fall below the range,
 * back off. RPE gates the jump — grinding at RPE 9.5+ means consolidate.
 */

export interface LastWorkingSets {
  weight: number;
  reps: number[];
  avgRpe: number | null;
  sessionAt: string | null;
}

export type ProgressionAction = 'START' | 'PROGRESS' | 'REPEAT' | 'CONSOLIDATE' | 'BACK_OFF';

export interface ProgressionPlan {
  exerciseId: string;
  weight: number;
  repLow: number;
  repHigh: number;
  action: ProgressionAction;
  note: string;
}

export function repRangeFor(exercise: ExerciseCatalogItem): { low: number; high: number } {
  const d = exercise.defaultReps;
  return { low: Math.max(3, d - 2), high: d + 2 };
}

function minWeightFor(exercise: ExerciseCatalogItem): number {
  if (exercise.equipment.includes('barbell')) return 45;
  if (exercise.equipment.includes('dumbbells')) return 5;
  return 0;
}

export function planDoubleProgression(args: {
  exercise: ExerciseCatalogItem;
  last: LastWorkingSets | null;
}): ProgressionPlan {
  const { exercise, last } = args;
  const { low, high } = repRangeFor(exercise);
  const base = { exerciseId: exercise.id, repLow: low, repHigh: high };

  if (!last || last.reps.length === 0 || last.weight <= 0) {
    return {
      ...base, weight: 0, action: 'START',
      note: 'First logged session on this movement — establish a baseline, leave 2 reps in reserve.',
    };
  }

  const allHitHigh = last.reps.every((r) => r >= high);
  const anyBelowLow = last.reps.some((r) => r < low);
  const inc = exercise.loadIncrement;

  if (allHitHigh) {
    if (inc <= 0) {
      return {
        ...base, weight: last.weight, action: 'PROGRESS',
        note: `Hit ${high} reps on every set — add reps next time (bodyweight progression).`,
      };
    }
    if (last.avgRpe != null && last.avgRpe >= 9) {
      return {
        ...base, weight: last.weight, action: 'CONSOLIDATE',
        note: `Top of the range, but RPE ${last.avgRpe.toFixed(1)} — consolidate at ${last.weight} lb before jumping.`,
      };
    }
    return {
      ...base, weight: last.weight + inc, action: 'PROGRESS',
      note: `Hit ${high} reps across every set — adding ${inc} lb.`,
    };
  }

  if (anyBelowLow) {
    const next = Math.max(minWeightFor(exercise), last.weight - Math.max(inc, 2.5));
    return {
      ...base, weight: next, action: 'BACK_OFF',
      note: `Reps fell below the ${low}-${high} range — dropping to ${next} lb to rebuild.`,
    };
  }

  return {
    ...base, weight: last.weight, action: 'REPEAT',
    note: `Working through the ${low}-${high} range — same ${last.weight} lb, chase more reps.`,
  };
}

/** Latest working sets per exercise (warm-ups excluded), batched in one query. */
export async function getLastWorkingSets(
  db: SQLiteDatabase,
  exerciseIds?: string[],
): Promise<Record<string, LastWorkingSets>> {
  const filter = exerciseIds?.length
    ? `AND exercise_id IN (${exerciseIds.map(() => '?').join(',')})`
    : '';
  const params = exerciseIds?.length ? exerciseIds : [];
  const rows = await db.getAllAsync<{
    exercise_id: string; session_id: string; weight: number; reps: number; rpe: number | null; completed_at: string;
  }>(
    `SELECT exercise_id, session_id, weight, reps, rpe, completed_at FROM exercise_sets
     WHERE (set_kind IS NULL OR set_kind = 'working') AND completed_at IS NOT NULL ${filter}
     ORDER BY completed_at DESC LIMIT 500`,
    ...params,
  );
  const latestSession = new Map<string, string>();
  for (const row of rows) {
    if (!latestSession.has(row.exercise_id)) latestSession.set(row.exercise_id, row.session_id);
  }
  const out: Record<string, LastWorkingSets> = {};
  for (const [exerciseId, sessionId] of latestSession) {
    const sets = rows.filter((r) => r.exercise_id === exerciseId && r.session_id === sessionId && r.weight > 0);
    if (!sets.length) continue;
    const weights = sets.map((s) => Number(s.weight));
    const mode = weights.sort((a, b) =>
      weights.filter((w) => w === a).length - weights.filter((w) => w === b).length).pop() ?? weights[0] ?? 0;
    const rpes = sets.map((s) => s.rpe).filter((r): r is number => r != null);
    out[exerciseId] = {
      weight: mode,
      reps: sets.map((s) => Number(s.reps) || 0),
      avgRpe: rpes.length ? Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10) / 10 : null,
      sessionAt: sets[0]?.completed_at ?? null,
    };
  }
  return out;
}

export function catalogItemFor(exerciseId: string): ExerciseCatalogItem | undefined {
  return EXERCISE_CATALOG.find((e) => e.id === exerciseId);
}
