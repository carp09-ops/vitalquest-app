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
    return <SafeAreaView style={[styles.safe, { backgroundColor }]}>{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
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
  const { theme } = useVitalTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.tokens.surface,
          borderColor: theme.tokens.border,
        },
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
      <Text style={[styles.sectionTitle, { color: theme.tokens.text }]}>{title}</Text>
      {right ? (
        <Text style={[styles.sectionRight, { color: theme.tokens.accent }]}>{right}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
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
    borderRadius: radius.lg,
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
  sectionTitle: {
    fontWeight: '800',
    fontSize: 18,
  },
  sectionRight: {
    fontWeight: '700',
    fontSize: 13,
  },
});
