import React,{Suspense} from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDb } from '../src/db';
import { VitalThemeProvider } from '../src/ThemeProvider';
import BrandLoadingScreen from '../src/BrandLoadingScreen';

function ThemedStack() {
  return (
    <Suspense fallback={<BrandLoadingScreen variant="launch"/>}>
      <SQLiteProvider databaseName="vitalquest.db" onInit={migrateDb} useSuspense>
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
    </Suspense>
  );
}

export default function RootLayout() {
  return (
    <VitalThemeProvider>
      <ThemedStack />
    </VitalThemeProvider>
  );
}
