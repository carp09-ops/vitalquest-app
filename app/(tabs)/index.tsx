import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar, Screen, SectionHeader } from '../../src/components';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing } from '../../src/theme';
import {
  BrandMark,
  DisplayText,
  GlassPanel,
  ProgressRing,
  StatOrb,
  ThemePill,
  Wordmark,
} from '../../src/visual';

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
        <View style={styles.brandIdentity}>
          <BrandMark size={40} />
          <Wordmark compact />
        </View>
        <View style={[styles.levelSeal, { borderColor: `${t.accent}72`, backgroundColor: `${t.surface}E8` }]}>
          <Text style={[styles.levelSmall, { color: t.accent }]}>LV</Text>
          <Text style={[styles.levelNumber, { color: t.text }]}>12</Text>
        </View>
      </View>

      <View style={styles.greetingBlock}>
        <ThemePill>{theme.name}</ThemePill>
        <Text style={[styles.greeting, { color: t.muted }]}>{greeting()},</Text>
        <DisplayText style={styles.champion}>Champion.</DisplayText>
        <Text style={[styles.dailyLine, { color: t.muted }]}>{theme.tagline}</Text>
      </View>

      <GlassPanel style={[styles.commandCard, { borderColor: `${t.accent}48` }]} elevated>
        <View style={styles.commandHeader}>
          <View>
            <Text style={[styles.commandEyebrow, { color: t.accent }]}>TODAY'S COMMAND</Text>
            <Text style={[styles.commandTitle, { color: t.text }]}>Stay in motion.</Text>
          </View>
          <Text style={[styles.commandDate, { color: t.muted }]}>DAILY GOAL</Text>
        </View>

        <View style={styles.progressCenter}>
          <ProgressRing value={0.78} label="Daily progress" valueText="78%" footer="3 / 5 quests" />
        </View>

        <View style={styles.signalRow}>
          <StatOrb icon="↗" value="7,842" label="Move" accent={t.secondary} />
          <StatOrb icon="◆" value="1/1" label="Train" accent={t.accent} />
          <StatOrb icon="◒" value="Good" label="Recover" accent={t.positive} />
          <StatOrb icon="◇" value="3/5" label="Quests" accent={t.power} />
        </View>
      </GlassPanel>

      <SectionHeader title="Today's training" right="Push · ~55 min" />

      <GlassPanel style={styles.workoutCard}>
        <View style={styles.workoutTop}>
          <View style={[styles.workoutGlyph, { backgroundColor: `${t.accent}10`, borderColor: `${t.accent}44` }]}>
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
          style={[
            styles.primaryButton,
            { backgroundColor: t.accent },
            ({ boxShadow: `0 12px 28px ${t.accent}38` } as any),
          ]}
          onPress={() =>
            router.push({
              pathname: '/workout',
              params: { templateId: 'push' },
            })
          }
        >
          <Text style={[styles.primaryText, { color: t.background }]}>BEGIN TRAINING</Text>
        </Pressable>
      </GlassPanel>

      <View style={styles.twoUp}>
        <GlassPanel style={styles.momentumCard}>
          <Text style={[styles.cardEyebrow, { color: t.muted }]}>CURRENT STREAK</Text>
          <View style={styles.streakRow}>
            <Text style={[styles.streakIcon, { color: t.secondary }]}>◆</Text>
            <Text style={[styles.streakValue, { color: t.text }]}>12</Text>
            <Text style={[styles.streakUnit, { color: t.muted }]}>days</Text>
          </View>
          <Text style={[styles.quote, { color: t.muted }]}>“Ordinary effort. Extraordinary results.”</Text>
        </GlassPanel>

        <GlassPanel style={styles.momentumCard}>
          <Text style={[styles.cardEyebrow, { color: t.muted }]}>NEXT LEVEL</Text>
          <Text style={[styles.nextLevel, { color: t.text }]}>620 XP</Text>
          <Text style={[styles.nextCopy, { color: t.muted }]}>until Level 13</Text>
          <View style={{ marginTop: 15 }}>
            <ProgressBar value={0.66} />
          </View>
        </GlassPanel>
      </View>

      <SectionHeader title="Active quest" right="View quests" />

      <Pressable onPress={() => router.push('/(tabs)/quests')}>
        <GlassPanel style={{ borderColor: `${t.accent}42` }}>
          <View style={styles.questTop}>
            <View style={styles.questText}>
              <Text style={[styles.questType, { color: t.accent }]}>WEEKLY QUEST</Text>
              <Text style={[styles.questTitle, { color: t.text }]}>Iron Week</Text>
              <Text style={[styles.questCopy, { color: t.muted }]}>Complete 3 resistance workouts this week.</Text>
            </View>
            <View style={[styles.rewardSeal, { borderColor: `${t.positive}55`, backgroundColor: `${t.positive}10` }]}>
              <Text style={[styles.questReward, { color: t.positive }]}>+300</Text>
              <Text style={[styles.rewardUnit, { color: t.muted }]}>XP</Text>
            </View>
          </View>
          <ProgressBar value={2 / 3} accent={t.positive} />
          <View style={styles.questFooter}>
            <Text style={[styles.questProgress, { color: t.muted }]}>2 / 3 complete</Text>
            <Text style={[styles.questArrow, { color: t.accent }]}>›</Text>
          </View>
        </GlassPanel>
      </Pressable>
    </Screen>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.miniStat, { backgroundColor: `${t.surfaceElevated}CC`, borderColor: `${t.border}A8` }]}>
      <Text style={[styles.miniValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandIdentity: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  levelSeal: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  levelSmall: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  levelNumber: { fontSize: 22, fontWeight: '900', lineHeight: 23 },
  greetingBlock: { marginTop: 8, marginBottom: 2, gap: 5 },
  greeting: { fontSize: 15, fontWeight: '700', marginTop: 9 },
  champion: { fontSize: 40, lineHeight: 43 },
  dailyLine: { fontSize: 13, lineHeight: 19, marginTop: 2, maxWidth: 480 },
  commandCard: { padding: spacing.lg },
  commandHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  commandEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.7 },
  commandTitle: { fontSize: 22, fontWeight: '900', marginTop: 4 },
  commandDate: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  progressCenter: { alignItems: 'center', paddingVertical: 22 },
  signalRow: { flexDirection: 'row', gap: 6 },
  workoutCard: { padding: spacing.lg },
  workoutTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  workoutGlyph: { width: 60, height: 60, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  workoutGlyphText: { fontSize: 27 },
  workoutBody: { flex: 1 },
  workoutLabel: { fontWeight: '900', fontSize: 9, letterSpacing: 1.4 },
  workoutTitle: { fontWeight: '900', fontSize: 25, marginTop: 4 },
  workoutMeta: { marginTop: 3, fontSize: 12 },
  workoutStats: { flexDirection: 'row', gap: 8, marginTop: 20 },
  miniStat: { flex: 1, borderRadius: radius.md, borderWidth: 1, padding: 12 },
  miniValue: { fontWeight: '900', fontSize: 16 },
  miniLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5, marginTop: 3 },
  primaryButton: { borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 19 },
  primaryText: { fontWeight: '900', letterSpacing: 1.25, fontSize: 12 },
  twoUp: { flexDirection: 'row', gap: spacing.sm },
  momentumCard: { flex: 1, minHeight: 145 },
  cardEyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  streakRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 9 },
  streakIcon: { fontSize: 14 },
  streakValue: { fontSize: 29, fontWeight: '900' },
  streakUnit: { fontSize: 11, fontWeight: '700' },
  quote: { fontSize: 10, lineHeight: 15, fontStyle: 'italic', marginTop: 9 },
  nextLevel: { fontSize: 27, fontWeight: '900', marginTop: 10 },
  nextCopy: { fontSize: 10, marginTop: 2 },
  questTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 15 },
  questText: { flex: 1 },
  questType: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  questTitle: { fontSize: 19, fontWeight: '900', marginTop: 4 },
  questCopy: { fontSize: 11, lineHeight: 16, marginTop: 4 },
  rewardSeal: { width: 58, height: 58, borderRadius: 29, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  questReward: { fontSize: 14, fontWeight: '900' },
  rewardUnit: { fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  questFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 },
  questProgress: { fontSize: 9, fontWeight: '700' },
  questArrow: { fontSize: 25, lineHeight: 25 },
});
