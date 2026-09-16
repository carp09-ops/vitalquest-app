import type { SQLiteDatabase } from 'expo-sqlite';
import type { TrainingIntelligence } from './trainingIntelligence';

export type TrainingBlockPhase='FOUNDATION'|'BUILD'|'OVERLOAD'|'DELOAD';
export type TrainingArcGoal='STRENGTH'|'CONDITIONING'|'HYBRID'|'REBUILD';
export type ArcScorecard={adherence:number;plannedSessions:number;performance:string;fatigue:number;coachingCalibration:number;status:'IN PROGRESS'|'ARC COMPLETE'|'RECOVER'|'NEEDS REVIEW';summary:string;};
export type CompletedTrainingArc={id:string;goal:TrainingArcGoal;goalLabel:string;startAt:string;endAt:string;completedAt:string;blockSessions:number;blockXP:number;goalProgress:string;scorecard:ArcScorecard;};
export type TrainingBlock={
  id:string;startAt:string;endAt:string;week:number;totalWeeks:number;phase:TrainingBlockPhase;title:string;objective:string;loadGuidance:string;loadMultiplier:number;
  goal:TrainingArcGoal;goalLabel:string;goalDescription:string;successMetric:string;
  weeklyTarget:number;weeklyCompleted:number;weeklyProgress:number;resistanceTarget:number;enduranceTarget:number;recoveryTarget:number;resistanceCompleted:number;enduranceCompleted:number;recoveryCompleted:number;
  blockSessions:number;blockXP:number;assessment:string;goalProgress:string;scorecard:ArcScorecard;transition:CompletedTrainingArc|null;
};

export const ARC_GOALS:Array<{id:TrainingArcGoal;label:string;description:string}>=[
  {id:'STRENGTH',label:'Build Strength',description:'Bias the Arc toward resistance progression, load quality and strength attributes.'},
  {id:'CONDITIONING',label:'Improve Conditioning',description:'Increase endurance exposure while protecting enough resistance work to stay balanced.'},
  {id:'HYBRID',label:'Hybrid Performance',description:'Develop strength and conditioning together with balanced weekly exposure.'},
  {id:'REBUILD',label:'Return / Rebuild',description:'Re-establish consistency with lower loading, more recovery and conservative progression.'},
];

const DAY=864e5;const WEEK=7*DAY;const TOTAL_WEEKS=4;
let activeGuide:{loadMultiplier:number;phaseLabel:string}={loadMultiplier:1,phaseLabel:'BUILD'};
export function currentTrainingBlockLoadGuide(){return activeGuide}
const phases:Record<number,{phase:TrainingBlockPhase;title:string;objective:string;loadGuidance:string;loadMultiplier:number;weeklyTarget:number}>={
  1:{phase:'FOUNDATION',title:'Foundation',objective:'Establish repeatable training quality and balanced exposure.',loadGuidance:'Leave room in the tank. Build clean baselines before chasing volume.',loadMultiplier:.9,weeklyTarget:4},
  2:{phase:'BUILD',title:'Build',objective:'Add productive work while preserving movement balance.',loadGuidance:'Progress load or volume modestly when recent performance supports it.',loadMultiplier:1,weeklyTarget:4},
  3:{phase:'OVERLOAD',title:'Overload',objective:'Create the strongest progression stimulus of the Arc.',loadGuidance:'Push progression selectively. Quality output matters more than adding junk volume.',loadMultiplier:1.05,weeklyTarget:5},
  4:{phase:'DELOAD',title:'Deload + Assess',objective:'Reduce fatigue, consolidate gains, and assess the block.',loadGuidance:'Cut hard-session demand roughly 20–25% and favor recovery when signals soften.',loadMultiplier:.75,weeklyTarget:3},
};
const goalConfig:Record<TrainingArcGoal,{label:string;description:string;loadFactor:number;targets:[number,number,number];successMetric:string}>={
  STRENGTH:{label:'Build Strength',description:'Resistance progression is the primary objective.',loadFactor:1.03,targets:[3,1,1],successMetric:'Finish with improving or stable resistance output, consistent training, and positive Strength growth.'},
  CONDITIONING:{label:'Improve Conditioning',description:'Endurance capacity and repeatable work output are the primary objective.',loadFactor:.97,targets:[2,2,1],successMetric:'Finish with more weekly endurance exposure, positive Stamina/Agility growth, and stable recovery.'},
  HYBRID:{label:'Hybrid Performance',description:'Strength and conditioning advance together.',loadFactor:1,targets:[3,1,1],successMetric:'Finish with balanced resistance/endurance exposure and no major attribute domain falling behind.'},
  REBUILD:{label:'Return / Rebuild',description:'Consistency and recovery quality come before aggressive loading.',loadFactor:.9,targets:[2,1,2],successMetric:'Finish with consistent sessions, manageable fatigue, and improving output without needing an emergency deload.'},
};
function mondayStart(date=new Date()){const d=new Date(date);const day=d.getDay();const diff=day===0?-6:1-day;d.setDate(d.getDate()+diff);d.setHours(0,0,0,0);return d;}
async function getPref(db:SQLiteDatabase,key:string){const row=await db.getFirstAsync<{value_json:string}>(`SELECT value_json FROM app_preferences WHERE key=? LIMIT 1`,key);if(!row?.value_json)return null;try{return JSON.parse(row.value_json)}catch{return null}}
async function setPref(db:SQLiteDatabase,key:string,value:unknown){await db.runAsync(`INSERT OR REPLACE INTO app_preferences (key,value_json,updated_at) VALUES (?,?,?)`,key,JSON.stringify(value),new Date().toISOString())}
async function ensureBlockState(db:SQLiteDatabase){const existing=await getPref(db,'training_block_v1');if(existing?.startAt)return{start:new Date(existing.startAt),goal:(existing.goal??'HYBRID') as TrainingArcGoal};const first=await db.getFirstAsync<{completed_at:string}>(`SELECT completed_at FROM workout_sessions ORDER BY completed_at DESC LIMIT 1`);const start=mondayStart(first?.completed_at?new Date(first.completed_at):new Date());const goal:TrainingArcGoal='HYBRID';await setPref(db,'training_block_v1',{startAt:start.toISOString(),totalWeeks:TOTAL_WEEKS,goal});return{start,goal};}
export async function setTrainingBlockGoal(db:SQLiteDatabase,goal:TrainingArcGoal){const state=await getPref(db,'training_block_v1');const startAt=state?.startAt??mondayStart(new Date()).toISOString();await setPref(db,'training_block_v1',{...state,startAt,totalWeeks:TOTAL_WEEKS,goal});}

