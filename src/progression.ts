import type { SQLiteDatabase } from 'expo-sqlite';
import { levelProgress } from './gameEngine';

export type ProgressionSnapshot = {
  totalXP: number;
  level: number;
  levelCurrentXP: number;
  levelNeededXP: number;
  levelRatio: number;
  strengthXP: number;
  staminaXP: number;
  agilityXP: number;
  workoutCount: number;
  totalVolume: number;
  prCount: number;
  streakDays: number;
  thisWeekWorkouts: number;
  thisWeekVolume: number;
  thisWeekXP: number;
  lastWorkoutAt: string | null;
  quests: {
    ironWeek: { progress: number; target: number; complete: boolean };
    fiveTonTrial: { progress: number; target: number; complete: boolean };
    veteranPath: { progress: number; target: number; complete: boolean };
  };
  unlocks: {
    ironInitiate: boolean;
    relentless: boolean;
    forgedHelm: boolean;
    titanPlate: boolean;
  };
};

function mondayStartIso(now = new Date()) {
  const date = new Date(now);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

async function getNumber(db: SQLiteDatabase, sql: string, ...params: any[]) {
  const row = await db.getFirstAsync<{ total: number }>(sql, ...params);
  return Number(row?.total ?? 0);
}

export async function getProgressionSnapshot(db: SQLiteDatabase): Promise<ProgressionSnapshot> {
  const weekStart = mondayStartIso();

  const [
    totalXP,
    strengthXP,
    staminaXP,
    agilityXP,
    workoutCount,
    totalVolume,
    prCount,
    thisWeekWorkouts,
    thisWeekVolume,
    thisWeekXP,
  ] = await Promise.all([
    getNumber(db, `SELECT COALESCE(SUM(amount),0) AS total FROM xp_events`),
    getNumber(db, `SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='strength'`),
    getNumber(db, `SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='stamina'`),
    getNumber(db, `SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='agility'`),
    getNumber(db, `SELECT COUNT(*) AS total FROM workout_sessions`),
    getNumber(db, `SELECT COALESCE(SUM(total_volume),0) AS total FROM workout_sessions`),
    getNumber(db, `SELECT COUNT(*) AS total FROM exercise_sets WHERE is_pr=1`),
    getNumber(db, `SELECT COUNT(*) AS total FROM workout_sessions WHERE completed_at >= ?`, weekStart),
    getNumber(db, `SELECT COALESCE(SUM(total_volume),0) AS total FROM workout_sessions WHERE completed_at >= ?`, weekStart),
    getNumber(db, `SELECT COALESCE(SUM(total_xp),0) AS total FROM workout_sessions WHERE completed_at >= ?`, weekStart),
  ]);

  const last = await db.getFirstAsync<{ completed_at: string }>(
    `SELECT completed_at FROM workout_sessions ORDER BY completed_at DESC LIMIT 1`
  );

  const days = await db.getAllAsync<{ day: string }>(
    `SELECT DISTINCT substr(completed_at,1,10) AS day FROM workout_sessions ORDER BY day DESC LIMIT 90`
  );
  const set = new Set(days.map((row) => row.day));
  let streakDays = 0;
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  const todayKey = cursor.toISOString().slice(0, 10);
  if (!set.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const level = levelProgress(totalXP);
  const ironTarget = 3;
  const fiveTonTarget = 10000;
  const veteranTarget = 25;

  return {
    totalXP,
    level: level.level,
    levelCurrentXP: level.current,
    levelNeededXP: level.needed,
    levelRatio: level.ratio,
    strengthXP,
    staminaXP,
    agilityXP,
    workoutCount,
    totalVolume,
    prCount,
    streakDays,
    thisWeekWorkouts,
    thisWeekVolume,
    thisWeekXP,
    lastWorkoutAt: last?.completed_at ?? null,
    quests: {
      ironWeek: { progress: Math.min(thisWeekWorkouts, ironTarget), target: ironTarget, complete: thisWeekWorkouts >= ironTarget },
      fiveTonTrial: { progress: Math.min(thisWeekVolume, fiveTonTarget), target: fiveTonTarget, complete: thisWeekVolume >= fiveTonTarget },
      veteranPath: { progress: Math.min(workoutCount, veteranTarget), target: veteranTarget, complete: workoutCount >= veteranTarget },
    },
    unlocks: {
      ironInitiate: workoutCount >= 1,
      relentless: streakDays >= 7,
      forgedHelm: workoutCount >= 10,
      titanPlate: totalVolume >= 100000,
    },
  };
}
