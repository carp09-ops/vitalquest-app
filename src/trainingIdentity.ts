import { EXERCISE_CATALOG } from './trainingPreferences';

export type ResistancePattern='push'|'pull'|'legs'|'mixed';

const LEG_IDS=new Set(['squat','rdl','split-squat','leg-press','ham-curl','calf','lunge']);
const PUSH_IDS=new Set(['bench','ohp','incline-db','pushup']);
const PULL_IDS=new Set(['row','pulldown','pullup','curl']);

function patternForExercise(exerciseId:string):Exclude<ResistancePattern,'mixed'>|null{
  if(LEG_IDS.has(exerciseId))return'legs';
  if(PUSH_IDS.has(exerciseId))return'push';
  if(PULL_IDS.has(exerciseId))return'pull';
  const muscle=(EXERCISE_CATALOG.find(item=>item.id===exerciseId)?.muscle??'').toLowerCase();
  if(/quad|hamstring|glute|calf|leg|lower/.test(muscle))return'legs';
  if(/chest|shoulder|tricep|press/.test(muscle))return'push';
  if(/back|lat|bicep|rear delt|pull/.test(muscle))return'pull';
  return null;
}

function exerciseCounts(exerciseIds:string[]){
  const counts={push:0,pull:0,legs:0};
  for(const id of exerciseIds){const pattern=patternForExercise(id);if(pattern)counts[pattern]++;}
  return counts;
}

export function inferResistancePattern(templateId:string,exerciseIds:string[]=[]):ResistancePattern{
  const key=(templateId||'').toLowerCase();
  if(key==='push')return'push';
  if(key==='pull')return'pull';
  if(key==='legs'||key.includes('lower')||key.includes('leg-day'))return'legs';
  const counts=exerciseCounts(exerciseIds);const total=counts.push+counts.pull+counts.legs;
  if(total){
    const ranked=(Object.entries(counts) as Array<[Exclude<ResistancePattern,'mixed'>,number]>).sort((a,b)=>b[1]-a[1]);
    if(ranked[0][1]>total/2)return ranked[0][0];
    if(ranked[0][1]===total&&total>0)return ranked[0][0];
  }
  if(key.includes('upper')){
    if(counts.push>counts.pull)return'push';
    if(counts.pull>counts.push)return'pull';
  }
  return'mixed';
}

export function isLegOrFullBodyResistance(templateId:string,exerciseIds:string[]=[]){
  const key=(templateId||'').toLowerCase();
  if(key==='legs'||key.includes('lower')||key.includes('full'))return true;
  const counts=exerciseCounts(exerciseIds);
  const upper=counts.push+counts.pull;
  return counts.legs>0&&(upper>0||inferResistancePattern(templateId,exerciseIds)==='legs');
}

export function recommendationMatchesSession(recommendedTemplateId:string,actualTemplateId:string,exerciseIds:string[]=[]){
  if(recommendedTemplateId===actualTemplateId)return true;
  if(recommendedTemplateId==='run'||recommendedTemplateId==='recovery')return false;
  if(actualTemplateId==='run'||actualTemplateId==='recovery')return false;
  return inferResistancePattern(actualTemplateId,exerciseIds)===recommendedTemplateId;
}
