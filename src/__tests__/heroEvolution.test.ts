import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTE_TIER_TITLES,
  attributeTierForXP,
  deriveHeroEvolution,
  detectAttributeTierUps,
  type HeroAttribute,
} from '../heroEvolution';
import type { ProgressionSnapshot } from '../progression';

const snapshotFor = (overrides: Partial<ProgressionSnapshot> = {}): ProgressionSnapshot =>
  ({
    level: 6,
    strengthXP: 0,
    staminaXP: 0,
    agilityXP: 0,
    vitalityXP: 0,
    disciplineXP: 0,
    ...overrides,
  }) as ProgressionSnapshot;

const beforeAll = (overrides: Partial<Record<HeroAttribute, number>> = {}): Record<HeroAttribute, number> => ({
  strength: 0,
  stamina: 0,
  agility: 0,
  vitality: 0,
  discipline: 0,
  ...overrides,
});

describe('attributeTierForXP', () => {
  it.each([
    [0, 1],
    [99, 1],
    [100, 2],
    [249, 2],
    [250, 3],
    [499, 3],
    [500, 4],
    [899, 4],
    [900, 5],
    [5000, 5],
  ])('xp %i maps to tier %i', (xp, tier) => {
    expect(attributeTierForXP(xp)).toBe(tier);
  });
});

describe('ATTRIBUTE_TIER_TITLES', () => {
  it('names all five tiers for every attribute', () => {
    const attrs: HeroAttribute[] = ['strength', 'stamina', 'agility', 'vitality', 'discipline'];
    for (const attr of attrs) {
      expect(ATTRIBUTE_TIER_TITLES[attr]).toHaveLength(5);
      for (const title of ATTRIBUTE_TIER_TITLES[attr]) {
        expect(title.length).toBeGreaterThan(0);
      }
    }
  });

  it('surfaces the tier title through deriveHeroEvolution', () => {
    const hero = deriveHeroEvolution(snapshotFor({ strengthXP: 300 }), 'spartan');
    expect(hero.attributes.strength.tier).toBe(3);
    expect(hero.attributes.strength.tierTitle).toBe('Powerful');
    const maxed = deriveHeroEvolution(snapshotFor({ disciplineXP: 1200 }), 'mystic');
    expect(maxed.attributes.discipline.tier).toBe(5);
    expect(maxed.attributes.discipline.tierTitle).toBe('Legendary');
    expect(maxed.attributes.discipline.nextThreshold).toBeNull();
  });
});

describe('detectAttributeTierUps', () => {
  it('detects a single tier crossing', () => {
    const ups = detectAttributeTierUps(beforeAll({ strength: 90 }), [{ attribute: 'strength', amount: 20 }]);
    expect(ups).toEqual([{ attribute: 'strength', fromTier: 1, toTier: 2, title: 'Conditioned' }]);
  });

  it('returns nothing when no threshold is crossed', () => {
    expect(detectAttributeTierUps(beforeAll({ strength: 90 }), [{ attribute: 'strength', amount: 5 }])).toEqual([]);
    expect(detectAttributeTierUps(beforeAll({ strength: 300 }), [{ attribute: 'strength', amount: 50 }])).toEqual([]);
  });

  it('detects multi-tier jumps', () => {
    const ups = detectAttributeTierUps(beforeAll({ agility: 0 }), [{ attribute: 'agility', amount: 600 }]);
    expect(ups).toEqual([{ attribute: 'agility', fromTier: 1, toTier: 4, title: 'Elusive' }]);
  });

  it('handles several attributes at once', () => {
    const ups = detectAttributeTierUps(beforeAll({ strength: 95, stamina: 10 }), [
      { attribute: 'strength', amount: 10 },
      { attribute: 'stamina', amount: 5 },
    ]);
    expect(ups).toHaveLength(1);
    expect(ups[0].attribute).toBe('strength');
  });

  it('ignores unknown attributes and non-positive gains', () => {
    expect(
      detectAttributeTierUps(beforeAll(), [
        { attribute: 'charisma', amount: 500 },
        { attribute: 'strength', amount: 0 },
        { attribute: 'stamina', amount: -10 },
      ]),
    ).toEqual([]);
  });
});
