import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useVitalTheme } from './ThemeProvider';
import { radius } from './theme';

function webStyle(style: Record<string, unknown>) {
  return Platform.OS === 'web' ? (style as any) : undefined;
}

export function ThemeBackdrop() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;

  const gradient =
    themeId === 'mythicForge'
      ? `radial-gradient(circle at 78% 8%, ${t.accent}26 0, transparent 28%), radial-gradient(circle at 12% 72%, ${t.secondary}18 0, transparent 30%), linear-gradient(155deg, #080A0C 0%, ${t.background} 46%, #111820 100%)`
      : themeId === 'celestialPulse'
      ? `radial-gradient(circle at 85% 4%, ${t.accent}32 0, transparent 17%), radial-gradient(circle at 68% 24%, ${t.secondary}24 0, transparent 30%), radial-gradient(circle at 10% 82%, #264B7428 0, transparent 30%), linear-gradient(150deg, #07101C 0%, ${t.background} 50%, #10233A 100%)`
      : `radial-gradient(circle at 80% 0%, ${t.secondary}16 0, transparent 22%), radial-gradient(circle at 18% 72%, ${t.accent}24 0, transparent 32%), linear-gradient(150deg, #050506 0%, ${t.background} 54%, #17191D 100%)`;

  const texture =
    themeId === 'mythicForge'
      ? `repeating-linear-gradient(118deg, transparent 0 17px, rgba(255,255,255,.018) 18px 19px), radial-gradient(circle at 20% 10%, rgba(255,255,255,.025) 0 1px, transparent 1.6px)`
      : themeId === 'celestialPulse'
      ? `radial-gradient(circle at 10% 20%, rgba(255,255,255,.55) 0 1px, transparent 1.4px), radial-gradient(circle at 72% 60%, rgba(255,255,255,.22) 0 1px, transparent 1.5px), radial-gradient(circle at 42% 78%, rgba(255,255,255,.18) 0 1px, transparent 1.3px)`
      : `repeating-linear-gradient(135deg, rgba(255,255,255,.025) 0 1px, transparent 1px 8px), repeating-linear-gradient(45deg, rgba(255,255,255,.012) 0 1px, transparent 1px 9px)`;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: t.background }, webStyle({ backgroundImage: gradient })]} />
      <View style={[StyleSheet.absoluteFill, styles.texture, webStyle({ backgroundImage: texture, backgroundSize: themeId === 'celestialPulse' ? '110px 110px, 180px 180px, 240px 240px' : undefined })]} />
      {themeId === 'mythicForge' ? <ForgeLandscape /> : null}
      {themeId === 'celestialPulse' ? <CelestialOrbit /> : null}
      {themeId === 'titanCore' ? <TitanStripes /> : null}
    </View>
  );
}

function ForgeLandscape() {
  const { theme } = useVitalTheme();
  return (
    <View style={styles.landscapeWrap}>
      <View style={[styles.mountain, styles.mountainOne, { borderBottomColor: '#19212A' }]} />
      <View style={[styles.mountain, styles.mountainTwo, { borderBottomColor: '#11171D' }]} />
      <View style={[styles.horizonLine, { backgroundColor: theme.tokens.accent }]} />
    </View>
  );
}

function CelestialOrbit() {
  const { theme } = useVitalTheme();
  return (
    <View style={styles.orbitWrap}>
      <View style={[styles.orbit, styles.orbitLarge, { borderColor: `${theme.tokens.secondary}30` }]} />
      <View style={[styles.orbit, styles.orbitSmall, { borderColor: `${theme.tokens.accent}38` }]} />
      <View style={[styles.planet, { backgroundColor: theme.tokens.surfaceElevated, borderColor: `${theme.tokens.accent}48` }]} />
    </View>
  );
}

function TitanStripes() {
  const { theme } = useVitalTheme();
  return (
    <View style={styles.titanWrap}>
      <View style={[styles.titanSlash, { backgroundColor: `${theme.tokens.accent}18` }]} />
      <View style={[styles.titanSlash, styles.titanSlashTwo, { backgroundColor: `${theme.tokens.secondary}10` }]} />
    </View>
  );
}

