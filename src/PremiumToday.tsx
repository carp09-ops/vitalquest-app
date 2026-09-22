import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { IconArt, VQIconName } from './IconArt';
import { useVitalTheme } from './ThemeProvider';
import { APP_BASE } from './artAssets';

type WorldId = 'mythicForge' | 'celestialPulse' | 'titanCore';

type WorldSpec = {
  name: string;
  overline: string;
  title: string;
  vow: string;
  className: string;
  hero: string;
  focus: string;
  metal: string;
  panel: string;
  panelDeep: string;
  border: string;
  accent: string;
  text: string;
  muted: string;
  strength: string;
  stamina: string;
  agility: string;
  vitality: string;
  buttonText: string;
  glow: string;
};

const WORLD: Record<WorldId, WorldSpec> = {
  mythicForge: {
    name: 'MYTHIC FORGE',
    overline: 'THE IRON PATH',
    title: 'Forge the hero\nbehind the numbers.',
    vow: 'Discipline builds freedom.',
    className: 'Arclight Vanguard',
    hero: `${APP_BASE}/art/premium/mythic-hero.jpg`,
    focus: `${APP_BASE}/art/premium/mythic-quest.jpg`,
    metal: '#C79A4A',
    panel: 'rgba(13,16,18,.91)',
    panelDeep: 'rgba(5,7,8,.97)',
    border: 'rgba(209,165,82,.48)',
    accent: '#E3B968',
    text: '#F8F3E9',
    muted: '#AFA99E',
    strength: '#F07662',
    stamina: '#73D59B',
    agility: '#70B7F4',
    vitality: '#E3B968',
    buttonText: '#171008',
    glow: 'rgba(227,185,104,.26)',
  },
  celestialPulse: {
    name: 'CELESTIAL PULSE',
    overline: 'THE ASCENDANT PATH',
    title: 'Find the rhythm.\nRise beyond it.',
    vow: 'Momentum becomes ascension.',
    className: 'Astral Wayfinder',
    hero: `${APP_BASE}/art/today-celestial-premium.webp`,
    focus: `${APP_BASE}/art/today-celestial-premium.webp`,
    metal: '#D9E9FF',
    panel: 'rgba(14,21,35,.89)',
    panelDeep: 'rgba(7,12,24,.97)',
    border: 'rgba(185,218,255,.46)',
    accent: '#BBD8FF',
    text: '#F5F9FF',
    muted: '#A9B8D0',
    strength: '#FF8E9C',
    stamina: '#76E2BA',
    agility: '#79C7FF',
    vitality: '#D6C6FF',
    buttonText: '#07101E',
    glow: 'rgba(151,194,255,.30)',
  },
  titanCore: {
    name: 'TITAN CORE',
    overline: 'THE ASCENSION PROTOCOL',
    title: 'Build capacity.\nBreak the ceiling.',
    vow: 'Progress is engineered.',
    className: 'Titan Operative',
    hero: `${APP_BASE}/art/today-titan-premium.webp`,
    focus: `${APP_BASE}/art/today-titan-premium.webp`,
    metal: '#8BD7F2',
    panel: 'rgba(8,17,23,.92)',
    panelDeep: 'rgba(3,9,13,.98)',
    border: 'rgba(92,204,239,.42)',
    accent: '#74D8F6',
    text: '#F1FBFF',
    muted: '#94ADB8',
    strength: '#FF735F',
    stamina: '#5BE2B3',
    agility: '#64C6FF',
    vitality: '#FFC46D',
    buttonText: '#041014',
    glow: 'rgba(94,218,246,.28)',
  },
};

const STATS: Array<{ label: string; value: number; icon: VQIconName; tint: keyof WorldSpec }> = [
  { label: 'STRENGTH', value: 78, icon: 'strength', tint: 'strength' },
  { label: 'STAMINA', value: 62, icon: 'stamina', tint: 'stamina' },
  { label: 'AGILITY', value: 55, icon: 'agility', tint: 'agility' },
  { label: 'VITALITY', value: 48, icon: 'trophy', tint: 'vitality' },
];

