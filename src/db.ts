import type { SQLiteDatabase } from 'expo-sqlite';

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

export async function saveCompletedWorkout(
  db: SQLiteDatabase,
  input: {
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
  const attributeGains: AttributeGain[] = input.attributeGains?.length
    ? input.attributeGains
    : input.strengthXP
      ? [{ attribute: 'strength', amount: input.strengthXP, reason: 'resistance_training' }]
      : [];

  await db.withTransactionAsync(async () => {
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

    await db.runAsync(
      `INSERT INTO xp_events (id, session_id, amount, reason, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      `${input.sessionId}-xp`,
      input.sessionId,
      input.totalXP,
      'workout_complete',
      input.completedAt
    );

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
      attributeGains,
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
  });
}

export async function getLifetimeXP(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM xp_events`
  );
  return row?.total ?? 0;
}

export async function getLifetimeAttributeXP(db: SQLiteDatabase, attribute: string) {
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM attribute_events WHERE attribute = ?`,
    attribute
  );
  return row?.total ?? 0;
}
