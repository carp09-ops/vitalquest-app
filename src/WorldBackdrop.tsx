import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, ImageBackground, Platform, StyleSheet, View } from 'react-native';
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
  const reveal = useRef(new Animated.Value(0)).current;
  const ambient = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    reveal.setValue(0);
    Animated.timing(reveal, { toValue: 1, duration: 520, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ambient, { toValue: 0.72, duration: 2600, useNativeDriver: true }),
        Animated.timing(ambient, { toValue: 0.3, duration: 3200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scene, themeId, reveal, ambient]);

  return (
    <View style={[styles.root, { backgroundColor: t.navBackground }]}> 
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: reveal,
            transform: [{ scale: reveal.interpolate({ inputRange: [0, 1], outputRange: [1.035, 1] }) }],
          },
        ]}
      >
        <ImageBackground source={{ uri: image }} resizeMode="cover" style={StyleSheet.absoluteFill} imageStyle={styles.image}>
          <View style={styles.topVignette} />
          <View style={styles.centerClear} />
          <View style={[styles.bottomVignette, { backgroundColor: t.navBackground }]} />
          <View style={[styles.tint, { backgroundColor: t.navBackground }]} />
        </ImageBackground>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          { borderColor: `${t.accent}22`, opacity: ambient },
          Platform.OS === 'web' ? ({ boxShadow: `0 0 125px ${t.accent}22` } as any) : null,
        ]}
      />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: reveal,
            transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  content: { flex: 1 },
  image: { opacity: 0.86 },
  tint: { ...StyleSheet.absoluteFillObject, opacity: 0.24 },
  topVignette: {
    position: 'absolute', left: 0, right: 0, top: 0, height: 150,
    backgroundColor: 'rgba(0,0,0,.44)',
  },
  centerClear: {
    position: 'absolute', left: '7%', right: '7%', top: '14%', height: '48%',
    borderRadius: 150, backgroundColor: 'rgba(255,255,255,.018)',
  },
  bottomVignette: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 220, opacity: 0.9,
  },
  glow: {
    position: 'absolute', left: '17%', right: '17%', top: 10, height: 240,
    borderRadius: 180, borderWidth: 1,
  },
});
