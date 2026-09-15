import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getProgressionSnapshot, ProgressionSnapshot } from './progression';

const EMPTY: ProgressionSnapshot = {
  totalXP: 0,
  level: 1,
  levelCurrentXP: 0,
  levelNeededXP: 500,
  levelRatio: 0,
  strengthXP: 0,
  staminaXP: 0,
  agilityXP: 0,
  vitalityXP: 0,
  disciplineXP: 0,
  workoutCount: 0,
  recoveryCount: 0,
  totalVolume: 0,
  lifetimeMiles: 0,
  prCount: 0,
  streakDays: 0,
  thisWeekWorkouts: 0,
  thisWeekRecoverySessions: 0,
  thisWeekVolume: 0,
  thisWeekMiles: 0,
  thisWeekXP: 0,
  lastWorkoutAt: null,
  quests: {
    ironWeek: { progress: 0, target: 3, complete: false },
    fiveTonTrial: { progress: 0, target: 10000, complete: false },
    longRoad: { progress: 0, target: 15, complete: false },
    veteranPath: { progress: 0, target: 25, complete: false },
  },
  unlocks: {
    ironInitiate: false,
    relentless: false,
    forgedHelm: false,
    titanPlate: false,
    roadrunnerGreaves: false,
    restored: false,
  },
};

export function useProgressionSnapshot() {
  const db = useSQLiteContext();
  const [snapshot, setSnapshot] = useState<ProgressionSnapshot>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await getProgressionSnapshot(db);
      setSnapshot(next);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getProgressionSnapshot(db)
        .then((next) => { if (active) setSnapshot(next); })
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, [db])
  );

  return { snapshot, loading, refresh };
}
