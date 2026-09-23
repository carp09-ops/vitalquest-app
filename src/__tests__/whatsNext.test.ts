import { describe, expect, it } from 'vitest';
import { nextAttributeTier, paceLabelForDays, pickNextMilestone } from '../whatsNext';
import type { Milestone } from '../milestones';

function milestone(id: string, earned: boolean, progress?: number): Milestone {
  return {
    id, title: id.toUpperCase(), flavor: '', howTo: '', icon: 'trophy', accent: '#fff',
    earned, progress, progressLabel: '', remainingText: progress != null ? 'X TO GO' : undefined,
  };
}

describe('paceLabelForDays', () => {
  it('formats days, weeks, and months', () => {
    expect(paceLabelForDays(0)).toBe('AT YOUR PACE · DAYS AWAY');
    expect(paceLabelForDays(9)).toBe('AT YOUR PACE · ~9 DAYS');
    expect(paceLabelForDays(21)).toBe('AT YOUR PACE · ~3 WEEKS');
    expect(paceLabelForDays(90)).toBe('AT YOUR PACE · ~3 MONTHS');
  });
});

describe('pickNextMilestone', () => {
  it('picks the locked milestone with the highest progress', () => {
    const wall = [
      milestone('a', true, 1),
      milestone('b', false, 0.4),
      milestone('c', false, 0.85),
      milestone('d', false), // no progress info — skipped
    ];
    expect(pickNextMilestone(wall)?.id).toBe('c');
  });

  it('returns null when everything is earned', () => {
    expect(pickNextMilestone([milestone('a', true, 1)])).toBeNull();
  });
});

describe('nextAttributeTier', () => {
  it('picks the attribute closest to its next tier', () => {
    // thresholds: 0, 100, 250, 500, 900
    const next = nextAttributeTier({ strength: 240, stamina: 60, agility: 880 });
    expect(next?.attribute).toBe('strength'); // 10 XP to tier 3
    expect(next?.nextTier).toBe(3);
    expect(next?.xpRemaining).toBe(10);
  });

  it('skips maxed attributes and unknown keys', () => {
    const next = nextAttributeTier({ strength: 950, bogus: 10 });
    expect(next).toBeNull();
  });
});
