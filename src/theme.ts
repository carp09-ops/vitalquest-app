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

export const themes: Record<ThemeId, VitalTheme> = {
  mythicForge: {
    id: 'mythicForge',
    name: 'Mythic Forge',
    tagline: 'Forged in discipline. Rewarded like a legend.',
    flavor: 'Forged steel · dark stone · molten gold',
    tokens: {
      background: 'rgba(7,10,13,.68)',
      surface: 'rgba(15,20,26,.82)',
      surfaceElevated: 'rgba(26,35,46,.90)',
      border: 'rgba(183,133,59,.34)',
      text: '#F3EBDD',
      muted: '#A9A39A',
      accent: '#D6A04C',
      accentSoft: '#806232',
      secondary: '#B85B4B',
      positive: '#6E9A88',
      danger: '#C85E5E',
      strength: '#C96555',
      stamina: '#6E9A88',
      agility: '#7FA7C8',
      power: '#B58ACD',
      discipline: '#D6A04C',
      navBackground: '#080A0C',
      heroSurface: 'rgba(23,19,14,.88)',
    },
  },
  celestialPulse: {
    id: 'celestialPulse',
    name: 'Celestial Pulse',
    tagline: 'Precision training under a cosmic horizon.',
    flavor: 'Eclipse glow · glass HUD · star-map light',
    tokens: {
      background: 'rgba(6,12,23,.66)',
      surface: 'rgba(13,25,40,.80)',
      surfaceElevated: 'rgba(24,48,77,.88)',
      border: 'rgba(132,185,235,.32)',
      text: '#E9F2FC',
      muted: '#9DB2C8',
      accent: '#C7DEFF',
      accentSoft: '#557DA8',
      secondary: '#58C5C0',
      positive: '#58C5C0',
      danger: '#E76F51',
      strength: '#F28B78',
      stamina: '#58C5C0',
      agility: '#78BFF2',
      power: '#C5A0E7',
      discipline: '#F2C76B',
      navBackground: '#07101E',
      heroSurface: 'rgba(11,27,44,.88)',
    },
  },
  titanCore: {
    id: 'titanCore',
    name: 'Titan Core',
    tagline: 'Built for power. Measured with purpose.',
    flavor: 'Carbon · crimson iron · engineered performance',
    tokens: {
      background: 'rgba(3,8,11,.68)',
      surface: 'rgba(11,18,23,.82)',
      surfaceElevated: 'rgba(22,34,42,.90)',
      border: 'rgba(91,203,238,.30)',
      text: '#F0F8FA',
      muted: '#9AAFB8',
      accent: '#74D8F6',
      accentSoft: '#337F95',
      secondary: '#9ACD32',
      positive: '#9ACD32',
      danger: '#C34C53',
      strength: '#D95A61',
      stamina: '#9ACD32',
      agility: '#6EA2D7',
      power: '#E18A50',
      discipline: '#E0B84D',
      navBackground: '#040B0F',
      heroSurface: 'rgba(8,16,20,.90)',
    },
  },
};

export const defaultTheme = themes.mythicForge;

// Backward-compatible aliases while older screens are migrated to semantic tokens.
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

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
};
