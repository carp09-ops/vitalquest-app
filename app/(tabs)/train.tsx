import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Screen, SectionHeader } from '../../src/components';
import { templates } from '../../src/data';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing } from '../../src/theme';

export default function TrainScreen() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const featured = templates[0];
  const rest = templates.slice(1);

  return (
    <Screen>
      <View>
        <Text style={[styles.eyebrow, { color: t.accent }]}>TRAINING HALL</Text>
        <Text style={[styles.title, { color: t.text }]}>Choose your trial.</Text>
        <Text style={[styles.lede, { color: t.muted }]}>Fast templates. Focused sessions. Progress calculated when the work is done.</Text>
      </View>

      <Card style={[styles.featured, { backgroundColor: t.heroSurface, borderColor: t.accentSoft }]}>
        <View style={styles.featuredTop}>
          <View style={[styles.featuredIcon, { backgroundColor: t.surfaceElevated, borderColor: t.accentSoft }]}>
            <Text style={[styles.featuredIconText, { color: t.accent }]}>{featured.icon}</Text>
          </View>
          <View style={styles.featuredBody}>
            <Text style={[styles.featuredKicker, { color: t.accent }]}>RECOMMENDED TODAY</Text>
            <Text style={[styles.featuredTitle, { color: t.text }]}>{featured.name}</Text>
            <Text style={[styles.featuredSubtitle, { color: t.muted }]}>{featured.subtitle}</Text>
          </View>
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
            <View key={exercise.id} style={[styles.previewRow, index !== featured.exercises.length - 1 && { borderBottomColor: t.border, borderBottomWidth: 1 }]}>
              <View style={[styles.previewNumber, { backgroundColor: t.surfaceElevated }]}>
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
          style={[styles.primary, { backgroundColor: t.accent }]}
          onPress={() => router.push({ pathname: '/workout', params: { templateId: featured.id } })}
        >
          <Text style={[styles.primaryText, { color: t.background }]}>START {featured.name.toUpperCase()}</Text>
        </Pressable>
      </Card>

      <SectionHeader title="Other trials" right="Templates" />

      <View style={styles.grid}>
        {rest.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => router.push({ pathname: '/workout', params: { templateId: template.id } })}
          >
            <Card style={styles.template}>
              <View style={[styles.iconBox, { backgroundColor: t.surfaceElevated, borderColor: t.border }]}>
                <Text style={[styles.icon, { color: t.accent }]}>{template.icon}</Text>
              </View>
              <View style={styles.templateBody}>
                <Text style={[styles.templateName, { color: t.text }]}>{template.name}</Text>
                <Text style={[styles.templateSubtitle, { color: t.muted }]}>{template.subtitle}</Text>
                <Text style={[styles.templateMeta, { color: t.accent }]}>~{template.estimatedMinutes} min</Text>
              </View>
              <Text style={[styles.chevron, { color: t.muted }]}>›</Text>
            </Card>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.outline, { borderColor: t.border }]}>
        <Text style={[styles.outlineText, { color: t.text }]}>+ CREATE CUSTOM TEMPLATE</Text>
      </Pressable>
    </Screen>
  );
}

function PreviewStat({ value, label }: { value: string; label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={[styles.previewStat, { backgroundColor: t.surface }]}>
      <Text style={[styles.previewStatValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.previewStatLabel, { color: t.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.6 },
  title: { fontSize: 36, lineHeight: 40, fontWeight: '900', letterSpacing: -1.2, marginTop: 4 },
  lede: { fontSize: 13, lineHeight: 20, marginTop: 8, maxWidth: 520 },
  featured: { padding: spacing.lg },
  featuredTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featuredIcon: { width: 62, height: 62, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  featuredIconText: { fontSize: 27 },
  featuredBody: { flex: 1 },
  featuredKicker: { fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  featuredTitle: { fontSize: 27, fontWeight: '900', marginTop: 4 },
  featuredSubtitle: { fontSize: 12, marginTop: 3 },
  previewStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  previewStat: { width: '48.5%', borderRadius: radius.md, padding: 12 },
  previewStatValue: { fontSize: 17, fontWeight: '900' },
  previewStatLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.7, marginTop: 3 },
  previewLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.3, marginTop: 22, marginBottom: 5 },
  exercisePreview: { gap: 0 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  previewNumber: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
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