function targetsFor(goal:TrainingArcGoal,week:number){const base=goalConfig[goal].targets;let [resistance,endurance,recovery]=base;if(week===1){resistance=Math.max(1,resistance-1);recovery=Math.max(1,recovery);}if(week===3&&goal!=='REBUILD')resistance+=1;if(week===4){resistance=Math.max(1,resistance-1);endurance=goal==='CONDITIONING'?1:0;recovery=Math.max(1,recovery);}return{resistance,endurance,recovery,weeklyTarget:resistance+endurance+recovery};}
function goalProgressText(goal:TrainingArcGoal,args:{resistance:number;endurance:number;recovery:number;trend:string;fatigue:number}){if(goal==='STRENGTH')return `${args.resistance} resistance sessions banked this Arc · performance ${args.trend.toLowerCase()}.`;if(goal==='CONDITIONING')return `${args.endurance} endurance sessions banked this Arc · fatigue ${args.fatigue}/100.`;if(goal==='REBUILD')return `${args.recovery} recovery sessions banked this Arc · fatigue ${args.fatigue}/100.`;return `${args.resistance} resistance · ${args.endurance} endurance · ${args.recovery} recovery sessions banked this Arc.`;}
function plannedThroughWeek(goal:TrainingArcGoal,week:number){let total=0;for(let i=1;i<=Math.min(TOTAL_WEEKS,week);i++)total+=targetsFor(goal,i).weeklyTarget;return total;}
function makeScorecard(args:{goal:TrainingArcGoal;week:number;blockSessions:number;trend:string;fatigue:number;coaching:number;goalProgress:string}){const planned=plannedThroughWeek(args.goal,args.week);const adherence=Math.min(100,Math.round((args.blockSessions/Math.max(1,planned))*100));let status:ArcScorecard['status']='IN PROGRESS';if(args.week===4){if(args.fatigue>=60)status='RECOVER';else if(adherence>=75&&args.trend!=='REGRESSING')status='ARC COMPLETE';else status='NEEDS REVIEW';}const summary=status==='ARC COMPLETE'?`The Arc reached its planned consistency threshold with ${args.trend.toLowerCase()} performance direction.`:status==='RECOVER'?'The block accumulated enough fatigue that recovery should lead the transition into the next Arc.':status==='NEEDS REVIEW'?'The Arc is complete, but adherence or performance signals suggest reviewing the next block before increasing demand.':`${adherence}% of planned sessions through Week ${args.week} are banked. ${args.goalProgress}`;return{adherence,plannedSessions:planned,performance:args.trend,fatigue:args.fatigue,coachingCalibration:args.coaching,status,summary};}

async function archiveExpiredArc(db:SQLiteDatabase,start:Date,goal:TrainingArcGoal,intelligence?:TrainingIntelligence){
  const endAt=new Date(start.getTime()+TOTAL_WEEKS*WEEK);const rows=await db.getAllAsync<{template_id:string|null;total_xp:number}>(`SELECT template_id,total_xp FROM workout_sessions WHERE completed_at>=? AND completed_at<?`,start.toISOString(),endAt.toISOString());
  const resistance=rows.filter(row=>row.template_id!=='run'&&row.template_id!=='recovery').length;const endurance=rows.filter(row=>row.template_id==='run').length;const recovery=rows.filter(row=>row.template_id==='recovery').length;const blockSessions=rows.length;const blockXP=rows.reduce((sum,row)=>sum+Number(row.total_xp||0),0);const trend=intelligence?.performanceTrend??'LIMITED DATA';const fatigue=intelligence?.fatigueScore??0;const goalProgress=goalProgressText(goal,{resistance,endurance,recovery,trend,fatigue});const scorecard=makeScorecard({goal,week:4,blockSessions,trend,fatigue,coaching:intelligence?.coaching.calibrationScore??0,goalProgress});
  const completed:CompletedTrainingArc={id:`arc-${start.toISOString().slice(0,10)}`,goal,goalLabel:goalConfig[goal].label,startAt:start.toISOString(),endAt:endAt.toISOString(),completedAt:new Date().toISOString(),blockSessions,blockXP,goalProgress,scorecard};
  await setPref(db,'last_training_arc_v1',completed);return completed;
}

