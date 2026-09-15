import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { radius, spacing } from './theme';
import { useVitalTheme } from './ThemeProvider';
import { ThemeBackdrop } from './visual';

export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  const { theme } = useVitalTheme();
  const backgroundColor = theme.tokens.background;

  if (!scroll) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor }]}>
        <ThemeBackdrop />
        <View style={styles.fill}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <ThemeBackdrop />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  const { theme } = useVitalTheme();
  return <Text style={[styles.eyebrow, { color: theme.tokens.accent }]}>{children}</Text>;
}

export function Title({ children }: { children: React.ReactNode }) {
  const { theme } = useVitalTheme();
  return <Text style={[styles.title, { color: theme.tokens.text }]}>{children}</Text>;
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { themeId, theme } = useVitalTheme();
  const webShadow =
    themeId === 'celestialPulse'
      ? ({ boxShadow: `0 14px 34px rgba(0,0,0,.26), inset 0 1px 0 ${theme.tokens.text}10`, backdropFilter: 'blur(12px)' } as any)
      : themeId === 'mythicForge'
      ? ({ boxShadow: `0 16px 38px rgba(0,0,0,.32), inset 0 1px 0 ${theme.tokens.accent}0D` } as any)
      : ({ boxShadow: '0 14px 32px rgba(0,0,0,.38)' } as any);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: `${theme.tokens.surface}EE`,
          borderColor: theme.tokens.border,
          borderRadius: themeId === 'titanCore' ? radius.md : radius.lg,
        },
        webShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function ProgressBar({
  value,
  accent,
}: {
  value: number;
  accent?: string;
}) {
  const { theme } = useVitalTheme();
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { backgroundColor: theme.tokens.surfaceElevated }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: accent ?? theme.tokens.accent,
          },
          ({ boxShadow: `0 0 18px ${(accent ?? theme.tokens.accent)}40` } as any),
        ]}
      />
    </View>
  );
}

export function SectionHeader({
  title,
  right,
}: {
  title: string;
  right?: string;
}) {
  const { theme } = useVitalTheme();
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleWrap}>
        <View style={[styles.sectionTick, { backgroundColor: theme.tokens.accent }]} />
        <Text style={[styles.sectionTitle, { color: theme.tokens.text }]}>{title}</Text>
      </View>
      {right ? (
        <Text style={[styles.sectionRight, { color: theme.tokens.accent }]}>{right}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 120,
    gap: spacing.md,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1,
  },
  card: {
    borderWidth: 1,
    padding: spacing.md,
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  sectionTick: {
    width: 16,
    height: 2,
    borderRadius: 999,
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 18,
  },
  sectionRight: {
    fontWeight: '700',
    fontSize: 13,
  },
});
