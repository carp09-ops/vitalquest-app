import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { EMPTY_INTELLIGENCE, getTrainingIntelligence, TrainingIntelligence } from './trainingIntelligence';

export function useTrainingIntelligence(){
  const db=useSQLiteContext();
  const [intelligence,setIntelligence]=useState<TrainingIntelligence>(EMPTY_INTELLIGENCE);
  useFocusEffect(useCallback(()=>{let active=true;getTrainingIntelligence(db).then(next=>{if(active)setIntelligence(next)});return()=>{active=false}},[db]));
  return intelligence;
}
