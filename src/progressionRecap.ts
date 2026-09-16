import { levelProgress } from './gameEngine';
import type { ProgressionSnapshot } from './progression';
import { progressionRules } from './progressionRules';

export type RecapModality='resistance'|'endurance'|'recovery';
export type RecapAttribute={label:string;amount:number};
export type ProgressionRecap={
  levelBefore:number;levelAfter:number;leveledUp:boolean;levelsGained:number;
  totalXPAfter:number;levelCurrentXP:number;levelNeededXP:number;levelRatio:number;xpToNext:number;
  attributes:RecapAttribute[];progressSignals:string[];nextMilestone:string;
};

export function buildProgressionRecap(args:{
  snapshot:ProgressionSnapshot;
  awardedXP:number;
  modality:RecapModality;
  attributes:RecapAttribute[];
  volume?:number;
  distanceMiles?:number;
}):ProgressionRecap{
  const {snapshot,awardedXP,modality}=args;
  const totalXPAfter=snapshot.totalXP+Math.max(0,awardedXP);
  const before=levelProgress(snapshot.totalXP);
  const after=levelProgress(totalXPAfter);
  const workoutCountAfter=snapshot.workoutCount+1;
  const resistanceAfter=snapshot.thisWeekResistanceWorkouts+(modality==='resistance'?1:0);
  const recoveryAfter=snapshot.recoveryCount+(modality==='recovery'?1:0);
  const weeklyVolumeAfter=snapshot.thisWeekVolume+(modality==='resistance'?(args.volume??0):0);
  const lifetimeMilesAfter=snapshot.lifetimeMiles+(modality==='endurance'?(args.distanceMiles??0):0);
  const signals:string[]=[];
  if(modality==='resistance'){
    signals.push(`Iron Week ${Math.min(resistanceAfter,progressionRules.quests.ironWeek.target)}/${progressionRules.quests.ironWeek.target}`);
    signals.push(`Five-Ton Trial ${Math.min(Math.round(weeklyVolumeAfter),progressionRules.quests.fiveTonTrial.target).toLocaleString()}/${progressionRules.quests.fiveTonTrial.target.toLocaleString()} lb`);
  }
  if(modality==='endurance') signals.push(`Long Road ${Math.min(lifetimeMilesAfter,progressionRules.quests.longRoad.target).toFixed(1)}/${progressionRules.quests.longRoad.target.toFixed(1)} mi`);
  if(modality==='recovery') signals.push(`Restoration Ritual ${Math.min(recoveryAfter,progressionRules.quests.restorationRitual.target)}/${progressionRules.quests.restorationRitual.target}`);
  signals.push(`Veteran Path ${Math.min(workoutCountAfter,progressionRules.quests.veteranPath.target)}/${progressionRules.quests.veteranPath.target}`);

  const xpToNext=Math.max(0,after.needed-after.current);
  const milestones:Array<{remaining:number;label:string}>=[
    {remaining:xpToNext,label:`Level ${after.level+1} · ${xpToNext.toLocaleString()} XP away`},
    {remaining:Math.max(0,progressionRules.unlocks.emberAura.target-totalXPAfter),label:`Ember Aura · ${Math.max(0,progressionRules.unlocks.emberAura.target-totalXPAfter).toLocaleString()} XP away`},
    {remaining:Math.max(0,progressionRules.unlocks.forgedHelm.target-workoutCountAfter)*150,label:`Forged Helm · ${Math.max(0,progressionRules.unlocks.forgedHelm.target-workoutCountAfter)} sessions away`},
  ].filter(item=>item.remaining>0).sort((a,b)=>a.remaining-b.remaining);

  return {
    levelBefore:before.level,levelAfter:after.level,leveledUp:after.level>before.level,levelsGained:Math.max(0,after.level-before.level),
    totalXPAfter,levelCurrentXP:after.current,levelNeededXP:after.needed,levelRatio:after.ratio,xpToNext,
    attributes:args.attributes.filter(item=>item.amount>0),progressSignals:signals,
    nextMilestone:milestones[0]?.label??'All configured progression milestones cleared',
  };
}
