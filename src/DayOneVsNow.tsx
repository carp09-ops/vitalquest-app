import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatLegendDate, type DayOneComparison } from './legend';
import { fonts } from './designSystem';

/**
 * Day one vs today: the first session side-by-side with lifetime totals,
 * plus per-lift progress from the first recorded set to the best ever.
 */
export default function DayOneVsNow({ data, highlight }: { data: DayOneComparison; highlight: string }) {
  const first = data.firstSession;
  if (!first) return null;
  return <View>
    <Text style={[s.kicker, { color: highlight }]}>THEN VS NOW</Text>
    <Text style={s.title}>Day one vs today.</Text>
    <View style={s.cards}>
      <View style={s.card}>
        <Text style={s.cardKicker}>DAY ONE</Text>
        <Text style={s.cardDate}>{formatLegendDate(first.date)}</Text>
        <Text style={s.cardName}>{first.name}</Text>
        <Stat label="VOLUME" value={first.volume.toLocaleString()} />
        <Stat label="EARNED XP" value={`+${first.xp}`} />
        <Stat label="MINUTES" value={String(first.minutes)} />
      </View>
      <View style={[s.card, s.cardNow]}>
        <Text style={[s.cardKicker, { color: highlight }]}>TODAY</Text>
        <Text style={s.cardDate}>LEVEL {data.now.level}</Text>
        <Text style={s.cardName}>{data.now.sessions} trials completed</Text>
        <Stat label="VOLUME" value={data.now.volume.toLocaleString()} accent />
        <Stat label="LIFETIME XP" value={data.now.xp.toLocaleString()} accent />
        <Stat label="STREAK" value={`${data.now.streakDays} DAYS`} accent />
      </View>
    </View>
    {data.lifts.length > 0 && (
      <View style={s.lifts}>
        {data.lifts.map((lift) => (
          <View key={lift.name} style={s.lift}>
            <Text style={s.liftName}>{lift.name}</Text>
            <View style={s.liftValues}>
              <Text style={s.liftFirst}>{lift.first}</Text>
              <Text style={[s.liftArrow, { color: highlight }]}>→</Text>
              <Text style={s.liftBest}>{lift.best}</Text>
              <Text style={[s.liftDelta, { color: highlight }]}>+{lift.deltaPct}%</Text>
            </View>
          </View>
        ))}
      </View>
    )}
  </View>;
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <View style={s.stat}>
    <Text style={s.statLabel}>{label}</Text>
    <Text style={[s.statValue, accent && s.statValueAccent]}>{value}</Text>
  </View>;
}

const serif = fonts.display;
const s = StyleSheet.create({
  kicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.45 },
  title: { fontFamily: serif, fontSize: 25, fontWeight: '800', color: '#F7F8FA', marginTop: 3 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  card: { flexGrow: 1, flexBasis: 220, borderWidth: 1, borderColor: 'rgba(255,255,255,.10)', backgroundColor: 'rgba(255,255,255,.03)', borderRadius: 18, padding: 16 },
  cardNow: { borderColor: 'rgba(231,184,88,.35)', backgroundColor: 'rgba(231,184,88,.05)' },
  cardKicker: { fontSize: 8.5, fontWeight: '900', letterSpacing: 1.6, color: 'rgba(247,248,250,.45)' },
  cardDate: { fontSize: 12, fontWeight: '900', letterSpacing: 0.6, color: '#F7F8FA', marginTop: 6 },
  cardName: { fontSize: 10, color: 'rgba(247,248,250,.6)', marginTop: 3, marginBottom: 8 },
  stat: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.08)', paddingVertical: 7 },
  statLabel: { fontSize: 8.5, fontWeight: '900', letterSpacing: 1, color: 'rgba(247,248,250,.45)' },
  statValue: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'], color: '#F7F8FA' },
  statValueAccent: { color: '#E7B858' },
  lifts: { marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,.10)', borderRadius: 18, overflow: 'hidden' },
  lift: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,.07)' },
  liftName: { fontSize: 12, fontWeight: '900', color: '#F7F8FA' },
  liftValues: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 5, flexWrap: 'wrap' },
  liftFirst: { fontSize: 11, fontWeight: '700', fontVariant: ['tabular-nums'], color: 'rgba(247,248,250,.5)' },
  liftArrow: { fontSize: 12, fontWeight: '900' },
  liftBest: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'], color: '#F7F8FA' },
  liftDelta: { fontSize: 10, fontWeight: '900', fontVariant: ['tabular-nums'] },
});
