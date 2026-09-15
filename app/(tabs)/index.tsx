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
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;

  return (
    <Screen>
      <View style={styles.brandRow}>
        <View style={styles.brandIdentity}>
          <BrandMark size={42} />
          <Wordmark compact />
        </View>
        <View
          style={[
            styles.levelSeal,
            {
              borderColor: `${t.accent}72`,
              backgroundColor: `${t.surface}EE`,
              borderRadius: themeId === 'titanCore' ? 10 : 28,
            },
          ]}
        >
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

      {themeId === 'mythicForge' ? <MythicCommand /> : null}
      {themeId === 'celestialPulse' ? <CelestialCommand /> : null}
      {themeId === 'titanCore' ? <TitanCommand /> : null}

      <SectionHeader title="Today's training" right="Push · ~55 min" />

      {themeId === 'mythicForge' ? <MythicWorkout /> : null}
      {themeId === 'celestialPulse' ? <CelestialWorkout /> : null}
      {themeId === 'titanCore' ? <TitanWorkout /> : null}

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
      <ActiveQuest />
    </Screen>
  );
}

function MythicCommand() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <GlassPanel style={[styles.mythicCommand, { borderColor: `${t.accent}66` }]} elevated>
      <View style={[styles.mythicRule, { backgroundColor: t.accent }]} />
      <View style={styles.mythicCrownRow}>
        <Text style={[styles.mythicRune, { color: t.accent }]}>✦</Text>
        <Text style={[styles.mythicKicker, { color: t.accent }]}>THE DAY'S DECREE</Text>
        <Text style={[styles.mythicRune, { color: t.accent }]}>✦</Text>
      </View>
      <Text style={[styles.mythicTitle, { color: t.text }]}>Stay in motion.</Text>
      <Text style={[styles.mythicCopy, { color: t.muted }]}>The forge rewards consistency before intensity.</Text>
      <View style={styles.mythicRingWrap}>
        <ProgressRing value={0.78} size={190} stroke={13} label="Daily progress" valueText="78%" footer="3 / 5 quests" />
      </View>
      <View style={styles.mythicStats}>
        <MythicStat glyph="↗" value="7,842" label="STEPS" />
        <View style={[styles.mythicDivider, { backgroundColor: `${t.accent}2A` }]} />
        <MythicStat glyph="⚔" value="1 / 1" label="TRAIN" />
        <View style={[styles.mythicDivider, { backgroundColor: `${t.accent}2A` }]} />
        <MythicStat glyph="◒" value="GOOD" label="RECOVER" />
      </View>
      <View style={[styles.mythicFooter, { borderTopColor: `${t.accent}30` }]}>
        <Text style={[styles.mythicFooterText, { color: t.muted }]}>DISCIPLINE BONUS ACTIVE</Text>
        <Text style={[styles.mythicFooterText, { color: t.accent }]}>+12%</Text>
      </View>
    </GlassPanel>
  );
}

