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
      background: '#0B0F14',
      surface: '#121820',
      surfaceElevated: '#1A232E',
      border: '#2B3542',
      text: '#F3EBDD',
      muted: '#9DA3A8',
      accent: '#D6A04C',
      accentSoft: '#6A512D',
      secondary: '#B85B4B',
      positive: '#5F7C73',
      danger: '#C85E5E',
      strength: '#B85B4B',
      stamina: '#5F7C73',
      agility: '#6F8FAE',
      power: '#A77AC2',
      discipline: '#D6A04C',
      navBackground: '#0A0E13',
      heroSurface: '#17130E',
    },
  },
  celestialPulse: {
    id: 'celestialPulse',
    name: 'Celestial Pulse',
    tagline: 'Precision training under a cosmic horizon.',
    flavor: 'Eclipse glow · glass HUD · star-map light',
    tokens: {
      background: '#0D1321',
      surface: '#121D2C',
      surfaceElevated: '#1D3557',
      border: '#294561',
      text: '#D9E3F0',
      muted: '#8FA5BB',
      accent: '#F2B950',
      accentSoft: '#6D542A',
      secondary: '#49A7A3',
      positive: '#49A7A3',
      danger: '#E76F51',
      strength: '#E76F51',
      stamina: '#49A7A3',
      agility: '#6FA8DC',
      power: '#B28ADB',
      discipline: '#F2B950',
      navBackground: '#09111D',
      heroSurface: '#112338',
    },
  },
  titanCore: {
    id: 'titanCore',
    name: 'Titan Core',
    tagline: 'Built for power. Measured with purpose.',
    flavor: 'Carbon · crimson iron · engineered performance',
    tokens: {
      background: '#0A0A0B',
      surface: '#15171A',
      surfaceElevated: '#23262D',
      border: '#343943',
      text: '#EDE7DA',
      muted: '#9B9B97',
      accent: '#9F3E44',
      accentSoft: '#5A282C',
      secondary: '#9ACD32',
      positive: '#9ACD32',
      danger: '#C34C53',
      strength: '#9F3E44',
      stamina: '#9ACD32',
      agility: '#5C7EA6',
      power: '#D47B3F',
      discipline: '#E0B84D',
      navBackground: '#09090A',
      heroSurface: '#171717',
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
