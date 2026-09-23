import { describe, expect, it } from 'vitest';
import { buildMilestones, type MilestoneContext } from '../milestones';
import type { LegendEntry } from '../legend';

function entry(id: string, date: string): LegendEntry {
  return { id, date, kind: 'level', title: id.toUpperCase(), detail: '' };
}

function ctx(overrides: Partial<MilestoneContext> = {}): MilestoneContext {
  return {
    level: 12, formTier: 2, maxAttributeTier: 3, sessionCount: 30,
    totalVolume: 12000, longestStreakDays: 12, ...overrides,
  };
}

describe('buildMilestones', () => {
  it('builds the full 13-milestone wall in curated order', () => {
    const wall = buildMilestones([], ctx());
    expect(wall).toHaveLength(13);
    expect(wall[0].id).toBe('first-steps');
    expect(wall[wall.length - 1].id).toBe('titan');
  });

  it('marks milestones earned when their legend entry exists, with dates', () => {
    const wall = buildMilestones(
      [entry('beginning', '2026-01-05T10:00:00'), entry('pr-first', '2026-02-01T10:00:00')],
      ctx(),
    );
    const first = wall.find((m) => m.id === 'first-steps')!;
    expect(first.earned).toBe(true);
    expect(first.date).toBe('2026-01-05T10:00:00');
    const pr = wall.find((m) => m.id === 'record-breaker')!;
    expect(pr.earned).toBe(true);
    expect(wall.find((m) => m.id === 'rising')!.earned).toBe(false);
  });

  it('detects form ascensions and the paragon attribute', () => {
    const wall = buildMilestones(
      [entry('form-5', '2026-03-01T10:00:00'), entry('attr-strength-5', '2026-04-01T10:00:00')],
      ctx(),
    );
    expect(wall.find((m) => m.id === 'ascension-2')!.earned).toBe(true);
    expect(wall.find((m) => m.id === 'ascension-3')!.earned).toBe(false);
    const paragon = wall.find((m) => m.id === 'paragon')!;
    expect(paragon.earned).toBe(true);
    expect(paragon.flavor).toContain('STRENGTH');
    expect(paragon.icon).toBe('strength');
  });

  it('shows progress on locked milestones', () => {
    const wall = buildMilestones([], ctx({ level: 7, sessionCount: 18, totalVolume: 9000, longestStreakDays: 9, maxAttributeTier: 2 }));
    const rising = wall.find((m) => m.id === 'rising')!;
    expect(rising.progress).toBeCloseTo(0.7);
    expect(rising.progressLabel).toBe('LEVEL 7 / 10');
    const dedicated = wall.find((m) => m.id === 'sessions-25')!;
    expect(dedicated.progress).toBeCloseTo(18 / 25);
    const unbroken = wall.find((m) => m.id === 'unbroken')!;
    expect(unbroken.progress).toBeCloseTo(9 / 30);
    const titan = wall.find((m) => m.id === 'titan')!;
    expect(titan.progress).toBeCloseTo(9000 / 25000);
  });

  it('earns the streak milestone from context and dates it from the legend', () => {
    const wall = buildMilestones(
      [{ ...entry('streak-best', '2026-05-20T10:00:00'), kind: 'streak' as const }],
      ctx({ longestStreakDays: 34 }),
    );
    const unbroken = wall.find((m) => m.id === 'unbroken')!;
    expect(unbroken.earned).toBe(true);
    expect(unbroken.date).toBe('2026-05-20T10:00:00');
  });
});
