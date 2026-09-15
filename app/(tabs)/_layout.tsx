import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useVitalTheme } from '../../src/ThemeProvider';

function NavIndicator({ color, focused }: { color: string; focused: boolean }) {
  return (
    <View
      style={[
        {
          width: focused ? 24 : 5,
          height: 2,
          borderRadius: 999,
          backgroundColor: focused ? color : `${color}55`,
          marginBottom: 3,
        },
        focused ? ({ boxShadow: `0 0 12px ${color}66` } as any) : null,
      ]}
    />
  );
}

export default function TabLayout() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          {
            backgroundColor: `${t.navBackground}FA`,
            borderTopColor: `${t.accent}2A`,
            borderTopWidth: 1,
            height: 76,
            paddingTop: 9,
            paddingBottom: 13,
          },
          ({
            boxShadow:
              themeId === 'celestialPulse'
                ? `0 -10px 30px rgba(0,0,0,.34), inset 0 1px 0 ${t.secondary}12`
                : '0 -12px 30px rgba(0,0,0,.42)',
            backdropFilter: 'blur(18px)',
          } as any),
        ],
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.muted,
        tabBarItemStyle: {
          paddingTop: 1,
        },
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: '900',
          letterSpacing: 1.05,
          textTransform: 'uppercase',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => <NavIndicator color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Train',
          tabBarIcon: ({ color, focused }) => <NavIndicator color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, focused }) => <NavIndicator color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="armory"
        options={{
          title: 'Armory',
          tabBarIcon: ({ color, focused }) => <NavIndicator color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="hero"
        options={{
          title: 'Hero',
          tabBarIcon: ({ color, focused }) => <NavIndicator color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