function MythicStat({ glyph, value, label }: { glyph: string; value: string; label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={styles.mythicStat}>
      <Text style={[styles.mythicStatGlyph, { color: t.accent }]}>{glyph}</Text>
      <Text style={[styles.mythicStatValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.mythicStatLabel, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

function CelestialCommand() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <GlassPanel style={[styles.celestialCommand, { borderColor: `${t.secondary}52` }]} elevated>
      <View style={styles.celestialHeader}>
        <View>
          <Text style={[styles.celestialKicker, { color: t.secondary }]}>VITAL SYSTEM // ONLINE</Text>
          <Text style={[styles.celestialTitle, { color: t.text }]}>Daily trajectory</Text>
        </View>
        <View style={[styles.systemDot, { backgroundColor: t.positive, boxShadow: `0 0 16px ${t.positive}` } as any]} />
      </View>

      <View style={styles.celestialMain}>
        <View style={styles.celestialRingColumn}>
          <ProgressRing value={0.78} size={174} stroke={10} label="Trajectory" valueText="78%" footer="ON COURSE" />
        </View>
        <View style={styles.celestialGrid}>
          <CelestialMetric code="MOV" value="7,842" label="steps" />
          <CelestialMetric code="TRN" value="1/1" label="session" />
          <CelestialMetric code="RCV" value="GOOD" label="recovery" />
          <CelestialMetric code="QST" value="3/5" label="objectives" />
        </View>
      </View>

      <View style={[styles.celestialScanline, { backgroundColor: `${t.secondary}20` }]} />
      <View style={styles.celestialFooter}>
        <Text style={[styles.celestialFooterText, { color: t.muted }]}>NEXT SYNC</Text>
        <Text style={[styles.celestialFooterValue, { color: t.accent }]}>+210 XP potential</Text>
      </View>
    </GlassPanel>
  );
}

function CelestialMetric({ code, value, label }: { code: string; value: string; label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.celestialMetric, { borderColor: `${t.secondary}32`, backgroundColor: `${t.surfaceElevated}98` }]}>
      <Text style={[styles.celestialCode, { color: t.secondary }]}>{code}</Text>
      <Text style={[styles.celestialValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.celestialLabel, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

function TitanCommand() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.titanCommand, { backgroundColor: `${t.surface}F5`, borderColor: t.border }]}>
      <View style={[styles.titanRail, { backgroundColor: t.accent }]} />
      <View style={styles.titanHeader}>
        <View>
          <Text style={[styles.titanKicker, { color: t.secondary }]}>DAILY OUTPUT</Text>
          <Text style={[styles.titanTitle, { color: t.text }]}>78%</Text>
        </View>
        <View style={styles.titanScoreRight}>
          <Text style={[styles.titanScoreLabel, { color: t.muted }]}>QUESTS</Text>
          <Text style={[styles.titanScoreValue, { color: t.text }]}>3 / 5</Text>
        </View>
      </View>
      <View style={[styles.titanTrack, { backgroundColor: t.surfaceElevated }]}>
        <View style={[styles.titanFill, { width: '78%', backgroundColor: t.secondary }]} />
      </View>
      <View style={styles.titanMetricRow}>
        <TitanMetric label="MOVE" value="7,842" />
        <TitanMetric label="TRAIN" value="1 / 1" />
        <TitanMetric label="RECOVER" value="GOOD" />
      </View>
      <View style={[styles.titanCallout, { borderColor: `${t.accent}54`, backgroundColor: `${t.accent}12` }]}>
        <Text style={[styles.titanCalloutLabel, { color: t.accent }]}>TODAY'S TARGET</Text>
        <Text style={[styles.titanCalloutText, { color: t.text }]}>Finish the work. Preserve the streak.</Text>
      </View>
    </View>
  );
}

function TitanMetric({ label, value }: { label: string; value: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={styles.titanMetric}>
      <Text style={[styles.titanMetricLabel, { color: t.muted }]}>{label}</Text>
      <Text style={[styles.titanMetricValue, { color: t.text }]}>{value}</Text>
    </View>
  );
}

function MythicWorkout() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <GlassPanel style={[styles.mythicWorkout, { borderColor: `${t.accent}55` }]}>
      <View style={styles.mythicWorkoutHeader}>
        <View style={[styles.crest, { borderColor: `${t.accent}72`, backgroundColor: `${t.accent}0C` }]}>
          <Text style={[styles.crestIcon, { color: t.accent }]}>⚔</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.workoutLabel, { color: t.accent }]}>RECOMMENDED TRIAL</Text>
          <Text style={[styles.mythicWorkoutTitle, { color: t.text }]}>Push Day</Text>
          <Text style={[styles.workoutMeta, { color: t.muted }]}>Chest · Shoulders · Triceps</Text>
        </View>
      </View>
      <View style={[styles.mythicWorkoutRule, { backgroundColor: `${t.accent}35` }]} />
      <View style={styles.workoutStats}>
        <MiniStat value="9" label="WORKING SETS" />
        <MiniStat value="55" label="MINUTES" />
        <MiniStat value="+~210" label="EST. XP" />
      </View>
      <StartButton label="ENTER TRIAL" />
    </GlassPanel>
  );
}

function CelestialWorkout() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <GlassPanel style={[styles.celestialWorkout, { borderColor: `${t.secondary}50` }]}>
      <View style={styles.celestialWorkoutTop}>
        <View>
          <Text style={[styles.celestialKicker, { color: t.secondary }]}>TRAINING PROTOCOL 01</Text>
          <Text style={[styles.celestialWorkoutTitle, { color: t.text }]}>PUSH // UPPER</Text>
          <Text style={[styles.workoutMeta, { color: t.muted }]}>Strength focus · 55 min · +~210 XP</Text>
        </View>
        <View style={[styles.protocolBadge, { borderColor: `${t.accent}55`, backgroundColor: `${t.accent}10` }]}>
          <Text style={[styles.protocolBadgeText, { color: t.accent }]}>READY</Text>
        </View>
      </View>
      <View style={styles.celestialExerciseLine}>
        {['Bench', 'Incline DB', 'OHP'].map((item) => (
          <View key={item} style={[styles.exerciseChip, { borderColor: `${t.secondary}32`, backgroundColor: `${t.surfaceElevated}92` }]}>
            <Text style={[styles.exerciseChipText, { color: t.text }]}>{item}</Text>
          </View>
        ))}
      </View>
      <StartButton label="START PROTOCOL" />
    </GlassPanel>
  );
}

