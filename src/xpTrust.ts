export type VerificationSource='manual_entry'|'live_app'|'gps'|'healthkit'|'wearable';
export type VerificationTier='SELF_REPORTED'|'TRACKED'|'CORROBORATED'|'VERIFIED';
export type ActivityModality='resistance'|'endurance'|'recovery'|'other';

export type VerificationEvidence={
  source?:VerificationSource;
  modality?:ActivityModality;
  durationMinutes?:number;
  completedUnits?:number;
  totalVolume?:number;
  distanceMiles?:number;
  avgPaceSeconds?:number;
  liveTracked?:boolean;
  sensorMinutes?:number;
  duplicateDetected?:boolean;
  clockMismatch?:boolean;
  implausibleSpike?:boolean;
};

export type XPTrustResult={
  rawXP:number;
  awardedXP:number;
  withheldXP:number;
  confidence:number;
  multiplier:number;
  tier:VerificationTier;
  reasons:string[];
  evidence:VerificationEvidence;
};

function clamp(n:number,min:number,max:number){return Math.max(min,Math.min(max,n))}

function multiplierFor(confidence:number){
  if(confidence>=85)return 1;
  if(confidence>=65)return .9;
  if(confidence>=45)return .75;
  return .6;
}
function tierFor(confidence:number):VerificationTier{
  if(confidence>=85)return 'VERIFIED';
  if(confidence>=65)return 'CORROBORATED';
  if(confidence>=45)return 'TRACKED';
  return 'SELF_REPORTED';
}

export function evaluateXPTrust(rawXP:number,input:VerificationEvidence={}):XPTrustResult{
  const evidence:VerificationEvidence={source:'manual_entry',modality:'other',...input};
  const reasons:string[]=[];
  let score=evidence.source==='wearable'||evidence.source==='healthkit'||evidence.source==='gps'?72:evidence.source==='live_app'?45:25;

  if(['wearable','healthkit','gps'].includes(evidence.source||'')){reasons.push('Independent device or sensor source attached.');}
  else if(evidence.liveTracked){score+=10;reasons.push('Session was tracked live inside VitalQuest.');}
  else reasons.push('Session relies primarily on user-entered data.');

  const duration=Number(evidence.durationMinutes||0);
  if(duration>=8&&duration<=240){score+=10;reasons.push('Session duration is within a plausible training range.');}
  else if(duration>0&&duration<3){score-=20;reasons.push('Duration is too short for the reported work.');}
  else if(duration>240){score-=15;reasons.push('Duration is unusually long and receives reduced confidence.');}

  const units=Number(evidence.completedUnits||0);
  if(units>=2){score+=8;reasons.push('Multiple completed work units support the session.');}
  if(duration>0&&units/duration>2){score-=18;reasons.push('Reported work density is implausibly high.');}

  if(evidence.modality==='resistance'){
    const volume=Number(evidence.totalVolume||0);
    if(volume>0){score+=7;reasons.push('Logged resistance volume corroborates completion.');}
    if(volume>250000){score-=20;reasons.push('Single-session lifting volume is outside normal plausibility bounds.');}
  }

  if(evidence.modality==='endurance'){
    const distance=Number(evidence.distanceMiles||0);const pace=Number(evidence.avgPaceSeconds||0);
    if(distance>.15){score+=7;reasons.push('Distance data supports the endurance session.');}
    if(pace>=240&&pace<=1800){score+=8;reasons.push('Recorded pace is within a plausible human range.');}
    else if(pace>0){score-=25;reasons.push('Recorded pace falls outside configured plausibility bounds.');}
  }

  if(evidence.modality==='recovery'&&duration>=5){score+=5;reasons.push('Recovery duration supports the completed protocol.');}
  if(Number(evidence.sensorMinutes||0)>=Math.max(5,duration*.6)){score+=13;reasons.push('Sensor-active time corroborates most of the session.');}

  if(evidence.duplicateDetected){score-=45;reasons.push('Duplicate-session evidence detected.');}
  if(evidence.clockMismatch){score-=30;reasons.push('Session timestamps conflict with elapsed-time evidence.');}
  if(evidence.implausibleSpike){score-=25;reasons.push('Performance spike exceeds configured progression bounds.');}

  const confidence=clamp(Math.round(score),0,100);
  const multiplier=multiplierFor(confidence);
  const awardedXP=Math.max(0,Math.floor(rawXP*multiplier));
  return {rawXP,awardedXP,withheldXP:Math.max(0,rawXP-awardedXP),confidence,multiplier,tier:tierFor(confidence),reasons,evidence};
}

export function scaleTrustedAmount(amount:number,multiplier:number){return Math.max(0,Math.floor(amount*multiplier))}
