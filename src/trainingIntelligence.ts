import type { SQLiteDatabase } from 'expo-sqlite';

export type RecentTrainingSession = {
  templateId: string;
  name: string;
  totalXP: number;
  totalVolume: number;
  durationMinutes: number;
  completedAt: string;
};

export type TrainingIntelligence = {
  recent: RecentTrainingSession[];
  averageXP: number;
  averageDuration: number;
  averageVolume: number;
  generatedSessions: number;
  recentResistanceMix: string[];
};

export async function getTrainingIntelligence(db: SQLiteDatabase): Promise<TrainingIntelligence> {
  const rows = await db.getAllAsync<{
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

  const recent = rows.map(row => ({
    templateId: row.template_id ?? 'unknown',
    name: row.name,
    totalXP: Number(row.total_xp ?? 0),
    totalVolume: Number(row.total_volume ?? 0),
    durationMinutes: Number(row.duration_minutes ?? 0),
    completedAt: row.completed_at,
  }));
  const count = Math.max(1, recent.length);
  return {
    recent,
    averageXP: recent.length ? Math.round(recent.reduce((sum,row)=>sum+row.totalXP,0)/count) : 0,
    averageDuration: recent.length ? Math.round(recent.reduce((sum,row)=>sum+row.durationMinutes,0)/count) : 0,
    averageVolume: recent.length ? Math.round(recent.reduce((sum,row)=>sum+row.totalVolume,0)/count) : 0,
    generatedSessions: recent.filter(row=>row.templateId.startsWith('ai-')).length,
    recentResistanceMix: recent.filter(row=>['push','pull','legs'].includes(row.templateId)||row.templateId.startsWith('ai-')).slice(0,5).map(row=>row.templateId),
  };
}
