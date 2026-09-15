import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar, Screen, SectionHeader } from '../../src/components';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing } from '../../src/theme';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TodayScreen() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;

  return (
    <Screen>
      <View style={styles.brandRow}>
        <View>
          <Text style={[styles.wordmark, { color: t.text }]}>Vital<Text style={{ color: t.accent }}>Quest</Text></Text>
          <Text style={[styles.skinName, { color: t.muted }]}>{theme.name.toUpperCase()}</Text>
        </View>
        <View style={[styles.levelSeal, { borderColor: t.accent, backgroundColor: t.surface }]}>
          <Text style={[styles.levelSmall, { color: t.accent }]}>LV</Text>
          <Text style={[styles.levelNumber, { color: t.text }]}>12</Text>
        </View>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={[styles.greeting, { color: t.text }]}>{greeting()},</Text>
        <Text style={[styles.champion, { color: t.text }]}>Champion.</Text>
        <Text style={[styles.dailyLine, { color: t.muted }]}>{theme.tagline}</Text>
      </View>

      <Card style={[styles.commandCard, { backgroundColor: t.heroSurface, borderColor: t.accentSoft }]}>
        <View style={styles.commandHeader}>
          <View>
            <Text style={[styles.commandEyebrow, { color: t.accent }]}>TODAY'S COMMAND</Text>
            <Text style={[styles.commandTitle, { color: t.text }]}>Stay in motion.</Text>
          </View>
          <Text style={[styles.commandDate, { color: t.muted }]}>DAILY GOAL</Text>
        </View>

        <View style={styles.progressCenter}>
          <View
            style={[
              styles.progressRing,
              {
                borderColor: t.accent,
                borderRightColor: t.surfaceElevated,
                backgroundColor: t.background,
              },
            ]}
          >
            <Text style={[styles.progressLabel, { color: t.muted }]}>PROGRESS</Text>
            <Text style={[styles.progressValue, { color: t.text }]}>78%</Text>
            <Text style={[styles.progressSub, { color: t.accent }]}>3 / 5 quests</Text>
          </View>
        </View>

        <View style={styles.signalGrid}>
          <Signal symbol="↗" label="Move" value="7,842" sub="steps" />
          <Signal symbol="↟" label="Train" value="1" sub="workout" />
          <Signal symbol="◒" label="Recover" value="Good" sub="status" />
          <Signal symbol="◇" label="Quests" value="3/5" sub="complete" />
        </View>
      </Card>

      <SectionHeader title="Today's training" right="Push · ~55 min" />

      <Card style={{ borderColor: t.border }}>
        <View style={styles.workoutTop}>
          <View style={[styles.workoutGlyph, { backgroundColor: t.surfaceElevated, borderColor: t.accentSoft }]}>
            <Text style={[styles.workoutGlyphText, { color: t.accent }]}>⚔</Text>
          </View>
          <View style={styles.workoutBody}>
            <Text style={[styles.workoutLabel, { color: t.accent }]}>RECOMMENDED TRIAL</Text>
            <Text style={[styles.workoutTitle, { color: t.text }]}>Push Day</Text>
            <Text style={[styles.workoutMeta, { color: t.muted }]}>Chest · Shoulders · Triceps</Text>
          </View>
        </View>

        <View style={styles.workoutStats}>
          <MiniStat value="9" label="WORKING SETS" />
          <MiniStat value="55" label="MINUTES" />
          <MiniStat value="+~210" label="EST. XP" />
        </View>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: t.accent }]}
          onPress={() =>
            router.push({
              pathname: '/workout',
              params: { templateId: 'push' },
            })
          }
        >
          <Text style={[styles.primaryText, { color: t.background }]}>BEGIN TRAINING</Text>
        </Pressable>
      </Card>

      <View style={styles.twoUp}>
        <Card style={styles.momentumCard}>
          <Text style={[styles.cardEyebrow, { color: t.muted }]}>CURRENT STREAK</Text>
          <View style={styles.streakRow}>
            <Text style={[styles.streakIcon, { color: t.secondary }]}>◆</Text>
            <Text style={[styles.streakValue, { color: t.text }]}>12</Text>
            <Text style={[styles.streakUnit, { color: t.muted }]}>days</Text>
          </View>
          <Text style={[styles.quote, { color: t.muted }]}>
            “Ordinary effort. Extraordinary results.”
          </Text>
        </Card>

        <Card style={styles.momentumCard}>
          <Text style={[styles.cardEyebrow, { color: t.muted }]}>NEXT LEVEL</Text>
          <Text style={[styles.nextLevel, { color: t.text }]}>620 XP</Text>
          <Text style={[styles.nextCopy, { color: t.muted }]}>until Level 13</Text>
          <View style={{ marginTop: 15 }}>
            <ProgressBar value={0.66} />
          </View>
        </Card>
      </View>

      <SectionHeader title="Active quest" right="View quests" />

      <Pressable onPress={() => router.push('/(tabs)/quests')}>
        <Card style={{ borderColor: t.accentSoft }}>
          <View style={styles.questTop}>
            <View style={styles.questText}>
              <Text style={[styles.questType, { color: t.accent }]}>WEEKLY QUEST</Text>
              <Text style={[styles.questTitle, { color: t.text }]}>Iron Week</Text>
              <Text style={[styles.questCopy, { color: t.muted }]}>Complete 3 resistance workouts this week.</Text>
            </View>
            <Text style={[styles.questReward, { color: t.positive }]}>+300 XP</Text>
          </View>
          <ProgressBar value={2 / 3} accent={t.positive} />
          <View style={styles.questFooter}>
            <Text style={[styles.questProgress, { color: t.muted }]}>2 / 3 complete</Text>
            <Text style={[styles.questArrow, { color: t.accent }]}>›</Text>
          </View>
        </Card>
      </Pressable>
    </Screen>
  );
}

