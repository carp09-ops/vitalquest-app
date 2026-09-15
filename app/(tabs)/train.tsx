import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Screen, Title } from '../../src/components';
import { templates } from '../../src/data';
import { colors, radius, spacing } from '../../src/theme';

export default function TrainScreen() {
  return (
    <Screen>
      <Eyebrow>Training hall</Eyebrow>
      <Title>Choose your trial.</Title>
      <Text style={styles.lede}>
        Templates keep logging fast. Your progression is calculated when the session is completed.
      </Text>

      <View style={styles.grid}>
        {templates.map((template) => (
          <Pressable
            key={template.id}
            onPress={() =>
              router.push({
                pathname: '/workout',
                params: { templateId: template.id },
              })
            }
          >
            <Card style={styles.template}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{template.icon}</Text>
              </View>
              <View style={styles.templateBody}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateSubtitle}>{template.subtitle}</Text>
                <Text style={styles.templateMeta}>
                  ~{template.estimatedMinutes} min
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.outline}>
        <Text style={styles.outlineText}>+ CREATE TEMPLATE</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: -6,
  },
  grid: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  template: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: '#1B1812',
    borderColor: colors.goldSoft,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.gold,
    fontSize: 22,
  },
  templateBody: {
    flex: 1,
  },
  templateName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  templateSubtitle: {
    color: colors.muted,
    marginTop: 2,
    fontSize: 12,
  },
  templateMeta: {
    color: colors.gold,
    marginTop: 6,
    fontSize: 11,
    fontWeight: '800',
  },
  chevron: {
    color: colors.muted,
    fontSize: 32,
    fontWeight: '300',
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  outlineText: {
    color: colors.text,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 12,
  },
});
