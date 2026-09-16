import type { SQLiteDatabase } from 'expo-sqlite';

export type SessionIntegrityResult={
  duplicateDetected:boolean;
  clockMismatch:boolean;
  overlapCount:number;
  overlapSeconds:number;
};

type RecentSession={id:string;started_at:string;completed_at:string};

export async function evaluateSessionIntegrity(db:SQLiteDatabase,args:{startedAt:string;completedAt:string;durationMinutes:number}):Promise<SessionIntegrityResult>{
  const start=new Date(args.startedAt).getTime();
  const end=new Date(args.completedAt).getTime();
  const elapsedMinutes=(end-start)/60000;
  const clockMismatch=!Number.isFinite(start)||!Number.isFinite(end)||end<=start||Math.abs(elapsedMinutes-args.durationMinutes)>Math.max(3,args.durationMinutes*.2);
  const recent=await db.getAllAsync<RecentSession>(`SELECT id, started_at, completed_at FROM workout_sessions ORDER BY completed_at DESC LIMIT 12`);
  let overlapCount=0;let overlapSeconds=0;
  for(const row of recent){
    const otherStart=new Date(row.started_at).getTime();const otherEnd=new Date(row.completed_at).getTime();
    if(!Number.isFinite(otherStart)||!Number.isFinite(otherEnd))continue;
    const overlap=Math.max(0,Math.min(end,otherEnd)-Math.max(start,otherStart));
    if(overlap>0){overlapCount+=1;overlapSeconds+=Math.round(overlap/1000);}
  }
  const sessionSeconds=Math.max(1,(end-start)/1000);
  const duplicateDetected=overlapSeconds/sessionSeconds>.35||overlapCount>=2;
  return {duplicateDetected,clockMismatch,overlapCount,overlapSeconds};
}
