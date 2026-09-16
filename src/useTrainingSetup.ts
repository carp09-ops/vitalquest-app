import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getCustomWorkouts, getEquipmentProfile } from './db';
import { CustomWorkoutTemplate, DEFAULT_EQUIPMENT, EquipmentId } from './trainingPreferences';

export function useTrainingSetup(){
  const db=useSQLiteContext();
  const [equipment,setEquipment]=useState<EquipmentId[]>(DEFAULT_EQUIPMENT);
  const [customWorkouts,setCustomWorkouts]=useState<CustomWorkoutTemplate[]>([]);
  const [loading,setLoading]=useState(true);
  const refresh=useCallback(async()=>{
    const [nextEquipment,nextCustom]=await Promise.all([getEquipmentProfile(db),getCustomWorkouts(db)]);
    setEquipment(nextEquipment);setCustomWorkouts(nextCustom);setLoading(false);
  },[db]);
  useFocusEffect(useCallback(()=>{let active=true;Promise.all([getEquipmentProfile(db),getCustomWorkouts(db)]).then(([nextEquipment,nextCustom])=>{if(!active)return;setEquipment(nextEquipment);setCustomWorkouts(nextCustom);setLoading(false);});return()=>{active=false}},[db]));
  return{equipment,customWorkouts,loading,refresh};
}
