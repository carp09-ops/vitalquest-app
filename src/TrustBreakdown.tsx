import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useVitalTheme } from './ThemeProvider';
import type { RuleBreakdown } from './trust/pipeline';
import type { VerificationTier } from './xpTrust';

const RULE_LABELS: Record<string, string> = {
  base_source: 'Evidence source',
  live_tracked_bonus: 'Live tracking',
  duration_plausibility: 'Duration',
  work_density: 'Work density',
  resistance_volume: 'Volume',
  resistance_cadence: 'Set cadence',
  endurance_plausibility: 'Pace & distance',
  recovery: 'Recovery',
  sensor_corroboration: 'Sensor corroboration',
  integrity_penalties: 'Integrity',
};

type Props = {
  tier: VerificationTier;
  confidence: number;
  awardedXP: number;
  withheldXP: number;
  breakdown: RuleBreakdown[];
};

/**
 * Shows exactly how the trust engine scored a session: tier, confidence,
 * and a per-rule breakdown of what added or removed XP.
 * Rules that contributed nothing (no delta, no reason) are hidden.
 */
export default function TrustBreakdown({ tier, confidence, awardedXP, withheldXP, breakdown }: Props) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const [open, setOpen] = useState(false);
  const visible = breakdown.filter((rule) => rule.delta !== 0 || rule.reasons.length > 0);
  if (!visible.length) return null;
  return (
    <View style={[styles.card, { borderColor: t.border, backgroundColor: t.heroSurface }]}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.kicker, { color: t.accent }]}>WHY THIS SCORE</Text>
          <Text style={[styles.summary, { color: t.text }]}>
            {tier.replace('_', ' ')} · {confidence}% confidence
          </Text>
          <Text style={[styles.sub, { color: t.muted }]}>
            {withheldXP > 0
              ? `${withheldXP} XP withheld — tap to see why`
              : `${awardedXP} XP banked at full value — tap for details`}
          </Text>
        </View>
        <Text style={[styles.chevron, { color: t.muted }]}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {open && (
        <View style={styles.rules}>
          {visible.map((rule) => (
            <View key={rule.id} style={[styles.rule, { borderTopColor: t.border }]}>
              <View style={styles.ruleHeader}>
                <Text style={[styles.ruleLabel, { color: t.text }]}>{RULE_LABELS[rule.id] ?? rule.id}</Text>
                <Text
                  style={[
                    styles.delta,
                    { color: rule.delta > 0 ? t.accent : rule.delta < 0 ? t.danger : t.muted },
                  ]}
                >
                  {rule.delta > 0 ? `+${rule.delta}` : `${rule.delta}`}
                </Text>
              </View>
              {rule.reasons.map((reason, i) => (
                <Text key={i} style={[styles.reason, { color: t.muted }]}>
                  {reason}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', borderWidth: 1, borderRadius: 16, padding: 15, marginTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerText: { flex: 1 },
  kicker: { fontSize: 7.5, fontWeight: '900', letterSpacing: 1.1 },
  summary: { fontSize: 14, fontWeight: '900', marginTop: 4 },
  sub: { fontSize: 9, lineHeight: 14, marginTop: 3 },
  chevron: { fontSize: 16, marginLeft: 10 },
  rules: { marginTop: 10 },
  rule: { borderTopWidth: 1, paddingVertical: 9 },
  ruleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ruleLabel: { fontSize: 10.5, fontWeight: '800' },
  delta: { fontSize: 11, fontWeight: '900', fontVariant: ['tabular-nums'] },
  reason: { fontSize: 9, lineHeight: 14, marginTop: 3 },
});
