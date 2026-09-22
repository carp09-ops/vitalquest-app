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

export const archetypeMaterials: Record<HeroArchetype, {
  commandSurface:string;
  elevatedSurface:string;
  railSurface:string;
  edge:string;
  edgeStrong:string;
  glow:string;
  metal:string;
  motif:string;
  descriptor:string;
}> = {
  mystic:{
    commandSurface:'rgba(18,16,34,.84)',
    elevatedSurface:'rgba(30,24,50,.80)',
    railSurface:'rgba(17,20,34,.72)',
    edge:'rgba(196,181,253,.18)',
    edgeStrong:'rgba(34,211,238,.34)',
    glow:'rgba(34,211,238,.18)',
    metal:'#B8B4CE',
    motif:'ORBITAL',
    descriptor:'Luminous orbital glass and cool energy.'
  },
  athlete:{
    commandSurface:'rgba(9,22,30,.84)',
    elevatedSurface:'rgba(14,32,42,.80)',
    railSurface:'rgba(10,24,32,.73)',
    edge:'rgba(14,165,233,.22)',
    edgeStrong:'rgba(252,211,77,.30)',
    glow:'rgba(14,165,233,.18)',
    metal:'#CBD5E1',
    motif:'PERFORMANCE GRID',
    descriptor:'Technical performance surfaces and electric precision.'
  },
  spartan:{
    commandSurface:'rgba(28,15,14,.84)',
    elevatedSurface:'rgba(39,22,17,.80)',
    railSurface:'rgba(29,20,16,.73)',
    edge:'rgba(180,83,9,.24)',
    edgeStrong:'rgba(212,175,55,.34)',
    glow:'rgba(212,175,55,.16)',
    metal:'#D6C6AA',
    motif:'FORGED',
    descriptor:'Dark forged metal with bronze-gold restraint.'
  },
};

export const typography = {
  display: { letterSpacing: -0.8 },
  eyebrow: { letterSpacing: 1.6 },
  label: { letterSpacing: .8 },
} as const;

// Loaded via expo-font in app/_layout.tsx. Display = carved-fantasy serif for
// headlines; UI = grotesque for kickers, buttons and data labels.
export const fonts = {
  display: 'Cinzel_800ExtraBold',
  displayBold: 'Cinzel_700Bold',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemi: 'Inter_600SemiBold',
  uiBold: 'Inter_700Bold',
  uiBlack: 'Inter_800ExtraBold',
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

export function materialForArchetype(archetype: HeroArchetype) {
  return archetypeMaterials[archetype];
}
