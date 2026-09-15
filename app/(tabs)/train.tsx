import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen, SectionHeader } from '../../src/components';
import { templates } from '../../src/data';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing } from '../../src/theme';
import { DisplayText, GlassPanel, ThemePill } from '../../src/visual';

const modeTabs = ['Strength', 'Cardio', 'Mobility', 'Custom'];

export default function TrainScreen() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const featured = templates[0];
  const rest = templates.slice(1);

  return (
    <Screen>
      <View style={styles.heading}>
        <ThemePill>Training hall</ThemePill>
        <DisplayText style={styles.title}>Choose your trial.</DisplayText>
        <Text style={[styles.lede, { color: t.muted }]}>Fast templates. Focused sessions. Progress calculated when the work is done.</Text>
      </View>

      <View style={[styles.modeTabs, { backgroundColor: `${t.surface}D8`, borderColor: t.border }]}>
        {modeTabs.map((mode, index) => (
          <View
            key={mode}
            style={[
              styles.modeTab,
              index === 0 && { backgroundColor: t.surfaceElevated, borderColor: `${t.accent}55` },
            ]}
          >
            <Text style={[styles.modeText, { color: index === 0 ? t.accent : t.muted }]}>{mode}</Text>
          </View>
        ))}
      </View>

      <GlassPanel style={[styles.featured, { borderColor: `${t.accent}48` }]} elevated>
        <View style={[styles.featuredBanner, { backgroundColor: `${t.heroSurface}F2`, borderColor: `${t.accent}25` }]}>
          <View style={styles.bannerGlow} />
          <View style={styles.featuredTop}>
            <View style={[styles.featuredIcon, { backgroundColor: `${t.accent}10`, borderColor: `${t.accent}4A` }]}>
              <Text style={[styles.featuredIconText, { color: t.accent }]}>{featured.icon}</Text>
            </View>
            <View style={styles.featuredBody}>
              <Text style={[styles.featuredKicker, { color: t.accent }]}>RECOMMENDED TODAY</Text>
              <Text style={[styles.featuredTitle, { color: t.text }]}>{featured.name}</Text>
              <Text style={[styles.featuredSubtitle, { color: t.muted }]}>{featured.subtitle}</Text>
            </View>
          </View>
          <Text style={[styles.bannerQuote, { color: t.text }]}>Strength builds more than muscle.</Text>
          <Text style={[styles.bannerSub, { color: t.muted }]}>A focused session. A stronger version of you.</Text>
        </View>

        <View style={styles.previewStats}>
          <PreviewStat value={`${featured.exercises.length}`} label="EXERCISES" />
          <PreviewStat value="9" label="WORKING SETS" />
          <PreviewStat value={`~${featured.estimatedMinutes}`} label="MINUTES" />
          <PreviewStat value="+~210" label="EST. XP" />
        </View>

        <Text style={[styles.previewLabel, { color: t.muted }]}>SESSION PREVIEW</Text>
        <View style={styles.exercisePreview}>
          {featured.exercises.map((exercise, index) => (
            <View
              key={exercise.id}
              style={[
                styles.previewRow,
                index !== featured.exercises.length - 1 && { borderBottomColor: t.border, borderBottomWidth: 1 },
              ]}
            >
              <View style={[styles.previewNumber, { backgroundColor: `${t.accent}0F`, borderColor: `${t.accent}35` }]}>
                <Text style={[styles.previewNumberText, { color: t.accent }]}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.previewName, { color: t.text }]}>{exercise.name}</Text>
                <Text style={[styles.previewMuscle, { color: t.muted }]}>{exercise.muscle}</Text>
              </View>
              <Text style={[styles.previewSets, { color: t.accent }]}>3 sets</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[
            styles.primary,
            { backgroundColor: t.accent },
            ({ boxShadow: `0 12px 28px ${t.accent}35` } as any),
          ]}
          onPress={() => router.push({ pathname: '/workout', params: { templateId: featured.id } })}
        >
          <Text style={[styles.primaryText, { color: t.background }]}>START {featured.name.toUpperCase()}</Text>
        </Pressable>
      </GlassPanel>

      <SectionHeader title="Other trials" right="Templates" />

      <View style={styles.grid}>
        {rest.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => router.push({ pathname: '/workout', params: { templateId: template.id } })}
          >
            <GlassPanel style={styles.template}>
              <View style={[styles.iconBox, { backgroundColor: `${t.surfaceElevated}D8`, borderColor: `${t.accent}28` }]}>
                <Text style={[styles.icon, { color: t.accent }]}>{template.icon}</Text>
              </View>
              <View style={styles.templateBody}>
                <Text style={[styles.templateName, { color: t.text }]}>{template.name}</Text>
                <Text style={[styles.templateSubtitle, { color: t.muted }]}>{template.subtitle}</Text>
                <Text style={[styles.templateMeta, { color: t.accent }]}>~{template.estimatedMinutes} min</Text>
              </View>
              <Text style={[styles.chevron, { color: t.muted }]}>›</Text>
            </GlassPanel>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.outline, { borderColor: `${t.accent}35`, backgroundColor: `${t.surface}B8` }]}>
        <Text style={[styles.outlineText, { color: t.text }]}>+ CREATE CUSTOM TEMPLATE</Text>
      </Pressable>
    </Screen>
  );
}

