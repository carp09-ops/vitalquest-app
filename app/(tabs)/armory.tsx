import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Screen } from '../../src/components';
import { armory } from '../../src/data';
import { useVitalTheme } from '../../src/ThemeProvider';
import { radius, spacing, ThemeId, themes } from '../../src/theme';

type ArmoryTab = 'Gear' | 'Badges' | 'Titles' | 'Themes';

const tabs: ArmoryTab[] = ['Gear', 'Badges', 'Titles', 'Themes'];

export default function ArmoryScreen() {
  const { theme, themeId, setThemeId } = useVitalTheme();
  const t = theme.tokens;
  const [activeTab, setActiveTab] = useState<ArmoryTab>('Themes');

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.eyebrow, { color: t.accent }]}>REWARD REGISTRY</Text>
          <Text style={[styles.title, { color: t.text }]}>Armory</Text>
          <Text style={[styles.lede, { color: t.muted }]}>Wear the proof. Choose the world.</Text>
        </View>
        <View style={[styles.currency, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Text style={[styles.currencyIcon, { color: t.accent }]}>◆</Text>
          <Text style={[styles.currencyText, { color: t.text }]}>1,280</Text>
        </View>
      </View>

      <View style={[styles.tabs, { backgroundColor: t.surface, borderColor: t.border }]}>
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                active && { backgroundColor: t.surfaceElevated, borderColor: t.accentSoft },
              ]}
            >
              <Text style={[styles.tabText, { color: active ? t.accent : t.muted }]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'Themes' ? (
        <ThemeVault activeTheme={themeId} onSelect={setThemeId} />
      ) : (
        <RewardGrid mode={activeTab} />
      )}
    </Screen>
  );
}

function ThemeVault({
  activeTheme,
  onSelect,
}: {
  activeTheme: ThemeId;
  onSelect: (themeId: ThemeId) => void;
}) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;

  return (
    <View style={{ gap: spacing.md }}>
      <View>
        <Text style={[styles.sectionLabel, { color: t.accent }]}>THEME VAULT</Text>
        <Text style={[styles.sectionTitle, { color: t.text }]}>Choose your realm.</Text>
        <Text style={[styles.sectionCopy, { color: t.muted }]}>The app anatomy stays fixed. The atmosphere becomes yours.</Text>
      </View>

      {(Object.keys(themes) as ThemeId[]).map((id) => {
        const item = themes[id];
        const active = id === activeTheme;
        const p = item.tokens;
        return (
          <Pressable key={id} onPress={() => onSelect(id)}>
            <Card
              style={[
                styles.themeCard,
                {
                  backgroundColor: p.heroSurface,
                  borderColor: active ? p.accent : p.border,
                },
              ]}
            >
              <View style={styles.themeTop}>
                <View style={styles.themeNameBlock}>
                  <Text style={[styles.themeKicker, { color: p.accent }]}>{active ? 'ACTIVE SKIN' : 'AVAILABLE'}</Text>
                  <Text style={[styles.themeName, { color: p.text }]}>{item.name}</Text>
                </View>
                <View style={[styles.themeCheck, { borderColor: p.accent, backgroundColor: active ? p.accent : 'transparent' }]}>
                  <Text style={[styles.themeCheckText, { color: active ? p.background : p.accent }]}>{active ? '✓' : '+'}</Text>
                </View>
              </View>

              <Text style={[styles.themeTagline, { color: p.text }]}>{item.tagline}</Text>
              <Text style={[styles.themeFlavor, { color: p.muted }]}>{item.flavor}</Text>

              <View style={styles.swatches}>
                {[p.background, p.surfaceElevated, p.text, p.accent, p.secondary, p.positive].map((color, index) => (
                  <View key={`${id}-${index}`} style={[styles.swatch, { backgroundColor: color, borderColor: p.border }]} />
                ))}
              </View>

              <View style={[styles.themeAction, { borderTopColor: p.border }]}>
                <Text style={[styles.themeActionText, { color: p.accent }]}>{active ? 'APPLIED TO VITALQUEST' : 'APPLY SKIN'}</Text>
                <Text style={[styles.themeArrow, { color: p.accent }]}>›</Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}

function RewardGrid({ mode }: { mode: Exclude<ArmoryTab, 'Themes'> }) {
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const filtered = armory.filter((item) => {
    if (mode === 'Gear') return ['Head', 'Chest', 'Legs', 'Aura'].includes(item.kind);
    if (mode === 'Titles') return item.kind === 'Title';
    return item.kind === 'Badge';
  });

  return (
    <View style={styles.grid}>
      {filtered.map((item) => (
        <Card
          key={item.name}
          style={[
            styles.item,
            item.state === 'locked' && styles.locked,
            item.state === 'unlocked' && { borderColor: t.accentSoft, backgroundColor: t.heroSurface },
          ]}
        >
          <View style={[styles.symbol, { backgroundColor: t.surfaceElevated }]}>
            <Text style={[styles.symbolText, { color: item.state === 'locked' ? t.muted : t.accent }]}>
              {item.state === 'locked' ? '⌁' : item.symbol}
            </Text>
          </View>
          <Text style={[styles.kind, { color: t.muted }]}>{item.kind.toUpperCase()}</Text>
          <Text style={[styles.name, { color: t.text }]}>{item.name}</Text>
          <Text style={[styles.state, { color: item.state === 'unlocked' ? t.accent : t.muted }]}>
            {item.state === 'unlocked' ? 'UNLOCKED' : item.state === 'progress' ? 'IN PROGRESS' : 'LOCKED'}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginTop: 4,
  },
  lede: {
    fontSize: 12,
    marginTop: 5,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currencyIcon: {
    fontSize: 10,
  },
  currencyText: {
    fontSize: 12,
    fontWeight: '900',
  },
  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '900',
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  sectionCopy: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  themeCard: {
    padding: spacing.lg,
    overflow: 'hidden',
  },
  themeTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  themeNameBlock: {
    flex: 1,
  },
  themeKicker: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  themeName: {
    fontSize: 25,
    fontWeight: '900',
    marginTop: 3,
  },
  themeCheck: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCheckText: {
    fontSize: 17,
    fontWeight: '900',
  },
  themeTagline: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 18,
  },
  themeFlavor: {
    fontSize: 10,
    marginTop: 5,
  },
  swatches: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 20,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  themeAction: {
    borderTopWidth: 1,
    marginTop: 20,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeActionText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  themeArrow: {
    fontSize: 25,
    lineHeight: 25,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    width: '48%',
    minHeight: 190,
    justifyContent: 'flex-end',
  },
  locked: {
    opacity: 0.48,
  },
  symbol: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  symbolText: {
    fontSize: 25,
    fontWeight: '900',
  },
  kind: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  state: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 8,
  },
});
