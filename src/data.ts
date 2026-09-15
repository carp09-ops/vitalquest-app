export type ExerciseTemplate = {
  id: string;
  name: string;
  muscle: string;
  previous: Array<{ weight: number; reps: number }>;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  estimatedMinutes: number;
  exercises: ExerciseTemplate[];
};

export const templates: WorkoutTemplate[] = [
  {
    id: 'push', name: 'Push Day', subtitle: 'Chest · Shoulders · Triceps', icon: '⚔', estimatedMinutes: 55,
    exercises: [
      { id: 'bench', name: 'Barbell Bench Press', muscle: 'Chest · Strength', previous: [{ weight: 225, reps: 8 }, { weight: 225, reps: 8 }, { weight: 225, reps: 7 }] },
      { id: 'incline-db', name: 'Incline Dumbbell Press', muscle: 'Chest · Power', previous: [{ weight: 75, reps: 10 }, { weight: 75, reps: 10 }, { weight: 75, reps: 9 }] },
      { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders · Strength', previous: [{ weight: 115, reps: 8 }, { weight: 115, reps: 8 }, { weight: 115, reps: 7 }] },
    ],
  },
  {
    id: 'pull', name: 'Pull Day', subtitle: 'Back · Biceps · Rear Delts', icon: '🛡', estimatedMinutes: 55,
    exercises: [{ id: 'row', name: 'Barbell Row', muscle: 'Back · Strength', previous: [{ weight: 185, reps: 8 }, { weight: 185, reps: 8 }, { weight: 185, reps: 8 }] }],
  },
  {
    id: 'legs', name: 'Leg Day', subtitle: 'Quads · Hamstrings · Glutes', icon: '◆', estimatedMinutes: 60,
    exercises: [{ id: 'squat', name: 'Back Squat', muscle: 'Legs · Strength', previous: [{ weight: 275, reps: 6 }, { weight: 275, reps: 6 }, { weight: 275, reps: 5 }] }],
  },
  { id: 'run', name: 'Endurance Run', subtitle: 'Stamina · Conditioning', icon: '➤', estimatedMinutes: 35, exercises: [] },
  { id: 'recovery', name: 'Recovery Protocol', subtitle: 'Mobility · Recovery · Reset', icon: '◌', estimatedMinutes: 20, exercises: [] },
];

export const quests = [
  { title: 'Iron Week', description: 'Complete 3 resistance workouts this week.', progress: 2, target: 3, reward: '+300 XP' },
  { title: 'Five-Ton Trial', description: 'Accumulate 10,000 lb of lifting volume.', progress: 7420, target: 10000, reward: 'Iron Initiate' },
  { title: 'The Long Road', description: 'Cover 15 running miles.', progress: 6.8, target: 15, reward: '+250 Stamina XP' },
];

export const armory = [
  { name: 'Iron Initiate', kind: 'Badge', state: 'unlocked', symbol: 'I' },
  { name: 'The Relentless', kind: 'Title', state: 'unlocked', symbol: 'R' },
  { name: 'Forged Helm', kind: 'Head', state: 'progress', symbol: 'H' },
  { name: 'Titan Plate', kind: 'Chest', state: 'locked', symbol: 'T' },
  { name: 'Roadrunner Greaves', kind: 'Legs', state: 'locked', symbol: 'G' },
  { name: 'Ember Aura', kind: 'Aura', state: 'locked', symbol: 'E' },
];
