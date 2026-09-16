export function shouldSampleSessionFeedback(sessionId:string){
  let hash=0;
  for(let i=0;i<sessionId.length;i++)hash=(hash*31+sessionId.charCodeAt(i))>>>0;
  return hash%3===0;
}

export function makeFeedbackId(prefix='beta'){
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
