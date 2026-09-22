import React,{Suspense,useEffect} from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Cinzel_700Bold, Cinzel_800ExtraBold } from '@expo-google-fonts/cinzel';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { migrateDb } from '../src/db';
import { VitalThemeProvider } from '../src/ThemeProvider';
import BrandLoadingScreen from '../src/BrandLoadingScreen';

SplashScreen.preventAutoHideAsync().catch(()=>{});

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
  const [fontsLoaded]=useFonts({
    Cinzel_700Bold, Cinzel_800ExtraBold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
  });
  useEffect(()=>{ if(fontsLoaded) SplashScreen.hideAsync().catch(()=>{}); },[fontsLoaded]);
  if(!fontsLoaded) return <BrandLoadingScreen variant="launch"/>;
  return (
    <VitalThemeProvider>
      <ThemedStack />
    </VitalThemeProvider>
  );
}
