import { describe, expect, it } from 'vitest';
import { CONDITIONING_STRUCTURES, hardMinutes, totalMinutes } from '../conditioning';

describe('conditioning structures', () => {
  it('ships the five expected structures', () => {
    expect(CONDITIONING_STRUCTURES.map((s) => s.id)).toEqual([
      'easy-aerobic',
      'intervals-3-2',
      'tempo-20',
      'progression-30',
      'fartlek-25',
    ]);
  });

  it('every structure has at least 3 segments', () => {
    for (const s of CONDITIONING_STRUCTURES) {
      expect(s.segments.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('totalMinutes matches the segment sum', () => {
    for (const s of CONDITIONING_STRUCTURES) {
      const sum = s.segments.reduce((acc, seg) => acc + seg.minutes, 0);
      expect(totalMinutes(s)).toBe(sum);
    }
  });

  it('totals match the advertised session lengths', () => {
    const byId = new Map(CONDITIONING_STRUCTURES.map((s) => [s.id, s]));
    expect(totalMinutes(byId.get('easy-aerobic')!)).toBe(35);
    expect(totalMinutes(byId.get('intervals-3-2')!)).toBe(43);
    expect(totalMinutes(byId.get('tempo-20')!)).toBe(40);
    expect(totalMinutes(byId.get('progression-30')!)).toBe(30);
    expect(totalMinutes(byId.get('fartlek-25')!)).toBe(35);
  });

  it('the intervals structure has 6 hard segments of 3 minutes', () => {
    const intervals = CONDITIONING_STRUCTURES.find((s) => s.id === 'intervals-3-2')!;
    const hard = intervals.segments.filter((seg) => seg.intensity === 'hard');
    expect(hard).toHaveLength(6);
    expect(hard.every((seg) => seg.minutes === 3)).toBe(true);
  });

  it('hardMinutes sums only hard segments', () => {
    const byId = new Map(CONDITIONING_STRUCTURES.map((s) => [s.id, s]));
    expect(hardMinutes(byId.get('easy-aerobic')!)).toBe(0);
    expect(hardMinutes(byId.get('intervals-3-2')!)).toBe(18);
    expect(hardMinutes(byId.get('tempo-20')!)).toBe(0);
    expect(hardMinutes(byId.get('progression-30')!)).toBe(10);
    expect(hardMinutes(byId.get('fartlek-25')!)).toBe(8);
  });

  it('every segment has a non-empty label and note', () => {
    for (const s of CONDITIONING_STRUCTURES) {
      for (const seg of s.segments) {
        expect(seg.label.trim().length).toBeGreaterThan(0);
        expect(seg.note.trim().length).toBeGreaterThan(0);
        expect(seg.minutes).toBeGreaterThan(0);
      }
    }
  });
});
