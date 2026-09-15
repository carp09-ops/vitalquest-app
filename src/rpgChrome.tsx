import React from 'react';
import { Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useVitalTheme } from './ThemeProvider';
import { radius } from './theme';

function webStyle(style: Record<string, unknown>) {
  return Platform.OS === 'web' ? (style as any) : undefined;
}

const heroArt = {
  mythicForge: '/vitalquest-app/art/today-mythic.svg',
  celestialPulse: '/vitalquest-app/art/today-celestial.svg',
  titanCore: '/vitalquest-app/art/today-titan.svg',
} as const;

export function RpgFrame({
  children,
  style,
  strong = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  strong?: boolean;
}) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const angular = themeId === 'titanCore';
  const glow = themeId === 'celestialPulse';
  const border = strong ? t.accent : themeId === 'celestialPulse' ? t.secondary : t.accentSoft;

  return (
    <View
      style={[
        styles.frame,
        {
          borderColor: `${border}${strong ? 'A8' : '72'}`,
          backgroundColor: `${t.background}EE`,
          borderRadius: angular ? 8 : radius.md,
        },
        webStyle({
          boxShadow: glow
            ? `0 0 0 1px ${t.secondary}16, 0 16px 50px rgba(0,0,0,.42), inset 0 0 28px ${t.secondary}0D`
            : themeId === 'mythicForge'
            ? `0 18px 48px rgba(0,0,0,.48), inset 0 0 25px ${t.accent}09`
            : `0 18px 48px rgba(0,0,0,.52), inset 5px 0 0 ${t.accent}10`,
        }),
        style,
      ]}
    >
      <CornerOrnaments />
      {themeId === 'titanCore' ? <View style={[styles.titanRail, { backgroundColor: t.accent }]} /> : null}
      {children}
    </View>
  );
}

function CornerOrnaments() {
  const { themeId, theme } = useVitalTheme();
  const c = theme.tokens.accent;
  const size = themeId === 'titanCore' ? 16 : 22;
  return (
    <>
      <View style={[styles.corner, styles.cornerTL, { width: size, height: size, borderColor: c }]} />
      <View style={[styles.corner, styles.cornerTR, { width: size, height: size, borderColor: c }]} />
      <View style={[styles.corner, styles.cornerBL, { width: size, height: size, borderColor: c }]} />
      <View style={[styles.corner, styles.cornerBR, { width: size, height: size, borderColor: c }]} />
    </>
  );
}