function TitanWorkout() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.titanWorkout, { backgroundColor: `${t.surface}F5`, borderColor: t.border }]}>
      <View style={[styles.titanWorkoutBand, { backgroundColor: t.accent }]}>
        <Text style={[styles.titanWorkoutBandText, { color: t.text }]}>TODAY // PUSH</Text>
      </View>
      <View style={styles.titanWorkoutBody}>
        <Text style={[styles.titanWorkoutTitle, { color: t.text }]}>POWER BLOCK</Text>
        <Text style={[styles.workoutMeta, { color: t.muted }]}>Chest · Shoulders · Triceps</Text>
        <View style={styles.titanWorkoutStats}>
          <TitanMetric label="SETS" value="9" />
          <TitanMetric label="TIME" value="55M" />
          <TitanMetric label="XP" value="210" />
        </View>
        <StartButton label="START WORK" />
      </View>
    </View>
  );
}

function StartButton({ label }: { label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <Pressable
      style={[styles.primaryButton, { backgroundColor: t.accent }, ({ boxShadow: `0 12px 28px ${t.accent}38` } as any)]}
      onPress={() => router.push({ pathname: '/workout', params: { templateId: 'push' } })}
    >
      <Text style={[styles.primaryText, { color: t.background }]}>{label}</Text>
    </Pressable>
  );
}

