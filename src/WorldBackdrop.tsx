import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useVitalTheme } from './ThemeProvider';
import { useHeroArchetype } from './useHeroArchetype';
import WorldArt from './WorldArt';

type Scene = 'today' | 'train' | 'quests' | 'armory' | 'hero';

const WORLD_ATMOSPHERE = {
  mystic: {
    veil: 'rgba(12,10,30,.14)',
    glow: 'rgba(104,82,174,.10)',
  },
  athlete: {
    veil: 'rgba(4,12,18,.10)',
    glow: 'rgba(79,158,196,.08)',
  },
  spartan: {
    veil: 'rgba(24,10,4,.14)',
    glow: 'rgba(181,104,38,.10)',
  },
} as const;

export default function WorldBackdrop({ scene, children }: PropsWithChildren<{ scene: Scene }>) {
  const { theme } = useVitalTheme();
  const { archetype } = useHeroArchetype();
  const t = theme.tokens;
  const reveal = useRef(new Animated.Value(0)).current;
  const atmosphere = WORLD_ATMOSPHERE[archetype] ?? WORLD_ATMOSPHERE.athlete;

  useEffect(() => {
    reveal.setValue(0);
    Animated.timing(reveal, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [scene, reveal]);

  return (
    <View style={[styles.root, { backgroundColor: t.background }]}> 
      <WorldArt archetype={archetype} strength={scene==='hero'?'medium':'soft'} position="top" />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.worldVeil,{backgroundColor:atmosphere.veil}]} />
        <View style={[styles.worldGlow,{backgroundColor:atmosphere.glow}]} />
        <View style={styles.readabilityVeil} />
        <View style={[styles.bottomShade, { backgroundColor: t.navBackground }]} />
      </View>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: reveal,
            transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }],
          },
          Platform.OS === 'web' ? ({ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,.012), transparent 18%)' } as any) : null,
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
  worldVeil:{...StyleSheet.absoluteFillObject},
  worldGlow:{position:'absolute',left:'8%',right:'8%',top:'4%',height:'34%',borderRadius:999},
  readabilityVeil:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(4,7,10,.20)'},
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, opacity: .24 },
});
