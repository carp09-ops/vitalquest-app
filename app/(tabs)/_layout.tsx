import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useVitalTheme } from '../../src/ThemeProvider';

function NavIcon({ symbol, color, focused }: { symbol: string; color: string; focused: boolean }) {
  const { theme } = useVitalTheme();
  return (
    <View
      style={[
        {
          width: 34,
          height: 30,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: focused ? `${theme.tokens.accent}55` : 'transparent',
          backgroundColor: focused ? `${theme.tokens.accent}10` : 'transparent',
        },
        focused ? ({ boxShadow: `0 0 18px ${theme.tokens.accent}20` } as any) : null,
      ]}
    >
      <Text style={{ color, fontSize: 17, fontWeight: '900' }}>{symbol}</Text>
    </View>
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
            backgroundColor: `${t.navBackground}F7`,
            borderTopColor: `${t.border}D8`,
            height: 84,
            paddingTop: 7,
            paddingBottom: 15,
          },
          ({
            boxShadow:
              themeId === 'celestialPulse'
                ? '0 -12px 34px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.035)'
                : '0 -14px 34px rgba(0,0,0,.38)',
            backdropFilter: 'blur(16px)',
          } as any),
        ],
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.muted,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          letterSpacing: 0.35,
          marginTop: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => <NavIcon symbol="⌂" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Train',
          tabBarIcon: ({ color, focused }) => <NavIcon symbol="↟" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, focused }) => <NavIcon symbol="◇" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="armory"
        options={{
          title: 'Armory',
          tabBarIcon: ({ color, focused }) => <NavIcon symbol="⬡" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="hero"
        options={{
          title: 'Hero',
          tabBarIcon: ({ color, focused }) => <NavIcon symbol="♜" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
