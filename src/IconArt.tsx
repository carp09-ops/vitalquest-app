import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
  strength: '≋',
  stamina: '∞',
  agility: '⌁',
  xp: '✦',
  quest: '◇',
  armory: '⬢',
  trophy: '♛',
  streak: '△',
};

export function IconArt({
  name,
  size = 40,
  opacity = 1,
  tint,
  quiet = false,
}: {
  name: VQIconName;
  size?: number;
  opacity?: number;
  tint?: string;
  quiet?: boolean;
}) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const accent = tint ?? t.accent;
  const fontSize = name === 'xp' ? size * .48 : name === 'stamina' ? size * .43 : size * .39;
  return (
    <View
      style={[
        styles.shell,
        {
          width: size,
          height: size,
          borderRadius: Math.max(10, size * .29),
          borderColor: quiet ? `${t.text}14` : `${accent}45`,
          backgroundColor: quiet ? `${t.surfaceElevated}B8` : `${t.surfaceElevated}F2`,
          opacity,
        },
        Platform.OS === 'web' && !quiet ? ({ boxShadow: `inset 0 1px 0 rgba(255,255,255,.05), 0 8px 22px rgba(0,0,0,.18)` } as any) : null,
      ]}
    >
      <View style={[styles.innerRing,{borderColor:`${accent}22`}]} />
      <Text style={[styles.glyph, { color: accent, fontSize }]}>{GLYPH[name]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  innerRing: { position:'absolute',left:5,right:5,top:5,bottom:5,borderWidth:1,borderRadius:999 },
  glyph: { fontWeight: '700', textAlign:'center', lineHeight: undefined },
});
