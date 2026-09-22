import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ATTRIBUTE_TIER_TITLES, deriveHeroEvolution, type HeroArchetype, type HeroAttribute } from './heroEvolution';
import type { ProgressionSnapshot } from './progression';
import { useVitalTheme } from './ThemeProvider';
import { materialForArchetype, paletteForArchetype } from './designSystem';

const LABEL: Record<HeroAttribute, string> = {
  strength: 'Strength',
  stamina: 'Stamina',
  agility: 'Agility',
  vitality: 'Vitality',
  discipline: 'Discipline',
};

export default function AttributeStrip({ snapshot, archetype }: { snapshot: ProgressionSnapshot; archetype: HeroArchetype }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const palette = paletteForArchetype(archetype);
  const material = materialForArchetype(archetype);
  const hero = deriveHeroEvolution(snapshot, archetype);
  const attrs = (Object.keys(hero.attributes) as HeroAttribute[]).sort((a, b) => hero.attributes[b].xp - hero.attributes[a].xp);
  const dominant = hero.dominantAttribute;

  return (
    <View style={[styles.band, { borderColor: material.edge, backgroundColor: material.railSurface }]}>
      <View style={styles.head}>
        <Text style={[styles.kicker, { color: palette.highlight }]}>CHARACTER · ATTRIBUTE PULSE</Text>
        <Text style={[styles.headTitle, { color: t.text }]}>
          {hero.title} · {LABEL[dominant]} leads the build
        </Text>
      </View>
      <View style={styles.grid}>
        {attrs.map(key => {
          const a = hero.attributes[key];
          const max = Math.max(a.nextThreshold ?? a.xp, 1);
          const pct = a.nextThreshold == null ? 100 : Math.min(100, Math.round((a.xp / max) * 100));
          const nextTitle: string | undefined = a.nextThreshold == null ? undefined : ATTRIBUTE_TIER_TITLES[key][Math.min(4, a.tier)];
          return (
            <View key={key} style={[styles.cell, { borderColor: material.edge }]}>
              <Text style={[styles.name, { color: t.muted }]}>{LABEL[key].toUpperCase()}</Text>
              <Text style={[styles.tierTitle, { color: key === dominant ? palette.highlight : t.text }]}>{a.tierTitle}</Text>
              <View style={[styles.track, { backgroundColor: 'rgba(255,255,255,.08)' }]}>
                <View style={[styles.fill, { width: `${pct}%`, backgroundColor: key === dominant ? palette.highlight : palette.primary }]} />
              </View>
              <Text style={[styles.next, { color: t.muted }]}>
                {a.nextThreshold == null ? 'MAX TIER REACHED' : `${a.xpToNext.toLocaleString()} XP TO ${nextTitle?.toUpperCase()}`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { borderWidth: 1, borderRadius: 22, padding: 16, gap: 12 },
  head: { gap: 4 },
  kicker: { fontSize: 7, fontWeight: '900', letterSpacing: 1.45 },
  headTitle: { fontSize: 15, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { flexGrow: 1, flexBasis: 150, borderWidth: 1, borderRadius: 14, padding: 11, gap: 6 },
  name: { fontSize: 6.2, fontWeight: '900', letterSpacing: 0.8 },
  tierTitle: { fontSize: 14, fontWeight: '900' },
  track: { height: 6, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  next: { fontSize: 6.5, fontWeight: '800', letterSpacing: 0.4 },
});
