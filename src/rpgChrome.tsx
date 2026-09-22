import React from 'react';
import { Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useVitalTheme } from './ThemeProvider';
import { radius } from './theme';
import { APP_BASE } from './artAssets';

function webStyle(style: Record<string, unknown>) {
  return Platform.OS === 'web' ? (style as any) : undefined;
}

const heroArt = {
  mythicForge: `${APP_BASE}/art/today-mythic-premium.svg`,
  celestialPulse: `${APP_BASE}/art/today-celestial-premium.webp`,
  titanCore: `${APP_BASE}/art/today-titan-premium.webp`,
} as const;

const iconPaths = {
  strength: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M18.9 2.6 21.4 5l-6.8 6.8 1.6 1.6-1.8 1.8-1.6-1.6-6.1 6.1H3.8v-2.9l6.1-6.1-1.5-1.6 1.8-1.8 1.6 1.6 7.1-6.3ZM4.8 18.1v.9h.9l5.5-5.5-.9-.9-5.5 5.5Z"/></svg>',
  stamina: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M13.3 2 5.8 13h5l-1.1 9L18.2 10h-5l.1-8Z"/></svg>',
  discipline: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="m12 2 2.1 5.9L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-2.1L12 2Zm0 5.1-.8 2.1-2.1.8 2.1.8.8 2.1.8-2.1 2.1-.8-2.1-.8-.8-2.1Z"/></svg>',
  recovery: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12 21S4 16.2 4 9.7C4 6.6 6.2 5 8.5 5c1.4 0 2.7.7 3.5 1.8C12.8 5.7 14.1 5 15.5 5 17.8 5 20 6.6 20 9.7 20 16.2 12 21 12 21Zm-4.9-9.6h2.4l1.2-2.2 2.2 5 1.2-2.1h2.8v-1.6h-1.9l-2.2 3.8-2.1-4.8-1.2 2.1H7.1v1.8Z"/></svg>',
} as const;

function maskUri(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function displayFont(themeId: string) {
  if (themeId === 'mythicForge') return Platform.select({ ios: 'Georgia', web: 'Georgia', default: 'serif' });
  if (themeId === 'titanCore') return Platform.select({ ios: 'Avenir Next Condensed', web: 'Arial Narrow', default: 'sans-serif' });
  return Platform.select({ ios: 'Avenir Next', web: 'Avenir Next', default: 'sans-serif' });
}

export function RpgFrame({ children, style, strong = false }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; strong?: boolean }) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const angular = themeId === 'titanCore';
  return (
    <View
      style={[
        styles.frameOuter,
        {
          borderColor: strong ? `${t.accent}D4` : `${t.accent}86`,
          backgroundColor: `${t.background}F8`,
          borderRadius: angular ? 7 : radius.md,
        },
        webStyle({ boxShadow: themeId === 'celestialPulse' ? `0 18px 54px rgba(0,0,0,.52), 0 0 32px ${t.secondary}16` : `0 18px 54px rgba(0,0,0,.56)` }),
        style,
      ]}
    >
      <View style={[styles.frameInner, { borderColor: `${t.accent}32`, borderRadius: angular ? 4 : radius.sm }]}>
        <CornerOrnaments />
        {themeId === 'titanCore' ? <View style={[styles.titanRail, { backgroundColor: t.accent }]} /> : null}
        {children}
      </View>
    </View>
  );
}

function CornerOrnaments() {
  const { themeId, theme } = useVitalTheme();
  const c = theme.tokens.accent;
  const size = themeId === 'titanCore' ? 14 : 20;
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
  return (
    <View
      style={[
        styles.hero,
        { borderColor: `${t.accent}98`, backgroundColor: t.heroSurface },
        webStyle({
          backgroundImage: `linear-gradient(180deg, rgba(2,4,8,.05) 0%, rgba(2,4,8,.04) 54%, ${t.background}D0 100%), url('${heroArt[themeId]}')`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat',
          boxShadow: `inset 0 0 0 1px ${t.accent}18, inset 0 -72px 64px rgba(0,0,0,.32)`,
        }),
      ]}
    >
      <CornerOrnaments />
      <View style={[styles.realmStamp, { borderColor: `${t.accent}72`, backgroundColor: `${t.background}CA` }]}>
        <Text style={[styles.realmStampText, { color: t.accent }]}>{theme.name.toUpperCase()}</Text>
      </View>
    </View>
  );
}

