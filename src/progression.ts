import type { SQLiteDatabase } from 'expo-sqlite';
import { levelProgress } from './gameEngine';
import { progressionRules } from './progressionRules';

export type ProgressionSnapshot = {
  totalXP:number;level:number;levelCurrentXP:number;levelNeededXP:number;levelRatio:number;
  strengthXP:number;staminaXP:number;agilityXP:number;vitalityXP:number;disciplineXP:number;
  workoutCount:number;resistanceWorkoutCount:number;enduranceCount:number;recoveryCount:number;
  totalVolume:number;lifetimeMiles:number;prCount:number;streakDays:number;
  thisWeekWorkouts:number;thisWeekResistanceWorkouts:number;thisWeekEnduranceSessions:number;thisWeekRecoverySessions:number;
  thisWeekVolume:number;thisWeekMiles:number;thisWeekXP:number;lastWorkoutAt:string|null;
  quests:{ironWeek:{progress:number;target:number;complete:boolean};fiveTonTrial:{progress:number;target:number;complete:boolean};longRoad:{progress:number;target:number;complete:boolean};veteranPath:{progress:number;target:number;complete:boolean};restorationRitual:{progress:number;target:number;complete:boolean}};
  unlocks:{ironInitiate:boolean;relentless:boolean;forgedHelm:boolean;titanPlate:boolean;roadrunnerGreaves:boolean;restored:boolean;emberAura:boolean};
};

function mondayStartIso(now=new Date()){const date=new Date(now);const day=date.getDay();const diff=day===0?-6:1-day;date.setDate(date.getDate()+diff);date.setHours(0,0,0,0);return date.toISOString()}
async function getNumber(db:SQLiteDatabase,sql:string,...params:any[]){const row=await db.getFirstAsync<{total:number}>(sql,...params);return Number(row?.total??0)}

export async function getProgressionSnapshot(db:SQLiteDatabase):Promise<ProgressionSnapshot>{
  const weekStart=mondayStartIso();
  const [totalXP,strengthXP,staminaXP,agilityXP,vitalityXP,disciplineXP,workoutCount,enduranceCount,recoveryCount,totalVolume,lifetimeMiles,prCount,thisWeekWorkouts,thisWeekEnduranceSessions,thisWeekRecoverySessions,thisWeekVolume,thisWeekMiles,thisWeekXP]=await Promise.all([
    getNumber(db,`SELECT COALESCE(SUM(amount),0) AS total FROM xp_events`),
    getNumber(db,`SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='strength'`),
    getNumber(db,`SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='stamina'`),
    getNumber(db,`SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='agility'`),
    getNumber(db,`SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='vitality'`),
    getNumber(db,`SELECT COALESCE(SUM(amount),0) AS total FROM attribute_events WHERE attribute='discipline'`),
    getNumber(db,`SELECT COUNT(*) AS total FROM workout_sessions`),
    getNumber(db,`SELECT COUNT(*) AS total FROM workout_sessions WHERE template_id='run'`),
    getNumber(db,`SELECT COUNT(*) AS total FROM workout_sessions WHERE template_id='recovery'`),
    getNumber(db,`SELECT COALESCE(SUM(total_volume),0) AS total FROM workout_sessions`),
    getNumber(db,`SELECT COALESCE(SUM(distance_miles),0) AS total FROM endurance_sessions`),
    getNumber(db,`SELECT COUNT(*) AS total FROM exercise_sets WHERE is_pr=1`),
    getNumber(db,`SELECT COUNT(*) AS total FROM workout_sessions WHERE completed_at >= ?`,weekStart),
    getNumber(db,`SELECT COUNT(*) AS total FROM workout_sessions WHERE template_id='run' AND completed_at >= ?`,weekStart),
    getNumber(db,`SELECT COUNT(*) AS total FROM workout_sessions WHERE template_id='recovery' AND completed_at >= ?`,weekStart),
    getNumber(db,`SELECT COALESCE(SUM(total_volume),0) AS total FROM workout_sessions WHERE completed_at >= ?`,weekStart),
    getNumber(db,`SELECT COALESCE(SUM(distance_miles),0) AS total FROM endurance_sessions WHERE created_at >= ?`,weekStart),
    getNumber(db,`SELECT COALESCE(SUM(total_xp),0) AS total FROM workout_sessions WHERE completed_at >= ?`,weekStart),
  ]);
  const resistanceWorkoutCount=Math.max(0,workoutCount-enduranceCount-recoveryCount);
  const thisWeekResistanceWorkouts=Math.max(0,thisWeekWorkouts-thisWeekEnduranceSessions-thisWeekRecoverySessions);
  const last=await db.getFirstAsync<{completed_at:string}>(`SELECT completed_at FROM workout_sessions ORDER BY completed_at DESC LIMIT 1`);
  const days=await db.getAllAsync<{day:string}>(`SELECT DISTINCT substr(completed_at,1,10) AS day FROM workout_sessions ORDER BY day DESC LIMIT 90`);
  const set=new Set(days.map(row=>row.day));let streakDays=0;const cursor=new Date();cursor.setHours(12,0,0,0);const todayKey=cursor.toISOString().slice(0,10);if(!set.has(todayKey))cursor.setDate(cursor.getDate()-1);while(set.has(cursor.toISOString().slice(0,10))){streakDays+=1;cursor.setDate(cursor.getDate()-1)}
  const level=levelProgress(totalXP);const q=progressionRules.quests;const u=progressionRules.unlocks;
  return {totalXP,level:level.level,levelCurrentXP:level.current,levelNeededXP:level.needed,levelRatio:level.ratio,strengthXP,staminaXP,agilityXP,vitalityXP,disciplineXP,workoutCount,resistanceWorkoutCount,enduranceCount,recoveryCount,totalVolume,lifetimeMiles,prCount,streakDays,thisWeekWorkouts,thisWeekResistanceWorkouts,thisWeekEnduranceSessions,thisWeekRecoverySessions,thisWeekVolume,thisWeekMiles,thisWeekXP,lastWorkoutAt:last?.completed_at??null,
    quests:{
      ironWeek:{progress:Math.min(thisWeekResistanceWorkouts,q.ironWeek.target),target:q.ironWeek.target,complete:thisWeekResistanceWorkouts>=q.ironWeek.target},
      fiveTonTrial:{progress:Math.min(thisWeekVolume,q.fiveTonTrial.target),target:q.fiveTonTrial.target,complete:thisWeekVolume>=q.fiveTonTrial.target},
      longRoad:{progress:Math.min(lifetimeMiles,q.longRoad.target),target:q.longRoad.target,complete:lifetimeMiles>=q.longRoad.target},
      veteranPath:{progress:Math.min(workoutCount,q.veteranPath.target),target:q.veteranPath.target,complete:workoutCount>=q.veteranPath.target},
      restorationRitual:{progress:Math.min(recoveryCount,q.restorationRitual.target),target:q.restorationRitual.target,complete:recoveryCount>=q.restorationRitual.target},
    },
    unlocks:{ironInitiate:workoutCount>=u.ironInitiate.target,relentless:streakDays>=u.relentless.target,forgedHelm:workoutCount>=u.forgedHelm.target,titanPlate:totalVolume>=u.titanPlate.target,roadrunnerGreaves:lifetimeMiles>=u.roadrunnerGreaves.target,restored:recoveryCount>=u.restored.target,emberAura:totalXP>=u.emberAura.target}
  };
}
