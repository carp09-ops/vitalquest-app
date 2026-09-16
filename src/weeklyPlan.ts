import type { TrainingBlock } from './trainingBlock';
import type { TrainingRecommendation, TrialId } from './recommendation';
import type { TrainingIntelligence } from './trainingIntelligence';

export type WeeklyPlanSlot={day:number;label:string;type:TrialId|'rest';title:string;reason:string;status:'NEXT'|'PLANNED'|'REST';};
export type WeeklyPlan={slots:WeeklyPlanSlot[];summary:string;};

const titleFor=(type:TrialId|'rest')=>type==='push'?'Push Day':type==='pull'?'Pull Day':type==='legs'?'Leg Day':type==='run'?'Endurance Run':type==='recovery'?'Recovery Protocol':'Rest / Optional Mobility';
function resistanceRotation(last?:string|null):TrialId[]{const base:TrialId[]=['push','pull','legs'];const idx=base.indexOf(last as TrialId);return idx>=0?[...base.slice(idx+1),...base.slice(0,idx+1)]:base;}

export function buildAdaptiveWeeklyPlan(block:TrainingBlock|null,recommendation:TrainingRecommendation,intelligence?:TrainingIntelligence):WeeklyPlan{
  if(!block)return{slots:[{day:1,label:'TODAY',type:recommendation.templateId,title:titleFor(recommendation.templateId),reason:'Current adaptive recommendation.',status:'NEXT'}],summary:'VitalQuest is waiting for an active Arc before building the full 7-day sketch.'};
  const remainingResistance=Math.max(0,block.resistanceTarget-block.resistanceCompleted);
  const remainingEndurance=Math.max(0,block.enduranceTarget-block.enduranceCompleted);
  const remainingRecovery=Math.max(0,block.recoveryTarget-block.recoveryCompleted);
  const desired:TrialId[]=[recommendation.templateId];
  let r=Math.max(0,remainingResistance-(['push','pull','legs'].includes(recommendation.templateId)?1:0));
  let e=Math.max(0,remainingEndurance-(recommendation.templateId==='run'?1:0));
  let rec=Math.max(0,remainingRecovery-(recommendation.templateId==='recovery'?1:0));
  const rotation=resistanceRotation(intelligence?.recent?.find(x=>['push','pull','legs'].includes(x.templateId))?.templateId);
  const addResistance=()=>{if(r<=0)return false;const next=rotation[(remainingResistance-r)%rotation.length]??'push';desired.push(next);r--;return true;};
  const addRun=()=>{if(e<=0)return false;desired.push('run');e--;return true;};
  const addRecovery=()=>{if(rec<=0)return false;desired.push('recovery');rec--;return true;};
  while(r+e+rec>0&&desired.length<7){
    if(block.goal==='STRENGTH'){if(!addResistance()&&!addRecovery())addRun();}
    else if(block.goal==='CONDITIONING'){if(!addRun()&&!addResistance())addRecovery();}
    else if(block.goal==='REBUILD'){if(!addRecovery()&&!addResistance())addRun();}
    else{const hardCount=desired.filter(x=>x!=='recovery').length;if(hardCount>=2&&rec>0)addRecovery();else if(r>=e)addResistance()||addRun()||addRecovery();else addRun()||addResistance()||addRecovery();}
  }
  if(block.phase==='DELOAD'&&!desired.includes('recovery'))desired.splice(Math.min(1,desired.length),0,'recovery');
  const slots:WeeklyPlanSlot[]=[];let desiredIndex=0;for(let day=1;day<=7;day++){
    const next=desired[desiredIndex];
    if(next){const hardBefore=slots.slice(-2).filter(s=>s.type!=='recovery'&&s.type!=='rest').length;const shouldRest=day>1&&hardBefore>=2&&next!=='recovery';if(shouldRest){slots.push({day,label:`DAY ${day}`,type:'rest',title:titleFor('rest'),reason:'Spacing hard work protects output quality.',status:'REST'});continue;}slots.push({day,label:day===1?'TODAY':`DAY ${day}`,type:next,title:titleFor(next),reason:day===1?recommendation.reason:`Supports ${block.goalLabel} targets in ${block.title}.`,status:day===1?'NEXT':'PLANNED'});desiredIndex++;}
    else slots.push({day,label:`DAY ${day}`,type:'rest',title:titleFor('rest'),reason:'No additional session is required to satisfy the current Arc target.',status:'REST'});
  }
  const summary=`${block.goalLabel}: ${Math.max(0,block.weeklyTarget-block.weeklyCompleted)} planned session${Math.max(0,block.weeklyTarget-block.weeklyCompleted)===1?'':'s'} remain in Week ${block.week}. The sketch will reshuffle after each completed session.`;
  return{slots,summary};
}
