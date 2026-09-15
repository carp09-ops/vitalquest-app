import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useVitalTheme } from '../../src/ThemeProvider';

const icon = (symbol: string, color: string) => (
  <Text style={{ color, fontSize: 18, fontWeight: '800' }}>{symbol}</Text>
);

export default function TabLayout() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.navBackground,
          borderTopColor: t.border,
          height: 82,
          paddingTop: 8,
          paddingBottom: 16,
        },
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => icon('⌂', color),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Train',
          tabBarIcon: ({ color }) => icon('↟', color),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color }) => icon('◇', color),
        }}
      />
      <Tabs.Screen
        name="armory"
        options={{
          title: 'Armory',
          tabBarIcon: ({ color }) => icon('⬡', color),
        }}
      />
      <Tabs.Screen
        name="hero"
        options={{
          title: 'Hero',
          tabBarIcon: ({ color }) => icon('♜', color),
        }}
      />
    </Tabs>
  );
}
