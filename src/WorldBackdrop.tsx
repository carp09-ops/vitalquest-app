import React, { PropsWithChildren } from 'react';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { ART } from './artAssets';
import { ThemeId } from './theme';
import { useVitalTheme } from './ThemeProvider';

type Scene = 'today' | 'train' | 'quests' | 'armory' | 'hero';

const WORLD_ART: Record<ThemeId, string> = {
  mythicForge: ART.worlds.mythicForge,
  celestialPulse: ART.worlds.celestialPulse,
  titanCore: ART.worlds.titanCore,
};

function artFor(scene: Scene, themeId: ThemeId) {
  if (themeId !== 'mythicForge') return WORLD_ART[themeId];
  if (scene === 'train') return ART.training;
  if (scene === 'quests') return ART.quest;
  if (scene === 'hero') return ART.hero.mythicForge;
  return ART.worlds.mythicForge;
}

export default function WorldBackdrop({ scene, children }: PropsWithChildren<{ scene: Scene }>) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const image = artFor(scene, themeId as ThemeId);

  return (
    <View style={[styles.root, { backgroundColor: t.navBackground }]}> 
      <ImageBackground
        source={{ uri: image }}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        imageStyle={styles.image}
        pointerEvents="none"
      >
        <View style={styles.topVignette} />
        <View style={styles.centerClear} />
        <View style={[styles.bottomVignette, { backgroundColor: t.navBackground }]} />
        <View style={[styles.tint, { backgroundColor: t.navBackground }]} />
      </ImageBackground>
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          { borderColor: `${t.accent}22` },
          Platform.OS === 'web' ? ({ boxShadow: `0 0 110px ${t.accent}18` } as any) : null,
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  content: { flex: 1 },
  image: { opacity: 0.82 },
  tint: { ...StyleSheet.absoluteFillObject, opacity: 0.28 },
  topVignette: {
    position: 'absolute', left: 0, right: 0, top: 0, height: 150,
    backgroundColor: 'rgba(0,0,0,.48)',
  },
  centerClear: {
    position: 'absolute', left: '8%', right: '8%', top: '16%', height: '44%',
    borderRadius: 140, backgroundColor: 'rgba(255,255,255,.025)',
  },
  bottomVignette: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 210, opacity: 0.88,
  },
  glow: {
    position: 'absolute', left: '18%', right: '18%', top: 18, height: 220,
    borderRadius: 180, borderWidth: 1, opacity: 0.7,
  },
});
