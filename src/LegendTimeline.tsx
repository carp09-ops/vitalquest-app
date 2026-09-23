import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatLegendDate, type LegendEntry } from './legend';
import { fonts } from './designSystem';

const COLLAPSED_COUNT = 8;

/**
 * The hero's legend: every level-up, form ascension, attribute tier-up,
 * PR, milestone, and streak — a scrollable history to look back on.
 */
export default function LegendTimeline({ entries, highlight }: { entries: LegendEntry[]; highlight: string }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? entries : entries.slice(0, COLLAPSED_COUNT);

  return <View>
    <Text style={[s.kicker, { color: highlight }]}>YOUR LEGEND</Text>
    <Text style={s.title}>Every milestone, written down.</Text>
    {entries.length === 0 ? (
      <View style={s.empty}>
        <Text style={s.emptyTitle}>Your legend awaits.</Text>
        <Text style={s.emptyCopy}>Complete trials and every level, record, and ascension will be written here.</Text>
      </View>
    ) : (
      <View style={s.list}>
        {visible.map((entry, i) => <TimelineRow key={entry.id} entry={entry} last={i === visible.length - 1 && (expanded || entries.length <= COLLAPSED_COUNT)} highlight={highlight} />)}
      </View>
    )}
    {entries.length > COLLAPSED_COUNT && (
      <Pressable onPress={() => setExpanded((v) => !v)} style={s.toggle}>
        <Text style={[s.toggleText, { color: highlight }]}>{expanded ? 'SHOW LESS' : `SHOW ALL ${entries.length} MILESTONES`}</Text>
      </Pressable>
    )}
  </View>;
}

function TimelineRow({ entry, last, highlight }: { entry: LegendEntry; last: boolean; highlight: string }) {
  const dotColor = entry.accent ?? 'rgba(255,255,255,.28)';
  return <View style={s.row}>
    <View style={s.rail}>
      <View style={[s.dot, { backgroundColor: dotColor, shadowColor: dotColor }]} />
      {!last && <View style={s.line} />}
    </View>
    <View style={s.body}>
      <Text style={s.date}>{formatLegendDate(entry.date)}</Text>
      <Text style={s.entryTitle}>{entry.title}</Text>
      <Text style={s.detail}>{entry.detail}</Text>
    </View>
  </View>;
}

const serif = fonts.display;
const s = StyleSheet.create({
  kicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.45 },
  title: { fontFamily: serif, fontSize: 25, fontWeight: '800', color: '#F7F8FA', marginTop: 3 },
  empty: { borderWidth: 1, borderColor: 'rgba(255,255,255,.10)', backgroundColor: 'rgba(255,255,255,.03)', borderRadius: 18, padding: 18, marginTop: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '900', color: '#F7F8FA' },
  emptyCopy: { fontSize: 10, lineHeight: 16, color: 'rgba(247,248,250,.55)', marginTop: 6 },
  list: { marginTop: 14 },
  row: { flexDirection: 'row', gap: 14 },
  rail: { alignItems: 'center', width: 14 },
  dot: { width: 11, height: 11, borderRadius: 6, marginTop: 3, shadowOpacity: 0.8, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  line: { width: 1.5, flex: 1, backgroundColor: 'rgba(255,255,255,.10)', marginTop: 6, minHeight: 26 },
  body: { flex: 1, paddingBottom: 22 },
  date: { fontSize: 8.5, fontWeight: '900', letterSpacing: 1.4, color: 'rgba(247,248,250,.42)' },
  entryTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 0.4, color: '#F7F8FA', marginTop: 4 },
  detail: { fontSize: 10, lineHeight: 15, color: 'rgba(247,248,250,.58)', marginTop: 4 },
  toggle: { alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,.14)', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, marginTop: 4 },
  toggleText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
});