function Signal({
  symbol,
  label,
  value,
  sub,
}: {
  symbol: string;
  label: string;
  value: string;
  sub: string;
}) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.signal, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Text style={[styles.signalSymbol, { color: t.accent }]}>{symbol}</Text>
      <Text style={[styles.signalValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.signalLabel, { color: t.muted }]}>{label} · {sub}</Text>
    </View>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.miniStat, { backgroundColor: t.surfaceElevated }]}>
      <Text style={[styles.miniValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  skinName: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: 3,
  },
  levelSeal: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelSmall: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 23,
  },
  greetingBlock: {
    marginTop: 8,
    marginBottom: 2,
  },
  greeting: {
    fontSize: 25,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  champion: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1.3,
  },
  dailyLine: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  commandCard: {
    overflow: 'hidden',
    padding: spacing.lg,
  },
  commandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  commandEyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  commandTitle: {
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },
  commandDate: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  progressCenter: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  progressRing: {
    width: 174,
    height: 174,
    borderRadius: 87,
    borderWidth: 13,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-18deg' }],
  },
  progressLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
    transform: [{ rotate: '18deg' }],
  },
  progressValue: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    transform: [{ rotate: '18deg' }],
  },
  progressSub: {
    fontSize: 10,
    fontWeight: '800',
    transform: [{ rotate: '18deg' }],
  },
  signalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  signal: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  signalSymbol: {
    fontSize: 16,
    fontWeight: '900',
  },
  signalValue: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 7,
  },
  signalLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  workoutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  workoutGlyph: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutGlyphText: {
    fontSize: 25,
  },
  workoutBody: {
    flex: 1,
  },
  workoutLabel: {
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 1.4,
  },
  workoutTitle: {
    fontWeight: '900',
    fontSize: 24,
    marginTop: 4,
  },
  workoutMeta: {
    marginTop: 3,
    fontSize: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 19,
  },
  miniStat: {
    flex: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  miniValue: {
    fontWeight: '900',
    fontSize: 16,
  },
  miniLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  primaryButton: {
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryText: {
    fontWeight: '900',
    letterSpacing: 1.2,
    fontSize: 12,
  },
  twoUp: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  momentumCard: {
    flex: 1,
    minHeight: 145,
  },
  cardEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 9,
  },
  streakIcon: {
    fontSize: 14,
  },
  streakValue: {
    fontSize: 29,
    fontWeight: '900',
  },
  streakUnit: {
    fontSize: 11,
    fontWeight: '700',
  },
  quote: {
    fontSize: 10,
    lineHeight: 15,
    fontStyle: 'italic',
    marginTop: 9,
  },
  nextLevel: {
    fontSize: 27,
    fontWeight: '900',
    marginTop: 10,
  },
  nextCopy: {
    fontSize: 10,
    marginTop: 2,
  },
  questTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 15,
  },
  questText: {
    flex: 1,
  },
  questType: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  questTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginTop: 4,
  },
  questCopy: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  questReward: {
    fontSize: 11,
    fontWeight: '900',
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
  },
  questProgress: {
    fontSize: 9,
    fontWeight: '700',
  },
  questArrow: {
    fontSize: 25,
    lineHeight: 25,
  },
});