const WEEKLY: Array<{ label: string; value: string; detail: string; icon: VQIconName }> = [
  { label: 'WORKOUTS', value: '3 / 5', detail: '2 sessions to target', icon: 'strength' },
  { label: 'TOTAL VOLUME', value: '12,450 lb', detail: '+8% week over week', icon: 'stamina' },
  { label: 'DISTANCE', value: '5.2 mi', detail: '1.8 mi to reward', icon: 'agility' },
  { label: 'XP GAINED', value: '+355', detail: 'This week', icon: 'xp' },
];

const RITUALS = [
  ['Log a workout', false],
  ['Move 10,000 steps', true],
  ['Drink 80 oz water', false],
  ['10 min mobility', false],
] as const;

function web(style: Record<string, unknown>) {
  return Platform.OS === 'web' ? (style as any) : undefined;
}

export default function PremiumToday() {
  const { width } = useWindowDimensions();
  const { themeId, setThemeId } = useVitalTheme();
  const world = WORLD[themeId as WorldId] ?? WORLD.mythicForge;
  const isWide = width >= 820;
  const compact = width < 430;
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    reveal.setValue(0);
    Animated.spring(reveal, {
      toValue: 1,
      speed: 14,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
  }, [themeId, reveal]);

  const revealStyle = useMemo(
    () => ({
      opacity: reveal,
      transform: [
        {
          translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }),
        },
      ],
    }),
    [reveal]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: world.panelDeep }]}>
      <View pointerEvents="none" style={[styles.ambientTop, { backgroundColor: world.glow }]} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.page, isWide && styles.pageWide]}
      >
        <Animated.View style={[styles.shell, revealStyle]}>
          <BrandBar world={world} themeId={themeId as WorldId} setThemeId={setThemeId} compact={compact} />

          <View
            style={[
              styles.heroFrame,
              { borderColor: world.border, backgroundColor: world.panelDeep },
              web({
                boxShadow: `0 30px 80px rgba(0,0,0,.55), 0 0 50px ${world.glow}, inset 0 0 0 1px rgba(255,255,255,.035)`,
              }),
            ]}
          >
            <ImageBackground
              source={{ uri: world.hero }}
              resizeMode="cover"
              style={[styles.heroArt, isWide ? styles.heroArtWide : styles.heroArtMobile]}
              imageStyle={styles.heroArtImage}
            >
              <View style={styles.heroShade} />
              <View style={[styles.heroBottomShade, { backgroundColor: world.panelDeep }]} />
              <View style={styles.heroTopLine}>
                <View style={[styles.microPlaque, { borderColor: world.border, backgroundColor: world.panel }]}>
                  <Text style={[styles.microPlaqueText, { color: world.accent }]}>{world.overline}</Text>
                </View>
                <Text style={[styles.seasonText, { color: world.muted }]}>SEASON I · DAY 7</Text>
              </View>
              <View style={[styles.heroCopy, isWide && styles.heroCopyWide]}>
                <Text style={[styles.heroKicker, { color: world.accent }]}>TODAY · ACTIVE CAMPAIGN</Text>
                <Text style={[styles.heroTitle, compact && styles.heroTitleCompact, { color: world.text }]}>
                  {world.title}
                </Text>
                <Text style={[styles.heroVow, { color: world.text }]}>{world.vow}</Text>
              </View>
            </ImageBackground>

            <View style={[styles.hudColumn, isWide && styles.hudColumnWide]}>
              <HeroIdentity world={world} />
              <View style={styles.statGrid}>
                {STATS.map((stat) => (
                  <StatPlate key={stat.label} stat={stat} world={world} />
                ))}
              </View>
              <View style={styles.miniMetrics}>
                <MiniMetric icon="streak" value="7" label="DAY STREAK" world={world} />
                <MiniMetric icon="strength" value="18" label="WORKOUTS" world={world} />
                <MiniMetric icon="trophy" value="3" label="QUESTS" world={world} />
              </View>
            </View>
          </View>

          <View style={[styles.mainGrid, isWide && styles.mainGridWide]}>
            <FocusCard world={world} />
            <QuestCard world={world} />
            <RitualCard world={world} />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionEyebrow, { color: world.accent }]}>WEEKLY PROGRESSION</Text>
              <Text style={[styles.sectionTitle, { color: world.text }]}>Your real effort, translated.</Text>
            </View>
            <View style={[styles.weekBadge, { borderColor: world.border, backgroundColor: world.panel }]}>
              <Text style={[styles.weekBadgeText, { color: world.muted }]}>WEEK 03</Text>
            </View>
          </View>

          <View style={[styles.weeklyGrid, isWide && styles.weeklyGridWide]}>
            {WEEKLY.map((item) => (
              <View
                key={item.label}
                style={[
                  styles.weekPlate,
                  { backgroundColor: world.panel, borderColor: world.border },
                  web({ boxShadow: '0 16px 38px rgba(0,0,0,.28)' }),
                ]}
              >
                <IconArt name={item.icon} size={43} />
                <View style={styles.weekCopy}>
                  <Text style={[styles.weekLabel, { color: world.muted }]}>{item.label}</Text>
                  <Text style={[styles.weekValue, { color: world.text }]}>{item.value}</Text>
                  <Text style={[styles.weekDetail, { color: world.muted }]}>{item.detail}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.manifesto, { borderColor: world.border, backgroundColor: world.panelDeep }]}>
            <View style={[styles.manifestoSigil, { borderColor: world.border }]}>
              <IconArt name="trophy" size={48} />
            </View>
            <View style={styles.manifestoCopy}>
              <Text style={[styles.manifestoKicker, { color: world.accent }]}>VITALQUEST PRINCIPLE</Text>
              <Text style={[styles.manifestoText, { color: world.text }]}>
                Your character does not level up because you tapped a button. It levels up because you did.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BrandBar({
  world,
  themeId,
  setThemeId,
  compact,
}: {
  world: WorldSpec;
  themeId: WorldId;
  setThemeId: (id: WorldId) => void;
  compact: boolean;
}) {
  return (
    <View style={styles.brandBar}>
      <View>
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact, { color: world.text }]}>
          VITAL<Text style={{ color: world.accent }}>QUEST</Text>
        </Text>
        <Text style={[styles.brandTag, { color: world.muted }]}>REAL EFFORT · HIGHER LEVELS</Text>
      </View>
      <View style={[styles.worldSwitch, { borderColor: world.border, backgroundColor: world.panel }]}>
        {(Object.keys(WORLD) as WorldId[]).map((id) => {
          const active = id === themeId;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`Use ${WORLD[id].name} skin`}
              onPress={() => setThemeId(id)}
              style={[
                styles.worldDotButton,
                active && { backgroundColor: world.accent, borderColor: world.accent },
              ]}
            >
              <View style={[styles.worldDot, { backgroundColor: active ? world.buttonText : WORLD[id].accent }]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function HeroIdentity({ world }: { world: WorldSpec }) {
  return (
    <View
      style={[
        styles.identity,
        { borderColor: world.border, backgroundColor: world.panel },
        web({ backdropFilter: 'blur(20px)' }),
      ]}
    >
      <View style={[styles.levelMedallion, { borderColor: world.accent, backgroundColor: world.panelDeep }]}>
        <Text style={[styles.levelLabel, { color: world.muted }]}>LVL</Text>
        <Text style={[styles.levelNumber, { color: world.text }]}>12</Text>
      </View>
      <View style={styles.identityCopy}>
        <Text style={[styles.identityClass, { color: world.text }]}>{world.className}</Text>
        <View style={styles.xpRow}>
          <Text style={[styles.xpText, { color: world.muted }]}>2,480 / 3,000 XP</Text>
          <Text style={[styles.xpText, { color: world.accent }]}>83%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '83%', backgroundColor: world.accent }]} />
        </View>
      </View>
      <IconArt name="xp" size={44} />
    </View>
  );
}

function StatPlate({
  stat,
  world,
}: {
  stat: (typeof STATS)[number];
  world: WorldSpec;
}) {
  const tint = String(world[stat.tint]);
  return (
    <View style={[styles.statPlate, { borderColor: `${tint}88`, backgroundColor: world.panel }]}>
      <IconArt name={stat.icon} size={30} />
      <Text style={[styles.statLabel, { color: world.muted }]}>{stat.label}</Text>
      <Text style={[styles.statValue, { color: world.text }]}>{stat.value}</Text>
      <View style={styles.statTrack}>
        <View style={[styles.statFill, { backgroundColor: tint, width: `${stat.value}%` }]} />
      </View>
    </View>
  );
}

function MiniMetric({
  icon,
  value,
  label,
  world,
}: {
  icon: VQIconName;
  value: string;
  label: string;
  world: WorldSpec;
}) {
  return (
    <View style={[styles.miniMetric, { borderColor: world.border, backgroundColor: world.panel }]}>
      <IconArt name={icon} size={27} />
      <Text style={[styles.miniMetricValue, { color: world.text }]}>{value}</Text>
      <Text style={[styles.miniMetricLabel, { color: world.muted }]}>{label}</Text>
    </View>
  );
}

function FocusCard({ world }: { world: WorldSpec }) {
  return (
    <View
      style={[
        styles.primaryModule,
        { borderColor: world.border, backgroundColor: world.panelDeep },
        web({ boxShadow: '0 22px 48px rgba(0,0,0,.36)' }),
      ]}
    >
      <ImageBackground source={{ uri: world.focus }} resizeMode="cover" style={styles.focusArt}>
        <View style={styles.moduleArtShade} />
        <View style={[styles.moduleChip, { borderColor: world.border, backgroundColor: world.panel }]}>
          <Text style={[styles.moduleChipText, { color: world.accent }]}>TODAY'S FOCUS</Text>
        </View>
      </ImageBackground>
      <View style={styles.moduleBody}>
        <Text style={[styles.moduleTitle, { color: world.text }]}>Push Day</Text>
        <Text style={[styles.moduleMeta, { color: world.muted }]}>Chest · Shoulders · Triceps</Text>
        <View style={styles.moduleSpecRow}>
          <Text style={[styles.moduleSpec, { color: world.text }]}>4 exercises</Text>
          <Text style={[styles.moduleSpec, { color: world.text }]}>~45 min</Text>
          <Text style={[styles.moduleSpec, { color: world.text }]}>+210 XP</Text>
        </View>
        <Pressable
          onPress={() => router.push({ pathname: '/workout', params: { templateId: 'push' } })}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: pressed ? world.metal : world.accent,
              borderColor: world.metal,
              transform: [{ scale: pressed ? 0.985 : 1 }],
            },
            web({ boxShadow: `0 10px 28px ${world.glow}` }),
          ]}
        >
          <Text style={[styles.ctaText, { color: world.buttonText }]}>START WORKOUT</Text>
          <Text style={[styles.ctaArrow, { color: world.buttonText }]}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

