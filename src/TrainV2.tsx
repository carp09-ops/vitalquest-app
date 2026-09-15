import { router } from 'expo-router';
import React from 'react';
import {
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
import { templates } from './data';
import { IconArt, VQIconName } from './IconArt';
import { useVitalTheme } from './ThemeProvider';

type WorldId = 'mythicForge' | 'celestialPulse' | 'titanCore';

type World = {
  name: string;
  eyebrow: string;
  title: string;
  copy: string;
  hero: string;
  accent: string;
  text: string;
  muted: string;
  panel: string;
  deep: string;
  border: string;
  glow: string;
  buttonText: string;
};

const WORLDS: Record<WorldId, World> = {
  mythicForge: {
    name: 'MYTHIC FORGE',
    eyebrow: 'THE TRAINING HALL',
    title: 'Choose the trial.\nEarn the power.',
    copy: 'Every session is a combat encounter with yesterday. Pick the discipline, enter the hall, and convert effort into progression.',
    hero: '/vitalquest-app/art/premium/mythic-quest.jpg',
    accent: '#E7BC67', text: '#FFF6E8', muted: '#B7AC9A', panel: 'rgba(14,16,18,.92)', deep: 'rgba(5,7,8,.98)', border: 'rgba(214,164,79,.46)', glow: 'rgba(225,173,83,.24)', buttonText: '#130D07',
  },
  celestialPulse: {
    name: 'CELESTIAL PULSE',
    eyebrow: 'THE MOTION SANCTUM',
    title: 'Enter the rhythm.\nAdvance the signal.',
    copy: 'Training becomes alignment. Choose the protocol that moves your body and pushes your attributes toward ascension.',
    hero: '/vitalquest-app/art/today-celestial-premium.webp',
    accent: '#C8DEFF', text: '#F6FAFF', muted: '#A8BAD2', panel: 'rgba(11,20,34,.91)', deep: 'rgba(5,10,20,.98)', border: 'rgba(181,216,255,.45)', glow: 'rgba(121,181,255,.25)', buttonText: '#06111D',
  },
  titanCore: {
    name: 'TITAN CORE',
    eyebrow: 'THE PERFORMANCE DECK',
    title: 'Select the protocol.\nRaise the ceiling.',
    copy: 'Output is the objective. Enter a calibrated session and turn measurable work into strength, stamina, and momentum.',
    hero: '/vitalquest-app/art/today-titan-premium.webp',
    accent: '#7DDBF7', text: '#F1FBFF', muted: '#9FB5BF', panel: 'rgba(7,16,22,.92)', deep: 'rgba(3,8,12,.98)', border: 'rgba(91,203,238,.43)', glow: 'rgba(91,212,244,.22)', buttonText: '#041015',
  },
};

const TEMPLATE_META: Record<string, { icon: VQIconName; role: string; xp: string; tier: string }> = {
  push: { icon: 'strength', role: 'STRENGTH · POWER', xp: '+210 XP', tier: 'RECOMMENDED' },
  pull: { icon: 'armory', role: 'STRENGTH · CONTROL', xp: '+190 XP', tier: 'AVAILABLE' },
  legs: { icon: 'trophy', role: 'STRENGTH · CAPACITY', xp: '+240 XP', tier: 'AVAILABLE' },
  run: { icon: 'agility', role: 'STAMINA · AGILITY', xp: '+175 XP', tier: 'ENDURANCE' },
};

const web = (s: Record<string, unknown>) => Platform.OS === 'web' ? s as any : undefined;

export default function TrainV2() {
  const { width } = useWindowDimensions();
  const { themeId } = useVitalTheme();
  const world = WORLDS[themeId as WorldId] ?? WORLDS.mythicForge;
  const wide = width >= 760;
  const featured = templates[0];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: world.deep }]}>
      <ImageBackground source={{ uri: world.hero }} resizeMode="cover" style={styles.backdrop} imageStyle={styles.backdropImage} pointerEvents="none">
        <View style={[styles.backdropShade, { backgroundColor: world.deep }]} />
      </ImageBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page, wide && styles.pageWide]}>
        <View style={styles.shell}>
          <View style={styles.brandRow}>
            <View>
              <Text style={[styles.eyebrow, { color: world.accent }]}>{world.eyebrow}</Text>
              <Text style={[styles.title, { color: world.text }]}>{world.title}</Text>
              <Text style={[styles.lede, { color: world.muted }]}>{world.copy}</Text>
            </View>
            {wide ? <View style={[styles.realmPlate, { borderColor: world.border, backgroundColor: world.panel }]}><Text style={[styles.realmText, { color: world.accent }]}>{world.name}</Text></View> : null}
          </View>

          <View style={[styles.readiness, { borderColor: world.border, backgroundColor: world.panel }]}>
            <Readiness icon="streak" value="7" label="DAY STREAK" world={world} />
            <Readiness icon="strength" value="18" label="SESSIONS" world={world} />
            <Readiness icon="xp" value="2,480" label="CURRENT XP" world={world} />
          </View>

          <View style={[styles.featured, wide && styles.featuredWide, { borderColor: world.border, backgroundColor: world.deep }, web({ boxShadow: `0 26px 70px rgba(0,0,0,.52),0 0 36px ${world.glow}` })]}>
            <ImageBackground source={{ uri: world.hero }} resizeMode="cover" style={[styles.featuredArt, wide && styles.featuredArtWide]}>
              <View style={styles.featuredShade} />
              <View style={[styles.featuredBadge, { borderColor: world.border, backgroundColor: world.panel }]}><Text style={[styles.featuredBadgeText, { color: world.accent }]}>TODAY'S RECOMMENDATION</Text></View>
              <View style={styles.artCopy}>
                <Text style={[styles.artKicker, { color: world.accent }]}>PRIMARY TRIAL</Text>
                <Text style={[styles.artTitle, { color: world.text }]}>{featured.name}</Text>
                <Text style={[styles.artSubtitle, { color: world.text }]}>{featured.subtitle}</Text>
              </View>
            </ImageBackground>

            <View style={styles.featuredBody}>
              <View style={styles.featuredHeading}>
                <IconArt name="strength" size={54} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardEyebrow, { color: world.accent }]}>FORGE PATH</Text>
                  <Text style={[styles.cardTitle, { color: world.text }]}>Build upper-body strength</Text>
                </View>
              </View>
              <Text style={[styles.cardCopy, { color: world.muted }]}>A focused resistance session built around pressing strength. Previous working weights are preloaded so logging stays fast on the gym floor.</Text>

              <View style={styles.statRow}>
                <SessionStat value={`${featured.exercises.length}`} label="EXERCISES" world={world} />
                <SessionStat value="9" label="SETS" world={world} />
                <SessionStat value={`~${featured.estimatedMinutes}`} label="MIN" world={world} />
                <SessionStat value="+210" label="XP" world={world} />
              </View>

              <View style={[styles.exercisePreview, { borderTopColor: world.border }]}>
                {featured.exercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.exerciseRow}>
                    <View style={[styles.exerciseIndex, { borderColor: world.border }]}><Text style={[styles.exerciseIndexText, { color: world.accent }]}>{index + 1}</Text></View>
                    <View style={{ flex: 1 }}><Text style={[styles.exerciseName, { color: world.text }]}>{exercise.name}</Text><Text style={[styles.exerciseMeta, { color: world.muted }]}>{exercise.muscle}</Text></View>
                    <Text style={[styles.previous, { color: world.muted }]}>{exercise.previous[0]?.weight ?? '—'} × {exercise.previous[0]?.reps ?? '—'}</Text>
                  </View>
                ))}
              </View>

              <Pressable onPress={() => router.push({ pathname: '/workout', params: { templateId: featured.id } })} style={({ pressed }) => [styles.primary, { backgroundColor: pressed ? world.text : world.accent, borderColor: world.accent }]}>
                <Text style={[styles.primaryText, { color: world.buttonText }]}>ENTER PUSH DAY</Text><Text style={[styles.primaryArrow, { color: world.buttonText }]}>›</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionHead}>
            <View><Text style={[styles.eyebrow, { color: world.accent }]}>AVAILABLE TRIALS</Text><Text style={[styles.sectionTitle, { color: world.text }]}>Choose another path.</Text></View>
            <Text style={[styles.sectionMeta, { color: world.muted }]}>4 ACTIVE TEMPLATES</Text>
          </View>

          <View style={[styles.templateGrid, wide && styles.templateGridWide]}>
            {templates.slice(1).map((template) => {
              const meta = TEMPLATE_META[template.id] ?? TEMPLATE_META.push;
              return (
                <Pressable key={template.id} onPress={() => router.push({ pathname: '/workout', params: { templateId: template.id } })} style={({ pressed }) => [styles.templateCard, { borderColor: world.border, backgroundColor: world.panel, opacity: pressed ? .78 : 1 }]}>
                  <View style={styles.templateTop}>
                    <IconArt name={meta.icon} size={46} />
                    <View style={[styles.tier, { borderColor: world.border }]}><Text style={[styles.tierText, { color: world.accent }]}>{meta.tier}</Text></View>
                  </View>
                  <Text style={[styles.templateName, { color: world.text }]}>{template.name}</Text>
                  <Text style={[styles.templateRole, { color: world.accent }]}>{meta.role}</Text>
                  <Text style={[styles.templateSubtitle, { color: world.muted }]}>{template.subtitle}</Text>
                  <View style={[styles.templateFooter, { borderTopColor: world.border }]}><Text style={[styles.templateTime, { color: world.text }]}>~{template.estimatedMinutes} MIN</Text><Text style={[styles.templateXp, { color: world.accent }]}>{meta.xp}</Text></View>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.customCard, { borderColor: world.border, backgroundColor: world.deep }]}>
            <IconArt name="armory" size={46} />
            <View style={{ flex: 1 }}><Text style={[styles.customTitle, { color: world.text }]}>Custom Loadout</Text><Text style={[styles.customCopy, { color: world.muted }]}>Build a reusable workout from your own exercises, set targets, and progression rules.</Text></View>
            <View style={[styles.lockedChip, { borderColor: world.border }]}><Text style={[styles.lockedText, { color: world.muted }]}>NEXT PASS</Text></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Readiness({ icon, value, label, world }: { icon: VQIconName; value: string; label: string; world: World }) {
  return <View style={styles.readinessItem}><IconArt name={icon} size={30} /><View><Text style={[styles.readinessValue, { color: world.text }]}>{value}</Text><Text style={[styles.readinessLabel, { color: world.muted }]}>{label}</Text></View></View>;
}

function SessionStat({ value, label, world }: { value: string; label: string; world: World }) {
  return <View style={[styles.sessionStat, { borderColor: world.border, backgroundColor: world.panel }]}><Text style={[styles.sessionValue, { color: world.text }]}>{value}</Text><Text style={[styles.sessionLabel, { color: world.muted }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, overflow: 'hidden' },
  backdrop: { ...StyleSheet.absoluteFillObject }, backdropImage: { opacity: .13 }, backdropShade: { ...StyleSheet.absoluteFillObject, opacity: .78 },
  page: { width: '100%', paddingHorizontal: 14, paddingTop: 16, paddingBottom: 118 }, pageWide: { paddingHorizontal: 24, paddingTop: 22 }, shell: { width: '100%', maxWidth: 1180, alignSelf: 'center', gap: 18 },
  brandRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }, eyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 1.6 }, title: { marginTop: 7, fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 38, lineHeight: 42, fontWeight: '900', letterSpacing: -1 }, lede: { marginTop: 8, maxWidth: 670, fontSize: 11.5, lineHeight: 18 },
  realmPlate: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 13, paddingVertical: 9 }, realmText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.3 },
  readiness: { borderWidth: 1, borderRadius: 15, padding: 12, flexDirection: 'row', gap: 8 }, readinessItem: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, readinessValue: { fontSize: 16, lineHeight: 18, fontWeight: '900' }, readinessLabel: { fontSize: 6.5, marginTop: 2, fontWeight: '900', letterSpacing: .8 },
  featured: { borderWidth: 1, borderRadius: 20, overflow: 'hidden' }, featuredWide: { flexDirection: 'row', minHeight: 540 }, featuredArt: { minHeight: 260, padding: 14, justifyContent: 'space-between' }, featuredArtWide: { width: '48%', minHeight: 540 }, featuredShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.27)' }, featuredBadge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 }, featuredBadgeText: { fontSize: 7.5, fontWeight: '900', letterSpacing: 1.15 }, artCopy: { marginTop: 'auto' }, artKicker: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5 }, artTitle: { marginTop: 5, fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 33, lineHeight: 36, fontWeight: '900' }, artSubtitle: { marginTop: 4, fontSize: 11, fontWeight: '700' },
  featuredBody: { flex: 1, padding: 18 }, featuredHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 }, cardEyebrow: { fontSize: 7.5, fontWeight: '900', letterSpacing: 1.3 }, cardTitle: { marginTop: 4, fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 22, lineHeight: 26, fontWeight: '800' }, cardCopy: { marginTop: 12, fontSize: 10.5, lineHeight: 17 },
  statRow: { flexDirection: 'row', gap: 7, marginTop: 16 }, sessionStat: { flex: 1, minHeight: 66, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, sessionValue: { fontSize: 16, fontWeight: '900' }, sessionLabel: { marginTop: 3, fontSize: 6.5, fontWeight: '900', letterSpacing: .75 },
  exercisePreview: { borderTopWidth: 1, marginTop: 18, paddingTop: 8 }, exerciseRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10 }, exerciseIndex: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, exerciseIndexText: { fontSize: 9, fontWeight: '900' }, exerciseName: { fontSize: 11, fontWeight: '900' }, exerciseMeta: { fontSize: 8, marginTop: 2 }, previous: { fontSize: 8.5, fontWeight: '800' },
  primary: { minHeight: 53, marginTop: 14, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, primaryText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.1 }, primaryArrow: { fontSize: 26 },
  sectionHead: { marginTop: 4, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }, sectionTitle: { marginTop: 4, fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 24, fontWeight: '800' }, sectionMeta: { fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  templateGrid: { gap: 10 }, templateGridWide: { flexDirection: 'row' }, templateCard: { flex: 1, minHeight: 218, borderWidth: 1, borderRadius: 16, padding: 14 }, templateTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, tier: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 6 }, tierText: { fontSize: 6.5, fontWeight: '900', letterSpacing: .8 }, templateName: { marginTop: 12, fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 21, fontWeight: '800' }, templateRole: { marginTop: 5, fontSize: 7, fontWeight: '900', letterSpacing: 1 }, templateSubtitle: { marginTop: 6, fontSize: 9.5, lineHeight: 14 }, templateFooter: { marginTop: 'auto', paddingTop: 14, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }, templateTime: { fontSize: 7.5, fontWeight: '900' }, templateXp: { fontSize: 7.5, fontWeight: '900' },
  customCard: { borderWidth: 1, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 }, customTitle: { fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 17, fontWeight: '800' }, customCopy: { marginTop: 3, fontSize: 9, lineHeight: 14 }, lockedChip: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 6 }, lockedText: { fontSize: 6.5, fontWeight: '900', letterSpacing: .8 },
});