export function BrandMark({ size = 36 }: { size?: number }) {
  const { themeId, theme } = useVitalTheme();
  const accent = theme.tokens.accent;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          styles.markOuter,
          {
            width: size,
            height: size,
            borderRadius: themeId === 'titanCore' ? 8 : size / 2,
            borderColor: `${accent}78`,
            backgroundColor: `${theme.tokens.surfaceElevated}D8`,
          },
        ]}
      >
        <Text style={{ color: accent, fontSize: size * 0.47, fontWeight: '900', lineHeight: size * 0.56 }}>V</Text>
        <View style={[styles.markSpine, { backgroundColor: accent, height: size * 0.58 }]} />
      </View>
    </View>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  const { themeId, theme } = useVitalTheme();
  const isMythic = themeId === 'mythicForge';
  const displayFont = isMythic ? 'Georgia' : themeId === 'titanCore' ? 'Arial Narrow' : 'Avenir Next';
  return (
    <View>
      <Text
        style={[
          styles.wordmark,
          {
            color: theme.tokens.text,
            fontFamily: displayFont,
            fontSize: compact ? 22 : 29,
            letterSpacing: isMythic ? -1 : themeId === 'celestialPulse' ? 0.4 : -0.6,
            textTransform: themeId === 'titanCore' ? 'uppercase' : 'none',
          },
        ]}
      >
        Vital<Text style={{ color: theme.tokens.accent }}>Quest</Text>
      </Text>
      {!compact ? (
        <Text style={[styles.wordmarkTag, { color: theme.tokens.muted }]}>{theme.tagline}</Text>
      ) : null}
    </View>
  );
}

