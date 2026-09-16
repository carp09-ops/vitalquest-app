import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useVitalTheme } from './ThemeProvider';

type Scene = 'today' | 'train' | 'quests' | 'armory' | 'hero';

export default function WorldBackdrop({ scene, children }: PropsWithChildren<{ scene: Scene }>) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    reveal.setValue(0);
    Animated.timing(reveal, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [scene, reveal]);

  return (
    <View style={[styles.root, { backgroundColor: t.background }]}> 
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.topWash, { backgroundColor: `${t.accent}0D` }]} />
        <View style={[styles.gridLine, styles.gridLineOne, { backgroundColor: `${t.text}08` }]} />
        <View style={[styles.gridLine, styles.gridLineTwo, { backgroundColor: `${t.text}06` }]} />
        <View style={[styles.bottomShade, { backgroundColor: t.navBackground }]} />
      </View>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: reveal,
            transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }],
          },
          Platform.OS === 'web' ? ({ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,.018), transparent 18%)' } as any) : null,
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
  topWash: { position: 'absolute', top: -120, left: '18%', right: '18%', height: 280, borderRadius: 220 },
  gridLine: { position: 'absolute', left: 18, right: 18, height: 1 },
  gridLineOne: { top: 118 },
  gridLineTwo: { top: 208 },
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, opacity: .28 },
});
