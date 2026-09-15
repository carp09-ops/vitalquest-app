import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { ThemeId, themes, VitalTheme } from './theme';

type ThemeContextValue = {
  themeId: ThemeId;
  theme: VitalTheme;
  setThemeId: (themeId: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'vitalquest.theme';

function isThemeId(value: string | null): value is ThemeId {
  return value === 'mythicForge' || value === 'celestialPulse' || value === 'titanCore';
}

export function VitalThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>('mythicForge');

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isThemeId(stored)) setThemeIdState(stored);
  }, []);

  function setThemeId(next: ThemeId) {
    setThemeIdState(next);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }

  const value = useMemo(
    () => ({ themeId, theme: themes[themeId], setThemeId }),
    [themeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useVitalTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useVitalTheme must be used inside VitalThemeProvider');
  }
  return value;
}