export function DisplayText({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const { themeId, theme } = useVitalTheme();
  return (
    <Text
      style={[
        styles.displayText,
        {
          color: theme.tokens.text,
          fontFamily: themeId === 'mythicForge' ? 'Georgia' : themeId === 'titanCore' ? 'Arial Narrow' : 'Avenir Next',
          letterSpacing: themeId === 'titanCore' ? -0.9 : -0.5,
          textTransform: themeId === 'titanCore' ? 'uppercase' : 'none',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function ProgressRing({
  value,
  size = 172,
  stroke = 12,
  label,
  valueText,
  footer,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  valueText?: string;
  footer?: string;
}) {
  const { theme } = useVitalTheme();
  const clamped = Math.max(0, Math.min(1, value));
  const deg = Math.round(clamped * 360);
  const accent = theme.tokens.accent;
  const ringWeb = webStyle({
    backgroundImage: `conic-gradient(${accent} 0deg ${deg}deg, ${theme.tokens.surfaceElevated} ${deg}deg 360deg)`,
    boxShadow: `0 0 38px ${accent}28`,
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          styles.ringOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: Platform.OS === 'web' ? 0 : stroke,
            borderColor: accent,
            backgroundColor: theme.tokens.surfaceElevated,
          },
          ringWeb,
        ]}
      >
        <View
          style={[
            styles.ringInner,
            {
              width: size - stroke * 2,
              height: size - stroke * 2,
              borderRadius: (size - stroke * 2) / 2,
              backgroundColor: theme.tokens.heroSurface,
              borderColor: `${theme.tokens.border}C0`,
            },
          ]}
        >
          {label ? <Text style={[styles.ringLabel, { color: theme.tokens.muted }]}>{label}</Text> : null}
          <Text style={[styles.ringValue, { color: theme.tokens.text }]}>{valueText ?? `${Math.round(clamped * 100)}%`}</Text>
          {footer ? <Text style={[styles.ringFooter, { color: theme.tokens.accent }]}>{footer}</Text> : null}
        </View>
      </View>
    </View>
  );
}

export function GlassPanel({
  children,
  style,
  elevated = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const web = webStyle({
    backdropFilter: themeId === 'celestialPulse' ? 'blur(16px)' : 'blur(8px)',
    boxShadow:
      themeId === 'celestialPulse'
        ? `0 18px 48px rgba(0,0,0,.30), inset 0 1px 0 ${t.text}12`
        : themeId === 'mythicForge'
        ? `0 18px 42px rgba(0,0,0,.36), inset 0 1px 0 ${t.accent}0C`
        : `0 16px 34px rgba(0,0,0,.42)`,
  });

  return (
    <View
      style={[
        styles.glass,
        {
          backgroundColor: elevated ? `${t.surfaceElevated}F2` : `${t.surface}E8`,
          borderColor: elevated ? `${t.accent}38` : t.border,
          borderRadius: themeId === 'titanCore' ? radius.md : radius.lg,
        },
        web,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function StatOrb({ icon, value, label, accent }: { icon: string; value: string; label: string; accent?: string }) {
  const { theme } = useVitalTheme();
  const c = accent ?? theme.tokens.accent;
  return (
    <View style={styles.statOrbWrap}>
      <View style={[styles.statOrbIcon, { borderColor: `${c}55`, backgroundColor: `${c}12` }]}>
        <Text style={{ color: c, fontSize: 17 }}>{icon}</Text>
      </View>
      <Text style={[styles.statOrbValue, { color: theme.tokens.text }]}>{value}</Text>
      <Text style={[styles.statOrbLabel, { color: theme.tokens.muted }]}>{label}</Text>
    </View>
  );
}

export function ThemePill({ children }: { children: React.ReactNode }) {
  const { theme } = useVitalTheme();
  return (
    <View style={[styles.themePill, { borderColor: `${theme.tokens.accent}55`, backgroundColor: `${theme.tokens.accent}10` }]}>
      <Text style={[styles.themePillText, { color: theme.tokens.accent }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  texture: { opacity: 0.58 },
  landscapeWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 210, overflow: 'hidden', opacity: 0.78 },
  mountain: { position: 'absolute', width: 0, height: 0, borderLeftWidth: 190, borderRightWidth: 190, borderBottomWidth: 155, borderLeftColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '180deg' }] },
  mountainOne: { left: -75, bottom: -44 },
  mountainTwo: { right: -115, bottom: -55, transform: [{ rotate: '180deg' }, { scale: 1.16 }] },
  horizonLine: { position: 'absolute', left: '18%', right: '10%', bottom: 42, height: 1, opacity: 0.18 },
  orbitWrap: { position: 'absolute', top: -110, right: -115, width: 410, height: 410, opacity: 0.9 },
  orbit: { position: 'absolute', borderWidth: 1 },
  orbitLarge: { width: 380, height: 380, borderRadius: 190, right: 0, top: 0 },
  orbitSmall: { width: 260, height: 260, borderRadius: 130, right: 46, top: 62 },
  planet: { position: 'absolute', width: 88, height: 88, borderRadius: 44, borderWidth: 1, right: 48, top: 96, opacity: 0.82 },
  titanWrap: { position: 'absolute', inset: 0 as any, overflow: 'hidden' },
  titanSlash: { position: 'absolute', width: 190, height: 900, right: -75, top: -130, transform: [{ rotate: '26deg' }] },
  titanSlashTwo: { right: 90, top: -280, width: 72 },
  markOuter: { borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  markSpine: { position: 'absolute', width: 1.5, top: '21%' },
  wordmark: { fontWeight: '900' },
  wordmarkTag: { fontSize: 9, marginTop: 3, letterSpacing: 0.65 },
  displayText: { fontSize: 34, lineHeight: 38, fontWeight: '900' },
  ringOuter: { alignItems: 'center', justifyContent: 'center' },
  ringInner: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ringLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
  ringValue: { fontSize: 39, lineHeight: 44, fontWeight: '900', letterSpacing: -1.5, marginTop: 2 },
  ringFooter: { fontSize: 10, fontWeight: '900', letterSpacing: 0.6, marginTop: 1 },
  glass: { borderWidth: 1, padding: 16, overflow: 'hidden' },
  statOrbWrap: { flex: 1, minWidth: 64, alignItems: 'center' },
  statOrbIcon: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  statOrbValue: { fontSize: 15, fontWeight: '900' },
  statOrbLabel: { fontSize: 9, fontWeight: '700', marginTop: 2 },
  themePill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  themePillText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
});
