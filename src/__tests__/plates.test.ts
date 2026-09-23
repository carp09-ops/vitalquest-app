import { describe, expect, it } from 'vitest';
import { plateBreakdown, plateLabel } from '../plates';

describe('plateBreakdown', () => {
  it('loads 135 with a single 45 per side', () => {
    const b = plateBreakdown(135);
    expect(b.perSide).toEqual([45]);
    expect(b.actualWeight).toBe(135);
    expect(b.exact).toBe(true);
    expect(plateLabel(b)).toBe('45 per side');
  });

  it('loads 185 with 45 + 25 per side', () => {
    const b = plateBreakdown(185);
    expect(b.perSide).toEqual([45, 25]);
    expect(b.actualWeight).toBe(185);
    expect(b.exact).toBe(true);
  });

  it('loads 225 with two 45s per side', () => {
    const b = plateBreakdown(225);
    expect(b.perSide).toEqual([45, 45]);
    expect(b.exact).toBe(true);
  });

  it('reports inexact loads with the actual weight', () => {
    const b = plateBreakdown(137);
    expect(b.perSide).toEqual([45]);
    expect(b.actualWeight).toBe(135);
    expect(b.exact).toBe(false);
    expect(plateLabel(b)).toBe('45 per side (135 lb actual)');
  });

  it('handles the empty bar', () => {
    const b = plateBreakdown(45);
    expect(b.perSide).toEqual([]);
    expect(b.actualWeight).toBe(45);
    expect(b.exact).toBe(true);
    expect(plateLabel(b)).toBe('Bar only');
  });

  it('handles sub-bar targets as inexact bar-only', () => {
    const b = plateBreakdown(30);
    expect(b.perSide).toEqual([]);
    expect(b.actualWeight).toBe(45);
    expect(b.exact).toBe(false);
    expect(plateLabel(b)).toBe('Bar only');
  });

  it('guards NaN and negatives by treating them as the bar', () => {
    expect(plateBreakdown(NaN).actualWeight).toBe(45);
    expect(plateBreakdown(-50).perSide).toEqual([]);
    expect(plateBreakdown(-50).exact).toBe(true);
  });

  it('respects custom bars and plate sets', () => {
    const b = plateBreakdown(100, { barWeight: 20, availablePlates: [25, 20, 15, 10, 5] });
    expect(b.perSide).toEqual([25, 15]);
    expect(b.actualWeight).toBe(100);
    expect(b.exact).toBe(true);
  });
});
