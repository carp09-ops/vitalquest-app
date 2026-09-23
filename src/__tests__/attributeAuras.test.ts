import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_AURA, attributeKeys, auraOpacityForTier } from '../attributeAuras';

const HEX = /^#[0-9A-Fa-f]{6}$/;

describe('attributeAuras', () => {
  it('covers all five attributes', () => {
    expect(attributeKeys()).toEqual(['strength', 'stamina', 'agility', 'vitality', 'discipline']);
    for (const key of attributeKeys()) {
      expect(ATTRIBUTE_AURA[key]).toBeDefined();
    }
  });

  it('gives every attribute a valid aura color, grade wash, and label', () => {
    for (const key of attributeKeys()) {
      const aura = ATTRIBUTE_AURA[key];
      expect(aura.aura).toMatch(HEX);
      expect(aura.grade).toMatch(/^rgba\(/);
      expect(aura.ascendantLabel).toContain(key.toUpperCase());
    }
  });

  it('gives every attribute a distinct aura color', () => {
    const colors = attributeKeys().map((k) => ATTRIBUTE_AURA[k].aura);
    expect(new Set(colors).size).toBe(colors.length);
  });

  it('scales aura opacity up with tier, clamped to 1..5', () => {
    const t1 = auraOpacityForTier(1);
    const t3 = auraOpacityForTier(3);
    const t5 = auraOpacityForTier(5);
    expect(t1).toBeLessThan(t3);
    expect(t3).toBeLessThan(t5);
    expect(auraOpacityForTier(0)).toBe(t1);
    expect(auraOpacityForTier(99)).toBe(t5);
    expect(t5).toBeLessThanOrEqual(1);
  });
});
