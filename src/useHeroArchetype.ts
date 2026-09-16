import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getHeroArchetype, saveHeroArchetype } from './db';
import type { HeroArchetype } from './heroEvolution';

export function useHeroArchetype(){
  const db=useSQLiteContext();
  const [archetype,setArchetypeState]=useState<HeroArchetype>('athlete');
  const [loading,setLoading]=useState(true);
  const refresh=useCallback(async()=>{const next=await getHeroArchetype(db);setArchetypeState(next);setLoading(false);return next},[db]);
  useFocusEffect(useCallback(()=>{let active=true;getHeroArchetype(db).then(next=>{if(active)setArchetypeState(next)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[db]));
  const setArchetype=useCallback(async(next:HeroArchetype)=>{setArchetypeState(next);await saveHeroArchetype(db,next)},[db]);
  return{archetype,setArchetype,loading,refresh};
}
