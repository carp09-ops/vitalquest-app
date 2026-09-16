import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { IconArt, VQIconName } from '../../src/IconArt';
import { useVitalTheme } from '../../src/ThemeProvider';

const NAV: Record<string, VQIconName> = {
  index: 'xp',
  train: 'strength',
  quests: 'quest',
  armory: 'armory',
  hero: 'trophy',
};

function NavIcon({ name, focused }: { name: keyof typeof NAV; focused: boolean }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.iconShell, focused && { backgroundColor: t.surfaceElevated, borderColor: `${t.accent}55` }]}>
      <IconArt name={NAV[name]} size={30} opacity={focused ? 1 : .58} />
      {focused ? <View style={[styles.activePip, { backgroundColor: t.accent }]} /> : null}
    </View>
  );
}

export default function TabLayout() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: t.navBackground, borderColor: t.border },
          Platform.OS === 'web'
            ? ({ boxShadow: '0 16px 48px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.035)', backdropFilter: 'blur(24px)' } as any)
            : null,
        ],
        tabBarActiveTintColor: t.text,
        tabBarInactiveTintColor: t.muted,
        tabBarItemStyle: styles.item,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ focused }) => <NavIcon name="index" focused={focused} /> }} />
      <Tabs.Screen name="train" options={{ title: 'Train', tabBarIcon: ({ focused }) => <NavIcon name="train" focused={focused} /> }} />
      <Tabs.Screen name="quests" options={{ title: 'Quests', tabBarIcon: ({ focused }) => <NavIcon name="quests" focused={focused} /> }} />
      <Tabs.Screen name="armory" options={{ title: 'Armory', tabBarIcon: ({ focused }) => <NavIcon name="armory" focused={focused} /> }} />
      <Tabs.Screen name="hero" options={{ title: 'Hero', tabBarIcon: ({ focused }) => <NavIcon name="hero" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', left: 12, right: 12, bottom: 10, height: 76,
    borderWidth: 1, borderTopWidth: 1, borderRadius: 20,
    paddingTop: 6, paddingBottom: 8, overflow: 'hidden',
  },
  item: { paddingTop: 0 },
  label: { fontSize: 7.5, fontWeight: '800', letterSpacing: .8, textTransform: 'uppercase', marginTop: -1 },
  iconShell: {
    width: 42, height: 42, borderRadius: 13, borderWidth: 1, borderColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  activePip: { position: 'absolute', bottom: -3, width: 14, height: 2, borderRadius: 99 },
});
