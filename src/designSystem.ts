import type { HeroArchetype } from './heroEvolution';

export const shellPalette = {
  obsidian: '#080A0D',
  graphite: '#11151A',
  slate: '#20262D',
  steel: '#4B5563',
  steelLight: '#8A96A3',
  ivory: '#F4F1EA',
  cloud: '#CBD5E1',
  champagne: '#D9C6A1',
  border: 'rgba(203,213,225,.14)',
  borderStrong: 'rgba(203,213,225,.25)',
  glass: 'rgba(17,21,26,.88)',
  glassStrong: 'rgba(32,38,45,.94)',
} as const;

export const archetypePalettes: Record<HeroArchetype, {
  primary: string;
  secondary: string;
  highlight: string;
  soft: string;
  glow: string;
  name: string;
}> = {
  mystic: {
    name: 'Mystic',
    primary: '#7C3AED',
    secondary: '#22D3EE',
    highlight: '#C4B5FD',
    soft: 'rgba(124,58,237,.16)',
    glow: 'rgba(34,211,238,.24)',
  },
  athlete: {
    name: 'Athlete',
    primary: '#0EA5E9',
    secondary: '#F59E0B',
    highlight: '#FCD34D',
    soft: 'rgba(14,165,233,.15)',
    glow: 'rgba(14,165,233,.24)',
  },
  spartan: {
    name: 'Spartan',
    primary: '#DC2626',
    secondary: '#B45309',
    highlight: '#D4AF37',
    soft: 'rgba(220,38,38,.15)',
    glow: 'rgba(212,175,55,.22)',
  },
};

export const typography = {
  display: { letterSpacing: -0.8 },
  eyebrow: { letterSpacing: 1.6 },
  label: { letterSpacing: .8 },
} as const;

export const premiumRadius = {
  control: 12,
  card: 18,
  feature: 24,
  pill: 999,
} as const;

export function paletteForArchetype(archetype: HeroArchetype) {
  return archetypePalettes[archetype];
}