export function HeroScene() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const title = themeId === 'mythicForge' ? 'Good day, Warrior.' : themeId === 'celestialPulse' ? 'Rise Again.' : 'BUILT DIFFERENT.';
  const subtitle = themeId === 'mythicForge'
    ? 'Discipline today. A stronger tomorrow.'
    : themeId === 'celestialPulse'
    ? 'Small steps. Massive tomorrows.'
    : 'Discomfort today. Dominance tomorrow.';
  const kicker = themeId === 'mythicForge' ? 'MYTHIC FORGE' : themeId === 'celestialPulse' ? 'CELESTIAL PULSE' : 'TITAN CORE';

  return (
    <View
      style={[
        styles.hero,
        { borderColor: `${t.accent}86`, backgroundColor: t.heroSurface },
        webStyle({
          backgroundImage: `linear-gradient(180deg, rgba(4,6,9,.08) 0%, rgba(4,6,9,.08) 48%, ${t.background}F5 100%), url('${heroArt[themeId]}')`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
          boxShadow: `inset 0 0 0 1px ${t.accent}18, 0 18px 46px rgba(0,0,0,.5)`,
        }),
      ]}
    >
      <CornerOrnaments />
      <View style={styles.heroTopRow}>
        <View style={[styles.realmBadge, { borderColor: `${t.accent}72`, backgroundColor: `${t.background}C8` }]}>
          <Text style={[styles.realmBadgeText, { color: t.accent }]}>{kicker}</Text>
        </View>
        <View style={[styles.levelChip, { borderColor: `${t.accent}72`, backgroundColor: `${t.background}D8` }]}>
          <Text style={[styles.levelChipText, { color: t.text }]}>LV 12</Text>
        </View>
      </View>
      <View style={styles.heroCopy}>
        <Text
          style={[
            styles.heroTitle,
            {
              color: t.text,
              fontFamily: themeId === 'mythicForge' ? 'Georgia' : themeId === 'titanCore' ? 'Arial Narrow' : 'Avenir Next',
              textTransform: themeId === 'titanCore' ? 'uppercase' : 'none',
            },
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.heroSubtitle, { color: t.text }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

export function LevelMedallion({ level = 12, current = 320, max = 600 }: { level?: number; current?: number; max?: number }) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const pct = Math.max(0, Math.min(1, current / max));
  const deg = Math.round(pct * 360);
  const ring = webStyle({
    backgroundImage: `conic-gradient(${t.accent} 0deg ${deg}deg, ${t.surfaceElevated} ${deg}deg 360deg)`,
    boxShadow: `0 0 38px ${t.accent}2A, inset 0 0 20px rgba(0,0,0,.5)`,
  });

  return (
    <View style={styles.medallionWrap}>
      <View style={[styles.medallionOuter, { borderColor: `${t.accent}92`, backgroundColor: t.surfaceElevated }, ring]}>
        <View style={[styles.medallionInner, { backgroundColor: `${t.background}F4`, borderColor: `${t.accent}55` }]}>
          <Text style={[styles.medallionLevel, { color: t.text }]}>{level}</Text>
          <Text style={[styles.medallionLabel, { color: t.accent }]}>{themeId === 'titanCore' ? 'LEVEL' : 'Level'}</Text>
          <Text style={[styles.medallionXp, { color: t.muted }]}>{current} / {max} XP</Text>
        </View>
      </View>
    </View>
  );
}

export function AttributeStrip() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const items = [
    { glyph: '⚔', name: 'Strength', value: '+12%', color: t.strength },
    { glyph: '◒', name: 'Stamina', value: '+8%', color: t.stamina },
    { glyph: '✦', name: 'Discipline', value: '+10%', color: t.discipline },
    { glyph: '♥', name: 'Recovery', value: '+6%', color: t.positive },
  ];
  return (
    <View style={styles.attributeRow}>
      {items.map((item) => (
        <View key={item.name} style={styles.attributeItem}>
          <View style={[styles.attributeMedal, { borderColor: `${item.color}88`, backgroundColor: `${item.color}13` }]}>
            <Text style={[styles.attributeGlyph, { color: item.color }]}>{item.glyph}</Text>
          </View>
          <Text style={[styles.attributeName, { color: t.text }]}>{item.name}</Text>
          <Text style={[styles.attributeValue, { color: item.color }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function QuestContract({ onPress }: { onPress?: () => void }) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const questTitle = themeId === 'mythicForge' ? 'Forge Your Strength' : themeId === 'celestialPulse' ? 'Align Your Energy' : 'Hit Your Numbers';
  const label = themeId === 'mythicForge' ? "TODAY'S QUEST" : themeId === 'celestialPulse' ? "TODAY'S MISSION" : "TODAY'S MISSION";
  const icon = themeId === 'mythicForge' ? '◆' : themeId === 'celestialPulse' ? '✦' : '⬢';

  return (
    <View style={[styles.questContract, { borderColor: `${t.accent}66`, backgroundColor: `${t.heroSurface}F2` }]}>
      <View style={[styles.questIcon, { borderColor: `${t.accent}72`, backgroundColor: `${t.accent}12` }]}>
        <Text style={[styles.questIconText, { color: t.accent }]}>{icon}</Text>
      </View>
      <View style={styles.questBody}>
        <Text style={[styles.questLabel, { color: t.accent }]}>{label}</Text>
        <Text style={[styles.questTitle, { color: t.text }]}>{questTitle}</Text>
        <Text style={[styles.questCopy, { color: t.muted }]}>Complete your workout</Text>
      </View>
      <View style={[styles.questReward, { borderColor: `${t.accent}55`, backgroundColor: `${t.background}AA` }]}>
        <Text style={[styles.questRewardValue, { color: t.accent }]}>+210</Text>
        <Text style={[styles.questRewardLabel, { color: t.muted }]}>XP</Text>
      </View>
    </View>
  );
}

export function SectionPlaque({ children }: { children: React.ReactNode }) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={styles.sectionPlaqueRow}>
      <View style={[styles.sectionRule, { backgroundColor: `${t.accent}44` }]} />
      <View style={[styles.sectionPlaque, { borderColor: `${t.accent}55`, backgroundColor: `${t.background}DD`, borderRadius: themeId === 'titanCore' ? 4 : 999 }]}>
        <Text style={[styles.sectionPlaqueText, { color: t.accent }]}>{children}</Text>
      </View>
      <View style={[styles.sectionRule, { backgroundColor: `${t.accent}44` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderWidth: 1, overflow: 'hidden', position: 'relative' },
  titanRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  corner: { position: 'absolute', zIndex: 5, opacity: .9 },
  cornerTL: { left: 5, top: 5, borderLeftWidth: 2, borderTopWidth: 2 },
  cornerTR: { right: 5, top: 5, borderRightWidth: 2, borderTopWidth: 2 },
  cornerBL: { left: 5, bottom: 5, borderLeftWidth: 2, borderBottomWidth: 2 },
  cornerBR: { right: 5, bottom: 5, borderRightWidth: 2, borderBottomWidth: 2 },
  hero: { height: 350, borderWidth: 1, borderRadius: radius.md, overflow: 'hidden', padding: 14, justifyContent: 'space-between' },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  realmBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  realmBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.45 },
  levelChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  levelChipText: { fontSize: 9, fontWeight: '900', letterSpacing: .9 },
  heroCopy: { padding: 10, paddingTop: 60 },
  heroTitle: { fontSize: 31, lineHeight: 35, fontWeight: '900', textShadowColor: 'rgba(0,0,0,.75)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  heroSubtitle: { fontSize: 12, lineHeight: 18, fontWeight: '700', marginTop: 5, maxWidth: 350, textShadowColor: 'rgba(0,0,0,.85)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
  medallionWrap: { alignItems: 'center', marginTop: -42, zIndex: 5 },
  medallionOuter: { width: 142, height: 142, borderRadius: 71, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  medallionInner: { width: 118, height: 118, borderRadius: 59, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  medallionLevel: { fontSize: 38, lineHeight: 40, fontWeight: '900' },
  medallionLabel: { fontSize: 10, fontWeight: '900', marginTop: 1 },
  medallionXp: { fontSize: 8, fontWeight: '700', marginTop: 4 },
  attributeRow: { flexDirection: 'row', paddingHorizontal: 4, gap: 4, marginTop: 16 },
  attributeItem: { flex: 1, alignItems: 'center' },
  attributeMedal: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  attributeGlyph: { fontSize: 16 },
  attributeName: { fontSize: 8, fontWeight: '900', marginTop: 6, textAlign: 'center' },
  attributeValue: { fontSize: 8, fontWeight: '900', marginTop: 2 },
  questContract: { borderWidth: 1, borderRadius: radius.md, minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginTop: 18 },
  questIcon: { width: 54, height: 54, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  questIconText: { fontSize: 23, fontWeight: '900' },
  questBody: { flex: 1 },
  questLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  questTitle: { fontSize: 17, fontWeight: '900', marginTop: 3 },
  questCopy: { fontSize: 9, marginTop: 3 },
  questReward: { width: 58, height: 58, borderRadius: 29, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  questRewardValue: { fontSize: 12, fontWeight: '900' },
  questRewardLabel: { fontSize: 7, fontWeight: '900', marginTop: 1 },
  sectionPlaqueRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginVertical: 4 },
  sectionRule: { height: 1, flex: 1 },
  sectionPlaque: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  sectionPlaqueText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
});
