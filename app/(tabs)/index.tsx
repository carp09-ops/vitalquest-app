import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/components';
import { useVitalTheme } from '../../src/ThemeProvider';
import {
  AttributeStrip,
  HeroIdentity,
  HeroScene,
  LevelMedallion,
  QuestContract,
  RpgFrame,
  SectionPlaque,
} from '../../src/rpgChrome';

export default function TodayScreen() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;

  const actionLabel =
    themeId === 'mythicForge'
      ? 'BEGIN TRIAL'
      : themeId === 'celestialPulse'
      ? 'BEGIN PROTOCOL'
      : 'BEGIN OPERATION';

  const realmWords =
    themeId === 'mythicForge'
      ? ['DISCIPLINE', 'LEGEND', 'HONOR']
      : themeId === 'celestialPulse'
      ? ['HARMONY', 'EVOLUTION', 'ASCENSION']
      : ['STRENGTH', 'PERFORMANCE', 'DOMINANCE'];

  return (
    <Screen>
      <View style={styles.pageColumn}>
        <View style={styles.screenHeader}>
          <SectionPlaque>TODAY</SectionPlaque>
          <Text style={[styles.screenSubtitle, { color: t.muted }]}>YOUR JOURNEY AWAITS</Text>
        </View>

        <RpgFrame strong style={styles.worldCard}>
          <HeroScene />
          <HeroIdentity />
          <LevelMedallion level={12} current={320} max={600} />
          <AttributeStrip />

          <View style={styles.realmWords}>
            {realmWords.map((word, index) => (
              <React.Fragment key={word}>
                {index > 0 ? <View style={[styles.wordDot, { backgroundColor: `${t.accent}72` }]} /> : null}
                <Text style={[styles.realmWord, { color: t.muted }]}>{word}</Text>
              </React.Fragment>
            ))}
          </View>

          <Pressable onPress={() => router.push('/(tabs)/quests')}>
            <QuestContract />
          </Pressable>

          <Pressable
            onPress={() => router.push({ pathname: '/workout', params: { templateId: 'push' } })}
            style={[
              styles.primaryAction,
              {
                backgroundColor: t.accent,
                borderColor: `${t.text}26`,
                borderRadius: themeId === 'titanCore' ? 4 : 7,
              },
              ({ boxShadow: `0 10px 28px ${t.accent}32, inset 0 1px 0 rgba(255,255,255,.18)` } as any),
            ]}
          >
            <Text style={[styles.primaryActionText, { color: t.background }]}>{actionLabel}</Text>
          </Pressable>

          <View style={styles.footerLine}>
            <Text style={[styles.footerText, { color: t.muted }]}>REAL EFFORT</Text>
            <View style={[styles.footerDot, { backgroundColor: t.accent }]} />
            <Text style={[styles.footerText, { color: t.muted }]}>EPIC REWARDS</Text>
          </View>
        </RpgFrame>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageColumn: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  screenHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  screenSubtitle: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: -2,
  },
  worldCard: {
    width: '100%',
  },
  realmWords: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 8,
  },
  realmWord: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.25,
  },
  wordDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  primaryAction: {
    minHeight: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginHorizontal: 4,
  },
  primaryActionText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.55,
  },
  footerLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 5,
  },
  footerText: {
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 1.25,
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
});