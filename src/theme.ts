import { shellPalette } from './designSystem';

export type ThemeId = 'mythicForge' | 'celestialPulse' | 'titanCore';

export type VitalTheme = {
  id: ThemeId;
  name: string;
  tagline: string;
  flavor: string;
  tokens: {
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    secondary: string;
    positive: string;
    danger: string;
    strength: string;
    stamina: string;
    agility: string;
    power: string;
    discipline: string;
    navBackground: string;
    heroSurface: string;
  };
};

// One product shell. Archetype worlds now live behind translucent premium materials.
const shell = {
  background: 'rgba(8,10,13,.56)',
  surface: 'rgba(17,21,26,.76)',
  surfaceElevated: 'rgba(32,38,45,.72)',
  border: shellPalette.border,
  text: shellPalette.ivory,
  muted: shellPalette.steelLight,
  accent: shellPalette.champagne,
  accentSoft: '#70634F',
  secondary: shellPalette.cloud,
  positive: '#58C692',
  danger: '#E36D72',
  strength: '#E17970',
  stamina: '#66CDA3',
  agility: '#65AEE6',
  power: '#A58BD2',
  discipline: '#D6B65C',
  navBackground: 'rgba(8,10,13,.78)',
  heroSurface: 'rgba(23,28,34,.68)',
} as const;

export const themes: Record<ThemeId, VitalTheme> = {
  mythicForge: { id: 'mythicForge', name: 'VitalQuest', tagline: 'Train. Progress. Evolve.', flavor: 'Unified premium shell', tokens: { ...shell } },
  celestialPulse: { id: 'celestialPulse', name: 'VitalQuest', tagline: 'Train. Progress. Evolve.', flavor: 'Unified premium shell', tokens: { ...shell } },
  titanCore: { id: 'titanCore', name: 'VitalQuest', tagline: 'Train. Progress. Evolve.', flavor: 'Unified premium shell', tokens: { ...shell } },
};

export const defaultTheme = themes.mythicForge;

export const colors = {
  bg: defaultTheme.tokens.background,
  surface: defaultTheme.tokens.surface,
  surface2: defaultTheme.tokens.surfaceElevated,
  border: defaultTheme.tokens.border,
  text: defaultTheme.tokens.text,
  muted: defaultTheme.tokens.muted,
  gold: defaultTheme.tokens.accent,
  goldSoft: defaultTheme.tokens.accentSoft,
  strength: defaultTheme.tokens.strength,
  stamina: defaultTheme.tokens.stamina,
  agility: defaultTheme.tokens.agility,
  power: defaultTheme.tokens.power,
  discipline: defaultTheme.tokens.discipline,
  success: defaultTheme.tokens.positive,
  danger: defaultTheme.tokens.danger,
  white: '#FFFFFF',
};

export const radius = { sm: 10, md: 16, lg: 24, xl: 30, pill: 999 };
export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 44 };
