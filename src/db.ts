import type { SQLiteDatabase } from 'expo-sqlite';
import { CustomWorkoutTemplate, DEFAULT_EQUIPMENT, EquipmentId } from './trainingPreferences';
import type { HeroArchetype } from './heroEvolution';
import { evaluateXPTrust, scaleTrustedAmount, VerificationEvidence } from './xpTrust';
import { evaluateSessionIntegrity } from './sessionIntegrity';
import { collectHealthVerificationEvidence, mergeVerificationEvidence } from './sensorVerification';

export async function migrateDb(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      template_id TEXT,
      name TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      total_volume REAL NOT NULL DEFAULT 0,
      total_xp INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS exercise_sets (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      weight REAL NOT NULL DEFAULT 0,
      reps INTEGER NOT NULL DEFAULT 0,
      is_pr INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS endurance_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      distance_miles REAL NOT NULL DEFAULT 0,
      duration_minutes INTEGER NOT NULL DEFAULT 0,
      avg_pace_seconds INTEGER NOT NULL DEFAULT 0,
      activity_type TEXT NOT NULL DEFAULT 'run',
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS xp_events (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS attribute_events (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT,
      attribute TEXT NOT NULL,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS session_verification (
      session_id TEXT PRIMARY KEY NOT NULL,
      raw_xp INTEGER NOT NULL DEFAULT 0,
      awarded_xp INTEGER NOT NULL DEFAULT 0,
      withheld_xp INTEGER NOT NULL DEFAULT 0,
      confidence INTEGER NOT NULL DEFAULT 0,
      multiplier REAL NOT NULL DEFAULT 0,
      tier TEXT NOT NULL,
      evidence_json TEXT NOT NULL,
      reasons_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS beta_feedback (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT,
      kind TEXT NOT NULL,
      fair_credit INTEGER,
      explanation_clear INTEGER,
      notes TEXT,
      context_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS custom_workouts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      exercises_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      retry_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}

type AttributeGain = {attribute:'strength'|'stamina'|'agility'|'vitality'|'discipline'|string;amount:number;reason:string;};
type BaseSession = {sessionId:string;templateId:string;name:string;startedAt:string;completedAt:string;durationMinutes:number;totalVolume:number;totalXP:number;strengthXP?:number;attributeGains?:AttributeGain[];syncDetails?:Record<string,unknown>;verificationEvidence?:VerificationEvidence;};

function defaultModality(templateId:string){if(templateId==='run')return'endurance'as const;if(templateId==='recovery')return'recovery'as const;return'resistance'as const;}

function withResistanceSupportGains(input:BaseSession,gains:AttributeGain[]){
  if(defaultModality(input.templateId)!=='resistance')return gains;
  const next=[...gains];
  const completedUnits=Math.max(1,Number(input.verificationEvidence?.completedUnits||0));
  const lowerBody=input.templateId==='legs'||input.templateId.includes('lower')||input.templateId.includes('full');
  const hasDiscipline=next.some(gain=>gain.attribute==='discipline');
  const hasStamina=next.some(gain=>gain.attribute==='stamina');
  const strength=next.find(gain=>gain.attribute==='strength')?.amount??0;
  if(!hasDiscipline){
    const discipline=Math.min(22,Math.max(5,Math.round(completedUnits*1.15+Math.min(8,input.durationMinutes/10))));
    next.push({attribute:'discipline',amount:discipline,reason:'training_consistency'});
  }
  if(lowerBody&&!hasStamina){
    const stamina=Math.min(28,Math.max(6,Math.round(strength*.3)));
    next.push({attribute:'stamina',amount:stamina,reason:'lower_body_capacity'});
  }
  return next;
}

async function writeSessionBase(db:SQLiteDatabase,input:BaseSession){
  const modality=defaultModality(input.templateId);
  const integrity=await evaluateSessionIntegrity(db,{startedAt:input.startedAt,completedAt:input.completedAt,durationMinutes:input.durationMinutes});
  const healthEvidence=await collectHealthVerificationEvidence({startedAt:input.startedAt,completedAt:input.completedAt,modality});
  const baseEvidence:VerificationEvidence={source:'live_app',modality,durationMinutes:input.durationMinutes,totalVolume:input.totalVolume,liveTracked:true,...input.verificationEvidence};
  const evidence=mergeVerificationEvidence(baseEvidence,healthEvidence);
  const trust=evaluateXPTrust(input.totalXP,{...evidence,duplicateDetected:integrity.duplicateDetected||Boolean(evidence.duplicateDetected),clockMismatch:integrity.clockMismatch||Boolean(evidence.clockMismatch)});
  const baseAttributeGains:AttributeGain[]=input.attributeGains?.length?input.attributeGains:input.strengthXP?[{attribute:'strength',amount:input.strengthXP,reason:'resistance_training'}]:[];
  const rawAttributeGains=withResistanceSupportGains(input,baseAttributeGains);
  const attributeGains=rawAttributeGains.map(gain=>({...gain,amount:scaleTrustedAmount(gain.amount,trust.multiplier)}));
  await db.runAsync(`INSERT INTO workout_sessions (id, template_id, name, started_at, completed_at, duration_minutes, total_volume, total_xp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,input.sessionId,input.templateId,input.name,input.startedAt,input.completedAt,input.durationMinutes,input.totalVolume,trust.awardedXP);
  await db.runAsync(`INSERT INTO xp_events (id, session_id, amount, reason, created_at) VALUES (?, ?, ?, ?, ?)`,`${input.sessionId}-xp`,input.sessionId,trust.awardedXP,`workout_complete:${trust.tier.toLowerCase()}`,input.completedAt);
  for(const gain of attributeGains){if(!gain.amount)continue;await db.runAsync(`INSERT INTO attribute_events (id, session_id, attribute, amount, reason, created_at) VALUES (?, ?, ?, ?, ?, ?)`,`${input.sessionId}-${gain.attribute}`,input.sessionId,gain.attribute,gain.amount,`${gain.reason}:${trust.tier.toLowerCase()}`,input.completedAt);}
  await db.runAsync(`INSERT INTO session_verification (session_id, raw_xp, awarded_xp, withheld_xp, confidence, multiplier, tier, evidence_json, reasons_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,input.sessionId,trust.rawXP,trust.awardedXP,trust.withheldXP,trust.confidence,trust.multiplier,trust.tier,JSON.stringify({...trust.evidence,integrity}),JSON.stringify(trust.reasons),input.completedAt);
  const payload=JSON.stringify({sessionId:input.sessionId,completedAt:input.completedAt,templateId:input.templateId,rawXP:trust.rawXP,awardedXP:trust.awardedXP,withheldXP:trust.withheldXP,verificationTier:trust.tier,verificationConfidence:trust.confidence,verificationMultiplier:trust.multiplier,verificationEvidence:trust.evidence,sessionIntegrity:integrity,durationMinutes:input.durationMinutes,totalVolume:input.totalVolume,attributeGains,rawAttributeGains,...input.syncDetails});
  await db.runAsync(`INSERT INTO sync_outbox (id, entity_type, entity_id, operation, payload_json, status, retry_count, created_at) VALUES (?, ?, ?, ?, ?, 'pending', 0, ?)`,`${input.sessionId}-sync`,'workout_session',input.sessionId,'upsert',payload,input.completedAt);
  return trust;
}

export async function saveCompletedWorkout(db:SQLiteDatabase,input:BaseSession&{sets:Array<{id:string;exerciseId:string;exerciseName:string;setNumber:number;weight:number;reps:number;isPR:boolean;completedAt?:string;}>;}){let trust:ReturnType<typeof evaluateXPTrust>|null=null;await db.withTransactionAsync(async()=>{trust=await writeSessionBase(db,{...input,verificationEvidence:{completedUnits:input.sets.length,totalVolume:input.totalVolume,...input.verificationEvidence},syncDetails:{...input.syncDetails,sets:input.sets}});for(const set of input.sets){await db.runAsync(`INSERT INTO exercise_sets (id, session_id, exercise_id, exercise_name, set_number, weight, reps, is_pr, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,set.id,input.sessionId,set.exerciseId,set.exerciseName,set.setNumber,set.weight,set.reps,set.isPR?1:0,set.completedAt??input.completedAt);}});return trust!;}

export async function saveCompletedEnduranceSession(db:SQLiteDatabase,input:BaseSession&{distanceMiles:number;avgPaceSeconds:number;activityType?:'run'|'walk'|'bike'|string;}){let trust:ReturnType<typeof evaluateXPTrust>|null=null;await db.withTransactionAsync(async()=>{trust=await writeSessionBase(db,{...input,verificationEvidence:{modality:'endurance',completedUnits:1,distanceMiles:input.distanceMiles,avgPaceSeconds:input.avgPaceSeconds,...input.verificationEvidence},syncDetails:{...input.syncDetails,distanceMiles:input.distanceMiles,avgPaceSeconds:input.avgPaceSeconds,activityType:input.activityType??'run'}});await db.runAsync(`INSERT INTO endurance_sessions (id, session_id, distance_miles, duration_minutes, avg_pace_seconds, activity_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,`${input.sessionId}-endurance`,input.sessionId,input.distanceMiles,input.durationMinutes,input.avgPaceSeconds,input.activityType??'run',input.completedAt);});return trust!;}

export async function saveBetaFeedback(db:SQLiteDatabase,input:{id:string;sessionId?:string|null;kind:'session'|'issue';fairCredit?:boolean|null;explanationClear?:boolean|null;notes?:string;context?:Record<string,unknown>;createdAt?:string;}){
  const createdAt=input.createdAt??new Date().toISOString();
  const context=input.context??{};
  await db.withTransactionAsync(async()=>{
    await db.runAsync(`INSERT INTO beta_feedback (id, session_id, kind, fair_credit, explanation_clear, notes, context_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,input.id,input.sessionId??null,input.kind,input.fairCredit==null?null:input.fairCredit?1:0,input.explanationClear==null?null:input.explanationClear?1:0,input.notes??'',JSON.stringify(context),createdAt);
    await db.runAsync(`INSERT INTO sync_outbox (id, entity_type, entity_id, operation, payload_json, status, retry_count, created_at) VALUES (?, ?, ?, ?, ?, 'pending', 0, ?)`,`${input.id}-sync`,'beta_feedback',input.id,'upsert',JSON.stringify({...input,createdAt,context}),createdAt);
  });
}

export async function getEquipmentProfile(db:SQLiteDatabase):Promise<EquipmentId[]>{const row=await db.getFirstAsync<{value_json:string}>(`SELECT value_json FROM app_preferences WHERE key='equipment_profile' LIMIT 1`);if(!row?.value_json)return DEFAULT_EQUIPMENT;try{const parsed=JSON.parse(row.value_json);return Array.isArray(parsed)&&parsed.length?parsed:DEFAULT_EQUIPMENT;}catch{return DEFAULT_EQUIPMENT;}}
export async function saveEquipmentProfile(db:SQLiteDatabase,equipment:EquipmentId[]){const now=new Date().toISOString();await db.runAsync(`INSERT OR REPLACE INTO app_preferences (key, value_json, updated_at) VALUES (?, ?, ?)`, 'equipment_profile',JSON.stringify(equipment),now);}
export async function getHeroArchetype(db:SQLiteDatabase):Promise<HeroArchetype>{const row=await db.getFirstAsync<{value_json:string}>(`SELECT value_json FROM app_preferences WHERE key='hero_archetype' LIMIT 1`);if(!row?.value_json)return 'athlete';try{const parsed=JSON.parse(row.value_json);return parsed==='mystic'||parsed==='athlete'||parsed==='spartan'?parsed:'athlete';}catch{return 'athlete';}}
export async function saveHeroArchetype(db:SQLiteDatabase,archetype:HeroArchetype){const now=new Date().toISOString();await db.runAsync(`INSERT OR REPLACE INTO app_preferences (key, value_json, updated_at) VALUES (?, ?, ?)`, 'hero_archetype',JSON.stringify(archetype),now);}
export async function getCustomWorkouts(db:SQLiteDatabase):Promise<CustomWorkoutTemplate[]>{const rows=await db.getAllAsync<{id:string;name:string;exercises_json:string;created_at:string}>(`SELECT id, name, exercises_json, created_at FROM custom_workouts ORDER BY updated_at DESC`);return rows.map(row=>({id:row.id,name:row.name,createdAt:row.created_at,exercises:JSON.parse(row.exercises_json||'[]')}));}
export async function saveCustomWorkout(db:SQLiteDatabase,workout:CustomWorkoutTemplate){const now=new Date().toISOString();await db.runAsync(`INSERT OR REPLACE INTO app_preferences (key, value_json, updated_at) VALUES (?, ?, ?)`, 'custom_workout_last_saved',JSON.stringify(workout.id),now);await db.runAsync(`INSERT OR REPLACE INTO custom_workouts (id, name, exercises_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,workout.id,workout.name,JSON.stringify(workout.exercises),workout.createdAt||now,now);}
export async function deleteCustomWorkout(db:SQLiteDatabase,id:string){await db.runAsync(`DELETE FROM custom_workouts WHERE id = ?`,id);}
export async function getLifetimeXP(db:SQLiteDatabase){const row=await db.getFirstAsync<{total:number}>(`SELECT COALESCE(SUM(amount), 0) AS total FROM xp_events`);return row?.total??0;}
export async function getLifetimeAttributeXP(db:SQLiteDatabase,attribute:string){const row=await db.getFirstAsync<{total:number}>(`SELECT COALESCE(SUM(amount), 0) AS total FROM attribute_events WHERE attribute = ?`,attribute);return row?.total??0;}
