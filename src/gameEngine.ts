export type CompletedSet = {
  weight: number;
  reps: number;
  completed: boolean;
  isPR?: boolean;
};

/**
 * VitalQuest progression balance v1.
 *
 * Design goals:
 * - A normal training session should feel meaningful without producing a full level by itself.
 * - Longer sessions, PRs and streaks should help, but none can stack without limit.
 * - Different modalities live in a similar reward band while recovery intentionally awards less XP.
 * - The level curve stays predictable and grows gradually over time.
 */
export const XP_BALANCE = {
  resistance: {
    completion: 80,
    setXP: 5,
    setCap: 60,
    durationPerMinute: 1,
    durationCap: 45,
    prXP: 15,
    prCap: 30,
    streakPerDay: 3,
    streakCap: 20,
    sessionCap: 220,
  },
  endurance: {
    completion: 80,
    distancePerMile: 18,
    distanceCap: 70,
    durationPerMinute: 0.8,
    durationCap: 45,
    streakPerDay: 3,
    streakCap: 20,
    sessionCap: 220,
  },
  recovery: {
    completion: 60,
    durationPerMinute: 1.2,
    durationCap: 35,
    blockXP: 7,
    blockCap: 28,
    streakPerDay: 2,
    streakCap: 15,
    sessionCap: 140,
  },
  attributes: {
    strengthCap: 75,
    staminaCap: 65,
    agilityCap: 45,
    vitalityCap: 55,
    disciplineCap: 45,
  },
  level: {
    baseXP: 500,
    exponent: 1.5,
  },
} as const;

function clampReward(value: number, cap: number) {
  return Math.max(0, Math.min(cap, Math.floor(value)));
}

export function volumeForSets(sets: CompletedSet[]) {
  return sets.reduce((total, set) => total + (set.completed ? set.weight * set.reps : 0), 0);
}

export function calculateSessionXP(args: { completedSets: number; durationMinutes: number; prCount: number; streakDays: number; }) {
  const b = XP_BALANCE.resistance;
  const completion = args.completedSets > 0 ? b.completion : 0;
  const work = clampReward(args.completedSets * b.setXP, b.setCap);
  const duration = clampReward(args.durationMinutes * b.durationPerMinute, b.durationCap);
  const prs = clampReward(args.prCount * b.prXP, b.prCap);
  const streak = clampReward(args.streakDays * b.streakPerDay, b.streakCap);
  return clampReward(completion + work + duration + prs + streak, b.sessionCap);
}

export function calculateStrengthXP(args: { completedSets: number; volume: number; prCount: number; }) {
  const value = 10 + args.completedSets * 3 + Math.min(30, Math.floor(args.volume / 1800)) + Math.min(20, args.prCount * 8);
  return clampReward(value, XP_BALANCE.attributes.strengthCap);
}

export function calculateEnduranceXP(args: { distanceMiles: number; durationMinutes: number; streakDays: number; }) {
  const b = XP_BALANCE.endurance;
  const completion = args.distanceMiles > 0 && args.durationMinutes > 0 ? b.completion : 0;
  const distance = clampReward(args.distanceMiles * b.distancePerMile, b.distanceCap);
  const duration = clampReward(args.durationMinutes * b.durationPerMinute, b.durationCap);
  const streak = clampReward(args.streakDays * b.streakPerDay, b.streakCap);
  return clampReward(completion + distance + duration + streak, b.sessionCap);
}

export function calculateStaminaXP(args: { distanceMiles: number; durationMinutes: number; }) {
  const value = 10 + Math.floor(args.distanceMiles * 10) + Math.min(24, Math.floor(args.durationMinutes / 3));
  return clampReward(value, XP_BALANCE.attributes.staminaCap);
}

export function calculateAgilityXP(args: { distanceMiles: number; avgPaceSeconds: number; }) {
  const paceBonus = args.avgPaceSeconds > 0 ? Math.max(0, Math.min(18, Math.round((720 - args.avgPaceSeconds) / 20))) : 0;
  const value = 6 + Math.floor(args.distanceMiles * 4) + paceBonus;
  return clampReward(value, XP_BALANCE.attributes.agilityCap);
}

export function calculateRecoveryXP(args: { durationMinutes: number; completedBlocks: number; streakDays: number; }) {
  const b = XP_BALANCE.recovery;
  const completion = args.completedBlocks > 0 && args.durationMinutes > 0 ? b.completion : 0;
  const duration = clampReward(args.durationMinutes * b.durationPerMinute, b.durationCap);
  const blocks = clampReward(args.completedBlocks * b.blockXP, b.blockCap);
  const streak = clampReward(args.streakDays * b.streakPerDay, b.streakCap);
  return clampReward(completion + duration + blocks + streak, b.sessionCap);
}

export function calculateVitalityXP(args: { durationMinutes: number; completedBlocks: number; }) {
  const value = 8 + Math.floor(args.durationMinutes * 0.8) + args.completedBlocks * 4;
  return clampReward(value, XP_BALANCE.attributes.vitalityCap);
}

export function calculateDisciplineXP(args: { completedBlocks: number; streakDays: number; }) {
  const value = 5 + args.completedBlocks * 3 + Math.min(18, args.streakDays * 2);
  return clampReward(value, XP_BALANCE.attributes.disciplineCap);
}

export function paceSecondsPerMile(distanceMiles: number, durationMinutes: number) {
  if (distanceMiles <= 0 || durationMinutes <= 0) return 0;
  return Math.round((durationMinutes * 60) / distanceMiles);
}

export function formatPace(secondsPerMile: number) {
  if (!secondsPerMile) return '--:--';
  const minutes = Math.floor(secondsPerMile / 60);
  const seconds = secondsPerMile % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function cumulativeXpForLevel(level: number) {
  if (level <= 1) return 0;
  const { baseXP, exponent } = XP_BALANCE.level;
  return Math.floor(baseXP * Math.pow(level - 1, exponent));
}

export function levelFromTotalXP(totalXP: number) {
  const safeXP = Math.max(0, Math.floor(totalXP));
  let level = 1;
  while (cumulativeXpForLevel(level + 1) <= safeXP) level += 1;
  return level;
}

export function levelProgress(totalXP: number) {
  const safeXP = Math.max(0, Math.floor(totalXP));
  const level = levelFromTotalXP(safeXP);
  const floor = cumulativeXpForLevel(level);
  const ceiling = cumulativeXpForLevel(level + 1);
  const current = safeXP - floor;
  const needed = ceiling - floor;
  return { level, current, needed, ratio: needed === 0 ? 0 : Math.max(0, Math.min(1, current / needed)) };
}
