import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import ActiveWorkoutV2 from '../src/ActiveWorkoutV2';
import EnduranceWorkoutV2 from '../src/EnduranceWorkoutV2';
import RecoveryEncounterV2 from '../src/RecoveryEncounterV2';
import WorldBackdrop from '../src/WorldBackdrop';

export default function WorkoutScreen() {
  const params = useLocalSearchParams<{ templateId?: string }>();
  const encounter = params.templateId === 'run'
    ? <EnduranceWorkoutV2 />
    : params.templateId === 'recovery'
      ? <RecoveryEncounterV2 />
      : <ActiveWorkoutV2 />;
  return <WorldBackdrop scene="train">{encounter}</WorldBackdrop>;
}
