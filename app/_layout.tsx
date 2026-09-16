import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDb } from '../src/db';
import { VitalThemeProvider } from '../src/ThemeProvider';

function ThemedStack() {
  return (
    <SQLiteProvider databaseName="vitalquest.db" onInit={migrateDb}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
          animationDuration: 260,
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
