import { templates } from './data';
import { ProgressionSnapshot } from './progression';
import { EquipmentId, EXERCISE_CATALOG, equipmentSupports } from './trainingPreferences';

export type TrialId='push'|'pull'|'legs'|'run'|'recovery';
type ResistanceTrialId='push'|'pull'|'legs';
export type RecommendationPriority='RECOVERY'|'BALANCE'|'PROGRESSION';
export type TrainingRecommendation={
  templateId:TrialId;
  label:string;
  title:string;
  reason:string;
  attributeFocus:string;
  priority:RecommendationPriority;
  signals:string[];
  alternative:{templateId:TrialId;title:string;reason:string;attributeFocus:string};
};

const ROLE:Record<TrialId,string>={push:'STRENGTH · DISCIPLINE',pull:'STRENGTH · DISCIPLINE',legs:'STRENGTH · STAMINA · DISCIPLINE',run:'STAMINA · AGILITY',recovery:'VITALITY · DISCIPLINE'};

function templateSupported(id:TrialId,equipment?:EquipmentId[]){
  if(!equipment?.length)return true;
  if(id==='run')return equipment.includes('cardio');
  if(id==='recovery')return equipment.includes('bodyweight');
  const template=templates.find(item=>item.id===id);if(!template)return false;
  return template.exercises.every(exercise=>{const catalog=EXERCISE_CATALOG.find(item=>item.id===exercise.id);return !catalog||equipmentSupports(catalog.equipment,equipment)});
}
function hoursSince(value:string|null){if(!value)return Infinity;const ms=Date.now()-new Date(value).getTime();return Math.max(0,ms/36e5)}
function resistanceCount(snapshot:ProgressionSnapshot,id:ResistanceTrialId){if(id==='push')return snapshot.thisWeekPushWorkouts;if(id==='pull')return snapshot.thisWeekPullWorkouts;return snapshot.thisWeekLegWorkouts}
function resistanceTitle(id:ResistanceTrialId){if(id==='push')return'Push Day';if(id==='pull')return'Pull Day';return'Leg Day'}
function pickBalancedResistance(snapshot:ProgressionSnapshot,equipment?:EquipmentId[]):ResistanceTrialId|null{
  const supported=(['push','pull','legs'] as ResistanceTrialId[]).filter(id=>templateSupported(id,equipment));if(!supported.length)return null;
  return [...supported].sort((a,b)=>{
    const countDiff=resistanceCount(snapshot,a)-resistanceCount(snapshot,b);if(countDiff!==0)return countDiff;
    const aRepeat=snapshot.lastTemplateId===a?1:0;const bRepeat=snapshot.lastTemplateId===b?1:0;if(aRepeat!==bRepeat)return aRepeat-bRepeat;
    return ['push','pull','legs'].indexOf(a)-['push','pull','legs'].indexOf(b);
  })[0];
}
function alternativeFor(primary:TrialId,snapshot:ProgressionSnapshot,equipment?:EquipmentId[]){
  if(primary==='recovery'&&templateSupported('run',equipment))return{templateId:'run' as TrialId,title:'Endurance Run',reason:'Choose this if you feel fresh and want a low-complexity conditioning session instead of restoration.',attributeFocus:ROLE.run};
  if(primary==='run'){const resistance=pickBalancedResistance(snapshot,equipment);if(resistance)return{templateId:resistance as TrialId,title:resistanceTitle(resistance),reason:'Choose this if you feel recovered and want to keep resistance balance moving instead.',attributeFocus:ROLE[resistance]};}
  if(templateSupported('recovery',equipment))return{templateId:'recovery' as TrialId,title:'Recovery Protocol',reason:'Choose this if soreness or fatigue is higher than the ledger can detect.',attributeFocus:ROLE.recovery};
  if(templateSupported('run',equipment))return{templateId:'run' as TrialId,title:'Endurance Run',reason:'Choose this for a simple conditioning session with your available equipment.',attributeFocus:ROLE.run};
  return{templateId:primary,title:templates.find(t=>t.id===primary)?.name??'Recommended session',reason:'Your current equipment profile limits the available alternatives.',attributeFocus:ROLE[primary]};
}

