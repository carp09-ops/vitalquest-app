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

// VitalQuest V2 uses one product shell. Legacy theme IDs remain temporarily so
// older persisted preferences and screens continue to work while hero archetypes
// replace full-app skins.
const shell = {
  background: '#0B0D10',
  surface: '#12161B',
  surfaceElevated: '#1A2027',
  border: '#2A3440',
  text: '#F3F5F7',
  muted: '#8792A0',
  accent: '#8FB7D8',
  accentSoft: '#49667F',
  secondary: '#AEB8C3',
  positive: '#4FC38A',
  danger: '#D86B6B',
  strength: '#D97A70',
  stamina: '#65CDA0',
  agility: '#70AFE3',
  power: '#A58BD2',
  discipline: '#D7B767',
  navBackground: '#0D1116',
  heroSurface: '#171D24',
} as const;

export const themes: Record<ThemeId, VitalTheme> = {
  mythicForge: { id: 'mythicForge', name: 'VitalQuest', tagline: 'Real effort. Visible growth.', flavor: 'Unified shell', tokens: { ...shell } },
  celestialPulse: { id: 'celestialPulse', name: 'VitalQuest', tagline: 'Real effort. Visible growth.', flavor: 'Unified shell', tokens: { ...shell } },
  titanCore: { id: 'titanCore', name: 'VitalQuest', tagline: 'Real effort. Visible growth.', flavor: 'Unified shell', tokens: { ...shell } },
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
