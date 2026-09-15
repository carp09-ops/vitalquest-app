import React, { createContext, useContext, useEffect, useMemo } from 'react';

type WebStore = {
  workout_sessions: any[];
  exercise_sets: any[];
  xp_events: any[];
  attribute_events: any[];
  sync_outbox: any[];
};

const STORAGE_KEY = 'vitalquest.webdb.v1';

function emptyStore(): WebStore {
  return {
    workout_sessions: [],
    exercise_sets: [],
    xp_events: [],
    attribute_events: [],
    sync_outbox: [],
  };
}

function loadStore(): WebStore {
  if (typeof window === 'undefined') return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore();
  } catch {
    return emptyStore();
  }
}

function persistStore(store: WebStore) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function createWebDb() {
  return {
    async execAsync() {
      // Browser storage is schemaless. Native migrations remain authoritative for SQLite.
    },

    async withTransactionAsync(callback: () => Promise<void>) {
      await callback();
    },

    async runAsync(sql: string, ...params: any[]) {
      const store = loadStore();
      const normalized = sql.replace(/\s+/g, ' ').trim().toLowerCase();

      if (normalized.includes('insert into workout_sessions')) {
        store.workout_sessions.push({
          id: params[0], template_id: params[1], name: params[2], started_at: params[3],
          completed_at: params[4], duration_minutes: params[5], total_volume: params[6], total_xp: params[7],
        });
      } else if (normalized.includes('insert into exercise_sets')) {
        store.exercise_sets.push({
          id: params[0], session_id: params[1], exercise_id: params[2], exercise_name: params[3],
          set_number: params[4], weight: params[5], reps: params[6], is_pr: params[7], completed_at: params[8],
        });
      } else if (normalized.includes('insert into xp_events')) {
        store.xp_events.push({ id: params[0], session_id: params[1], amount: params[2], reason: params[3], created_at: params[4] });
      } else if (normalized.includes('insert into attribute_events')) {
        store.attribute_events.push({
          id: params[0], session_id: params[1], attribute: params[2], amount: params[3], reason: params[4], created_at: params[5],
        });
      } else if (normalized.includes('insert into sync_outbox')) {
        store.sync_outbox.push({
          id: params[0], entity_type: params[1], entity_id: params[2], operation: params[3], payload_json: params[4],
          status: 'pending', retry_count: 0, created_at: params[5],
        });
      }

      persistStore(store);
      return { changes: 1, lastInsertRowId: 0 };
    },

    async getFirstAsync<T = any>(sql: string, ...params: any[]): Promise<T | null> {
      const store = loadStore();
      const normalized = sql.replace(/\s+/g, ' ').trim().toLowerCase();

      if (normalized.includes('from xp_events')) {
        const total = store.xp_events.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        return { total } as T;
      }

      if (normalized.includes('from attribute_events')) {
        const attribute = params[0];
        const total = store.attribute_events
          .filter((row) => row.attribute === attribute)
          .reduce((sum, row) => sum + Number(row.amount || 0), 0);
        return { total } as T;
      }

      return null;
    },
  };
}

type WebDb = ReturnType<typeof createWebDb>;
const DbContext = createContext<WebDb | null>(null);

export function SQLiteProvider({
  children,
  onInit,
}: {
  children: React.ReactNode;
  databaseName?: string;
  onInit?: (db: any) => Promise<void> | void;
}) {
  const db = useMemo(() => createWebDb(), []);

  useEffect(() => {
    void onInit?.(db);
  }, [db, onInit]);

  return <DbContext.Provider value={db}>{children}</DbContext.Provider>;
}

export function useSQLiteContext() {
  const db = useContext(DbContext);
  if (!db) throw new Error('useSQLiteContext must be used inside SQLiteProvider');
  return db as any;
}