function ActiveQuest() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <Pressable onPress={() => router.push('/(tabs)/quests')}>
      <GlassPanel
        style={[
          styles.questCard,
          { borderColor: themeId === 'celestialPulse' ? `${t.secondary}42` : `${t.accent}42` },
        ]}
      >
        <View style={styles.questTop}>
          <View style={styles.questText}>
            <Text style={[styles.questType, { color: t.accent }]}>WEEKLY QUEST</Text>
            <Text style={[styles.questTitle, { color: t.text }]}>Iron Week</Text>
            <Text style={[styles.questCopy, { color: t.muted }]}>Complete 3 resistance workouts this week.</Text>
          </View>
          <View
            style={[
              styles.rewardSeal,
              {
                borderColor: `${t.positive}55`,
                backgroundColor: `${t.positive}10`,
                borderRadius: themeId === 'titanCore' ? 8 : 29,
              },
            ]}
          >
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
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View
      style={[
        styles.miniStat,
        {
          backgroundColor: `${t.surfaceElevated}CC`,
          borderColor: `${t.border}A8`,
          borderRadius: themeId === 'titanCore' ? 8 : radius.md,
        },
      ]}
    >
      <Text style={[styles.miniValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandIdentity: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  levelSeal: { width: 56, height: 56, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  levelSmall: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  levelNumber: { fontSize: 22, fontWeight: '900', lineHeight: 23 },
  greetingBlock: { marginTop: 8, marginBottom: 2, gap: 5 },
  greeting: { fontSize: 15, fontWeight: '700', marginTop: 9 },
  champion: { fontSize: 40, lineHeight: 43 },
  dailyLine: { fontSize: 13, lineHeight: 19, marginTop: 2, maxWidth: 480 },

  mythicCommand: { padding: spacing.lg, alignItems: 'stretch' },
  mythicRule: { height: 1, opacity: 0.5, marginHorizontal: 34, marginBottom: 14 },
  mythicCrownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  mythicRune: { fontSize: 10 },
  mythicKicker: { fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  mythicTitle: { textAlign: 'center', fontFamily: 'Georgia', fontSize: 27, fontWeight: '700', marginTop: 8 },
  mythicCopy: { textAlign: 'center', fontFamily: 'Georgia', fontSize: 12, fontStyle: 'italic', marginTop: 6 },
  mythicRingWrap: { alignItems: 'center', paddingVertical: 22 },
  mythicStats: { flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between' },
  mythicStat: { flex: 1, alignItems: 'center', paddingVertical: 5 },
  mythicStatGlyph: { fontSize: 17 },
  mythicStatValue: { fontSize: 16, fontWeight: '900', marginTop: 5 },
  mythicStatLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2, marginTop: 3 },
  mythicDivider: { width: 1, marginVertical: 4 },
  mythicFooter: { borderTopWidth: 1, marginTop: 18, paddingTop: 13, flexDirection: 'row', justifyContent: 'space-between' },
  mythicFooterText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },

  celestialCommand: { padding: spacing.lg },
  celestialHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  celestialKicker: { fontSize: 8, fontWeight: '900', letterSpacing: 1.7 },
  celestialTitle: { fontSize: 23, fontWeight: '800', marginTop: 5, letterSpacing: 0.2 },
  systemDot: { width: 10, height: 10, borderRadius: 5 },
  celestialMain: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 16 },
  celestialRingColumn: { flex: 1.05, alignItems: 'center' },
  celestialGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  celestialMetric: { width: '47%', minHeight: 72, borderWidth: 1, borderRadius: 13, padding: 9, justifyContent: 'center' },
  celestialCode: { fontSize: 7, fontWeight: '900', letterSpacing: 1.2 },
  celestialValue: { fontSize: 15, fontWeight: '900', marginTop: 5 },
  celestialLabel: { fontSize: 8, marginTop: 2 },
  celestialScanline: { height: 1, marginTop: 18 },
  celestialFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  celestialFooterText: { fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  celestialFooterValue: { fontSize: 9, fontWeight: '900' },

  titanCommand: { borderWidth: 1, borderRadius: 12, padding: spacing.lg, overflow: 'hidden', position: 'relative' },
  titanRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 7 },
  titanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: 7 },
  titanKicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.6 },
  titanTitle: { fontSize: 58, lineHeight: 61, fontWeight: '900', letterSpacing: -3, fontFamily: 'Arial Narrow' },
  titanScoreRight: { alignItems: 'flex-end', paddingBottom: 7 },
  titanScoreLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.3 },
  titanScoreValue: { fontSize: 22, fontWeight: '900', marginTop: 4 },
  titanTrack: { height: 12, marginTop: 14, marginLeft: 7, overflow: 'hidden', transform: [{ skewX: '-10deg' }] },
  titanFill: { height: '100%' },
  titanMetricRow: { flexDirection: 'row', marginTop: 18, marginLeft: 7, gap: 8 },
  titanMetric: { flex: 1 },
  titanMetricLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  titanMetricValue: { fontSize: 18, fontWeight: '900', marginTop: 3 },
  titanCallout: { borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 18, marginLeft: 7 },
  titanCalloutLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  titanCalloutText: { fontSize: 13, fontWeight: '800', marginTop: 4 },

  mythicWorkout: { padding: spacing.lg },
  mythicWorkoutHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  crest: { width: 66, height: 76, borderWidth: 1, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  crestIcon: { fontSize: 26 },
  mythicWorkoutTitle: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '700', marginTop: 4 },
  mythicWorkoutRule: { height: 1, marginTop: 18 },
  celestialWorkout: { padding: spacing.lg },
  celestialWorkoutTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  celestialWorkoutTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 1.3, marginTop: 5 },
  protocolBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  protocolBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  celestialExerciseLine: { flexDirection: 'row', gap: 7, marginTop: 18 },
  exerciseChip: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  exerciseChipText: { fontSize: 9, fontWeight: '800' },
  titanWorkout: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  titanWorkoutBand: { paddingHorizontal: 16, paddingVertical: 8 },
  titanWorkoutBandText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  titanWorkoutBody: { padding: spacing.lg },
  titanWorkoutTitle: { fontFamily: 'Arial Narrow', fontSize: 30, fontWeight: '900', letterSpacing: -0.8 },
  titanWorkoutStats: { flexDirection: 'row', gap: 8, marginTop: 18 },

  workoutLabel: { fontWeight: '900', fontSize: 9, letterSpacing: 1.4 },
  workoutMeta: { marginTop: 3, fontSize: 12 },
  workoutStats: { flexDirection: 'row', gap: 8, marginTop: 18 },
  miniStat: { flex: 1, borderWidth: 1, padding: 12 },
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

  questCard: { padding: spacing.md },
  questTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 15 },
  questText: { flex: 1 },
  questType: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  questTitle: { fontSize: 19, fontWeight: '900', marginTop: 4 },
  questCopy: { fontSize: 11, lineHeight: 16, marginTop: 4 },
  rewardSeal: { width: 58, height: 58, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  questReward: { fontSize: 14, fontWeight: '900' },
  rewardUnit: { fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  questFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 },
  questProgress: { fontSize: 9, fontWeight: '700' },
  questArrow: { fontSize: 25, lineHeight: 25 },
});
