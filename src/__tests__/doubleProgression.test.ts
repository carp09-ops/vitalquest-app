import { describe, expect, it } from 'vitest';
import { planDoubleProgression, repRangeFor } from '../doubleProgression';
import { EXERCISE_CATALOG } from '../trainingPreferences';
import { generateWorkoutPlan } from '../workoutGenerator';

const bench = EXERCISE_CATALOG.find((e) => e.id === 'bench')!;
const pushup = EXERCISE_CATALOG.find((e) => e.id === 'pushup')!;

describe('repRangeFor', () => {
  it('builds a ±2 range around default reps', () => {
    expect(repRangeFor(bench)).toEqual({ low: 6, high: 10 });
    expect(repRangeFor(pushup)).toEqual({ low: 10, high: 14 });
  });
});

describe('planDoubleProgression', () => {
  it('returns START when there is no history', () => {
    const plan = planDoubleProgression({ exercise: bench, last: null });
    expect(plan.action).toBe('START');
    expect(plan.weight).toBe(0);
  });

  it('adds load when every set hits the top of the range', () => {
    const plan = planDoubleProgression({
      exercise: bench,
      last: { weight: 185, reps: [10, 10, 10], avgRpe: 8, sessionAt: null },
    });
    expect(plan.action).toBe('PROGRESS');
    expect(plan.weight).toBe(190);
    expect(plan.note).toContain('adding 5 lb');
  });

  it('consolidates instead of jumping when RPE is 9+', () => {
    const plan = planDoubleProgression({
      exercise: bench,
      last: { weight: 185, reps: [10, 10, 10], avgRpe: 9.5, sessionAt: null },
    });
    expect(plan.action).toBe('CONSOLIDATE');
    expect(plan.weight).toBe(185);
  });

  it('repeats the load mid-range', () => {
    const plan = planDoubleProgression({
      exercise: bench,
      last: { weight: 185, reps: [9, 8, 8], avgRpe: 8, sessionAt: null },
    });
    expect(plan.action).toBe('REPEAT');
    expect(plan.weight).toBe(185);
  });

  it('backs off when reps fall below the range', () => {
    const plan = planDoubleProgression({
      exercise: bench,
      last: { weight: 185, reps: [8, 5, 5], avgRpe: 9, sessionAt: null },
    });
    expect(plan.action).toBe('BACK_OFF');
    expect(plan.weight).toBe(180);
  });

  it('progresses bodyweight moves by reps, not load', () => {
    const plan = planDoubleProgression({
      exercise: pushup,
      last: { weight: 0, reps: [14, 14, 14], avgRpe: 7, sessionAt: null },
    });
    expect(plan.action).toBe('START'); // weight 0 → no baseline yet
    const withWeight = planDoubleProgression({
      exercise: { ...pushup, loadIncrement: 0 },
      last: { weight: 1, reps: [14, 14, 14], avgRpe: 7, sessionAt: null },
    });
    expect(withWeight.action).toBe('PROGRESS');
    expect(withWeight.note).toContain('add reps');
  });
});

describe('superset pairing', () => {
  it('pairs consecutive accessories and keeps compounds solo', () => {
    const snapshot: any = {
      strengthXP: 100, staminaXP: 10, agilityXP: 10, workoutCount: 1,
      resistanceWorkoutCount: 1, thisWeekResistanceWorkouts: 1,
      thisWeekRecoverySessions: 0, streakDays: 3,
    };
    const plan = generateWorkoutPlan({
      targetXP: 200, focus: 'upper', snapshot,
      equipment: ['barbell', 'dumbbells', 'bench', 'cables', 'pullup', 'bodyweight'],
    });
    const grouped = plan.exercises.filter((e) => e.supersetGroup);
    // groups come in pairs sharing a letter
    const letters = grouped.map((e) => e.supersetGroup);
    for (const letter of new Set(letters)) {
      expect(letters.filter((l) => l === letter).length).toBe(2);
    }
    // no compound is ever grouped
    const catalog = new Map(EXERCISE_CATALOG.map((e) => [e.id, e]));
    for (const e of grouped) {
      expect(catalog.get(e.id)?.compound).toBe(false);
    }
  });
});
