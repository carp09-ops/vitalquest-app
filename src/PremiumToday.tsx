import { router } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from './components';
import { useVitalTheme } from './ThemeProvider';

const worlds = {
  mythicForge: {
    hero: '/vitalquest-app/art/premium/mythic-hero.jpg',
    quest: '/vitalquest-app/art/premium/mythic-quest.jpg',
    title: 'Good day, Warrior.',
    subtitle: 'Discipline today. A stronger tomorrow.',
    realm: 'MYTHIC FORGE',
    questTitle: 'Forge Your Strength',
    cta: 'BEGIN TODAY’S TRIAL',
    quote: 'DISCIPLINE BUILDS FREEDOM',
  },
  celestialPulse: {
    hero: '/vitalquest-app/art/today-celestial.svg',
    quest: '/vitalquest-app/art/today-celestial.svg',
    title: 'Rise Again.',
    subtitle: 'Small steps. Massive tomorrows.',
    realm: 'CELESTIAL PULSE',
    questTitle: 'Align Your Energy',
    cta: 'BEGIN TODAY’S PROTOCOL',
    quote: 'HARMONY CREATES POWER',
  },
  titanCore: {
    hero: '/vitalquest-app/art/today-titan.svg',
    quest: '/vitalquest-app/art/today-titan.svg',
    title: 'BUILT DIFFERENT.',
    subtitle: 'Discomfort today. Dominance tomorrow.',
    realm: 'TITAN CORE',
    questTitle: 'Hit Your Numbers',
    cta: 'BEGIN TODAY’S OPERATION',
    quote: 'PROGRESS IS A CHOICE',
  },
} as const;

function web(style: Record<string, unknown>) {
  return Platform.OS === 'web' ? (style as any) : undefined;
}

