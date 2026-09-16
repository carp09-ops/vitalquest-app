export const progressionRules = {
  quests: {
    ironWeek: { target: 3, unit: 'resistance sessions' },
    fiveTonTrial: { target: 10000, unit: 'lb weekly volume' },
    longRoad: { target: 15, unit: 'lifetime miles' },
    veteranPath: { target: 25, unit: 'lifetime sessions' },
    restorationRitual: { target: 3, unit: 'recovery sessions' },
  },
  unlocks: {
    ironInitiate: { target: 1, metric: 'workoutCount' as const },
    relentless: { target: 7, metric: 'streakDays' as const },
    forgedHelm: { target: 25, metric: 'workoutCount' as const },
    titanPlate: { target: 100000, metric: 'totalVolume' as const },
    roadrunnerGreaves: { target: 25, metric: 'lifetimeMiles' as const },
    restored: { target: 5, metric: 'recoveryCount' as const },
    emberAura: { target: 5000, metric: 'totalXP' as const },
  },
} as const;

export type ProgressMetric = keyof Pick<
  { workoutCount:number; streakDays:number; totalVolume:number; lifetimeMiles:number; recoveryCount:number; totalXP:number },
  'workoutCount'|'streakDays'|'totalVolume'|'lifetimeMiles'|'recoveryCount'|'totalXP'
>;
