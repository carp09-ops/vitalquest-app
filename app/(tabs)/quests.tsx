import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Card,
  Eyebrow,
  ProgressBar,
  Screen,
  Title,
} from '../../src/components';
import { quests } from '../../src/data';
import { colors, spacing } from '../../src/theme';

export default function QuestsScreen() {
  return (
    <Screen>
      <Eyebrow>Quest board</Eyebrow>
      <Title>Earn your next reward.</Title>
      <Text style={styles.lede}>
        Quests turn normal training behavior into short, visible objectives.
      </Text>

      {quests.map((quest, index) => {
        const ratio = Math.min(1, quest.progress / quest.target);
        return (
          <Card key={quest.title}>
            <View style={styles.top}>
              <View style={styles.number}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{quest.title}</Text>
                <Text style={styles.description}>{quest.description}</Text>
              </View>
              <Text style={styles.reward}>{quest.reward}</Text>
            </View>
            <ProgressBar value={ratio} />
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{quest.progress}</Text>
              <Text style={styles.progressText}>{quest.target}</Text>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: -6,
    marginBottom: spacing.sm,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  number: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: colors.goldSoft,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18150F',
  },
  numberText: {
    color: colors.gold,
    fontWeight: '900',
  },
  body: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 17,
  },
  description: {
    color: colors.muted,
    lineHeight: 18,
    marginTop: 4,
    fontSize: 12,
  },
  reward: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 11,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  progressText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
});
