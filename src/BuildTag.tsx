import Constants from 'expo-constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BUILD_NUMBER } from './buildInfo';

// Tiny QA badge so it's always obvious which build is on screen.
// Version comes from app.json; BUILD_NUMBER is bumped in buildInfo.ts
// with every push to main (see AGENTS.md).
const VERSION: string = Constants.expoConfig?.version ?? '0.0.0';

export default function BuildTag() {
  return (
    <View pointerEvents="none" style={styles.tag}>
      <Text style={styles.text}>{`QA.${VERSION} · build ${BUILD_NUMBER}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: 'absolute',
    left: 20,
    bottom: 118,
    zIndex: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.14)',
    backgroundColor: 'rgba(5,7,10,.55)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: 'rgba(247,248,250,.55)',
  },
});
