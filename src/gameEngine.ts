export type CompletedSet = {
  weight: number;
  reps: number;
  completed: boolean;
  isPR?: boolean;
};

export function volumeForSets(sets: CompletedSet[]) {
  return sets.reduce(
    (total, set) => total + (set.completed ? set.weight * set.reps : 0),
    0
  );
}

export function calculateSessionXP(args: {
  completedSets: number;
  durationMinutes: number;
  prCount: number;
  streakDays: number;
}) {
  const completion = 100;
  const work = args.completedSets * 6;
  const duration = Math.min(60, Math.floor(args.durationMinutes * 1.25));
  const prs = args.prCount * 30;
  const streak = Math.min(50, args.streakDays * 5);

  return completion + work + duration + prs + streak;
}

export function calculateStrengthXP(args: {
  completedSets: number;
  volume: number;
  prCount: number;
}) {
  return (
    12 +
    args.completedSets * 3 +
    Math.min(40, Math.floor(args.volume / 1500)) +
    args.prCount * 10
  );
}

export function calculateEnduranceXP(args: {
  distanceMiles: number;
  durationMinutes: number;
  streakDays: number;
}) {
  const completion = 90;
  const distance = Math.floor(args.distanceMiles * 24);
  const duration = Math.min(55, Math.floor(args.durationMinutes * 1.1));
  const streak = Math.min(40, args.streakDays * 4);
  return completion + distance + duration + streak;
}

export function calculateStaminaXP(args: {
  distanceMiles: number;
  durationMinutes: number;
}) {
  return 10 + Math.floor(args.distanceMiles * 11) + Math.min(28, Math.floor(args.durationMinutes / 3));
}

export function calculateAgilityXP(args: {
  distanceMiles: number;
  avgPaceSeconds: number;
}) {
  const paceBonus = args.avgPaceSeconds > 0
    ? Math.max(0, Math.min(22, Math.round((720 - args.avgPaceSeconds) / 18)))
    : 0;
  return 6 + Math.floor(args.distanceMiles * 5) + paceBonus;
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
  return Math.floor(500 * Math.pow(level - 1, 1.45));
}

export function levelFromTotalXP(totalXP: number) {
  let level = 1;
  while (cumulativeXpForLevel(level + 1) <= totalXP) {
    level += 1;
  }
  return level;
}

export function levelProgress(totalXP: number) {
  const level = levelFromTotalXP(totalXP);
  const floor = cumulativeXpForLevel(level);
  const ceiling = cumulativeXpForLevel(level + 1);
  const current = totalXP - floor;
  const needed = ceiling - floor;

  return {
    level,
    current,
    needed,
    ratio: needed === 0 ? 0 : current / needed,
  };
}