export function getTrainingRecommendation(snapshot:ProgressionSnapshot,equipment?:EquipmentId[]):TrainingRecommendation{
  const recentHours=hoursSince(snapshot.lastWorkoutAt);
  const resistance=thisWeekResistanceBalance(snapshot);
  const strengthLead=snapshot.strengthXP-Math.max(snapshot.staminaXP,snapshot.agilityXP);
  const recoveryPressure=(snapshot.thisWeekWorkouts>=4?2:0)+(snapshot.streakDays>=4?2:0)+(recentHours<18?2:recentHours<30?1:0)+(snapshot.thisWeekRecoverySessions===0&&snapshot.thisWeekWorkouts>=3?1:0);
  const enduranceGap=snapshot.workoutCount>=3&&strengthLead>=35&&snapshot.thisWeekEnduranceSessions===0;

  if(recoveryPressure>=4&&templateSupported('recovery',equipment)){
    const signals=[`${snapshot.thisWeekWorkouts} sessions this week`,`${snapshot.streakDays} day streak`,recentHours<30?'Recent session still inside recovery window':'No recovery session this week'].slice(0,3);
    const primary:TrialId='recovery';return{templateId:primary,label:'RECOVERY RECOMMENDED',title:'Restore capacity before adding more load.',reason:'Your recent workload is creating recovery pressure. VitalQuest is prioritizing restoration so the next hard session can produce better training quality instead of simply extending the streak.',attributeFocus:ROLE[primary],priority:'RECOVERY',signals,alternative:alternativeFor(primary,snapshot,equipment)};
  }

  if(enduranceGap&&templateSupported('run',equipment)){
    const primary:TrialId='run';return{templateId:primary,label:'BALANCE RECOMMENDED',title:'Build the engine behind your strength.',reason:`Strength is leading your conditioning attributes by ${strengthLead} XP and you have not logged endurance this week. An endurance session narrows that gap while developing Stamina and Agility.`,attributeFocus:ROLE[primary],priority:'BALANCE',signals:[`Strength lead: ${strengthLead} XP`,'0 endurance sessions this week',`${snapshot.lifetimeMiles.toFixed(1)} lifetime miles`],alternative:alternativeFor(primary,snapshot,equipment)};
  }

  const balanced=pickBalancedResistance(snapshot,equipment);
  if(balanced){
    const count=resistanceCount(snapshot,balanced);const most=Math.max(resistance.push,resistance.pull,resistance.legs);const behind=most-count;
    const repeated=snapshot.lastTemplateId===balanced;
    const reason=behind>0?`${resistanceTitle(balanced)} is the least-trained resistance pattern in your current week. It brings the Push/Pull/Legs split back toward balance while continuing overall progression.`:`Your resistance split is balanced, so VitalQuest is selecting the next supported pattern while avoiding an unnecessary repeat of your last session.`;
    const primary:TrialId=balanced;return{templateId:primary,label:behind>0?'BALANCE RECOMMENDED':'PROGRESSION RECOMMENDED',title:balanced==='push'?'Build pressing strength.':balanced==='pull'?'Build pulling strength and control.':'Raise lower-body capacity.',reason,attributeFocus:ROLE[primary],priority:behind>0?'BALANCE':'PROGRESSION',signals:[`This week P ${resistance.push} · PULL ${resistance.pull} · L ${resistance.legs}`,repeated?'Last session matched this pattern':'Avoids repeating your last resistance pattern',`${snapshot.thisWeekWorkouts} total sessions this week`],alternative:alternativeFor(primary,snapshot,equipment)};
  }

  if(templateSupported('recovery',equipment)){
    const primary:TrialId='recovery';return{templateId:primary,label:'EQUIPMENT-SAFE TRIAL',title:'Train what your environment supports.',reason:'Your current equipment profile does not support the standard resistance templates, so VitalQuest selected a bodyweight recovery protocol. The Forge can create a more specific equipment-safe session.',attributeFocus:ROLE[primary],priority:'RECOVERY',signals:['Standard resistance templates unavailable','Bodyweight work is supported'],alternative:alternativeFor(primary,snapshot,equipment)};
  }
  const primary:TrialId='run';return{templateId:primary,label:'EQUIPMENT-SAFE TRIAL',title:'Build capacity with what is available.',reason:'Your current equipment profile does not support the standard resistance templates. Endurance is the strongest supported progression path right now.',attributeFocus:ROLE[primary],priority:'BALANCE',signals:['Resistance templates unavailable','Endurance remains available'],alternative:alternativeFor(primary,snapshot,equipment)};
}

function thisWeekResistanceBalance(snapshot:ProgressionSnapshot){return{push:snapshot.thisWeekPushWorkouts,pull:snapshot.thisWeekPullWorkouts,legs:snapshot.thisWeekLegWorkouts}}
