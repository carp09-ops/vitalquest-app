export const progressionRules = {
  quests: {
    ironWeek: { target: 3, unit: 'resistance sessions' },
    fiveTonTrial: { target: 10000, unit: 'lb weekly volume' },
    longRoad: { target: 15, unit: 'lifetime miles' },
    veteranPath: { target: 25, unit: 'lifetime sessions', reward: 'Forged Helm' },
    restorationRitual: { target: 3, unit: 'recovery sessions', reward: 'The Restored' },
  },
  unlocks: {
    ironInitiate: { target: 1, metric: 'workoutCount' as const, label: 'Iron Initiate' },
    relentless: { target: 7, metric: 'streakDays' as const, label: 'The Relentless' },
    forgedHelm: { target: 25, metric: 'workoutCount' as const, label: 'Forged Helm' },
    titanPlate: { target: 100000, metric: 'totalVolume' as const, label: 'Titan Plate' },
    roadrunnerGreaves: { target: 25, metric: 'lifetimeMiles' as const, label: 'Roadrunner Greaves' },
    restored: { target: 3, metric: 'recoveryCount' as const, label: 'The Restored' },
    emberAura: { target: 5000, metric: 'totalXP' as const, label: 'Ember Aura' },
  },
} as const;

export type ProgressMetrics = {
  workoutCount:number;
  streakDays:number;
  totalVolume:number;
  lifetimeMiles:number;
  recoveryCount:number;
  totalXP:number;
};

export type UnlockKey = keyof typeof progressionRules.unlocks;
export type UnlockState = Record<UnlockKey, boolean>;

export function deriveUnlockState(metrics: ProgressMetrics): UnlockState {
  const entries = Object.entries(progressionRules.unlocks) as Array<[UnlockKey, (typeof progressionRules.unlocks)[UnlockKey]]>;
  return entries.reduce((state,[key,rule])=>{
    state[key]=metrics[rule.metric]>=rule.target;
    return state;
  },{} as UnlockState);
}

export function newlyUnlocked(before: UnlockState, after: UnlockState) {
  return (Object.keys(after) as UnlockKey[])
    .filter(key=>!before[key]&&after[key])
    .map(key=>progressionRules.unlocks[key].label);
}

export type ProgressMetric = keyof ProgressMetrics;
