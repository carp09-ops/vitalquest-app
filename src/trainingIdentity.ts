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

function dominantPattern(counts:{push:number;pull:number;legs:number}):ResistancePattern{
  const total=counts.push+counts.pull+counts.legs;
  if(!total)return'mixed';
  const ranked=(Object.entries(counts) as Array<[Exclude<ResistancePattern,'mixed'>,number]>).sort((a,b)=>b[1]-a[1]);
  return ranked[0][1]>total/2?ranked[0][0]:'mixed';
}

export function inferResistancePattern(templateId:string,exerciseIds:string[]=[]):ResistancePattern{
  const key=(templateId||'').toLowerCase();
  if(key==='push')return'push';
  if(key==='pull')return'pull';
  if(key==='legs')return'legs';
  const counts=exerciseCounts(exerciseIds);const actual=dominantPattern(counts);
  if(actual!=='mixed')return actual;
  const recognized=counts.push+counts.pull+counts.legs;
  if(recognized>0)return'mixed';
  if(key.includes('lower')||key.includes('leg-day'))return'legs';
  return'mixed';
}

export function isLegOrFullBodyResistance(templateId:string,exerciseIds:string[]=[]){
  const key=(templateId||'').toLowerCase();
  if(key==='legs')return true;
  const counts=exerciseCounts(exerciseIds);const recognized=counts.push+counts.pull+counts.legs;
  if(recognized>0){const upper=counts.push+counts.pull;return counts.legs>0&&(upper>0||counts.legs>upper);}
  return key.includes('lower')||key.includes('full');
}

export function recommendationMatchesSession(recommendedTemplateId:string,actualTemplateId:string,exerciseIds:string[]=[]){
  if(recommendedTemplateId===actualTemplateId)return true;
  if(recommendedTemplateId==='run'||recommendedTemplateId==='recovery')return false;
  if(actualTemplateId==='run'||actualTemplateId==='recovery')return false;
  return inferResistancePattern(actualTemplateId,exerciseIds)===recommendedTemplateId;
}
