import type { SQLiteDatabase } from 'expo-sqlite';
import { clearRememberedRecommendation, getRememberedRecommendation } from './recommendationMemory';
import { recommendationMatchesSession } from './trainingIdentity';

export type CoachingContext={recommendedTemplateId?:string|null;priority?:string|null;readiness?:string|null;confidence?:string|null;source?:string|null;};
export type CoachingCalibration={observations:number;followed:number;followRate:number;validated:number;calibrationScore:number;label:'LEARNING'|'CALIBRATING'|'PERSONALIZED';pattern:string;};

async function ensureTable(db:SQLiteDatabase){await db.execAsync(`
  CREATE TABLE IF NOT EXISTS coaching_outcomes (
    session_id TEXT PRIMARY KEY NOT NULL,
    recommended_template_id TEXT NOT NULL,
    actual_template_id TEXT NOT NULL,
    priority TEXT,
    readiness TEXT,
    recommendation_confidence TEXT,
    source TEXT,
    followed INTEGER NOT NULL DEFAULT 0,
    outcome_score INTEGER NOT NULL DEFAULT 0,
    outcome_label TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
  );
`);}
function scoreAgainstBaseline(actual:number,baseline:number){if(baseline<=0)return 75;const ratio=actual/baseline;if(ratio>=1.05)return 100;if(ratio>=.95)return 90;if(ratio>=.85)return 75;if(ratio>=.7)return 55;return 35;}

export async function recordCoachingOutcome(db:SQLiteDatabase,args:{sessionId:string;actualTemplateId:string;actualOutput:number;exerciseIds?:string[];context?:CoachingContext}){
  const recommended=args.context?.recommendedTemplateId;if(!recommended)return null;await ensureTable(db);
  const previous=await db.getFirstAsync<{total_volume:number;total_xp:number}|null>(`SELECT total_volume,total_xp FROM workout_sessions WHERE template_id=? AND id<>? ORDER BY completed_at DESC LIMIT 1`,args.actualTemplateId,args.sessionId);
  const baseline=args.actualTemplateId==='run'||args.actualTemplateId==='recovery'?Number(previous?.total_xp??0):Number(previous?.total_volume??0);
  const followed=recommendationMatchesSession(recommended,args.actualTemplateId,args.exerciseIds??[]);let outcomeScore=scoreAgainstBaseline(Math.max(0,args.actualOutput),baseline);
  if(args.actualTemplateId==='recovery'&&args.context?.priority==='RECOVERY')outcomeScore=Math.max(outcomeScore,90);
  const outcomeLabel=outcomeScore>=85?'VALIDATED':outcomeScore>=65?'NEUTRAL':'MISSED';
  await db.runAsync(`INSERT OR REPLACE INTO coaching_outcomes (session_id,recommended_template_id,actual_template_id,priority,readiness,recommendation_confidence,source,followed,outcome_score,outcome_label,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,args.sessionId,recommended,args.actualTemplateId,args.context?.priority??null,args.context?.readiness??null,args.context?.confidence??null,args.context?.source??null,followed?1:0,outcomeScore,outcomeLabel,new Date().toISOString());
  return{followed,outcomeScore,outcomeLabel};
}

export async function captureLatestCoachingOutcome(db:SQLiteDatabase){
  const remembered=getRememberedRecommendation();if(!remembered)return null;await ensureTable(db);
  const latest=await db.getFirstAsync<{id:string;template_id:string|null;total_volume:number;total_xp:number;completed_at:string}|null>(`SELECT id,template_id,total_volume,total_xp,completed_at FROM workout_sessions WHERE completed_at>=? ORDER BY completed_at DESC LIMIT 1`,remembered.capturedAt);
  if(!latest?.id||!latest.template_id)return null;
  const existing=await db.getFirstAsync<{session_id:string}|null>(`SELECT session_id FROM coaching_outcomes WHERE session_id=? LIMIT 1`,latest.id);
  if(existing){clearRememberedRecommendation();return null;}
  const exerciseRows=await db.getAllAsync<{exercise_id:string}>(`SELECT DISTINCT exercise_id FROM exercise_sets WHERE session_id=?`,latest.id);
  const actualOutput=latest.template_id==='run'||latest.template_id==='recovery'?Number(latest.total_xp??0):Number(latest.total_volume??0);
  const result=await recordCoachingOutcome(db,{sessionId:latest.id,actualTemplateId:latest.template_id,actualOutput,exerciseIds:exerciseRows.map(row=>row.exercise_id),context:{recommendedTemplateId:remembered.recommendedTemplateId,priority:remembered.priority,readiness:remembered.readiness,confidence:remembered.confidence,source:remembered.source}});
  clearRememberedRecommendation();return result;
}

async function normalizedOutcomeRows(db:SQLiteDatabase){
  const rows=await db.getAllAsync<{session_id:string;recommended_template_id:string;actual_template_id:string;followed:number;outcome_score:number;outcome_label:string}>(`SELECT session_id,recommended_template_id,actual_template_id,followed,outcome_score,outcome_label FROM coaching_outcomes ORDER BY created_at DESC LIMIT 30`);
  return Promise.all(rows.map(async row=>{
    if(row.actual_template_id==='run'||row.actual_template_id==='recovery'||['push','pull','legs'].includes(row.actual_template_id))return row;
    const exerciseRows=await db.getAllAsync<{exercise_id:string}>(`SELECT DISTINCT exercise_id FROM exercise_sets WHERE session_id=?`,row.session_id);
    const followed=recommendationMatchesSession(row.recommended_template_id,row.actual_template_id,exerciseRows.map(item=>item.exercise_id));
    const normalized=followed?1:0;
    if(normalized!==row.followed)await db.runAsync(`UPDATE coaching_outcomes SET followed=? WHERE session_id=?`,normalized,row.session_id);
    return{...row,followed:normalized};
  }));
}

export async function getCoachingCalibration(db:SQLiteDatabase):Promise<CoachingCalibration>{
  await ensureTable(db);const rows=await normalizedOutcomeRows(db);const observations=rows.length;
  if(!observations)return{observations:0,followed:0,followRate:0,validated:0,calibrationScore:0,label:'LEARNING',pattern:'VitalQuest needs completed recommendation cycles before it can personalize coaching.'};
  const followed=rows.filter(row=>row.followed===1).length;const validated=rows.filter(row=>row.outcome_label==='VALIDATED').length;const calibrationScore=Math.round(rows.reduce((sum,row)=>sum+Number(row.outcome_score||0),0)/observations);const followRate=Math.round((followed/observations)*100);const label=observations>=8&&calibrationScore>=75?'PERSONALIZED':observations>=3?'CALIBRATING':'LEARNING';
  const skips=new Map<string,number>();for(const row of rows){if(row.followed===0)skips.set(row.recommended_template_id,(skips.get(row.recommended_template_id)??0)+1)}const topSkip=[...skips.entries()].sort((a,b)=>b[1]-a[1])[0];
  const pattern=topSkip&&topSkip[1]>=2?`${topSkip[0].toUpperCase()} recommendations have been bypassed ${topSkip[1]} times recently.`:followRate>=75?'You usually follow the recommended path, giving VitalQuest a strong calibration signal.':'Your recent choices are still teaching VitalQuest which recommendations fit you best.';
  return{observations,followed,followRate,validated,calibrationScore,label,pattern};
}
