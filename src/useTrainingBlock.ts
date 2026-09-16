import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback,useState } from 'react';
import { getTrainingBlock, setTrainingBlockGoal, type TrainingArcGoal, type TrainingBlock } from './trainingBlock';
import type { TrainingIntelligence } from './trainingIntelligence';

export function useTrainingBlock(intelligence?:TrainingIntelligence){
  const db=useSQLiteContext();
  const [block,setBlock]=useState<TrainingBlock|null>(null);
  useFocusEffect(useCallback(()=>{let active=true;getTrainingBlock(db,intelligence).then(next=>{if(active)setBlock(next)});return()=>{active=false}},[db,intelligence?.performanceTrend,intelligence?.fatigueScore,intelligence?.recent.length]));
  return block;
}

export function useTrainingBlockGoalController(intelligence?:TrainingIntelligence){
  const db=useSQLiteContext();
  const [saving,setSaving]=useState(false);
  const [version,setVersion]=useState(0);
  const [block,setBlock]=useState<TrainingBlock|null>(null);
  const refresh=useCallback(async()=>{const next=await getTrainingBlock(db,intelligence);setBlock(next);return next;},[db,intelligence?.performanceTrend,intelligence?.fatigueScore,intelligence?.recent.length,version]);
  useFocusEffect(useCallback(()=>{let active=true;getTrainingBlock(db,intelligence).then(next=>{if(active)setBlock(next)});return()=>{active=false}},[db,intelligence?.performanceTrend,intelligence?.fatigueScore,intelligence?.recent.length,version]));
  const setGoal=useCallback(async(goal:TrainingArcGoal)=>{setSaving(true);try{await setTrainingBlockGoal(db,goal);setVersion(v=>v+1);const next=await getTrainingBlock(db,intelligence);setBlock(next);}finally{setSaving(false)}},[db,intelligence]);
  return{block,setGoal,saving,refresh};
}
