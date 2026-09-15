import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Card,
  Eyebrow,
  ProgressBar,
  Screen,
  SectionHeader,
  Title,
} from '../../src/components';
import { colors, radius, spacing } from '../../src/theme';

export default function TodayScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Eyebrow>VitalQuest</Eyebrow>
          <Title>Forge the hero.</Title>
        </View>
        <View style={styles.levelSeal}>
          <Text style={styles.levelSmall}>LVL</Text>
          <Text style={styles.levelNumber}>12</Text>
        </View>
      </View>

      <Card style={styles.heroCard}>
        <Text style={styles.heroClass}>VANGUARD</Text>
        <Text style={styles.heroName}>The Relentless</Text>
        <Text style={styles.heroCopy}>
          620 XP until Level 13. One strong session puts the next reward within reach.
        </Text>
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>1,180 / 1,800 XP</Text>
          <Text style={styles.xpPercent}>66%</Text>
        </View>
        <ProgressBar value={0.66} />
      </Card>

      <SectionHeader title="Today's training" right="Push · 55 min" />

      <Card>
        <Text style={styles.workoutLabel}>RECOMMENDED</Text>
        <Text style={styles.workoutTitle}>Push Day</Text>
        <Text style={styles.workoutMeta}>Chest · Shoulders · Triceps</Text>

        <View style={styles.miniStats}>
          <MiniStat value="9" label="Working sets" />
          <MiniStat value="55" label="Minutes" />
          <MiniStat value="+~210" label="Est. XP" />
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: '/workout',
              params: { templateId: 'push' },
            })
          }
        >
          <Text style={styles.primaryText}>START WORKOUT</Text>
        </Pressable>
      </Card>

      <SectionHeader title="Active quests" right="View all" />

      <Card>
        <View style={styles.questTop}>
          <View>
            <Text style={styles.questTitle}>Iron Week</Text>
            <Text style={styles.questCopy}>2 of 3 lifting sessions</Text>
          </View>
          <Text style={styles.questReward}>+300 XP</Text>
        </View>
        <ProgressBar value={2 / 3} accent={colors.success} />
      </Card>

      <SectionHeader title="Momentum" />

      <View style={styles.momentumRow}>
        <Card style={styles.momentumCard}>
          <Text style={styles.momentumValue}>7</Text>
          <Text style={styles.momentumLabel}>DAY STREAK</Text>
        </Card>
        <Card style={styles.momentumCard}>
          <Text style={styles.momentumValue}>3</Text>
          <Text style={styles.momentumLabel}>PRs THIS MONTH</Text>
        </Card>
      </View>
    </Screen>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  levelSeal: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  levelSmall: {
    color: colors.gold,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  levelNumber: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  heroCard: {
    minHeight: 190,
    justifyContent: 'flex-end',
    backgroundColor: '#15130F',
    borderColor: colors.goldSoft,
  },
  heroClass: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  heroName: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 4,
  },
  heroCopy: {
    color: colors.muted,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 18,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
  xpPercent: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 12,
  },
  workoutLabel: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  workoutTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 28,
    marginTop: 6,
  },
  workoutMeta: {
    color: colors.muted,
    marginTop: 3,
  },
  miniStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  miniStat: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    padding: 12,
  },
  miniValue: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
  },
  miniLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryText: {
    color: '#15120C',
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  questTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  questTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
  },
  questCopy: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  questReward: {
    color: colors.success,
    fontWeight: '900',
  },
  momentumRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  momentumCard: {
    flex: 1,
  },
  momentumValue: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 32,
  },
  momentumLabel: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.9,
    marginTop: 4,
  },
});
