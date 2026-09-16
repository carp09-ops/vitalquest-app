export type ExerciseTemplate = {
  id: string;
  name: string;
  muscle: string;
  prescribedSets: number;
  targetReps: number;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  subtitle: string;
  estimatedMinutes: number;
  exercises: ExerciseTemplate[];
};

export const templates: WorkoutTemplate[] = [
  {
    id: 'push',
    name: 'Push Day',
    subtitle: 'Chest · Shoulders · Triceps',
    estimatedMinutes: 55,
    exercises: [
      { id: 'bench', name: 'Barbell Bench Press', muscle: 'Chest · Strength', prescribedSets: 3, targetReps: 8 },
      { id: 'incline-db', name: 'Incline Dumbbell Press', muscle: 'Chest · Power', prescribedSets: 3, targetReps: 10 },
      { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders · Strength', prescribedSets: 3, targetReps: 8 },
    ],
  },
  {
    id: 'pull',
    name: 'Pull Day',
    subtitle: 'Back · Biceps · Rear Delts',
    estimatedMinutes: 55,
    exercises: [
      { id: 'row', name: 'Barbell Row', muscle: 'Back · Strength', prescribedSets: 3, targetReps: 8 },
    ],
  },
  {
    id: 'legs',
    name: 'Leg Day',
    subtitle: 'Quads · Hamstrings · Glutes',
    estimatedMinutes: 60,
    exercises: [
      { id: 'squat', name: 'Back Squat', muscle: 'Legs · Strength', prescribedSets: 3, targetReps: 6 },
    ],
  },
  { id: 'run', name: 'Endurance Run', subtitle: 'Stamina · Conditioning', estimatedMinutes: 35, exercises: [] },
  { id: 'recovery', name: 'Recovery Protocol', subtitle: 'Mobility · Recovery · Reset', estimatedMinutes: 20, exercises: [] },
];

// Catalog only. Unlock state and requirements are derived from the progression ledger.
export const armory = [
  { name: 'Iron Initiate', kind: 'Badge', symbol: 'I' },
  { name: 'The Relentless', kind: 'Title', symbol: 'R' },
  { name: 'The Restored', kind: 'Title', symbol: 'V' },
  { name: 'Forged Helm', kind: 'Head', symbol: 'H' },
  { name: 'Titan Plate', kind: 'Chest', symbol: 'T' },
  { name: 'Roadrunner Greaves', kind: 'Legs', symbol: 'G' },
  { name: 'Ember Aura', kind: 'Aura', symbol: 'E' },
];
