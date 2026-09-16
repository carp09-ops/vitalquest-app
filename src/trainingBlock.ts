import type { SQLiteDatabase } from 'expo-sqlite';
import type { TrainingIntelligence } from './trainingIntelligence';

export type TrainingBlockPhase='FOUNDATION'|'BUILD'|'OVERLOAD'|'DELOAD';
export type TrainingBlock={
  id:string;startAt:string;endAt:string;week:number;totalWeeks:number;phase:TrainingBlockPhase;title:string;objective:string;loadGuidance:string;loadMultiplier:number;
  weeklyTarget:number;weeklyCompleted:number;weeklyProgress:number;resistanceTarget:number;enduranceTarget:number;recoveryTarget:number;resistanceCompleted:number;enduranceCompleted:number;recoveryCompleted:number;
  blockSessions:number;blockXP:number;assessment:string;
};

const DAY=864e5;const WEEK=7*DAY;const TOTAL_WEEKS=4;
let activeGuide:{loadMultiplier:number;phaseLabel:string}={loadMultiplier:1,phaseLabel:'BUILD'};
export function currentTrainingBlockLoadGuide(){return activeGuide}
const phases:Record<number,{phase:TrainingBlockPhase;title:string;objective:string;loadGuidance:string;loadMultiplier:number;weeklyTarget:number;resistanceTarget:number;enduranceTarget:number;recoveryTarget:number}>={
  1:{phase:'FOUNDATION',title:'Foundation',objective:'Establish repeatable training quality and balanced exposure.',loadGuidance:'Leave room in the tank. Build clean baselines before chasing volume.',loadMultiplier:.9,weeklyTarget:4,resistanceTarget:2,enduranceTarget:1,recoveryTarget:1},
  2:{phase:'BUILD',title:'Build',objective:'Add productive work while preserving movement balance.',loadGuidance:'Progress load or volume modestly when recent performance supports it.',loadMultiplier:1,weeklyTarget:4,resistanceTarget:3,enduranceTarget:1,recoveryTarget:1},
  3:{phase:'OVERLOAD',title:'Overload',objective:'Create the strongest progression stimulus of the Arc.',loadGuidance:'Push progression selectively. Quality output matters more than adding junk volume.',loadMultiplier:1.05,weeklyTarget:5,resistanceTarget:3,enduranceTarget:1,recoveryTarget:1},
  4:{phase:'DELOAD',title:'Deload + Assess',objective:'Reduce fatigue, consolidate gains, and assess the block.',loadGuidance:'Cut hard-session demand roughly 20–25% and favor recovery when signals soften.',loadMultiplier:.75,weeklyTarget:3,resistanceTarget:2,enduranceTarget:0,recoveryTarget:1},
};
function mondayStart(date=new Date()){const d=new Date(date);const day=d.getDay();const diff=day===0?-6:1-day;d.setDate(d.getDate()+diff);d.setHours(0,0,0,0);return d;}
async function getPref(db:SQLiteDatabase,key:string){const row=await db.getFirstAsync<{value_json:string}>(`SELECT value_json FROM app_preferences WHERE key=? LIMIT 1`,key);if(!row?.value_json)return null;try{return JSON.parse(row.value_json)}catch{return null}}
async function setPref(db:SQLiteDatabase,key:string,value:unknown){await db.runAsync(`INSERT OR REPLACE INTO app_preferences (key,value_json,updated_at) VALUES (?,?,?)`,key,JSON.stringify(value),new Date().toISOString())}
async function ensureBlockStart(db:SQLiteDatabase){const existing=await getPref(db,'training_block_v1');if(existing?.startAt){const start=new Date(existing.startAt);const age=Date.now()-start.getTime();if(age<TOTAL_WEEKS*WEEK)return start;}const first=await db.getFirstAsync<{completed_at:string}>(`SELECT completed_at FROM workout_sessions ORDER BY completed_at DESC LIMIT 1`);const start=mondayStart(first?.completed_at?new Date(first.completed_at):new Date());await setPref(db,'training_block_v1',{startAt:start.toISOString(),totalWeeks:TOTAL_WEEKS});return start;}

export async function getTrainingBlock(db:SQLiteDatabase,intelligence?:TrainingIntelligence):Promise<TrainingBlock>{
  let start=await ensureBlockStart(db);let elapsed=Math.max(0,Date.now()-start.getTime());if(elapsed>=TOTAL_WEEKS*WEEK){start=mondayStart(new Date());await setPref(db,'training_block_v1',{startAt:start.toISOString(),totalWeeks:TOTAL_WEEKS});elapsed=Math.max(0,Date.now()-start.getTime());}
  const week=Math.min(TOTAL_WEEKS,Math.floor(elapsed/WEEK)+1);const config=phases[week];activeGuide={loadMultiplier:config.loadMultiplier,phaseLabel:config.phase};
  const weekStart=new Date(start.getTime()+(week-1)*WEEK);const weekEnd=new Date(weekStart.getTime()+WEEK);const endAt=new Date(start.getTime()+TOTAL_WEEKS*WEEK);
  const rows=await db.getAllAsync<{template_id:string|null;total_xp:number;completed_at:string}>(`SELECT template_id,total_xp,completed_at FROM workout_sessions WHERE completed_at>=? AND completed_at<? ORDER BY completed_at ASC`,weekStart.toISOString(),weekEnd.toISOString());
  const blockRows=await db.getAllAsync<{total_xp:number}>(`SELECT total_xp FROM workout_sessions WHERE completed_at>=? AND completed_at<?`,start.toISOString(),endAt.toISOString());
  const resistanceCompleted=rows.filter(row=>row.template_id!=='run'&&row.template_id!=='recovery').length;const enduranceCompleted=rows.filter(row=>row.template_id==='run').length;const recoveryCompleted=rows.filter(row=>row.template_id==='recovery').length;const weeklyCompleted=rows.length;const blockSessions=blockRows.length;const blockXP=blockRows.reduce((sum,row)=>sum+Number(row.total_xp||0),0);const trend=intelligence?.performanceTrend??'LIMITED DATA';const fatigue=intelligence?.fatigueScore??0;
  const assessment=week<4?`${config.title} week · ${Math.max(0,config.weeklyTarget-weeklyCompleted)} planned session${Math.max(0,config.weeklyTarget-weeklyCompleted)===1?'':'s'} remaining.`:fatigue>=60?'Assessment: fatigue is elevated. Complete the Arc with recovery and reduced demand before starting the next block.':trend==='IMPROVING'?'Assessment: output is improving. Finish the deload, then begin the next Arc from a higher baseline.':trend==='REGRESSING'?'Assessment: output softened late in the block. Prioritize recovery before increasing the next Arc.':'Assessment: output is stable. Deload, then begin the next Arc with measured progression.';
  return{id:`arc-${start.toISOString().slice(0,10)}`,startAt:start.toISOString(),endAt:endAt.toISOString(),week,totalWeeks:TOTAL_WEEKS,phase:config.phase,title:config.title,objective:config.objective,loadGuidance:config.loadGuidance,loadMultiplier:config.loadMultiplier,weeklyTarget:config.weeklyTarget,weeklyCompleted,weeklyProgress:Math.min(1,weeklyCompleted/config.weeklyTarget),resistanceTarget:config.resistanceTarget,enduranceTarget:config.enduranceTarget,recoveryTarget:config.recoveryTarget,resistanceCompleted,enduranceCompleted,recoveryCompleted,blockSessions,blockXP,assessment};
}
