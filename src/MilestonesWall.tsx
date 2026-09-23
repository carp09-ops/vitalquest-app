import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconArt } from './IconArt';
import { formatLegendDate, type Milestone } from './milestones';

const CREAM = '#F6F2EA';
const DIM = 'rgba(246,242,234,0.55)';

interface Props {
  milestones: Milestone[];
  highlight: string;
}

export default function MilestonesWall({ milestones, highlight }: Props) {
  const [selected, setSelected] = useState<Milestone | null>(null);
  const earned = milestones.filter((m) => m.earned).length;
  const screenW = Dimensions.get('window').width;
  const tile = Math.min(104, (screenW - 64) / 3);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>MILESTONES</Text>
          <Text style={styles.title}>The wall of proof.</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={[styles.countText, { color: highlight }]}>{earned}/{milestones.length}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.grid}>
          {milestones.map((m) => {
            const active = selected?.id === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                activeOpacity={0.7}
                onPress={() => setSelected(m)}
                style={[styles.tile, { width: tile, opacity: m.earned ? 1 : 0.5 }]}>
                <View
                  style={[
                    styles.medallion,
                    { width: tile * 0.58, height: tile * 0.58, borderRadius: (tile * 0.58) / 2 },
                    m.earned
                      ? {
                          borderColor: m.accent,
                          backgroundColor: `${m.accent}1F`,
                          shadowColor: m.accent,
                          shadowOpacity: active ? 0.6 : 0.3,
                        }
                      : { borderColor: 'rgba(246,242,234,0.28)', borderStyle: 'dashed', backgroundColor: 'rgba(0,0,0,0.25)' },
                    active && { transform: [{ scale: 1.06 }] },
                  ]}>
                  <IconArt
                    name={m.icon}
                    size={tile * 0.3}
                    opacity={m.earned ? 1 : 0.4}
                  />
                </View>
                <Text style={[styles.tileTitle, { color: m.earned ? CREAM : DIM }]} numberOfLines={1}>
                  {m.title}
                </Text>
                <Text style={styles.tileSub} numberOfLines={1}>
                  {m.earned && m.date ? formatLegendDate(m.date) : m.progressLabel ?? m.howTo.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.scrim} onPress={() => setSelected(null)}>
          {selected && (
            <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
              <View
                style={[
                  styles.bigMedallion,
                  selected.earned
                    ? { borderColor: selected.accent, backgroundColor: `${selected.accent}22`, shadowColor: selected.accent }
                    : { borderColor: 'rgba(246,242,234,0.3)', borderStyle: 'dashed' },
                ]}>
                <IconArt name={selected.icon} size={56} opacity={selected.earned ? 1 : 0.4} />
              </View>
              <Text style={styles.sheetKicker}>{selected.earned ? 'EARNED' : 'LOCKED'}</Text>
              <Text style={styles.sheetTitle}>{selected.title}</Text>
              <Text style={styles.sheetFlavor}>{selected.flavor}</Text>
              {selected.earned && selected.date ? (
                <Text style={[styles.sheetMeta, { color: selected.accent }]}>EARNED {formatLegendDate(selected.date).toUpperCase()}</Text>
              ) : (
                <>
                  <Text style={styles.sheetMeta}>{selected.howTo.toUpperCase()}</Text>
                  {typeof selected.progress === 'number' && (
                    <View style={styles.progressWrap}>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${Math.round(selected.progress * 100)}%`, backgroundColor: selected.accent }]} />
                      </View>
                      <Text style={styles.progressLabel}>{selected.progressLabel}</Text>
                    </View>
                  )}
                </>
              )}
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)} activeOpacity={0.8}>
                <Text style={styles.closeText}>CLOSE</Text>
              </TouchableOpacity>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  kicker: { fontSize: 9, letterSpacing: 2.5, color: 'rgba(246,242,234,0.6)', fontFamily: 'Inter_600SemiBold' },
  title: { fontSize: 20, color: CREAM, fontFamily: 'Cinzel_700Bold', marginTop: 2 },
  countPill: { borderWidth: 1, borderColor: 'rgba(246,242,234,0.22)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  countText: { fontSize: 11, fontFamily: 'Inter_700Bold', fontVariant: ['tabular-nums'] },
  card: {
    paddingHorizontal: 10, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(246,242,234,0.12)', borderRadius: 16,
    backgroundColor: 'rgba(10,13,20,0.55)',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
  tile: { alignItems: 'center', gap: 5 },
  medallion: {
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 }, shadowRadius: 10, elevation: 4,
  },
  tileTitle: { fontSize: 8, letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
  tileSub: { fontSize: 7, letterSpacing: 0.8, color: DIM, fontFamily: 'Inter_600SemiBold' },
  scrim: { flex: 1, backgroundColor: 'rgba(5,7,12,0.8)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  sheet: { width: '100%', maxWidth: 340, backgroundColor: '#11141C', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(246,242,234,0.14)', padding: 24, alignItems: 'center', gap: 8 },
  bigMedallion: {
    width: 108, height: 108, borderRadius: 54, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 18, elevation: 6,
  },
  sheetKicker: { fontSize: 9, letterSpacing: 3, color: 'rgba(246,242,234,0.55)', fontFamily: 'Inter_700Bold' },
  sheetTitle: { fontSize: 24, color: CREAM, fontFamily: 'Cinzel_700Bold' },
  sheetFlavor: { fontSize: 14, color: 'rgba(246,242,234,0.75)', fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 21 },
  sheetMeta: { fontSize: 10, letterSpacing: 1.5, color: DIM, fontFamily: 'Inter_700Bold', marginTop: 4 },
  progressWrap: { width: '100%', marginTop: 10, gap: 6 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(246,242,234,0.12)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabel: { fontSize: 10, color: DIM, fontFamily: 'Inter_700Bold', fontVariant: ['tabular-nums'], textAlign: 'center' },
  closeBtn: { marginTop: 10, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(246,242,234,0.25)' },
  closeText: { fontSize: 10, letterSpacing: 2, color: CREAM, fontFamily: 'Inter_700Bold' },
});
