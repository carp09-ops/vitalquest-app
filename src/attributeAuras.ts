import type { HeroAttribute } from './heroEvolution';

export interface AttributeAura {
  /** Core glow color for the attribute's visual identity. */
  aura: string;
  /** Low-opacity color grade washed over the hero art. */
  grade: string;
  /** Label shown when this attribute is dominant, e.g. "STRENGTH ASCENDANT". */
  ascendantLabel: string;
}

export const ATTRIBUTE_AURA: Record<HeroAttribute, AttributeAura> = {
  strength:   { aura: '#FF6B35', grade: 'rgba(255,107,53,.15)',  ascendantLabel: 'STRENGTH ASCENDANT' },
  stamina:    { aura: '#4EA8FF', grade: 'rgba(78,168,255,.15)',  ascendantLabel: 'STAMINA ASCENDANT' },
  agility:    { aura: '#3EE6C4', grade: 'rgba(62,230,196,.15)',  ascendantLabel: 'AGILITY ASCENDANT' },
  vitality:   { aura: '#A8E635', grade: 'rgba(168,230,53,.14)',  ascendantLabel: 'VITALITY ASCENDANT' },
  discipline: { aura: '#B78CFF', grade: 'rgba(183,140,255,.15)', ascendantLabel: 'DISCIPLINE ASCENDANT' },
};

const ATTRIBUTES: HeroAttribute[] = ['strength', 'stamina', 'agility', 'vitality', 'discipline'];

/** Attribute keys in canonical order. */
export function attributeKeys(): HeroAttribute[] {
  return [...ATTRIBUTES];
}

/**
 * Aura opacity scales with the dominant attribute's tier so the hero
 * visibly intensifies as you pour XP into a category: tier 1 is a
 * whisper, tier 5 is a blaze.
 */
export function auraOpacityForTier(tier: number): number {
  const t = Math.max(1, Math.min(5, Math.round(tier)));
  return 0.2 + t * 0.06;
}
