import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { APP_BASE } from './artAssets';

export type VQIconName =
  | 'strength'
  | 'stamina'
  | 'agility'
  | 'xp'
  | 'quest'
  | 'armory'
  | 'trophy'
  | 'streak';

const ICON_URI: Record<VQIconName, string> = {
  strength: `${APP_BASE}/art/icons/icon-strength.webp`,
  stamina: `${APP_BASE}/art/icons/icon-stamina.webp`,
  agility: `${APP_BASE}/art/icons/icon-agility.webp`,
  xp: `${APP_BASE}/art/icons/icon-xp.webp`,
  quest: `${APP_BASE}/art/icons/icon-quest.webp`,
  armory: `${APP_BASE}/art/icons/icon-armory.webp`,
  trophy: `${APP_BASE}/art/icons/icon-trophy.webp`,
  streak: `${APP_BASE}/art/icons/icon-streak.webp`,
};

export function IconArt({
  name,
  size = 40,
  opacity = 1,
}: {
  name: VQIconName;
  size?: number;
  opacity?: number;
  tint?: string;
  quiet?: boolean;
}) {
  const radius = Math.max(10, size * .29);
  return (
    <View
      style={[
        styles.frame,
        {
          width: size,
          height: size,
          borderRadius: radius,
          opacity,
        },
        Platform.OS === 'web'
          ? ({ boxShadow: `inset 0 1px 0 rgba(255,255,255,.06), 0 8px 22px rgba(0,0,0,.35)` } as any)
          : null,
      ]}
    >
      <Image
        source={{ uri: ICON_URI[name] }}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.09)',
    overflow: 'hidden',
    backgroundColor: '#0B0E13',
  },
});
