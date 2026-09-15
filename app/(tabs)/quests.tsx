import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar, Screen, SectionHeader } from '../../src/components';
import { quests } from '../../src/data';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing } from '../../src/theme';
import { DisplayText, GlassPanel, ThemePill } from '../../src/visual';

type QuestTab = 'Active' | 'Completed' | 'Guild';

export default function QuestsScreen() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const [tab, setTab] = useState<QuestTab>('Active');

  return (
    <Screen>
      <View style={styles.heading}>
        <ThemePill>Quest board</ThemePill>
        <DisplayText style={styles.title}>Conquer what’s next.</DisplayText>
        <Text style={[styles.lede, { color: t.muted }]}>Bigger goals. A stronger you. Every objective turns real effort into visible progress.</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: `${t.surface}D8`, borderColor: t.border }]}>
        {(['Active', 'Completed', 'Guild'] as QuestTab[]).map((item) => {
          const active = item === tab;
          return (
            <Pressable
              key={item}
              onPress={() => setTab(item)}
              style={[styles.tab, active && { backgroundColor: t.surfaceElevated, borderColor: `${t.accent}55` }]}
            >
              <Text style={[styles.tabText, { color: active ? t.accent : t.muted }]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'Active' ? (
        <>
          <GlassPanel style={[styles.mainQuest, { borderColor: `${t.accent}48` }]} elevated>
            <View style={[styles.questScene, { backgroundColor: `${t.heroSurface}F2`, borderColor: `${t.accent}28` }]}>
              <View style={[styles.sceneOrb, { borderColor: `${t.accent}2E` }]} />
              <View style={[styles.sceneOrbSmall, { borderColor: `${t.secondary}25` }]} />
              <View style={styles.sceneMountainOne} />
              <View style={styles.sceneMountainTwo} />
              <Text style={[styles.sceneWords, { color: t.text }]}>HIGHER{`\n`}STRONGER{`\n`}FURTHER</Text>
            </View>

            <View style={styles.mainTop}>
              <Text style={[styles.mainKicker, { color: t.accent }]}>MAIN QUEST</Text>
              <Text style={[styles.mainReward, { color: t.positive }]}>LEGENDARY REWARD</Text>
            </View>
            <Text style={[styles.mainTitle, { color: t.text }]}>Forge a Stronger You</Text>
            <Text style={[styles.mainCopy, { color: t.muted }]}>Complete five cornerstone objectives across training, movement, recovery, and consistency.</Text>
            <View style={styles.mainProgressRow}>
              <Text style={[styles.mainProgress, { color: t.text }]}>3 / 5 objectives</Text>
              <Text style={[styles.mainPercent, { color: t.accent }]}>60%</Text>
            </View>
            <ProgressBar value={0.6} />
            <View style={styles.mainFooter}>
              <Text style={[styles.mainFooterText, { color: t.muted }]}>Title unlock: The Forged</Text>
              <Text style={[styles.mainArrow, { color: t.accent }]}>›</Text>
            </View>
          </GlassPanel>

          <SectionHeader title="Daily & weekly" right={`${quests.length} active`} />

          {quests.map((quest, index) => {
            const ratio = Math.min(1, quest.progress / quest.target);
            return (
              <GlassPanel key={quest.title}>
                <View style={styles.questTop}>
                  <View style={[styles.questIcon, { backgroundColor: `${t.accent}0F`, borderColor: `${t.accent}35` }]}>
                    <Text style={[styles.questIconText, { color: t.accent }]}>{index === 0 ? '◆' : index === 1 ? '↟' : '↗'}</Text>
                  </View>
                  <View style={styles.body}>
                    <Text style={[styles.questType, { color: t.accent }]}>{index === 0 ? 'WEEKLY' : 'MILESTONE'}</Text>
                    <Text style={[styles.questTitle, { color: t.text }]}>{quest.title}</Text>
                    <Text style={[styles.description, { color: t.muted }]}>{quest.description}</Text>
                  </View>
                  <View style={[styles.rewardPill, { borderColor: `${t.positive}38`, backgroundColor: `${t.positive}0D` }]}>
                    <Text style={[styles.reward, { color: t.positive }]}>{quest.reward}</Text>
                  </View>
                </View>
                <ProgressBar value={ratio} accent={index === 0 ? t.positive : t.accent} />
                <View style={styles.progressRow}>
                  <Text style={[styles.progressText, { color: t.muted }]}>{quest.progress}</Text>
                  <Text style={[styles.progressText, { color: t.muted }]}>{quest.target}</Text>
                </View>
              </GlassPanel>
            );
          })}
        </>
      ) : (
        <GlassPanel style={styles.emptyState}>
          <Text style={[styles.emptySymbol, { color: t.accent }]}>{tab === 'Completed' ? '✓' : '◇'}</Text>
          <Text style={[styles.emptyTitle, { color: t.text }]}>{tab === 'Completed' ? 'Quest history is coming.' : 'Guild quests unlock later.'}</Text>
          <Text style={[styles.emptyCopy, { color: t.muted }]}>
            {tab === 'Completed'
              ? 'Completed objectives will become a permanent record of your progression.'
              : 'Cooperative boss battles and shared quest chains will live here without changing the core app navigation.'}
          </Text>
        </GlassPanel>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 5 },
  title: { fontSize: 38, lineHeight: 42, marginTop: 7 },
  lede: { fontSize: 13, lineHeight: 20, maxWidth: 540, marginTop: 2 },
  tabs: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.md, padding: 4, gap: 4 },
  tab: { flex: 1, minHeight: 40, borderRadius: radius.sm, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 10, fontWeight: '900' },
  mainQuest: { padding: spacing.md },
  questScene: { minHeight: 170, borderWidth: 1, borderRadius: radius.md, overflow: 'hidden', marginBottom: 18, justifyContent: 'flex-end', padding: 16 },
  sceneOrb: { position: 'absolute', width: 170, height: 170, borderRadius: 85, borderWidth: 1, right: -35, top: -46 },
  sceneOrbSmall: { position: 'absolute', width: 112, height: 112, borderRadius: 56, borderWidth: 1, right: 18, top: 8 },
  sceneMountainOne: { position: 'absolute', bottom: -8, left: -30, width: 0, height: 0, borderLeftWidth: 95, borderRightWidth: 95, borderBottomWidth: 92, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'rgba(255,255,255,.055)', transform: [{ rotate: '180deg' }] },
  sceneMountainTwo: { position: 'absolute', bottom: -18, right: 55, width: 0, height: 0, borderLeftWidth: 72, borderRightWidth: 72, borderBottomWidth: 72, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'rgba(255,255,255,.035)', transform: [{ rotate: '180deg' }] },
  sceneWords: { alignSelf: 'flex-end', textAlign: 'right', fontSize: 10, lineHeight: 16, fontWeight: '900', letterSpacing: 2.1 },
  mainTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  mainKicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  mainReward: { fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  mainTitle: { fontSize: 28, fontWeight: '900', marginTop: 11 },
  mainCopy: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  mainProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, marginBottom: 9 },
  mainProgress: { fontSize: 11, fontWeight: '800' },
  mainPercent: { fontSize: 11, fontWeight: '900' },
  mainFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  mainFooterText: { fontSize: 10, fontWeight: '700' },
  mainArrow: { fontSize: 25, lineHeight: 25 },
  questTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  questIcon: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  questIconText: { fontSize: 13, fontWeight: '900' },
  body: { flex: 1 },
  questType: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  questTitle: { fontWeight: '900', fontSize: 17, marginTop: 3 },
  description: { lineHeight: 18, marginTop: 4, fontSize: 11 },
  rewardPill: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  reward: { fontWeight: '900', fontSize: 9 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  progressText: { fontSize: 9, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 44 },
  emptySymbol: { fontSize: 34, fontWeight: '900' },
  emptyTitle: { fontSize: 20, fontWeight: '900', marginTop: 14, textAlign: 'center' },
  emptyCopy: { fontSize: 12, lineHeight: 19, marginTop: 8, textAlign: 'center', maxWidth: 430 },
});
