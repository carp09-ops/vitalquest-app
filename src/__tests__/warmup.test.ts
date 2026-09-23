import { describe, expect, it } from 'vitest';
import { warmupRamp } from '../warmup';

describe('warmupRamp', () => {
  it('builds a 4-set ramp for 185, ending at 150x3', () => {
    const sets = warmupRamp(185);
    expect(sets).toHaveLength(4);
    expect(sets[0]).toMatchObject({ weight: 45, reps: 10, label: 'W1' });
    expect(sets[1]).toMatchObject({ weight: 75, reps: 8, label: 'W2' });
    expect(sets[2]).toMatchObject({ weight: 110, reps: 5, label: 'W3' });
    expect(sets[3]).toMatchObject({ weight: 150, reps: 3, label: 'W4' });
  });

  it('starts with the bar and dedupes for 95', () => {
    const sets = warmupRamp(95);
    expect(sets[0]).toMatchObject({ weight: 45, reps: 10 });
    expect(sets.length).toBeGreaterThan(1);
    expect(new Set(sets.map((s) => s.weight)).size).toBe(sets.length);
  });

  it('gives a single bar set under 95', () => {
    expect(warmupRamp(65)).toEqual([{ weight: 45, reps: 10, label: 'W1 · Bar × 10' }]);
  });

  it('never reaches the working weight', () => {
    for (const w of [100, 135, 205, 315]) {
      for (const s of warmupRamp(w)) expect(s.weight).toBeLessThan(w);
    }
  });

  it('rounds every ramp weight to a multiple of 5', () => {
    for (const s of warmupRamp(185)) expect(s.weight % 5).toBe(0);
  });

  it('respects a custom bar weight', () => {
    const sets = warmupRamp(140, { barWeight: 35 });
    expect(sets[0].weight).toBe(35);
  });
});
