import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDb } from '../src/db';
import { VitalThemeProvider, useVitalTheme } from '../src/ThemeProvider';

function ThemedStack() {
  const { theme } = useVitalTheme();

  return (
    <SQLiteProvider databaseName="vitalquest.db" onInit={migrateDb}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.tokens.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout" />
      </Stack>
    </SQLiteProvider>
  );
}

export default function RootLayout() {
  return (
    <VitalThemeProvider>
      <ThemedStack />
    </VitalThemeProvider>
  );
}
