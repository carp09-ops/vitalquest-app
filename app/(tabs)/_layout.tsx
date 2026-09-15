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

function NavIcon({
  name,
  focused,
  accent,
}: {
  name: keyof typeof NAV;
  focused: boolean;
  accent: string;
}) {
  return (
    <View
      style={[
        styles.iconShell,
        focused && styles.iconShellFocused,
        focused && { borderColor: `${accent}88` },
        Platform.OS === 'web' && focused
          ? ({ boxShadow: `0 0 18px ${accent}30` } as any)
          : null,
      ]}
    >
      <IconArt name={NAV[name]} size={31} opacity={focused ? 1 : 0.56} />
      {focused ? <View style={[styles.activePip, { backgroundColor: accent }]} /> : null}
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
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: `${t.navBackground}FA`,
            borderTopColor: `${t.accent}44`,
          },
          Platform.OS === 'web'
            ? ({
                boxShadow: '0 -18px 48px rgba(0,0,0,.52), inset 0 1px 0 rgba(255,255,255,.035)',
                backdropFilter: 'blur(22px)',
              } as any)
            : null,
        ],
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: '#8B8B8B',
        tabBarItemStyle: styles.item,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <NavIcon name="index" focused={focused} accent={t.accent} />,
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Train',
          tabBarIcon: ({ focused }) => <NavIcon name="train" focused={focused} accent={t.accent} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ focused }) => <NavIcon name="quests" focused={focused} accent={t.accent} />,
        }}
      />
      <Tabs.Screen
        name="armory"
        options={{
          title: 'Armory',
          tabBarIcon: ({ focused }) => <NavIcon name="armory" focused={focused} accent={t.accent} />,
        }}
      />
      <Tabs.Screen
        name="hero"
        options={{
          title: 'Hero',
          tabBarIcon: ({ focused }) => <NavIcon name="hero" focused={focused} accent={t.accent} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 88,
    borderTopWidth: 1,
    paddingTop: 7,
    paddingBottom: 12,
  },
  item: { paddingTop: 1 },
  label: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginTop: 0,
  },
  iconShell: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconShellFocused: { backgroundColor: 'rgba(255,255,255,.035)' },
  activePip: {
    position: 'absolute',
    bottom: -4,
    width: 13,
    height: 2,
    borderRadius: 99,
  },
});
