import { ProgressionSnapshot } from './progression';
import { TrainingIntelligence } from './trainingIntelligence';

export type ForgeFocus = 'adaptive' | 'upper' | 'lower' | 'full';

export type GeneratedExercise = {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: number;
};

export type GeneratedWorkoutPlan = {
  id: string;
  name: string;
  focus: ForgeFocus;
  targetXP: number;
  projectedXP: number;
  estimatedMinutes: number;
  rationale: string;
  coachingNote: string;
  qualityScore: number;
  qualityLabel: 'CALIBRATING' | 'SOLID' | 'STRONG' | 'ELITE FIT';
  exercises: GeneratedExercise[];
};

const LIBRARY: Record<Exclude<ForgeFocus,'adaptive'>, Omit<GeneratedExercise,'sets'|'reps'>[]> = {
  upper: [
    { id:'bench', name:'Barbell Bench Press', muscle:'Chest · Strength' },
    { id:'row', name:'Barbell Row', muscle:'Back · Strength' },
    { id:'ohp', name:'Overhead Press', muscle:'Shoulders · Power' },
    { id:'pulldown', name:'Lat Pulldown', muscle:'Back · Control' },
    { id:'incline-db', name:'Incline Dumbbell Press', muscle:'Chest · Volume' },
    { id:'curl', name:'Dumbbell Curl', muscle:'Biceps · Accessory' },
  ],
  lower: [
    { id:'squat', name:'Back Squat', muscle:'Quads · Strength' },
    { id:'rdl', name:'Romanian Deadlift', muscle:'Hamstrings · Strength' },
    { id:'split-squat', name:'Bulgarian Split Squat', muscle:'Legs · Stability' },
    { id:'leg-press', name:'Leg Press', muscle:'Quads · Volume' },
    { id:'ham-curl', name:'Hamstring Curl', muscle:'Hamstrings · Accessory' },
    { id:'calf', name:'Standing Calf Raise', muscle:'Calves · Capacity' },
  ],
  full: [
    { id:'squat', name:'Back Squat', muscle:'Legs · Strength' },
    { id:'bench', name:'Barbell Bench Press', muscle:'Chest · Strength' },
    { id:'row', name:'Barbell Row', muscle:'Back · Strength' },
    { id:'rdl', name:'Romanian Deadlift', muscle:'Posterior Chain · Strength' },
    { id:'ohp', name:'Overhead Press', muscle:'Shoulders · Power' },
    { id:'carry', name:'Farmer Carry', muscle:'Grip · Conditioning' },
  ],
};

function recentBias(intelligence?: TrainingIntelligence): Exclude<ForgeFocus,'adaptive'> | null {
  if (!intelligence?.recentResistanceMix.length) return null;
  const recent = intelligence.recentResistanceMix.slice(0,3);
  const upperCount = recent.filter(id => ['push','pull','ai-upper'].includes(id)).length;
  const lowerCount = recent.filter(id => ['legs','ai-lower'].includes(id)).length;
  if (upperCount >= 2) return 'lower';
  if (lowerCount >= 2) return 'upper';
  return null;
}

function chooseAdaptiveFocus(snapshot: ProgressionSnapshot, intelligence?: TrainingIntelligence): Exclude<ForgeFocus,'adaptive'> {
  const historyChoice = recentBias(intelligence);
  if (historyChoice) return historyChoice;
  const endurance = snapshot.staminaXP + snapshot.agilityXP;
  if (snapshot.thisWeekResistanceWorkouts >= 3 && snapshot.thisWeekRecoverySessions === 0) return 'full';
  if (snapshot.strengthXP > endurance * 1.35 && snapshot.workoutCount > 2) return 'lower';
  return snapshot.resistanceWorkoutCount % 2 === 0 ? 'upper' : 'lower';
}

function projectedSessionXP(sets: number, minutes: number, streakDays: number) {
  return 100 + sets * 6 + Math.min(60, Math.floor(minutes * 1.25)) + Math.min(50, streakDays * 5);
}

function qualityLabel(score:number):GeneratedWorkoutPlan['qualityLabel'] {
  if(score>=90)return 'ELITE FIT';
  if(score>=80)return 'STRONG';
  if(score>=68)return 'SOLID';
  return 'CALIBRATING';
}

