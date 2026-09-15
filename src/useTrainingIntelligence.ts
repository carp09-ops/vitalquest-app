import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getTrainingIntelligence, TrainingIntelligence } from './trainingIntelligence';

const EMPTY:TrainingIntelligence={recent:[],averageXP:0,averageDuration:0,averageVolume:0,generatedSessions:0,recentResistanceMix:[]};

export function useTrainingIntelligence(){
  const db=useSQLiteContext();
  const [intelligence,setIntelligence]=useState<TrainingIntelligence>(EMPTY);
  useFocusEffect(useCallback(()=>{let active=true;getTrainingIntelligence(db).then(next=>{if(active)setIntelligence(next)});return()=>{active=false}},[db]));
  return intelligence;
}
