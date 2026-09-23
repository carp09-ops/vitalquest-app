import { ExerciseInsight } from './trainingIntelligence';
import { currentTrainingBlockLoadGuide } from './trainingBlock';
import { catalogItemFor, planDoubleProgression, type LastWorkingSets, type ProgressionPlan } from './doubleProgression';

export type LoadPrescription = {
  suggestedWeight: number | null;
  source: 'history' | 'none';
  rationale: string;
  progression?: ProgressionPlan;
};

function roundToFive(value:number){return Math.max(0,Math.round(value/5)*5)}

export function prescribeWorkingWeight(args:{
  insight?: ExerciseInsight;
  targetReps:number;
  loadMultiplier?:number;
  phaseLabel?:string;
  catalogId?:string;
  lastSets?: LastWorkingSets | null;
}):LoadPrescription{
  const {insight,targetReps}=args;
  const active=currentTrainingBlockLoadGuide();
  const loadMultiplier=Math.max(.65,Math.min(1.1,args.loadMultiplier??active.loadMultiplier));
  const phaseLabel=args.phaseLabel??active.phaseLabel;
  const phaseText=Math.abs(loadMultiplier-1)>.01?` ${phaseLabel} applies a ${Math.round(loadMultiplier*100)}% Arc load guide.`:'';

  // Double progression is the durable rule: when we have set-level history it
  // overrides the 1RM estimate with the rep-range ladder.
  const exercise=args.catalogId?catalogItemFor(args.catalogId):undefined;
  const plan=exercise&&args.lastSets!==undefined?planDoubleProgression({exercise,last:args.lastSets}):undefined;
  if(plan&&plan.weight>0){
    return {
      suggestedWeight:roundToFive(plan.weight*loadMultiplier),
      source:'history',
      rationale:`${plan.note}${phaseText}`,
      progression:plan,
    };
  }

  if(!insight || insight.sessions<1 || insight.estimatedOneRepMax<=0){
    return {suggestedWeight:null,source:'none',rationale:'No logged history yet. Choose a comfortable working load and VitalQuest will calibrate from it.',progression:plan};
  }

  const repAdjusted=insight.estimatedOneRepMax/(1+Math.max(1,targetReps)/30);
  let trendFactor=1;
  if(insight.sessions>=2){
    if(insight.volumeTrendPct>=8) trendFactor=1.025;
    else if(insight.volumeTrendPct<=-8) trendFactor=.95;
  }
  const suggestedWeight=roundToFive(repAdjusted*trendFactor*loadMultiplier);
  const trendText=insight.sessions<2
    ? 'using your latest logged performance'
    : insight.volumeTrendPct>=8
      ? `with volume trending +${insight.volumeTrendPct}%`
      : insight.volumeTrendPct<=-8
        ? `with volume trending ${insight.volumeTrendPct}% so load is held conservative`
        : 'with recent volume holding steady';

  return {
    suggestedWeight,
    source:'history',
    rationale:`Based on an estimated ${insight.estimatedOneRepMax} lb 1RM from your ledger, ${trendText}.${phaseText}`,
    progression:plan,
  };
}
