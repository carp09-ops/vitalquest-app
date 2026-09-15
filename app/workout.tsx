import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import ActiveWorkoutV2 from '../src/ActiveWorkoutV2';
import EnduranceWorkoutV2 from '../src/EnduranceWorkoutV2';

export default function WorkoutScreen() {
  const params = useLocalSearchParams<{ templateId?: string }>();
  if (params.templateId === 'run') return <EnduranceWorkoutV2 />;
  return <ActiveWorkoutV2 />;
}
