import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from './designSystem';

const IVORY = '#F7F2E8';
const GOLD = '#E7B858';

/** Eclipse-corona brand mark: a gold ring occluded by a dark disc. */
export function BrandEclipse({ size = 22 }: { size?: number }) {
  const disc = size * 0.62;
  return (
    <View style={[s.eclipse, { width: size, height: size, borderRadius: size / 2, borderColor: GOLD }]}>
      <View style={[s.eclipseGlow, { width: size, height: size, borderRadius: size / 2 }]} />
      <View
        style={{
          width: disc,
          height: disc,
          borderRadius: disc / 2,
          backgroundColor: '#0A0E12',
          transform: [{ translateX: size * 0.12 }, { translateY: -size * 0.06 }],
        }}
      />
    </View>
  );
}

/** Two-tone VITALQUEST lockup. VITAL in ivory, QUEST in gold. */
export function BrandWordmark({ size = 18, tracking }: { size?: number; tracking?: number }) {
  const ls = tracking ?? size * 0.22;
  return (
    <View style={s.lockup}>
      <BrandEclipse size={size * 1.05} />
      <Text style={[s.word, { fontSize: size, letterSpacing: ls }]}>
        <Text style={{ color: IVORY }}>VITAL</Text>
        <Text style={{ color: GOLD }}>QUEST</Text>
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  word: { fontFamily: fonts.display, fontWeight: '800', color: IVORY },
  eclipse: {
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(231,184,88,.08)',
  },
  eclipseGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: 'rgba(231,184,88,.18)',
  },
});
