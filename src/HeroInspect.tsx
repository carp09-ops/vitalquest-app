import React, { useRef } from 'react';
import { Animated, ImageBackground, Modal, PanResponder, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

interface HeroInspectProps {
  visible: boolean;
  onClose: () => void;
  artUri: string;
  auraColor: string;
  ascendantLabel: string;
  tier: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Full-screen 3D inspect viewer for the hero. Drag to tilt the portrait in
 * perspective — the rim light and aura shift with the angle, like holding a
 * holographic statue. Release and it springs back to rest.
 */
export default function HeroInspect({ visible, onClose, artUri, auraColor, ascendantLabel, tier }: HeroInspectProps) {
  const { width, height } = useWindowDimensions();
  const rotX = useRef(new Animated.Value(0)).current;
  const rotY = useRef(new Animated.Value(0)).current;

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      rotY.setValue(clamp(gesture.dx / 5, -24, 24));
      rotX.setValue(clamp(-gesture.dy / 5, -16, 16));
    },
    onPanResponderRelease: () => {
      Animated.parallel([
        Animated.spring(rotX, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }),
        Animated.spring(rotY, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }),
      ]).start();
    },
  })).current;

  const rotXDeg = rotX.interpolate({ inputRange: [-16, 16], outputRange: ['-16deg', '16deg'] });
  const rotYDeg = rotY.interpolate({ inputRange: [-24, 24], outputRange: ['-24deg', '24deg'] });
  // Light follows the tilt: drag right and the sheen sweeps right.
  const sheenX = rotY.interpolate({ inputRange: [-24, 24], outputRange: [-width * 0.28, width * 0.28] });
  const sheenY = rotX.interpolate({ inputRange: [-16, 16], outputRange: [height * 0.2, -height * 0.2] });
  const sheenOpacity = rotY.interpolate({ inputRange: [-24, 0, 24], outputRange: [0.5, 0.12, 0.5] });
  const rimOpacity = rotY.interpolate({ inputRange: [-24, 0, 24], outputRange: [0.85, 0.35, 0.85] });

  const cardWidth = Math.min(width * 0.88, 520);
  const cardHeight = Math.min(height * 0.68, 720);

  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.scrim}>
      <Pressable style={styles.close} onPress={onClose} accessibilityLabel="Close inspect view">
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
      <View style={styles.stage} {...pan.panHandlers}>
        <Animated.View style={[styles.card, { width: cardWidth, height: cardHeight, borderColor: auraColor, transform: [{ perspective: 900 }, { rotateX: rotXDeg }, { rotateY: rotYDeg }] }]}>
          <ImageBackground source={{ uri: artUri }} resizeMode="cover" style={styles.art} imageStyle={styles.artRadius}>
            <View style={styles.shade} />
            {/* Sheen that sweeps with the tilt */}
            <Animated.View pointerEvents="none" style={[styles.sheen, { opacity: sheenOpacity, transform: [{ translateX: sheenX }, { translateY: sheenY }] }]} />
            <View style={styles.caption}>
              <View style={styles.captionRow}>
                <View style={[styles.dot, { backgroundColor: auraColor }]} />
                <Text style={[styles.ascendant, { color: auraColor }]}>{ascendantLabel} · TIER {tier}</Text>
              </View>
              <Text style={styles.hint}>DRAG TO INSPECT</Text>
            </View>
          </ImageBackground>
          {/* Rim light in the attribute's element color */}
          <Animated.View pointerEvents="none" style={[styles.rim, { borderColor: auraColor, opacity: rimOpacity }]} />
        </Animated.View>
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(2,4,7,.92)', alignItems: 'center', justifyContent: 'center' },
  close: { position: 'absolute', top: 54, right: 20, width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,.18)', backgroundColor: 'rgba(255,255,255,.05)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  closeText: { color: '#F7F8FA', fontSize: 16, fontWeight: '700' },
  stage: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { borderWidth: 1.5, borderRadius: 28, overflow: 'hidden', backgroundColor: '#05070A' },
  art: { flex: 1, justifyContent: 'flex-end' },
  artRadius: { borderRadius: 26 },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,5,9,.18)' },
  sheen: { position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: 'rgba(255,255,255,.55)', alignSelf: 'center', top: '30%' },
  rim: { ...StyleSheet.absoluteFillObject, borderWidth: 2, borderRadius: 28 },
  caption: { padding: 18, gap: 6, backgroundColor: 'rgba(2,5,9,.55)' },
  captionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  ascendant: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  hint: { fontSize: 8.5, fontWeight: '900', letterSpacing: 2.4, color: 'rgba(247,248,250,.45)' },
});
