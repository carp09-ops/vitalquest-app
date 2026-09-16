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
            animationDuration: 300,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="(tabs)" options={{animation:'fade'}} />
          <Stack.Screen name="onboarding" options={{animation:'fade',gestureEnabled:false}} />
          <Stack.Screen name="workout" options={{animation:'slide_from_bottom'}} />
          <Stack.Screen name="generated-workout" options={{animation:'slide_from_bottom'}} />
          <Stack.Screen name="custom-workout" options={{animation:'fade_from_bottom'}} />
          <Stack.Screen name="forge" options={{animation:'fade_from_bottom'}} />
          <Stack.Screen name="equipment" options={{animation:'fade_from_bottom'}} />
          <Stack.Screen name="insights" options={{animation:'fade_from_bottom'}} />
          <Stack.Screen name="verification" options={{animation:'fade_from_bottom'}} />
          <Stack.Screen name="beta-feedback" options={{animation:'fade_from_bottom'}} />
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
