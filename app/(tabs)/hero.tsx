import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar, Screen, SectionHeader } from '../../src/components';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing } from '../../src/theme';

export default function HeroScreen() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const attributes = [
    { name: 'Strength', value: 153, ratio: 0.76, color: t.strength },
    { name: 'Stamina', value: 128, ratio: 0.64, color: t.stamina },
    { name: 'Agility', value: 104, ratio: 0.52, color: t.agility },
    { name: 'Power', value: 137, ratio: 0.68, color: t.power },
    { name: 'Discipline', value: 171, ratio: 0.86, color: t.discipline },
  ];

  return (
    <Screen>
      <View>
        <Text style={[styles.eyebrow, { color: t.accent }]}>HERO PROFILE</Text>
        <Text style={[styles.title, { color: t.text }]}>The Relentless</Text>
        <Text style={[styles.lede, { color: t.muted }]}>Your training history, translated into identity.</Text>
      </View>

      <Card style={[styles.identity, { backgroundColor: t.heroSurface, borderColor: t.accentSoft }]}>
        <View style={[styles.avatar, { borderColor: t.accent, backgroundColor: t.surfaceElevated }]}>
          <Text style={[styles.avatarRune, { color: t.accent }]}>V</Text>
        </View>
        <View style={styles.identityBody}>
          <Text style={[styles.classText, { color: t.accent }]}>VANGUARD · LEVEL 12</Text>
          <Text style={[styles.name, { color: t.text }]}>Champion</Text>
          <Text style={[styles.copy, { color: t.muted }]}>12 day streak · 43 lifetime sessions</Text>
        </View>
      </Card>

      <Card>
        <View style={styles.xpTop}>
          <View>
            <Text style={[styles.label, { color: t.muted }]}>LEVEL PROGRESS</Text>
            <Text style={[styles.xpTitle, { color: t.text }]}>620 XP to Level 13</Text>
          </View>
          <Text style={[styles.gold, { color: t.accent }]}>1,180 / 1,800</Text>
        </View>
        <ProgressBar value={0.66} />
      </Card>

      <View style={styles.summaryGrid}>
        <Summary value="43" label="WORKOUTS" />
        <Summary value="12" label="DAY STREAK" />
        <Summary value="8" label="BADGES" />
        <Summary value="3" label="TITLES" />
      </View>

      <SectionHeader title="Active title" right="Equipped" />
      <Card style={styles.activeTitleCard}>
        <View style={[styles.titleGlyph, { backgroundColor: t.surfaceElevated, borderColor: t.accentSoft }]}>
          <Text style={[styles.titleGlyphText, { color: t.accent }]}>✦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.activeTitleName, { color: t.text }]}>Iron Vow</Text>
          <Text style={[styles.activeTitleCopy, { color: t.muted }]}>Show up. No excuses.</Text>
        </View>
      </Card>

      <SectionHeader title="Attributes" right="Overall 139" />
      <Card>
        {attributes.map((attribute, index) => (
          <View
            key={attribute.name}
            style={[
              styles.attribute,
              index !== attributes.length - 1 && { borderBottomWidth: 1, borderBottomColor: t.border },
            ]}
          >
            <View style={styles.attributeTop}>
              <Text style={[styles.attributeName, { color: t.text }]}>{attribute.name}</Text>
              <Text style={[styles.attributeValue, { color: attribute.color }]}>{attribute.value}</Text>
            </View>
            <ProgressBar value={attribute.ratio} accent={attribute.color} />
          </View>
        ))}
      </Card>

      <SectionHeader title="Career feats" />
      <View style={styles.feats}>
        <Card style={styles.feat}>
          <Text style={[styles.featValue, { color: t.text }]}>482K</Text>
          <Text style={[styles.featLabel, { color: t.muted }]}>LBS LIFTED</Text>
        </Card>
        <Card style={styles.feat}>
          <Text style={[styles.featValue, { color: t.text }]}>74.2</Text>
          <Text style={[styles.featLabel, { color: t.muted }]}>MILES RUN</Text>
        </Card>
      </View>

      <SectionHeader title="Recent achievements" right="See all" />
      <View style={styles.badges}>
        <Badge symbol="I" name="First 10" detail="10 workouts" />
        <Badge symbol="◆" name="Consistent" detail="7 day streak" />
        <Badge symbol="☀" name="Early Riser" detail="5 AM club" />
      </View>
    </Screen>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <Card style={styles.summary}>
      <Text style={[styles.summaryValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: t.muted }]}>{label}</Text>
    </Card>
  );
}

function Badge({ symbol, name, detail }: { symbol: string; name: string; detail: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <Card style={styles.badge}>
      <View style={[styles.badgeMedal, { borderColor: t.accent, backgroundColor: t.heroSurface }]}>
        <Text style={[styles.badgeSymbol, { color: t.accent }]}>{symbol}</Text>
      </View>
      <Text style={[styles.badgeName, { color: t.text }]}>{name}</Text>
      <Text style={[styles.badgeDetail, { color: t.muted }]}>{detail}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.6 },
  title: { fontSize: 36, lineHeight: 40, fontWeight: '900', letterSpacing: -1.2, marginTop: 4 },
  lede: { fontSize: 13, lineHeight: 20, marginTop: 8 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  avatar: { width: 82, height: 82, borderRadius: 41, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarRune: { fontWeight: '900', fontSize: 34 },
  identityBody: { flex: 1 },
  classText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  name: { fontSize: 27, fontWeight: '900', marginTop: 5 },
  copy: { fontSize: 11, marginTop: 4 },
  xpTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  label: { fontWeight: '800', fontSize: 8, letterSpacing: 1 },
  xpTitle: { fontSize: 16, fontWeight: '900', marginTop: 4 },
  gold: { fontWeight: '900', fontSize: 10, alignSelf: 'flex-end' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summary: { width: '48.5%', minHeight: 88 },
  summaryValue: { fontSize: 25, fontWeight: '900' },
  summaryLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.8, marginTop: 5 },
  activeTitleCard: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  titleGlyph: { width: 48, height: 48, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  titleGlyphText: { fontSize: 20 },
  activeTitleName: { fontSize: 18, fontWeight: '900' },
  activeTitleCopy: { fontSize: 11, marginTop: 3 },
  attribute: { paddingVertical: 12 },
  attributeTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  attributeName: { fontWeight: '800', fontSize: 13 },
  attributeValue: { fontWeight: '900', fontSize: 13 },
  feats: { flexDirection: 'row', gap: spacing.sm },
  feat: { flex: 1 },
  featValue: { fontSize: 27, fontWeight: '900' },
  featLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginTop: 5 },
  badges: { flexDirection: 'row', gap: 8 },
  badge: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  badgeMedal: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badgeSymbol: { fontSize: 17, fontWeight: '900' },
  badgeName: { fontSize: 11, fontWeight: '900', marginTop: 9, textAlign: 'center' },
  badgeDetail: { fontSize: 8, marginTop: 3, textAlign: 'center' },
});
