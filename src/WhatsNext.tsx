import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ATTRIBUTE_AURA } from './attributeAuras';
import type { WhatsNext } from './whatsNext';

const CREAM = '#F6F2EA';
const DIM = 'rgba(246,242,234,0.55)';
const ROMAN: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };

/**
 * Up Next — the forward pull. What the hero is hunting:
 * the next form, the next milestone, the next attribute tier.
 */
export default function WhatsNextPanel({ data, highlight }: { data: WhatsNext; highlight: string }) {
  if (!data.form && !data.milestone && !data.attribute) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.kicker}>UP NEXT</Text>
        <Text style={styles.title}>Apex reached.</Text>
        <Text style={styles.lede}>Every form ascended. Every milestone earned. The wall is complete — defend it.</Text>
      </View>
    );
  }
  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>UP NEXT</Text>
          <Text style={styles.title}>The hunt continues.</Text>
        </View>
      </View>
      <View style={styles.card}>
        {data.form && (
          <View style={styles.row}>
            <Text style={styles.rowKicker}>NEXT FORM</Text>
            <Text style={styles.big}>FORM {ROMAN[data.form.tier]} — {data.form.title.toUpperCase()}</Text>
            <Text style={styles.meta}>
              {data.form.xpRemaining.toLocaleString()} XP TO GO · LEVEL {data.form.targetLevel}
              {data.form.paceLabel ? ` · ${data.form.paceLabel}` : ''}
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.round(data.form.progress * 100)}%`, backgroundColor: highlight }]} />
            </View>
          </View>
        )}
        {data.milestone && (
          <View style={[styles.row, styles.divided]}>
            <Text style={styles.rowKicker}>NEXT MILESTONE</Text>
            <Text style={styles.rowTitle}>{data.milestone.title}</Text>
            <Text style={[styles.meta, { color: highlight }]}>{data.milestone.remainingText}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.round(data.milestone.progress * 100)}%`, backgroundColor: highlight }]} />
            </View>
          </View>
        )}
        {data.attribute && (
          <View style={[styles.row, styles.divided]}>
            <Text style={styles.rowKicker}>NEXT ATTRIBUTE TIER</Text>
            <Text style={styles.rowTitle}>
              {data.attribute.attribute.toUpperCase()} · TIER {ROMAN[data.attribute.nextTier]}{' '}
              <Text style={{ color: ATTRIBUTE_AURA[data.attribute.attribute].aura }}>
                {data.attribute.nextTierTitle.toUpperCase()}
              </Text>
            </Text>
            <Text style={styles.meta}>{data.attribute.xpRemaining.toLocaleString()} XP TO GO</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  kicker: { fontSize: 9, letterSpacing: 2.5, color: 'rgba(246,242,234,0.6)', fontFamily: 'Inter_600SemiBold' },
  title: { fontSize: 20, color: CREAM, fontFamily: 'Cinzel_700Bold', marginTop: 2 },
  lede: { fontSize: 14, color: DIM, fontFamily: 'Inter_400Regular', lineHeight: 21 },
  card: {
    borderWidth: 1, borderColor: 'rgba(246,242,234,0.12)', borderRadius: 16,
    backgroundColor: 'rgba(10,13,20,0.55)', paddingHorizontal: 16, paddingVertical: 6,
  },
  row: { paddingVertical: 12, gap: 4 },
  divided: { borderTopWidth: 1, borderTopColor: 'rgba(246,242,234,0.08)' },
  rowKicker: { fontSize: 8, letterSpacing: 2.2, color: DIM, fontFamily: 'Inter_700Bold' },
  big: { fontSize: 17, color: CREAM, fontFamily: 'Cinzel_700Bold' },
  rowTitle: { fontSize: 15, color: CREAM, fontFamily: 'Inter_700Bold', letterSpacing: 0.4 },
  meta: { fontSize: 10, letterSpacing: 1.2, color: DIM, fontFamily: 'Inter_700Bold' },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(246,242,234,0.1)', overflow: 'hidden', marginTop: 6 },
  fill: { height: '100%', borderRadius: 3 },
});
