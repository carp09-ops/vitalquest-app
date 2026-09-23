import { describe, expect, it } from 'vitest';
import { buildLegendTimeline, formatLegendDate, type LegendInput } from '../legend';

function input(overrides: Partial<LegendInput> = {}): LegendInput {
  return {
    xpEvents: [
      { created_at: '2026-01-05T10:00:00', amount: 120 },
      { created_at: '2026-02-10T10:00:00', amount: 400 },
    ],
    attributeEvents: [
      { created_at: '2026-01-05T10:00:00', attribute: 'strength', amount: 120 },
    ],
    sessions: [
      { completed_at: '2026-01-05T10:00:00', name: 'First Trial', total_volume: 800 },
      { completed_at: '2026-02-10T10:00:00', name: 'Second Trial', total_volume: 900 },
    ],
    prs: [
      { completed_at: '2026-02-10T10:00:00', exercise_name: 'Bench Press', weight: 80, reps: 5 },
    ],
    ...overrides,
  };
}

describe('buildLegendTimeline', () => {
  it('always opens with the journey beginning when sessions exist', () => {
    const entries = buildLegendTimeline(input());
    const beginning = entries.find((e) => e.kind === 'beginning');
    expect(beginning).toBeDefined();
    expect(beginning!.title).toBe('THE JOURNEY BEGINS');
    expect(beginning!.detail).toContain('First Trial');
  });

  it('emits level-ups when cumulative XP crosses thresholds', () => {
    const entries = buildLegendTimeline(input({
      xpEvents: [{ created_at: '2026-01-05T10:00:00', amount: 600 }],
    }));
    const level2 = entries.find((e) => e.id === 'level-2');
    expect(level2).toBeDefined();
    expect(level2!.date).toBe('2026-01-05T10:00:00');
  });

  it('emits form ascensions instead of plain level-ups at form levels', () => {
    // cumulativeXpForLevel(5): push enough XP to cross level 5 in one event.
    const entries = buildLegendTimeline(input({
      xpEvents: [{ created_at: '2026-03-01T10:00:00', amount: 100000 }],
    }));
    const form = entries.find((e) => e.kind === 'form');
    expect(form).toBeDefined();
    expect(form!.title).toContain('FORM');
    expect(entries.find((e) => e.id === 'level-5')).toBeUndefined();
  });

  it('emits attribute tier-ups with the attribute accent color', () => {
    const entries = buildLegendTimeline(input({
      attributeEvents: [
        { created_at: '2026-01-05T10:00:00', attribute: 'strength', amount: 90 },
        { created_at: '2026-02-10T10:00:00', attribute: 'strength', amount: 30 },
      ],
    }));
    const tierUp = entries.find((e) => e.id === 'attr-strength-2');
    expect(tierUp).toBeDefined();
    expect(tierUp!.title).toContain('STRENGTH');
    expect(tierUp!.accent).toMatch(/^#/);
  });

  it('marks the first PR and session milestones', () => {
    const sessions = Array.from({ length: 10 }, (_, i) => ({
      completed_at: `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00`,
      name: `Trial ${i + 1}`,
      total_volume: 500,
    }));
    const entries = buildLegendTimeline(input({ sessions }));
    expect(entries.find((e) => e.id === 'pr-first')!.title).toBe('FIRST PERSONAL RECORD');
    expect(entries.find((e) => e.id === 'sessions-10')!.title).toBe('10 TRIALS COMPLETED');
  });

  it('detects the longest streak from session dates', () => {
    const sessions = Array.from({ length: 9 }, (_, i) => ({
      completed_at: `2026-04-${String(i + 1).padStart(2, '0')}T10:00:00`,
      name: `Trial ${i + 1}`,
      total_volume: 100,
    }));
    const entries = buildLegendTimeline(input({ sessions }));
    const streak = entries.find((e) => e.kind === 'streak');
    expect(streak).toBeDefined();
    expect(streak!.title).toBe('9-DAY STREAK');
  });

  it('returns entries newest-first and handles empty history', () => {
    const entries = buildLegendTimeline(input());
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1].date >= entries[i].date).toBe(true);
    }
    expect(buildLegendTimeline(input({ xpEvents: [], attributeEvents: [], sessions: [], prs: [] }))).toEqual([]);
  });
});

describe('formatLegendDate', () => {
  it('formats ISO dates as D MMM YYYY', () => {
    expect(formatLegendDate('2026-09-12T14:00:00')).toBe('12 SEP 2026');
    expect(formatLegendDate('not-a-date')).toBe('');
  });
});
