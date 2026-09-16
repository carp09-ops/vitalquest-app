import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { IconArt, VQIconName } from '../../src/IconArt';
import { useVitalTheme } from '../../src/ThemeProvider';
import { useHeroArchetype } from '../../src/useHeroArchetype';
import { paletteForArchetype } from '../../src/designSystem';

const NAV: Record<string, VQIconName> = {
  index: 'xp',
  train: 'strength',
  quests: 'quest',
  armory: 'armory',
  hero: 'trophy',
};

function NavIcon({ name, focused, accent }: { name: keyof typeof NAV; focused: boolean; accent: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.iconShell, focused && { backgroundColor: `${accent}14`, borderColor: `${accent}52` }]}>
      <IconArt name={NAV[name]} size={34} opacity={focused ? 1 : .54} tint={focused ? accent : t.muted} quiet={!focused} />
      {focused ? <View style={[styles.activePip, { backgroundColor: accent }]} /> : null}
    </View>
  );
}

export default function TabLayout() {
  const { theme } = useVitalTheme();
  const { archetype } = useHeroArchetype();
  const t = theme.tokens;
  const accent = paletteForArchetype(archetype).primary;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: t.navBackground, borderColor: `${t.text}18` },
          Platform.OS === 'web'
            ? ({ boxShadow: '0 20px 64px rgba(0,0,0,.58), inset 0 1px 0 rgba(255,255,255,.055)', backdropFilter: 'blur(30px)' } as any)
            : null,
        ],
        tabBarActiveTintColor: t.text,
        tabBarInactiveTintColor: t.muted,
        tabBarItemStyle: styles.item,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ focused }) => <NavIcon name="index" focused={focused} accent={accent} /> }} />
      <Tabs.Screen name="train" options={{ title: 'Train', tabBarIcon: ({ focused }) => <NavIcon name="train" focused={focused} accent={accent} /> }} />
      <Tabs.Screen name="quests" options={{ title: 'Quests', tabBarIcon: ({ focused }) => <NavIcon name="quests" focused={focused} accent={accent} /> }} />
      <Tabs.Screen name="armory" options={{ title: 'Armory', tabBarIcon: ({ focused }) => <NavIcon name="armory" focused={focused} accent={accent} /> }} />
      <Tabs.Screen name="hero" options={{ title: 'Hero', tabBarIcon: ({ focused }) => <NavIcon name="hero" focused={focused} accent={accent} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', left: 14, right: 14, bottom: 12, height: 90,
    borderWidth: 1, borderTopWidth: 1, borderRadius: 26,
    paddingTop: 8, paddingBottom: 10, overflow: 'hidden',
  },
  item: { paddingTop: 0 },
  label: { fontSize: 8.25, fontWeight: '900', letterSpacing: 1.15, textTransform: 'uppercase', marginTop: 0 },
  iconShell: {
    width: 50, height: 50, borderRadius: 16, borderWidth: 1, borderColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  activePip: { position: 'absolute', bottom: -4, width: 20, height: 3, borderRadius: 99 },
});