export async function getTrainingBlock(db:SQLiteDatabase,intelligence?:TrainingIntelligence):Promise<TrainingBlock>{
  let {start,goal}=await ensureBlockState(db);let elapsed=Math.max(0,Date.now()-start.getTime());let transition:CompletedTrainingArc|null=null;
  if(elapsed>=TOTAL_WEEKS*WEEK){transition=await archiveExpiredArc(db,start,goal,intelligence);start=mondayStart(new Date());await setPref(db,'training_block_v1',{startAt:start.toISOString(),totalWeeks:TOTAL_WEEKS,goal});elapsed=Math.max(0,Date.now()-start.getTime());}
  if(!transition){const last=await getPref(db,'last_training_arc_v1') as CompletedTrainingArc|null;if(last?.completedAt&&Date.now()-new Date(last.completedAt).getTime()<7*DAY)transition=last;}
  const week=Math.min(TOTAL_WEEKS,Math.floor(elapsed/WEEK)+1);const phase=phases[week];const goalInfo=goalConfig[goal];const targets=targetsFor(goal,week);const effectiveLoad=Math.max(.65,Math.min(1.1,phase.loadMultiplier*goalInfo.loadFactor));activeGuide={loadMultiplier:effectiveLoad,phaseLabel:`${phase.phase} · ${goal}`};
  const weekStart=new Date(start.getTime()+(week-1)*WEEK);const weekEnd=new Date(weekStart.getTime()+WEEK);const endAt=new Date(start.getTime()+TOTAL_WEEKS*WEEK);
  const rows=await db.getAllAsync<{template_id:string|null;total_xp:number;completed_at:string}>(`SELECT template_id,total_xp,completed_at FROM workout_sessions WHERE completed_at>=? AND completed_at<? ORDER BY completed_at ASC`,weekStart.toISOString(),weekEnd.toISOString());
  const blockRows=await db.getAllAsync<{template_id:string|null;total_xp:number}>(`SELECT template_id,total_xp FROM workout_sessions WHERE completed_at>=? AND completed_at<?`,start.toISOString(),endAt.toISOString());
  const resistanceCompleted=rows.filter(row=>row.template_id!=='run'&&row.template_id!=='recovery').length;const enduranceCompleted=rows.filter(row=>row.template_id==='run').length;const recoveryCompleted=rows.filter(row=>row.template_id==='recovery').length;const weeklyCompleted=rows.length;const blockSessions=blockRows.length;const blockXP=blockRows.reduce((sum,row)=>sum+Number(row.total_xp||0),0);const trend=intelligence?.performanceTrend??'LIMITED DATA';const fatigue=intelligence?.fatigueScore??0;
  const blockResistance=blockRows.filter(row=>row.template_id!=='run'&&row.template_id!=='recovery').length;const blockEndurance=blockRows.filter(row=>row.template_id==='run').length;const blockRecovery=blockRows.filter(row=>row.template_id==='recovery').length;const goalProgress=goalProgressText(goal,{resistance:blockResistance,endurance:blockEndurance,recovery:blockRecovery,trend,fatigue});
  const scorecard=makeScorecard({goal,week,blockSessions,trend,fatigue,coaching:intelligence?.coaching.calibrationScore??0,goalProgress});
  const assessment=week<4?`${goalInfo.label} · ${phase.title} week · ${Math.max(0,targets.weeklyTarget-weeklyCompleted)} planned session${Math.max(0,targets.weeklyTarget-weeklyCompleted)===1?'':'s'} remaining.`:scorecard.summary;
  return{id:`arc-${start.toISOString().slice(0,10)}`,startAt:start.toISOString(),endAt:endAt.toISOString(),week,totalWeeks:TOTAL_WEEKS,phase:phase.phase,title:phase.title,objective:`${goalInfo.description} ${phase.objective}`,loadGuidance:phase.loadGuidance,loadMultiplier:effectiveLoad,goal,goalLabel:goalInfo.label,goalDescription:goalInfo.description,successMetric:goalInfo.successMetric,weeklyTarget:targets.weeklyTarget,weeklyCompleted,weeklyProgress:Math.min(1,weeklyCompleted/Math.max(1,targets.weeklyTarget)),resistanceTarget:targets.resistance,enduranceTarget:targets.endurance,recoveryTarget:targets.recovery,resistanceCompleted,enduranceCompleted,recoveryCompleted,blockSessions,blockXP,assessment,goalProgress,scorecard,transition};
}
