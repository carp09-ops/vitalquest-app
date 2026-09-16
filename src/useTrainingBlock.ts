import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback,useState } from 'react';
import { getTrainingBlock, type TrainingBlock } from './trainingBlock';
import type { TrainingIntelligence } from './trainingIntelligence';

export function useTrainingBlock(intelligence?:TrainingIntelligence){
  const db=useSQLiteContext();
  const [block,setBlock]=useState<TrainingBlock|null>(null);
  useFocusEffect(useCallback(()=>{let active=true;getTrainingBlock(db,intelligence).then(next=>{if(active)setBlock(next)});return()=>{active=false}},[db,intelligence?.performanceTrend,intelligence?.fatigueScore,intelligence?.recent.length]));
  return block;
}
