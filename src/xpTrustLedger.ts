import type { SQLiteDatabase } from 'expo-sqlite';
import type { VerificationTier } from './xpTrust';

export type VerificationRecord={
  sessionId:string;
  rawXP:number;
  awardedXP:number;
  withheldXP:number;
  confidence:number;
  multiplier:number;
  tier:VerificationTier;
  createdAt:string;
  reasons:string[];
};

export type XPTrustSummary={
  sessionCount:number;
  rawXP:number;
  awardedXP:number;
  withheldXP:number;
  averageConfidence:number;
  fullValueRate:number;
  verifiedCount:number;
  corroboratedCount:number;
  trackedCount:number;
  selfReportedCount:number;
  recent:VerificationRecord[];
};

export const EMPTY_TRUST_SUMMARY:XPTrustSummary={sessionCount:0,rawXP:0,awardedXP:0,withheldXP:0,averageConfidence:0,fullValueRate:0,verifiedCount:0,corroboratedCount:0,trackedCount:0,selfReportedCount:0,recent:[]};

export async function getXPTrustSummary(db:SQLiteDatabase):Promise<XPTrustSummary>{
  const rows=await db.getAllAsync<any>(`SELECT session_id, raw_xp, awarded_xp, withheld_xp, confidence, multiplier, tier, reasons_json, created_at FROM session_verification ORDER BY created_at DESC`);
  if(!rows.length)return EMPTY_TRUST_SUMMARY;
  const records:VerificationRecord[]=rows.map(row=>({sessionId:String(row.session_id),rawXP:Number(row.raw_xp||0),awardedXP:Number(row.awarded_xp||0),withheldXP:Number(row.withheld_xp||0),confidence:Number(row.confidence||0),multiplier:Number(row.multiplier||0),tier:row.tier as VerificationTier,createdAt:String(row.created_at||''),reasons:(()=>{try{return JSON.parse(row.reasons_json||'[]')}catch{return[]}})()}));
  const rawXP=records.reduce((sum,row)=>sum+row.rawXP,0);const awardedXP=records.reduce((sum,row)=>sum+row.awardedXP,0);const withheldXP=records.reduce((sum,row)=>sum+row.withheldXP,0);
  const count=(tier:VerificationTier)=>records.filter(row=>row.tier===tier).length;
  return {sessionCount:records.length,rawXP,awardedXP,withheldXP,averageConfidence:Math.round(records.reduce((sum,row)=>sum+row.confidence,0)/records.length),fullValueRate:Math.round(records.filter(row=>row.multiplier>=1).length/records.length*100),verifiedCount:count('VERIFIED'),corroboratedCount:count('CORROBORATED'),trackedCount:count('TRACKED'),selfReportedCount:count('SELF_REPORTED'),recent:records.slice(0,12)};
}