export default function PremiumToday() {
  const { themeId, theme } = useVitalTheme();
  const w = worlds[themeId];
  const t = theme.tokens;
  const displayFont = themeId === 'mythicForge' ? 'Georgia' : themeId === 'titanCore' ? 'Arial Narrow' : 'Avenir Next';

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={[styles.wordmark, { color: t.text, fontFamily: displayFont }]}>Vital<Text style={{ color: t.accent }}>Quest</Text></Text>
          <Text style={[styles.brandTag, { color: t.muted }]}>TRAIN TODAY. BECOME MORE.</Text>
        </View>
        <View style={[styles.realmPill, { borderColor: `${t.accent}88`, backgroundColor: `${t.background}E8` }]}>
          <Text style={[styles.realmPillText, { color: t.accent }]}>{w.realm}</Text>
        </View>
      </View>

      <View style={[styles.heroShell, { borderColor: `${t.accent}80`, backgroundColor: t.background }, web({ boxShadow: `0 28px 70px rgba(0,0,0,.52), inset 0 0 0 1px ${t.accent}16` })]}>
        <ImageBackground source={{ uri: w.hero }} resizeMode="cover" style={styles.heroArt} imageStyle={styles.heroImage}>
          <View style={styles.heroTopFade} />
          <View style={styles.heroBottomFade} />
          <View style={styles.heroMetaRow}>
            <View style={[styles.artBadge, { borderColor: `${t.accent}8A`, backgroundColor: `${t.background}D8` }]}>
              <Text style={[styles.artBadgeText, { color: t.accent }]}>{w.realm}</Text>
            </View>
            <View style={[styles.artBadge, { borderColor: `${t.accent}8A`, backgroundColor: `${t.background}D8` }]}>
              <Text style={[styles.artBadgeText, { color: t.text }]}>LV 12</Text>
            </View>
          </View>
          <View style={styles.heroCopy}>
            <Text style={[styles.heroTitle, { color: t.text, fontFamily: displayFont }]}>{w.title}</Text>
            <Text style={[styles.heroSubtitle, { color: '#F4F0E8' }]}>{w.subtitle}</Text>
          </View>
        </ImageBackground>

        <View style={styles.levelArea}>
          <View style={[styles.levelRing, { borderColor: t.accent, backgroundColor: t.heroSurface }, web({ boxShadow: `0 0 42px ${t.accent}2E` })]}>
            <View style={[styles.levelCore, { borderColor: `${t.accent}55`, backgroundColor: `${t.background}F8` }]}>
              <Text style={[styles.levelNumber, { color: t.text }]}>12</Text>
              <Text style={[styles.levelLabel, { color: t.accent }]}>LEVEL</Text>
              <Text style={[styles.levelXp, { color: t.muted }]}>320 / 600 XP</Text>
            </View>
          </View>
          <View style={[styles.xpTrack, { backgroundColor: t.surfaceElevated }]}>
            <View style={[styles.xpFill, { backgroundColor: t.accent, width: '53%' }, web({ boxShadow: `0 0 18px ${t.accent}55` })]} />
          </View>
        </View>

        <View style={styles.statGrid}>
          <StatModule label="STRENGTH" value="+12%" tint={t.strength} />
          <StatModule label="STAMINA" value="+8%" tint={t.stamina} />
          <StatModule label="DISCIPLINE" value="+10%" tint={t.discipline} />
          <StatModule label="RECOVERY" value="+6%" tint={t.positive} />
        </View>
      </View>

      <View style={styles.quoteRow}>
        <View style={[styles.hairline, { backgroundColor: `${t.accent}45` }]} />
        <Text style={[styles.quote, { color: t.accent }]}>{w.quote}</Text>
        <View style={[styles.hairline, { backgroundColor: `${t.accent}45` }]} />
      </View>

      <View style={[styles.questShell, { borderColor: `${t.accent}70`, backgroundColor: `${t.surface}F4` }, web({ boxShadow: '0 22px 58px rgba(0,0,0,.45)' })]}>
        <ImageBackground source={{ uri: w.quest }} resizeMode="cover" style={styles.questArt} imageStyle={styles.questImage}>
          <View style={[styles.questArtShade, { backgroundColor: `${t.background}84` }]} />
          <View style={[styles.questType, { borderColor: `${t.accent}65`, backgroundColor: `${t.background}D8` }]}>
            <Text style={[styles.questTypeText, { color: t.accent }]}>TODAY’S QUEST</Text>
          </View>
        </ImageBackground>

        <View style={styles.questBody}>
          <Text style={[styles.questTitle, { color: t.text, fontFamily: displayFont }]}>{w.questTitle}</Text>
          <Text style={[styles.questDescription, { color: t.muted }]}>Complete today’s prescribed workout and keep your progression moving.</Text>

          <View style={styles.objectives}>
            <Objective label="Complete workout" done={false} />
            <Objective label="Log all working sets" done={false} />
            <Objective label="Protect your streak" done />
          </View>

          <View style={[styles.rewardRow, { borderTopColor: `${t.border}B0` }]}>
            <View>
              <Text style={[styles.rewardLabel, { color: t.muted }]}>QUEST REWARD</Text>
              <Text style={[styles.rewardValue, { color: t.accent }]}>+210 XP · +10 Discipline</Text>
            </View>
            <View style={[styles.rewardGem, { borderColor: `${t.accent}88`, backgroundColor: `${t.accent}10` }]}>
              <Text style={[styles.rewardGemText, { color: t.accent }]}>XP</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => router.push({ pathname: '/workout', params: { templateId: 'push' } })}
          style={[styles.primaryButton, { backgroundColor: t.accent, borderColor: `${t.text}30` }, web({ boxShadow: `0 12px 34px ${t.accent}42` })]}
        >
          <Text style={[styles.primaryButtonText, { color: t.background }]}>{w.cta}</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionKicker, { color: t.accent }]}>DAILY OBJECTIVES</Text>
        <Text style={[styles.sectionCount, { color: t.muted }]}>1 / 3</Text>
      </View>

      <View style={styles.dailyGrid}>
        <DailyCard label="Log a Workout" value="0 / 1" />
        <DailyCard label="Hit 10,000 Steps" value="7,842" />
        <DailyCard label="Drink 80 oz Water" value="64 oz" />
      </View>
    </Screen>
  );
}

function StatModule({ label, value, tint }: { label: string; value: string; tint: string }) {
  const { theme } = useVitalTheme();
  return (
    <View style={[styles.statModule, { borderColor: `${tint}55`, backgroundColor: `${theme.tokens.background}C8` }]}>
      <View style={[styles.statGlow, { backgroundColor: `${tint}1A` }]} />
      <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.tokens.text }]}>{label}</Text>
    </View>
  );
}

function Objective({ label, done }: { label: string; done?: boolean }) {
  const { theme } = useVitalTheme();
  return (
    <View style={styles.objectiveRow}>
      <View style={[styles.check, { borderColor: done ? theme.tokens.positive : theme.tokens.muted, backgroundColor: done ? `${theme.tokens.positive}22` : 'transparent' }]}>
        <View style={[styles.checkDot, { backgroundColor: done ? theme.tokens.positive : 'transparent' }]} />
      </View>
      <Text style={[styles.objectiveText, { color: done ? theme.tokens.text : theme.tokens.muted }]}>{label}</Text>
    </View>
  );
}