function PreviewStat({ value, label }: { value: string; label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.previewStat, { backgroundColor: `${t.surface}D8`, borderColor: `${t.border}B0` }]}>
      <Text style={[styles.previewStatValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.previewStatLabel, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 5 },
  title: { fontSize: 38, lineHeight: 42, marginTop: 7 },
  lede: { fontSize: 13, lineHeight: 20, maxWidth: 520, marginTop: 2 },
  modeTabs: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.md, padding: 4, gap: 4 },
  modeTab: { flex: 1, minHeight: 38, borderRadius: radius.sm, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  modeText: { fontSize: 9, fontWeight: '900' },
  featured: { padding: spacing.md },
  featuredBanner: { borderWidth: 1, borderRadius: radius.md, padding: 17, overflow: 'hidden', minHeight: 180 },
  bannerGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, right: -70, top: -80, backgroundColor: 'rgba(255,255,255,.025)' },
  featuredTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featuredIcon: { width: 62, height: 62, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  featuredIconText: { fontSize: 27 },
  featuredBody: { flex: 1 },
  featuredKicker: { fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  featuredTitle: { fontSize: 27, fontWeight: '900', marginTop: 4 },
  featuredSubtitle: { fontSize: 12, marginTop: 3 },
  bannerQuote: { fontSize: 16, fontWeight: '900', marginTop: 25 },
  bannerSub: { fontSize: 10, lineHeight: 15, marginTop: 4 },
  previewStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  previewStat: { width: '48.5%', borderRadius: radius.md, borderWidth: 1, padding: 12 },
  previewStatValue: { fontSize: 17, fontWeight: '900' },
  previewStatLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.7, marginTop: 3 },
  previewLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.3, marginTop: 22, marginBottom: 5 },
  exercisePreview: { gap: 0 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  previewNumber: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  previewNumberText: { fontSize: 11, fontWeight: '900' },
  previewName: { fontSize: 14, fontWeight: '900' },
  previewMuscle: { fontSize: 10, marginTop: 2 },
  previewSets: { fontSize: 9, fontWeight: '900' },
  primary: { borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 18 },
  primaryText: { fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  grid: { gap: spacing.sm },
  template: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: { width: 52, height: 52, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22 },
  templateBody: { flex: 1 },
  templateName: { fontSize: 18, fontWeight: '900' },
  templateSubtitle: { marginTop: 2, fontSize: 12 },
  templateMeta: { marginTop: 6, fontSize: 10, fontWeight: '800' },
  chevron: { fontSize: 30, fontWeight: '300' },
  outline: { borderWidth: 1, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.sm },
  outlineText: { fontWeight: '900', letterSpacing: 1, fontSize: 11 },
});
