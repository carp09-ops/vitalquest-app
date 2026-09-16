import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getProgressionSnapshot, ProgressionSnapshot } from './progression';

const EMPTY:ProgressionSnapshot={
  totalXP:0,level:1,levelCurrentXP:0,levelNeededXP:500,levelRatio:0,
  strengthXP:0,staminaXP:0,agilityXP:0,vitalityXP:0,disciplineXP:0,
  workoutCount:0,resistanceWorkoutCount:0,enduranceCount:0,recoveryCount:0,
  totalVolume:0,lifetimeMiles:0,prCount:0,streakDays:0,
  thisWeekWorkouts:0,thisWeekResistanceWorkouts:0,thisWeekEnduranceSessions:0,thisWeekRecoverySessions:0,
  thisWeekPushWorkouts:0,thisWeekPullWorkouts:0,thisWeekLegWorkouts:0,
  thisWeekVolume:0,thisWeekMiles:0,thisWeekXP:0,lastWorkoutAt:null,lastTemplateId:null,
  quests:{
    ironWeek:{progress:0,target:3,complete:false},
    fiveTonTrial:{progress:0,target:10000,complete:false},
    longRoad:{progress:0,target:15,complete:false},
    veteranPath:{progress:0,target:25,complete:false},
    restorationRitual:{progress:0,target:3,complete:false},
  },
  unlocks:{ironInitiate:false,relentless:false,forgedHelm:false,titanPlate:false,roadrunnerGreaves:false,restored:false,emberAura:false},
};

export function useProgressionSnapshot(){
  const db=useSQLiteContext();
  const [snapshot,setSnapshot]=useState<ProgressionSnapshot>(EMPTY);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const refresh=useCallback(async()=>{
    setRefreshing(true);setError(null);
    try{setSnapshot(await getProgressionSnapshot(db))}
    catch(err){setError(err instanceof Error?err.message:'Unable to refresh progression right now.')}
    finally{setLoading(false);setRefreshing(false)}
  },[db]);

  useFocusEffect(useCallback(()=>{
    let active=true;setError(null);
    getProgressionSnapshot(db)
      .then(next=>{if(active)setSnapshot(next)})
      .catch(err=>{if(active)setError(err instanceof Error?err.message:'Unable to load progression right now.')})
      .finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[db]));

  return{snapshot,loading,refreshing,error,refresh};
}