function QuestCard({ world }: { world: WorldSpec }) {
  return (
    <View style={[styles.secondaryModule, { borderColor: world.border, backgroundColor: world.panel }]}>
      <View style={styles.questHeader}>
        <IconArt name="quest" size={48} />
        <View style={styles.questCopy}>
          <Text style={[styles.moduleChipText, { color: world.accent }]}>ACTIVE QUEST</Text>
          <Text style={[styles.questTitle, { color: world.text }]}>Forge Consistency</Text>
        </View>
      </View>
      <Text style={[styles.questDescription, { color: world.muted }]}>
        Complete 5 workouts this week. Every logged session moves the campaign forward.
      </Text>
      <View style={styles.questProgressTop}>
        <Text style={[styles.questProgress, { color: world.text }]}>3 / 5 COMPLETE</Text>
        <Text style={[styles.questReward, { color: world.accent }]}>+500 XP</Text>
      </View>
      <View style={styles.questTrack}>
        <View style={[styles.questFill, { width: '60%', backgroundColor: world.accent }]} />
      </View>
      <Pressable style={styles.textLink}>
        <Text style={[styles.textLinkText, { color: world.accent }]}>VIEW QUEST CHAIN  ›</Text>
      </Pressable>
    </View>
  );
}

function RitualCard({ world }: { world: WorldSpec }) {
  return (
    <View style={[styles.secondaryModule, { borderColor: world.border, backgroundColor: world.panel }]}>
      <View style={styles.ritualHeader}>
        <Text style={[styles.moduleChipText, { color: world.accent }]}>DAILY RITUALS</Text>
        <Text style={[styles.ritualCount, { color: world.muted }]}>1 / 4</Text>
      </View>
      <View style={styles.ritualList}>
        {RITUALS.map(([label, done]) => (
          <View key={label} style={styles.ritualRow}>
            <View
              style={[
                styles.ritualCheck,
                {
                  borderColor: done ? world.stamina : world.border,
                  backgroundColor: done ? `${world.stamina}22` : 'transparent',
                },
              ]}
            >
              {done ? <View style={[styles.ritualDot, { backgroundColor: world.stamina }]} /> : null}
            </View>
            <Text style={[styles.ritualLabel, { color: done ? world.text : world.muted }]}>{label}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.streakLine, { borderTopColor: world.border }]}>
        <IconArt name="streak" size={38} />
        <View>
          <Text style={[styles.streakTitle, { color: world.text }]}>7 day streak</Text>
          <Text style={[styles.streakCopy, { color: world.muted }]}>Protect it before midnight.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, overflow: 'hidden' },
  ambientTop: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: -100,
    height: 250,
    borderRadius: 180,
    opacity: 0.6,
  },
  page: { width: '100%', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 118 },
  pageWide: { paddingHorizontal: 24, paddingTop: 18 },
  shell: { width: '100%', maxWidth: 1180, alignSelf: 'center', gap: 18 },
  brandBar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  wordmark: {
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  wordmarkCompact: { fontSize: 23 },
  brandTag: { marginTop: 4, fontSize: 7, fontWeight: '900', letterSpacing: 1.7 },
  worldSwitch: { flexDirection: 'row', gap: 5, borderWidth: 1, borderRadius: 99, padding: 5 },
  worldDotButton: {
    width: 29,
    height: 29,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.07)',
  },
  worldDot: { width: 8, height: 8, borderRadius: 99 },

  heroFrame: { overflow: 'hidden', borderWidth: 1, borderRadius: 22, minHeight: 620 },
  heroArt: { position: 'relative', overflow: 'hidden' },
  heroArtWide: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '61%', minHeight: 620 },
  heroArtMobile: { height: 430, width: '100%' },
  heroArtImage: { opacity: 0.96 },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.09)' },
  heroBottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 160, opacity: 0.86 },
  heroTopLine: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  microPlaque: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 },
  microPlaqueText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.6 },
  seasonText: { fontSize: 8, fontWeight: '800', letterSpacing: 1.1 },
  heroCopy: { marginTop: 'auto', padding: 18, paddingBottom: 26, maxWidth: 480 },
  heroCopyWide: { padding: 30, paddingBottom: 36 },
  heroKicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginBottom: 8 },
  heroTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -1.3,
    textShadowColor: 'rgba(0,0,0,.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroTitleCompact: { fontSize: 35, lineHeight: 39 },
  heroVow: {
    marginTop: 9,
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  hudColumn: { padding: 12, gap: 10, marginTop: -10 },
  hudColumnWide: {
    width: '44%',
    marginLeft: '56%',
    minHeight: 620,
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  identity: { borderWidth: 1, borderRadius: 14, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 11 },
  levelMedallion: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.3 },
  levelNumber: { fontSize: 26, lineHeight: 28, fontWeight: '900' },
  identityCopy: { flex: 1, minWidth: 0 },
  identityClass: {
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 19,
    fontWeight: '800',
  },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7, marginBottom: 5 },
  xpText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  progressTrack: { height: 6, borderRadius: 99, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,.10)' },
  progressFill: { height: '100%', borderRadius: 99 },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statPlate: { width: '48.7%', minHeight: 106, borderWidth: 1, borderRadius: 12, padding: 10 },
  statLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.1, marginTop: 5 },
  statValue: { fontSize: 24, lineHeight: 27, fontWeight: '900', marginTop: 1 },
  statTrack: { marginTop: 7, height: 4, borderRadius: 99, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,.08)' },
  statFill: { height: '100%', borderRadius: 99 },
  miniMetrics: { flexDirection: 'row', gap: 8 },
  miniMetric: {
    flex: 1,
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  miniMetricValue: { fontSize: 19, lineHeight: 22, fontWeight: '900', marginTop: 1 },
  miniMetricLabel: { fontSize: 6.5, fontWeight: '900', letterSpacing: 0.8, marginTop: 2 },

  mainGrid: { gap: 12 },
  mainGridWide: { flexDirection: 'row', alignItems: 'stretch' },
  primaryModule: { flex: 1.2, overflow: 'hidden', borderWidth: 1, borderRadius: 18 },
  secondaryModule: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 16, minHeight: 270 },
  focusArt: { height: 156, padding: 12 },
  moduleArtShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.24)' },
  moduleChip: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 4, paddingHorizontal: 9, paddingVertical: 6 },
  moduleChipText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.35 },
  moduleBody: { padding: 16 },
  moduleTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 28,
    lineHeight: 31,
    fontWeight: '900',
  },
  moduleMeta: { marginTop: 4, fontSize: 11, fontWeight: '600' },
  moduleSpecRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 13 },
  moduleSpec: { fontSize: 9, fontWeight: '800' },
  cta: {
    minHeight: 52,
    marginTop: 17,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  ctaArrow: { fontSize: 26, lineHeight: 28, fontWeight: '400' },

  questHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  questCopy: { flex: 1 },
  questTitle: {
    marginTop: 3,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 21,
    fontWeight: '800',
  },
  questDescription: { marginTop: 14, fontSize: 10.5, lineHeight: 16 },
  questProgressTop: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  questProgress: { fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  questReward: { fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  questTrack: { height: 7, borderRadius: 99, overflow: 'hidden', marginTop: 7, backgroundColor: 'rgba(255,255,255,.09)' },
  questFill: { height: '100%', borderRadius: 99 },
  textLink: { marginTop: 'auto', paddingTop: 22 },
  textLinkText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },

  ritualHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ritualCount: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  ritualList: { gap: 12, marginTop: 18 },
  ritualRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ritualCheck: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualDot: { width: 8, height: 8, borderRadius: 4 },
  ritualLabel: { fontSize: 10.5, fontWeight: '700' },
  streakLine: { borderTopWidth: 1, marginTop: 'auto', paddingTop: 15, flexDirection: 'row', alignItems: 'center', gap: 10 },
  streakTitle: { fontSize: 11, fontWeight: '900' },
  streakCopy: { fontSize: 8.5, marginTop: 2 },

  sectionHeader: { marginTop: 6, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  sectionEyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  sectionTitle: {
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 24,
    fontWeight: '800',
  },
  weekBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 9, paddingVertical: 7 },
  weekBadgeText: { fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  weeklyGrid: { gap: 9 },
  weeklyGridWide: { flexDirection: 'row' },
  weekPlate: {
    flex: 1,
    minHeight: 116,
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  weekCopy: { flex: 1 },
  weekLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 0.9 },
  weekValue: { fontSize: 18, lineHeight: 22, fontWeight: '900', marginTop: 2 },
  weekDetail: { fontSize: 8, marginTop: 3 },

  manifesto: {
    borderWidth: 1,
    borderRadius: 17,
    minHeight: 120,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  manifestoSigil: { width: 68, height: 68, borderRadius: 34, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  manifestoCopy: { flex: 1 },
  manifestoKicker: { fontSize: 7, fontWeight: '900', letterSpacing: 1.5 },
  manifestoText: {
    maxWidth: 760,
    marginTop: 6,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
});
