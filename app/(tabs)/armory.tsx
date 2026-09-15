import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Screen, Title } from '../../src/components';
import { armory } from '../../src/data';
import { colors, radius, spacing } from '../../src/theme';

export default function ArmoryScreen() {
  return (
    <Screen>
      <Eyebrow>Reward registry</Eyebrow>
      <Title>Your legend, collected.</Title>
      <Text style={styles.lede}>
        Equipment is cosmetic. Every unlock exists because you did something in the real world.
      </Text>

      <View style={styles.grid}>
        {armory.map((item) => (
          <Card
            key={item.name}
            style={[
              styles.item,
              item.state === 'locked' && styles.locked,
              item.state === 'unlocked' && styles.unlocked,
            ]}
          >
            <View style={styles.symbol}>
              <Text
                style={[
                  styles.symbolText,
                  item.state === 'locked' && styles.lockedText,
                ]}
              >
                {item.state === 'locked' ? '⌁' : item.symbol}
              </Text>
            </View>
            <Text style={styles.kind}>{item.kind.toUpperCase()}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text
              style={[
                styles.state,
                item.state === 'unlocked' && styles.stateUnlocked,
              ]}
            >
              {item.state === 'unlocked'
                ? 'UNLOCKED'
                : item.state === 'progress'
                ? 'IN PROGRESS'
                : 'LOCKED'}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: -6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  item: {
    width: '48%',
    minHeight: 190,
    justifyContent: 'flex-end',
  },
  locked: {
    opacity: 0.48,
  },
  unlocked: {
    borderColor: colors.goldSoft,
    backgroundColor: '#15130F',
  },
  symbol: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  symbolText: {
    color: colors.gold,
    fontSize: 25,
    fontWeight: '900',
  },
  lockedText: {
    color: colors.muted,
  },
  kind: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  state: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 8,
  },
  stateUnlocked: {
    color: colors.gold,
  },
});
