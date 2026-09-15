import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/components';
import { useVitalTheme } from '../../src/ThemeProvider';
import { spacing } from '../../src/theme';
import { BrandMark, Wordmark } from '../../src/visual';
import {
  AttributeStrip,
  HeroScene,
  LevelMedallion,
  QuestContract,
  RpgFrame,
  SectionPlaque,
} from '../../src/rpgChrome';

export default function TodayScreen() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;

  const worldLine =
    themeId === 'mythicForge'
      ? 'DISCIPLINE • LEGEND • PROGRESSION'
      : themeId === 'celestialPulse'
      ? 'HARMONY • EVOLUTION • ASCENSION'
      : 'STRENGTH • PERFORMANCE • DOMINANCE';

  const actionLabel =
    themeId === 'mythicForge'
      ? 'BEGIN TODAY’S TRIAL'
      : themeId === 'celestialPulse'
      ? 'BEGIN TODAY’S PROTOCOL'
      : 'BEGIN TODAY’S OPERATION';

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <BrandMark size={39} />
          <Wordmark compact />
        </View>
        <View style={[styles.realmTag, { borderColor: `${t.accent}58`, backgroundColor: `${t.background}CC` }]}>
          <Text style={[styles.realmTagText, { color: t.accent }]}>{theme.name.toUpperCase()}</Text>
        </View>
      </View>

      <SectionPlaque>TODAY · YOUR JOURNEY AWAITS</SectionPlaque>

      <RpgFrame strong style={styles.worldCard}>
        <HeroScene />
        <LevelMedallion level={12} current={320} max={600} />
        <AttributeStrip />

        <View style={[styles.worldMotto, { borderTopColor: `${t.accent}28`, borderBottomColor: `${t.accent}28` }]}>
          <Text style={[styles.worldMottoText, { color: t.muted }]}>{worldLine}</Text>
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
              borderColor: `${t.text}24`,
              borderRadius: themeId === 'titanCore' ? 6 : 10,
            },
            ({ boxShadow: `0 10px 30px ${t.accent}35` } as any),
          ]}
        >
          <Text style={[styles.primaryActionText, { color: t.background }]}>{actionLabel}</Text>
        </Pressable>

        <View style={styles.footerLine}>
          <Text style={[styles.footerText, { color: t.muted }]}>REAL EFFORT.</Text>
          <View style={[styles.footerDot, { backgroundColor: t.accent }]} />
          <Text style={[styles.footerText, { color: t.muted }]}>EPIC REWARDS.</Text>
        </View>
      </RpgFrame>

      <View style={styles.bottomPrompt}>
        <Text style={[styles.bottomPromptLabel, { color: t.accent }]}>NEXT</Text>
        <Text style={[styles.bottomPromptTitle, { color: t.text }]}>Choose your trial.</Text>
        <Text style={[styles.bottomPromptCopy, { color: t.muted }]}>Enter the Training Hall to preview the day’s workout and XP opportunity.</Text>
        <Pressable onPress={() => router.push('/(tabs)/train')} style={[styles.ghostButton, { borderColor: `${t.accent}4F` }]}>
          <Text style={[styles.ghostButtonText, { color: t.accent }]}>OPEN TRAINING HALL  ›</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  realmTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  realmTagText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  worldCard: {
    padding: 9,
  },
  worldMotto: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 15,
  },
  worldMottoText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.55,
    textAlign: 'center',
  },
  primaryAction: {
    minHeight: 52,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginHorizontal: 4,
  },
  primaryActionText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  footerLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  footerText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.35,
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  bottomPrompt: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  bottomPromptLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  bottomPromptTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  bottomPromptCopy: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    maxWidth: 480,
  },
  ghostButton: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  ghostButtonText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
});
