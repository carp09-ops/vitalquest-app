import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Card,
  Eyebrow,
  ProgressBar,
  Screen,
  SectionHeader,
  Title,
} from '../../src/components';
import { colors, spacing } from '../../src/theme';

const attributes = [
  { name: 'Strength', value: 153, ratio: 0.76, color: colors.strength },
  { name: 'Stamina', value: 128, ratio: 0.64, color: colors.stamina },
  { name: 'Agility', value: 104, ratio: 0.52, color: colors.agility },
  { name: 'Power', value: 137, ratio: 0.68, color: colors.power },
  { name: 'Discipline', value: 171, ratio: 0.86, color: colors.discipline },
];

export default function HeroScreen() {
  return (
    <Screen>
      <Eyebrow>Hero profile</Eyebrow>
      <Title>The Relentless</Title>

      <Card style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarRune}>V</Text>
        </View>
        <View style={styles.identityBody}>
          <Text style={styles.classText}>VANGUARD · LEVEL 12</Text>
          <Text style={styles.name}>Corey</Text>
          <Text style={styles.copy}>7 day streak · 43 lifetime sessions</Text>
        </View>
      </Card>

      <Card>
        <View style={styles.xpTop}>
          <Text style={styles.label}>LEVEL PROGRESS</Text>
          <Text style={styles.gold}>1,180 / 1,800</Text>
        </View>
        <ProgressBar value={0.66} />
      </Card>

      <SectionHeader title="Attributes" right="Overall 139" />

      <Card>
        {attributes.map((attribute, index) => (
          <View
            key={attribute.name}
            style={[
              styles.attribute,
              index !== attributes.length - 1 && styles.attributeBorder,
            ]}
          >
            <View style={styles.attributeTop}>
              <Text style={styles.attributeName}>{attribute.name}</Text>
              <Text style={styles.attributeValue}>{attribute.value}</Text>
            </View>
            <ProgressBar value={attribute.ratio} accent={attribute.color} />
          </View>
        ))}
      </Card>

      <SectionHeader title="Career feats" />

      <View style={styles.feats}>
        <Card style={styles.feat}>
          <Text style={styles.featValue}>482K</Text>
          <Text style={styles.featLabel}>LBS LIFTED</Text>
        </Card>
        <Card style={styles.feat}>
          <Text style={styles.featValue}>74.2</Text>
          <Text style={styles.featLabel}>MILES RUN</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: '#18150F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRune: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 32,
  },
  identityBody: {
    flex: 1,
  },
  classText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  copy: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  xpTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  gold: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 11,
  },
  attribute: {
    paddingVertical: 12,
  },
  attributeBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  attributeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  attributeName: {
    color: colors.text,
    fontWeight: '800',
  },
  attributeValue: {
    color: colors.text,
    fontWeight: '900',
  },
  feats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  feat: {
    flex: 1,
  },
  featValue: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
  },
  featLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 5,
  },
});
