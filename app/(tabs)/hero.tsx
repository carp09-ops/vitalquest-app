import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar, Screen, SectionHeader } from '../../src/components';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing } from '../../src/theme';
import { BrandMark, DisplayText, GlassPanel, ProgressRing, ThemePill } from '../../src/visual';

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
      <View style={styles.heading}>
        <ThemePill>Hero profile</ThemePill>
        <DisplayText style={styles.title}>The Relentless</DisplayText>
        <Text style={[styles.lede, { color: t.muted }]}>Your training history, translated into identity.</Text>
      </View>

      <GlassPanel style={[styles.heroCard, { borderColor: `${t.accent}48` }]} elevated>
        <View style={styles.heroVisual}>
          <View style={[styles.haloLarge, { borderColor: `${t.accent}20` }]} />
          <View style={[styles.haloSmall, { borderColor: `${t.secondary}28` }]} />
          <View style={[styles.portrait, { backgroundColor: `${t.surfaceElevated}D8`, borderColor: `${t.accent}62` }]}>
            <BrandMark size={66} />
          </View>
        </View>

        <View style={styles.heroIdentity}>
          <Text style={[styles.classText, { color: t.accent }]}>VANGUARD · LEVEL 12</Text>
          <Text style={[styles.name, { color: t.text }]}>Champion</Text>
          <Text style={[styles.copy, { color: t.muted }]}>12 day streak · 43 lifetime sessions</Text>
          <View style={[styles.titlePlate, { backgroundColor: `${t.accent}10`, borderColor: `${t.accent}38` }]}>
            <Text style={[styles.titlePlateLabel, { color: t.muted }]}>ACTIVE TITLE</Text>
            <Text style={[styles.titlePlateName, { color: t.text }]}>Iron Vow</Text>
            <Text style={[styles.titlePlateCopy, { color: t.muted }]}>Show up. No excuses.</Text>
          </View>
        </View>
      </GlassPanel>

      <GlassPanel style={styles.levelCard}>
        <ProgressRing value={0.66} size={146} stroke={10} label="Level" valueText="12" footer="1,180 / 1,800 XP" />
        <View style={styles.levelBody}>
          <Text style={[styles.label, { color: t.muted }]}>NEXT ASCENSION</Text>
          <Text style={[styles.xpTitle, { color: t.text }]}>620 XP to Level 13</Text>
          <Text style={[styles.xpCopy, { color: t.muted }]}>One focused week can put the next tier within reach.</Text>
          <View style={{ marginTop: 14 }}>
            <ProgressBar value={0.66} />
          </View>
        </View>
      </GlassPanel>

      <View style={styles.summaryGrid}>
        <Summary value="43" label="WORKOUTS" glyph="⚔" />
        <Summary value="12" label="DAY STREAK" glyph="◆" />
        <Summary value="8" label="BADGES" glyph="✦" />
        <Summary value="3" label="TITLES" glyph="◇" />
      </View>

      <SectionHeader title="Attributes" right="Overall 139" />
      <GlassPanel>
        {attributes.map((attribute, index) => (
          <View
            key={attribute.name}
            style={[
              styles.attribute,
              index !== attributes.length - 1 && { borderBottomWidth: 1, borderBottomColor: t.border },
            ]}
          >
            <View style={styles.attributeTop}>
              <View style={styles.attributeNameWrap}>
                <View style={[styles.attributeDot, { backgroundColor: attribute.color }]} />
                <Text style={[styles.attributeName, { color: t.text }]}>{attribute.name}</Text>
              </View>
              <Text style={[styles.attributeValue, { color: attribute.color }]}>{attribute.value}</Text>
            </View>
            <ProgressBar value={attribute.ratio} accent={attribute.color} />
          </View>
        ))}
      </GlassPanel>

      <SectionHeader title="Career feats" />
      <View style={styles.feats}>
        <GlassPanel style={styles.feat}>
          <Text style={[styles.featValue, { color: t.text }]}>482K</Text>
          <Text style={[styles.featLabel, { color: t.muted }]}>LBS LIFTED</Text>
          <Text style={[styles.featSub, { color: t.accent }]}>Titan path · 48%</Text>
        </GlassPanel>
        <GlassPanel style={styles.feat}>
          <Text style={[styles.featValue, { color: t.text }]}>74.2</Text>
          <Text style={[styles.featLabel, { color: t.muted }]}>MILES RUN</Text>
          <Text style={[styles.featSub, { color: t.secondary }]}>Road path · 37%</Text>
        </GlassPanel>
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

