import { ExerciseInsight } from './trainingIntelligence';

export type LoadPrescription = {
  suggestedWeight: number | null;
  source: 'history' | 'none';
  rationale: string;
};

function roundToFive(value:number){return Math.max(0,Math.round(value/5)*5)}

export function prescribeWorkingWeight(args:{
  insight?: ExerciseInsight;
  targetReps:number;
}):LoadPrescription{
  const {insight,targetReps}=args;
  if(!insight || insight.sessions<1 || insight.estimatedOneRepMax<=0){
    return {suggestedWeight:null,source:'none',rationale:'No logged history yet. Choose a comfortable working load and VitalQuest will calibrate from it.'};
  }

  const repAdjusted=insight.estimatedOneRepMax/(1+Math.max(1,targetReps)/30);
  let trendFactor=1;
  if(insight.sessions>=2){
    if(insight.volumeTrendPct>=8) trendFactor=1.025;
    else if(insight.volumeTrendPct<=-8) trendFactor=.95;
  }
  const suggestedWeight=roundToFive(repAdjusted*trendFactor);
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
    rationale:`Based on an estimated ${insight.estimatedOneRepMax} lb 1RM from your ledger, ${trendText}.`,
  };
}
