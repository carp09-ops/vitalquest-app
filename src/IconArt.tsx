import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useVitalTheme } from './ThemeProvider';

export type VQIconName =
  | 'strength'
  | 'stamina'
  | 'agility'
  | 'xp'
  | 'quest'
  | 'armory'
  | 'trophy'
  | 'streak';

const GLYPH: Record<VQIconName, string> = {
  strength: 'S',
  stamina: 'E',
  agility: 'A',
  xp: 'XP',
  quest: 'Q',
  armory: 'AR',
  trophy: 'H',
  streak: 'D',
};

export function IconArt({ name, size = 40, opacity = 1 }: { name: VQIconName; size?: number; opacity?: number }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const fontSize = name === 'xp' || name === 'armory' ? size * .24 : size * .31;
  return (
    <View
      style={[
        styles.shell,
        {
          width: size,
          height: size,
          borderRadius: Math.max(9, size * .28),
          borderColor: `${t.text}1F`,
          backgroundColor: t.surfaceElevated,
          opacity,
        },
      ]}
    >
      <View style={[styles.mark, { backgroundColor: t.accent }]} />
      <Text style={[styles.glyph, { color: t.text, fontSize }]}>{GLYPH[name]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  mark: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, opacity: .9 },
  glyph: { fontWeight: '900', letterSpacing: .2 },
});
