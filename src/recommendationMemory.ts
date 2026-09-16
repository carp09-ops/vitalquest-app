export type RecommendationMemory={
  recommendedTemplateId:string;
  priority:string;
  readiness:string;
  confidence:string;
  source:string;
  capturedAt:string;
};

let current:RecommendationMemory|null=null;

export function rememberRecommendation(input:Omit<RecommendationMemory,'capturedAt'>){
  const now=new Date().toISOString();
  if(current&&current.recommendedTemplateId===input.recommendedTemplateId&&current.priority===input.priority&&current.readiness===input.readiness&&current.confidence===input.confidence)return current;
  current={...input,capturedAt:now};
  return current;
}

export function getRememberedRecommendation(){return current;}
export function clearRememberedRecommendation(){current=null;}
