import type { SQLiteDatabase } from 'expo-sqlite';

export type RecentTrainingSession = {
  templateId: string;
  name: string;
  totalXP: number;
  totalVolume: number;
  durationMinutes: number;
  completedAt: string;
};

export type ExerciseInsight = {
  exerciseId: string;
  name: string;
  sessions: number;
  topWeight: number;
  bestVolumeSet: number;
  recentVolume: number;
  previousVolume: number;
  volumeTrendPct: number;
  lastPerformedAt: string | null;
};

export type TrainingIntelligence = {
  recent: RecentTrainingSession[];
  averageXP: number;
  averageDuration: number;
  averageVolume: number;
  generatedSessions: number;
  recentResistanceMix: string[];
  exerciseInsights: ExerciseInsight[];
  strongestTrend: ExerciseInsight | null;
  needsAttention: ExerciseInsight | null;
  recentPrs: number;
  recentSetCount: number;
};

export const EMPTY_INTELLIGENCE: TrainingIntelligence = {
  recent: [],
  averageXP: 0,
  averageDuration: 0,
  averageVolume: 0,
  generatedSessions: 0,
  recentResistanceMix: [],
  exerciseInsights: [],
  strongestTrend: null,
  needsAttention: null,
  recentPrs: 0,
  recentSetCount: 0,
};

export async function getTrainingIntelligence(db: SQLiteDatabase): Promise<TrainingIntelligence> {
  const sessionRows = await db.getAllAsync<{
    template_id: string | null;
    name: string;
    total_xp: number;
    total_volume: number;
    duration_minutes: number;
    completed_at: string;
  }>(`SELECT template_id, name, total_xp, total_volume, duration_minutes, completed_at
      FROM workout_sessions
      ORDER BY completed_at DESC
      LIMIT 12`);

  const recent = sessionRows.map(row => ({
    templateId: row.template_id ?? 'unknown',
    name: row.name,
    totalXP: Number(row.total_xp ?? 0),
    totalVolume: Number(row.total_volume ?? 0),
    durationMinutes: Number(row.duration_minutes ?? 0),
    completedAt: row.completed_at,
  }));

  const setRows = await db.getAllAsync<{
    session_id: string;
    exercise_id: string;
    exercise_name: string;
    weight: number;
    reps: number;
    is_pr: number;
    completed_at: string;
  }>(`SELECT session_id, exercise_id, exercise_name, weight, reps, is_pr, completed_at
      FROM exercise_sets
      ORDER BY completed_at DESC
      LIMIT 240`);

  const grouped = new Map<string, typeof setRows>();
  for (const row of setRows) {
    const current = grouped.get(row.exercise_id) ?? [];
    current.push(row);
    grouped.set(row.exercise_id, current);
  }

  const exerciseInsights = Array.from(grouped.entries()).map(([exerciseId, sets]) => {
    const sessionCount = new Set(sets.map(set => set.session_id)).size;
    const volumes = sets.map(set => Number(set.weight || 0) * Number(set.reps || 0));
    const recentSets = volumes.slice(0, Math.min(6, volumes.length));
    const previousSets = volumes.slice(6, 12);
    const recentVolume = recentSets.length ? recentSets.reduce((a,b)=>a+b,0) / recentSets.length : 0;
    const previousVolume = previousSets.length ? previousSets.reduce((a,b)=>a+b,0) / previousSets.length : recentVolume;
    const volumeTrendPct = previousVolume > 0 ? ((recentVolume - previousVolume) / previousVolume) * 100 : 0;
    return {
      exerciseId,
      name: sets[0]?.exercise_name ?? exerciseId,
      sessions: sessionCount,
      topWeight: Math.max(...sets.map(set => Number(set.weight || 0)), 0),
      bestVolumeSet: Math.max(...volumes, 0),
      recentVolume: Math.round(recentVolume),
      previousVolume: Math.round(previousVolume),
      volumeTrendPct: Math.round(volumeTrendPct),
      lastPerformedAt: sets[0]?.completed_at ?? null,
    };
  }).sort((a,b)=>b.sessions-a.sessions || b.recentVolume-a.recentVolume);

  const eligible = exerciseInsights.filter(item => item.sessions >= 2);
  const strongestTrend = [...eligible].sort((a,b)=>b.volumeTrendPct-a.volumeTrendPct)[0] ?? exerciseInsights[0] ?? null;
  const needsAttention = [...eligible].sort((a,b)=>a.volumeTrendPct-b.volumeTrendPct)[0] ?? null;
  const count = Math.max(1, recent.length);

  return {
    recent,
    averageXP: recent.length ? Math.round(recent.reduce((sum,row)=>sum+row.totalXP,0)/count) : 0,
    averageDuration: recent.length ? Math.round(recent.reduce((sum,row)=>sum+row.durationMinutes,0)/count) : 0,
    averageVolume: recent.length ? Math.round(recent.reduce((sum,row)=>sum+row.totalVolume,0)/count) : 0,
    generatedSessions: recent.filter(row=>row.templateId.startsWith('ai-')).length,
    recentResistanceMix: recent.filter(row=>['push','pull','legs'].includes(row.templateId)||row.templateId.startsWith('ai-')).slice(0,5).map(row=>row.templateId),
    exerciseInsights,
    strongestTrend,
    needsAttention,
    recentPrs: setRows.slice(0,60).filter(row=>Number(row.is_pr)===1).length,
    recentSetCount: Math.min(setRows.length,60),
  };
}
