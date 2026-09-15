import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { VQ_ICON_SPRITE } from './vqSprite';

export type VQIconName =
  | 'strength'
  | 'stamina'
  | 'agility'
  | 'xp'
  | 'quest'
  | 'armory'
  | 'trophy'
  | 'streak';

const INDEX: Record<VQIconName, number> = {
  strength: 0,
  stamina: 1,
  agility: 2,
  xp: 3,
  quest: 4,
  armory: 5,
  trophy: 6,
  streak: 7,
};

export function IconArt({
  name,
  size = 40,
  opacity = 1,
}: {
  name: VQIconName;
  size?: number;
  opacity?: number;
}) {
  const index = INDEX[name];
  return (
    <View style={[styles.crop, { width: size, height: size, borderRadius: size / 2, opacity }]}>
      <Image
        source={{ uri: VQ_ICON_SPRITE }}
        resizeMode="stretch"
        style={{
          position: 'absolute',
          left: -index * size,
          top: 0,
          width: size * 8,
          height: size,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  crop: {
    overflow: 'hidden',
  },
});