export function HeroIdentity() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const title = themeId === 'mythicForge' ? 'Good day, Warrior.' : themeId === 'celestialPulse' ? 'Rise Again.' : 'BUILT DIFFERENT.';
  const subtitle = themeId === 'mythicForge'
    ? 'Discipline today. A stronger tomorrow.'
    : themeId === 'celestialPulse'
    ? 'Small steps. Massive tomorrows.'
    : 'Discomfort today. Dominance tomorrow.';

  return (
    <View style={styles.identityBlock}>
      <Text style={[styles.identityTitle, { color: t.text, fontFamily: displayFont(themeId), textTransform: themeId === 'titanCore' ? 'uppercase' : 'none' }]}>{title}</Text>
      <Text style={[styles.identitySubtitle, { color: t.muted }]}>{subtitle}</Text>
    </View>
  );
}

export function LevelMedallion({ level = 12, current = 320, max = 600 }: { level?: number; current?: number; max?: number }) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const pct = Math.max(0, Math.min(1, current / max));
  const deg = Math.round(pct * 360);
  return (
    <View style={styles.medallionWrap}>
      <View style={[styles.medallionHalo, { borderColor: `${t.accent}40` }]}>
        <View
          style={[
            styles.medallionOuter,
            { borderColor: `${t.accent}B8`, backgroundColor: t.surfaceElevated },
            webStyle({ backgroundImage: `conic-gradient(${t.accent} 0deg ${deg}deg, ${t.surfaceElevated} ${deg}deg 360deg)`, boxShadow: `0 0 30px ${t.accent}24, inset 0 0 18px rgba(0,0,0,.6)` }),
          ]}
        >
          <View style={[styles.medallionInner, { backgroundColor: `${t.background}FA`, borderColor: `${t.accent}5A` }]}>
            <Text style={[styles.medallionLevel, { color: t.text, fontFamily: displayFont(themeId) }]}>{level}</Text>
            <Text style={[styles.medallionLabel, { color: t.accent }]}>LEVEL</Text>
            <Text style={[styles.medallionXp, { color: t.muted }]}>{current} / {max} XP</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function AttributeStrip() {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const items = [
    { icon: 'strength' as const, name: 'Strength', value: '+12%', color: t.strength, fallback: 'STR' },
    { icon: 'stamina' as const, name: 'Stamina', value: '+8%', color: t.stamina, fallback: 'STA' },
    { icon: 'discipline' as const, name: 'Discipline', value: '+10%', color: t.discipline, fallback: 'DIS' },
    { icon: 'recovery' as const, name: 'Recovery', value: '+6%', color: t.positive, fallback: 'REC' },
  ];
  return (
    <View style={styles.attributeRow}>
      {items.map((item) => (
        <View key={item.name} style={styles.attributeItem}>
          <View style={[styles.attributeMedal, { borderColor: `${item.color}8A`, backgroundColor: `${item.color}0E` }]}>
            {Platform.OS === 'web' ? (
              <View style={[styles.attributeIcon, webStyle({ backgroundColor: item.color, WebkitMaskImage: maskUri(iconPaths[item.icon]), maskImage: maskUri(iconPaths[item.icon]), WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskPosition: 'center', maskPosition: 'center' })]} />
            ) : (
              <Text style={[styles.attributeFallback, { color: item.color }]}>{item.fallback}</Text>
            )}
          </View>
          <Text style={[styles.attributeName, { color: t.text }]}>{item.name}</Text>
          <Text style={[styles.attributeValue, { color: item.color }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function QuestContract() {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  const questTitle = themeId === 'mythicForge' ? 'Forge Your Strength' : themeId === 'celestialPulse' ? 'Align Your Energy' : 'Hit Your Numbers';
  const label = themeId === 'mythicForge' ? "TODAY'S QUEST" : "TODAY'S MISSION";
  return (
    <View style={[styles.questOuter, { borderColor: `${t.accent}68`, backgroundColor: `${t.heroSurface}FA` }]}>
      <View style={[styles.questInner, { borderColor: `${t.accent}2C` }]}>
        <View style={[styles.questSigil, { borderColor: `${t.accent}70`, backgroundColor: `${t.accent}0E` }]}>
          <View style={[styles.questDiamond, { borderColor: t.accent }]} />
        </View>
        <View style={styles.questBody}>
          <Text style={[styles.questLabel, { color: t.accent }]}>{label}</Text>
          <Text style={[styles.questTitle, { color: t.text, fontFamily: displayFont(themeId) }]}>{questTitle}</Text>
          <Text style={[styles.questCopy, { color: t.muted }]}>Complete your workout</Text>
        </View>
        <View style={styles.questReward}>
          <Text style={[styles.questRewardValue, { color: t.accent }]}>+210</Text>
          <Text style={[styles.questRewardLabel, { color: t.muted }]}>XP</Text>
        </View>
      </View>
    </View>
  );
}

export function SectionPlaque({ children }: { children: React.ReactNode }) {
  const { themeId, theme } = useVitalTheme();
  const t = theme.tokens;
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: t.text, fontFamily: displayFont(themeId) }]}>{children}</Text>
      <View style={[styles.sectionRule, { backgroundColor: `${t.accent}55` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frameOuter: { borderWidth: 1, padding: 4, overflow: 'hidden', position: 'relative' },
  frameInner: { borderWidth: 1, overflow: 'hidden', position: 'relative', padding: 8 },
  titanRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  corner: { position: 'absolute', zIndex: 8, opacity: .92 },
  cornerTL: { left: 4, top: 4, borderLeftWidth: 2, borderTopWidth: 2 },
  cornerTR: { right: 4, top: 4, borderRightWidth: 2, borderTopWidth: 2 },
  cornerBL: { left: 4, bottom: 4, borderLeftWidth: 2, borderBottomWidth: 2 },
  cornerBR: { right: 4, bottom: 4, borderRightWidth: 2, borderBottomWidth: 2 },
  hero: { height: 264, borderWidth: 1, borderRadius: radius.sm, overflow: 'hidden', padding: 12 },
  realmStamp: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  realmStampText: { fontSize: 7, fontWeight: '900', letterSpacing: 1.55 },
  identityBlock: { alignItems: 'center', paddingTop: 16, paddingHorizontal: 16 },
  identityTitle: { fontSize: 27, lineHeight: 32, fontWeight: '900', textAlign: 'center', letterSpacing: -.5 },
  identitySubtitle: { fontSize: 11, lineHeight: 17, fontWeight: '600', textAlign: 'center', marginTop: 4, maxWidth: 340 },
  medallionWrap: { alignItems: 'center', marginTop: 18 },
  medallionHalo: { width: 140, height: 140, borderRadius: 70, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  medallionOuter: { width: 126, height: 126, borderRadius: 63, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  medallionInner: { width: 106, height: 106, borderRadius: 53, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  medallionLevel: { fontSize: 35, lineHeight: 37, fontWeight: '900' },
  medallionLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginTop: 1 },
  medallionXp: { fontSize: 7, fontWeight: '700', marginTop: 4 },
  attributeRow: { flexDirection: 'row', paddingHorizontal: 5, gap: 5, marginTop: 18 },
  attributeItem: { flex: 1, alignItems: 'center' },
  attributeMedal: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  attributeIcon: { width: 19, height: 19 },
  attributeFallback: { fontSize: 8, fontWeight: '900', letterSpacing: .3 },
  attributeName: { fontSize: 7.5, fontWeight: '800', marginTop: 6, textAlign: 'center' },
  attributeValue: { fontSize: 7.5, fontWeight: '900', marginTop: 2 },
  questOuter: { borderWidth: 1, borderRadius: radius.sm, padding: 3, marginTop: 22 },
  questInner: { borderWidth: 1, borderRadius: 7, minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  questSigil: { width: 52, height: 52, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  questDiamond: { width: 18, height: 18, borderWidth: 2, transform: [{ rotate: '45deg' }] },
  questBody: { flex: 1 },
  questLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.35 },
  questTitle: { fontSize: 16, lineHeight: 19, fontWeight: '900', marginTop: 3 },
  questCopy: { fontSize: 8.5, marginTop: 4 },
  questReward: { alignItems: 'center', minWidth: 50 },
  questRewardValue: { fontSize: 13, fontWeight: '900' },
  questRewardLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.1, marginTop: 1 },
  sectionHeader: { alignItems: 'center', marginTop: 2, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 1.8, textAlign: 'center', textTransform: 'uppercase' },
  sectionRule: { width: 56, height: 1, marginTop: 7 },
});