function scorePlan(args:{targetXP:number;projectedXP:number;exercises:GeneratedExercise[];snapshot:ProgressionSnapshot;intelligence?:TrainingIntelligence}) {
  const xpFit = Math.max(0, 40 - Math.round(Math.abs(args.targetXP-args.projectedXP)/4));
  const historyDepth = Math.min(20, (args.intelligence?.recent.length ?? 0) * 2);
  const exerciseHistory = args.exercises.filter(ex => args.intelligence?.exerciseInsights.some(i=>i.exerciseId===ex.id)).length;
  const familiarity = Math.min(20, exerciseHistory * 4);
  const recoveryFit = args.snapshot.thisWeekResistanceWorkouts >= 4 && args.snapshot.thisWeekRecoverySessions === 0 ? 5 : 15;
  return Math.min(100, xpFit + historyDepth + familiarity + recoveryFit);
}

export function generateWorkoutPlan(args: {
  targetXP: number;
  focus: ForgeFocus;
  snapshot: ProgressionSnapshot;
  intelligence?: TrainingIntelligence;
}): GeneratedWorkoutPlan {
  const targetXP = Math.max(140, Math.min(390, Math.round(args.targetXP)));
  const resolvedFocus = args.focus === 'adaptive' ? chooseAdaptiveFocus(args.snapshot,args.intelligence) : args.focus;
  const estimatedMinutes = targetXP <= 180 ? 28 : targetXP <= 240 ? 38 : targetXP <= 310 ? 50 : 62;
  const baseWithoutSets = 100 + Math.min(60, Math.floor(estimatedMinutes * 1.25)) + Math.min(50, args.snapshot.streakDays * 5);
  const desiredSets = Math.max(6, Math.min(24, Math.round((targetXP - baseWithoutSets) / 6)));
  const exerciseCount = Math.max(3, Math.min(6, Math.ceil(desiredSets / 4)));
  const pool = LIBRARY[resolvedFocus];
  const historyOffset = args.intelligence?.generatedSessions ?? 0;
  const rotation = (args.snapshot.workoutCount + historyOffset) % pool.length;
  const selected = Array.from({length: exerciseCount}, (_, index) => pool[(rotation + index) % pool.length]);
  let remaining = desiredSets;
  const exercises = selected.map((exercise, index) => {
    const slots = selected.length - index;
    const sets = Math.max(2, Math.min(5, Math.round(remaining / slots)));
    remaining -= sets;
    const compound = ['bench','row','ohp','squat','rdl','leg-press'].includes(exercise.id);
    const trend = args.intelligence?.exerciseInsights.find(item=>item.exerciseId===exercise.id)?.volumeTrendPct ?? 0;
    const reps = compound ? (trend < -8 ? 8 : targetXP >= 300 ? 6 : 8) : 10;
    return { ...exercise, sets, reps };
  });
  const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const projectedXP = projectedSessionXP(totalSets, estimatedMinutes, args.snapshot.streakDays);
  const historyText = args.intelligence?.recent.length
    ? ` Your last ${args.intelligence.recent.length} sessions averaged ${args.intelligence.averageXP} XP over ${args.intelligence.averageDuration} minutes.`
    : '';
  const rationale = args.focus === 'adaptive'
    ? `VitalQuest used your progression balance, recent resistance mix, ${args.snapshot.thisWeekResistanceWorkouts} resistance sessions this week, and ${args.snapshot.streakDays}-day streak to choose a ${resolvedFocus}-body emphasis near ${targetXP} XP.${historyText}`
    : `You selected ${resolvedFocus}-body training. VitalQuest scaled exercise count, working sets and estimated duration toward a ${targetXP} XP target.${historyText}`;

  const strongest = args.intelligence?.strongestTrend;
  const needsAttention = args.intelligence?.needsAttention;
  const coachingNote = strongest && strongest.volumeTrendPct > 4
    ? `${strongest.name} volume is trending +${strongest.volumeTrendPct}% across recent logged sets. The Forge can keep progressive overload in play while preserving total-session balance.`
    : needsAttention && needsAttention.volumeTrendPct < -6
      ? `${needsAttention.name} volume is trending ${needsAttention.volumeTrendPct}%. The Forge is keeping compound rep targets conservative instead of forcing intensity.`
      : args.intelligence?.recent.length
        ? `Recent workload is stable. This plan prioritizes balanced progression over a large single-session spike.`
        : `Complete a few sessions and the Forge will begin calibrating exercise-specific progression from your history.`;

  const qualityScore = scorePlan({targetXP,projectedXP,exercises,snapshot:args.snapshot,intelligence:args.intelligence});

  return {
    id: `forge-${Date.now()}`,
    name: `${targetXP} XP ${resolvedFocus === 'full' ? 'Full Body' : resolvedFocus === 'upper' ? 'Upper Body' : 'Lower Body'} Trial`,
    focus: resolvedFocus,
    targetXP,
    projectedXP,
    estimatedMinutes,
    rationale,
    coachingNote,
    qualityScore,
    qualityLabel: qualityLabel(qualityScore),
    exercises,
  };
}