function DailyCard({ label, value }: { label: string; value: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.dailyCard, { borderColor: t.border, backgroundColor: `${t.surface}E8` }]}>
      <View style={[styles.dailyTick, { backgroundColor: t.accent }]} />
      <Text style={[styles.dailyLabel, { color: t.text }]}>{label}</Text>
      <Text style={[styles.dailyValue, { color: t.muted }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 2 },
  wordmark: { fontSize: 29, fontWeight: '900', letterSpacing: -1.1 },
  brandTag: { fontSize: 7, fontWeight: '800', letterSpacing: 1.8, marginTop: 3 },
  realmPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 },
  realmPillText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.8 },
  heroShell: { borderWidth: 1, borderRadius: 20, padding: 7, overflow: 'hidden' },
  heroArt: { height: 330, justifyContent: 'space-between', padding: 14 },
  heroImage: { borderRadius: 14 },
  heroTopFade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,5,7,.12)' },
  heroBottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 180, backgroundColor: 'rgba(3,5,7,.58)' },
  heroMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  artBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  artBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.35 },
  heroCopy: { marginTop: 'auto', paddingBottom: 22, maxWidth: 355 },
  heroTitle: { fontSize: 38, lineHeight: 41, fontWeight: '900', textShadowColor: 'rgba(0,0,0,.85)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  heroSubtitle: { fontSize: 12, lineHeight: 18, fontWeight: '700', marginTop: 7, textShadowColor: 'rgba(0,0,0,.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 },
  levelArea: { alignItems: 'center', marginTop: -45, zIndex: 10, paddingHorizontal: 14 },
  levelRing: { width: 138, height: 138, borderRadius: 69, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  levelCore: { width: 116, height: 116, borderRadius: 58, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  levelNumber: { fontSize: 40, lineHeight: 42, fontWeight: '900' },
  levelLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  levelXp: { fontSize: 8, fontWeight: '700', marginTop: 4 },
  xpTrack: { width: '88%', height: 5, borderRadius: 99, overflow: 'hidden', marginTop: 10 },
  xpFill: { height: '100%', borderRadius: 99 },
  statGrid: { flexDirection: 'row', gap: 7, padding: 14, paddingTop: 18 },
  statModule: { flex: 1, minHeight: 82, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  statGlow: { position: 'absolute', width: 54, height: 54, borderRadius: 27, top: 5 },
  statValue: { fontSize: 15, fontWeight: '900' },
  statLabel: { fontSize: 7, fontWeight: '900', letterSpacing: .8, marginTop: 8 },
  quoteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  hairline: { height: 1, flex: 1 },
  quote: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  questShell: { borderWidth: 1, borderRadius: 18, overflow: 'hidden', padding: 7 },
  questArt: { height: 128, justifyContent: 'flex-start', padding: 12 },
  questImage: { borderRadius: 12 },
  questArtShade: { ...StyleSheet.absoluteFillObject, borderRadius: 12 },
  questType: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  questTypeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.25 },
  questBody: { padding: 14, paddingTop: 16 },
  questTitle: { fontSize: 27, lineHeight: 31, fontWeight: '900' },
  questDescription: { fontSize: 11, lineHeight: 17, marginTop: 6, maxWidth: 430 },
  objectives: { gap: 10, marginTop: 16 },
  objectiveRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  checkDot: { width: 8, height: 8, borderRadius: 4 },
  objectiveText: { fontSize: 11, fontWeight: '700' },
  rewardRow: { borderTopWidth: 1, marginTop: 16, paddingTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rewardLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.2 },
  rewardValue: { fontSize: 13, fontWeight: '900', marginTop: 4 },
  rewardGem: { width: 50, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }] },
  rewardGemText: { fontSize: 11, fontWeight: '900', transform: [{ rotate: '-45deg' }] },
  primaryButton: { margin: 8, marginTop: 0, minHeight: 56, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontSize: 11, fontWeight: '900', letterSpacing: 1.3 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  sectionKicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  sectionCount: { fontSize: 10, fontWeight: '800' },
  dailyGrid: { flexDirection: 'row', gap: 8 },
  dailyCard: { flex: 1, borderWidth: 1, borderRadius: 13, minHeight: 92, padding: 12, overflow: 'hidden' },
  dailyTick: { width: 18, height: 2, borderRadius: 99 },
  dailyLabel: { fontSize: 10, fontWeight: '900', lineHeight: 14, marginTop: 12 },
  dailyValue: { fontSize: 10, fontWeight: '800', marginTop: 7 },
});
