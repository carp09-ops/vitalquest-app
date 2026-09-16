import type { SQLiteDatabase } from 'expo-sqlite';
import { saveEquipmentProfile, saveHeroArchetype } from './db';
import type { HeroArchetype } from './heroEvolution';
import { setTrainingBlockGoal, type TrainingArcGoal } from './trainingBlock';
import type { EquipmentId } from './trainingPreferences';

export type TrainingExperience='BEGINNER'|'INTERMEDIATE'|'ADVANCED';
export type OnboardingProfile={
  goal:TrainingArcGoal;
  archetype:HeroArchetype;
  experience:TrainingExperience;
  weeklyDays:3|4|5;
  equipment:EquipmentId[];
  completedAt:string;
};

const KEY='onboarding_v2';

export async function getOnboardingProfile(db:SQLiteDatabase):Promise<OnboardingProfile|null>{
  const row=await db.getFirstAsync<{value_json:string}>(`SELECT value_json FROM app_preferences WHERE key=? LIMIT 1`,KEY);
  if(!row?.value_json)return null;
  try{return JSON.parse(row.value_json) as OnboardingProfile}catch{return null}
}

export async function isOnboardingComplete(db:SQLiteDatabase){return Boolean(await getOnboardingProfile(db))}

export async function shouldShowOnboarding(db:SQLiteDatabase){
  if(await isOnboardingComplete(db))return false;
  const history=await db.getFirstAsync<{count:number}>(`SELECT COUNT(*) AS count FROM workout_sessions`);
  if(Number(history?.count||0)>0)return false;
  const configured=await db.getFirstAsync<{count:number}>(`SELECT COUNT(*) AS count FROM app_preferences WHERE key IN ('equipment_profile','hero_archetype','training_block_v1')`);
  return Number(configured?.count||0)===0;
}

export async function saveOnboardingProfile(db:SQLiteDatabase,input:Omit<OnboardingProfile,'completedAt'>){
  const profile:OnboardingProfile={...input,completedAt:new Date().toISOString()};
  await db.withTransactionAsync(async()=>{
    await saveHeroArchetype(db,profile.archetype);
    await saveEquipmentProfile(db,profile.equipment);
    await setTrainingBlockGoal(db,profile.goal);
    await db.runAsync(`INSERT OR REPLACE INTO app_preferences (key,value_json,updated_at) VALUES (?,?,?)`,KEY,JSON.stringify(profile),profile.completedAt);
  });
  return profile;
}

export function firstSessionForGoal(goal:TrainingArcGoal,equipment:EquipmentId[]){
  if(goal==='CONDITIONING')return{templateId:'run',name:'Endurance Run',reason:'Start by establishing a conditioning baseline the coach can learn from.'};
  if(goal==='REBUILD')return{templateId:'recovery',name:'Recovery Protocol',reason:'Start with a low-risk capacity reset before training demand increases.'};
  const canBarbell=equipment.includes('barbell')&&(equipment.includes('bench')||equipment.includes('rack'));
  if(canBarbell)return{templateId:'push',name:'Push Day',reason:goal==='STRENGTH'?'Establish a clean resistance baseline for your strength-focused Arc.':'Bank a resistance baseline before the hybrid plan begins adapting.'};
  return{templateId:'recovery',name:'Recovery Protocol',reason:'Your selected equipment is limited, so VitalQuest starts with a trusted baseline while the plan adapts.'};
}
