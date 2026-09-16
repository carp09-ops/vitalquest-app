import type { SQLiteDatabase } from 'expo-sqlite';
import { CustomWorkoutTemplate, DEFAULT_EQUIPMENT, EquipmentId } from './trainingPreferences';

export async function migrateDb(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      template_id TEXT,
      name TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      total_volume REAL NOT NULL DEFAULT 0,
      total_xp INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS exercise_sets (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      weight REAL NOT NULL DEFAULT 0,
      reps INTEGER NOT NULL DEFAULT 0,
      is_pr INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS endurance_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      distance_miles REAL NOT NULL DEFAULT 0,
      duration_minutes INTEGER NOT NULL DEFAULT 0,
      avg_pace_seconds INTEGER NOT NULL DEFAULT 0,
      activity_type TEXT NOT NULL DEFAULT 'run',
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS xp_events (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS attribute_events (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT,
      attribute TEXT NOT NULL,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS app_preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS custom_workouts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      exercises_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      retry_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}

type AttributeGain = {
  attribute: 'strength' | 'stamina' | 'agility' | 'vitality' | 'discipline' | string;
  amount: number;
  reason: string;
};

type BaseSession = {
  sessionId: string;
  templateId: string;
  name: string;
  startedAt: string;
  completedAt: string;
  durationMinutes: number;
  totalVolume: number;
  totalXP: number;
  strengthXP?: number;
  attributeGains?: AttributeGain[];
  syncDetails?: Record<string, unknown>;
};

async function writeSessionBase(db: SQLiteDatabase, input: BaseSession) {
  await db.runAsync(
    `INSERT INTO workout_sessions
     (id, template_id, name, started_at, completed_at, duration_minutes, total_volume, total_xp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    input.sessionId,
    input.templateId,
    input.name,
    input.startedAt,
    input.completedAt,
    input.durationMinutes,
    input.totalVolume,
    input.totalXP
  );

  await db.runAsync(
    `INSERT INTO xp_events (id, session_id, amount, reason, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    `${input.sessionId}-xp`,
    input.sessionId,
    input.totalXP,
    'workout_complete',
    input.completedAt
  );

  const attributeGains: AttributeGain[] = input.attributeGains?.length
    ? input.attributeGains
    : input.strengthXP
      ? [{ attribute: 'strength', amount: input.strengthXP, reason: 'resistance_training' }]
      : [];

  for (const gain of attributeGains) {
    if (!gain.amount) continue;
    await db.runAsync(
      `INSERT INTO attribute_events (id, session_id, attribute, amount, reason, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      `${input.sessionId}-${gain.attribute}`,
      input.sessionId,
      gain.attribute,
      gain.amount,
      gain.reason,
      input.completedAt
    );
  }

  const payload = JSON.stringify({
    sessionId: input.sessionId,
    completedAt: input.completedAt,
    templateId: input.templateId,
    totalXP: input.totalXP,
    durationMinutes: input.durationMinutes,
    totalVolume: input.totalVolume,
    attributeGains,
    ...input.syncDetails,
  });

  await db.runAsync(
    `INSERT INTO sync_outbox
     (id, entity_type, entity_id, operation, payload_json, status, retry_count, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', 0, ?)`,
    `${input.sessionId}-sync`,
    'workout_session',
    input.sessionId,
    'upsert',
    payload,
    input.completedAt
  );
}

export async function saveCompletedWorkout(
  db: SQLiteDatabase,
  input: BaseSession & {
    sets: Array<{
      id: string;
      exerciseId: string;
      exerciseName: string;
      setNumber: number;
      weight: number;
      reps: number;
      isPR: boolean;
    }>;
  }
) {
  await db.withTransactionAsync(async () => {
    await writeSessionBase(db, { ...input, syncDetails: { ...input.syncDetails, sets: input.sets } });
    for (const set of input.sets) {
      await db.runAsync(
        `INSERT INTO exercise_sets
         (id, session_id, exercise_id, exercise_name, set_number, weight, reps, is_pr, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        set.id,
        input.sessionId,
        set.exerciseId,
        set.exerciseName,
        set.setNumber,
        set.weight,
        set.reps,
        set.isPR ? 1 : 0,
        input.completedAt
      );
    }
  });
}

export async function saveCompletedEnduranceSession(
  db: SQLiteDatabase,
  input: BaseSession & {
    distanceMiles: number;
    avgPaceSeconds: number;
    activityType?: 'run' | 'walk' | 'bike' | string;
  }
) {
  await db.withTransactionAsync(async () => {
    await writeSessionBase(db, {
      ...input,
      syncDetails: {
        ...input.syncDetails,
        distanceMiles: input.distanceMiles,
        avgPaceSeconds: input.avgPaceSeconds,
        activityType: input.activityType ?? 'run',
      },
    });
    await db.runAsync(
      `INSERT INTO endurance_sessions
       (id, session_id, distance_miles, duration_minutes, avg_pace_seconds, activity_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      `${input.sessionId}-endurance`,
      input.sessionId,
      input.distanceMiles,
      input.durationMinutes,
      input.avgPaceSeconds,
      input.activityType ?? 'run',
      input.completedAt
    );
  });
}

export async function getEquipmentProfile(db: SQLiteDatabase): Promise<EquipmentId[]> {
  const row = await db.getFirstAsync<{ value_json:string }>(`SELECT value_json FROM app_preferences WHERE key='equipment_profile' LIMIT 1`);
  if (!row?.value_json) return DEFAULT_EQUIPMENT;
  try {
    const parsed = JSON.parse(row.value_json);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_EQUIPMENT;
  } catch {
    return DEFAULT_EQUIPMENT;
  }
}

export async function saveEquipmentProfile(db: SQLiteDatabase, equipment: EquipmentId[]) {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO app_preferences (key, value_json, updated_at) VALUES (?, ?, ?)`,
    'equipment_profile',
    JSON.stringify(equipment),
    now
  );
}

export async function getCustomWorkouts(db: SQLiteDatabase): Promise<CustomWorkoutTemplate[]> {
  const rows = await db.getAllAsync<{id:string;name:string;exercises_json:string;created_at:string}>(`SELECT id, name, exercises_json, created_at FROM custom_workouts ORDER BY updated_at DESC`);
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    exercises: JSON.parse(row.exercises_json || '[]'),
  }));
}

export async function saveCustomWorkout(db: SQLiteDatabase, workout: CustomWorkoutTemplate) {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO custom_workouts (id, name, exercises_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    workout.id,
    workout.name,
    JSON.stringify(workout.exercises),
    workout.createdAt || now,
    now
  );
}

export async function deleteCustomWorkout(db: SQLiteDatabase, id: string) {
  await db.runAsync(`DELETE FROM custom_workouts WHERE id = ?`, id);
}

export async function getLifetimeXP(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ total: number }>(`SELECT COALESCE(SUM(amount), 0) AS total FROM xp_events`);
  return row?.total ?? 0;
}

export async function getLifetimeAttributeXP(db: SQLiteDatabase, attribute: string) {
  const row = await db.getFirstAsync<{ total: number }>(`SELECT COALESCE(SUM(amount), 0) AS total FROM attribute_events WHERE attribute = ?`, attribute);
  return row?.total ?? 0;
}