function Summary({ value, label, glyph }: { value: string; label: string; glyph: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <GlassPanel style={styles.summary}>
      <View style={styles.summaryTop}>
        <Text style={[styles.summaryGlyph, { color: t.accent }]}>{glyph}</Text>
        <Text style={[styles.summaryValue, { color: t.text }]}>{value}</Text>
      </View>
      <Text style={[styles.summaryLabel, { color: t.muted }]}>{label}</Text>
    </GlassPanel>
  );
}

function Badge({ symbol, name, detail }: { symbol: string; name: string; detail: string }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <GlassPanel style={styles.badge}>
      <View
        style={[
          styles.badgeMedal,
          { borderColor: t.accent, backgroundColor: `${t.accent}0D` },
          ({ boxShadow: `0 0 24px ${t.accent}24` } as any),
        ]}
      >
        <Text style={[styles.badgeSymbol, { color: t.accent }]}>{symbol}</Text>
      </View>
      <Text style={[styles.badgeName, { color: t.text }]}>{name}</Text>
      <Text style={[styles.badgeDetail, { color: t.muted }]}>{detail}</Text>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 5 },
  title: { fontSize: 38, lineHeight: 42, marginTop: 6 },
  lede: { fontSize: 13, lineHeight: 20, marginTop: 2 },
  heroCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.lg, minHeight: 210 },
  heroVisual: { width: 126, height: 146, alignItems: 'center', justifyContent: 'center' },
  haloLarge: { position: 'absolute', width: 126, height: 126, borderRadius: 63, borderWidth: 1 },
  haloSmall: { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 1 },
  portrait: { width: 86, height: 86, borderRadius: 43, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  heroIdentity: { flex: 1 },
  classText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  name: { fontSize: 29, fontWeight: '900', marginTop: 5 },
  copy: { fontSize: 11, marginTop: 4 },
  titlePlate: { borderWidth: 1, borderRadius: radius.md, padding: 11, marginTop: 15 },
  titlePlateLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.1 },
  titlePlateName: { fontSize: 15, fontWeight: '900', marginTop: 3 },
  titlePlateCopy: { fontSize: 9, marginTop: 2 },
  levelCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.lg },
  levelBody: { flex: 1 },
  label: { fontWeight: '900', fontSize: 8, letterSpacing: 1.2 },
  xpTitle: { fontSize: 19, fontWeight: '900', marginTop: 5 },
  xpCopy: { fontSize: 10, lineHeight: 15, marginTop: 6 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summary: { width: '48.5%', minHeight: 92 },
  summaryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryGlyph: { fontSize: 14 },
  summaryValue: { fontSize: 26, fontWeight: '900' },
  summaryLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.8, marginTop: 8 },
  attribute: { paddingVertical: 12 },
  attributeTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  attributeNameWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attributeDot: { width: 7, height: 7, borderRadius: 4 },
  attributeName: { fontWeight: '800', fontSize: 13 },
  attributeValue: { fontWeight: '900', fontSize: 13 },
  feats: { flexDirection: 'row', gap: spacing.sm },
  feat: { flex: 1 },
  featValue: { fontSize: 27, fontWeight: '900' },
  featLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginTop: 5 },
  featSub: { fontSize: 8, fontWeight: '800', marginTop: 9 },
  badges: { flexDirection: 'row', gap: 8 },
  badge: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  badgeMedal: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badgeSymbol: { fontSize: 18, fontWeight: '900' },
  badgeName: { fontSize: 11, fontWeight: '900', marginTop: 9, textAlign: 'center' },
  badgeDetail: { fontSize: 8, marginTop: 3, textAlign: 'center' },
});
