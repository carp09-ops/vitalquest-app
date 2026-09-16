import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { EMPTY_TRUST_SUMMARY, getXPTrustSummary, XPTrustSummary } from './xpTrustLedger';

export function useXPTrustSummary(){
  const db=useSQLiteContext();
  const [summary,setSummary]=useState<XPTrustSummary>(EMPTY_TRUST_SUMMARY);
  useFocusEffect(useCallback(()=>{let active=true;getXPTrustSummary(db).then(next=>{if(active)setSummary(next)});return()=>{active=false}},[db]));
  return summary;
}
