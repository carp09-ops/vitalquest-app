import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { templates } from '../src/data';
import {
  calculateSessionXP,
  calculateStrengthXP,
} from '../src/gameEngine';
import { saveCompletedWorkout } from '../src/db';
import { colors, radius, spacing } from '../src/theme';

type SetState = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
  isPR: boolean;
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function WorkoutScreen() {
  const params = useLocalSearchParams<{ templateId?: string }>();
  const db = useSQLiteContext();
  const template =
    templates.find((item) => item.id === params.templateId) ?? templates[0];

  const [startedAt] = useState(() => new Date());
  const [sets, setSets] = useState<SetState[]>(() =>
    template.exercises.flatMap((exercise) =>
      exercise.previous.map((previous, index) => ({
        id: makeId(exercise.id),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setNumber: index + 1,
        weight: String(previous.weight),
        reps: String(previous.reps),
        completed: false,
        isPR: false,
      }))
    )
  );
  const [restSeconds, setRestSeconds] = useState(0);
  const [result, setResult] = useState<null | {
    xp: number;
    strengthXP: number;
    volume: number;
    completedSets: number;
    prCount: number;
    duration: number;
  }>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (restSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRestSeconds((seconds) => {
        if (seconds <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restSeconds > 0]);

  const volume = useMemo(
    () =>
      sets.reduce((sum, set) => {
        if (!set.completed) return sum;
        return sum + Number(set.weight || 0) * Number(set.reps || 0);
      }, 0),
    [sets]
  );

  const completedSets = sets.filter((set) => set.completed).length;

  const groups = useMemo(
    () =>
      template.exercises.map((exercise) => ({
        exercise,
        sets: sets.filter((set) => set.exerciseId === exercise.id),
      })),
    [sets, template]
  );

  function updateSet(id: string, field: 'weight' | 'reps', value: string) {
    setSets((current) =>
      current.map((set) => (set.id === id ? { ...set, [field]: value } : set))
    );
  }

  function completeSet(id: string) {
    setSets((current) =>
      current.map((set) =>
        set.id === id ? { ...set, completed: !set.completed } : set
      )
    );
    setRestSeconds(90);
  }

  function togglePR(id: string) {
    setSets((current) =>
      current.map((set) =>
        set.id === id ? { ...set, isPR: !set.isPR } : set
      )
    );
  }

  async function finishWorkout() {
    if (completedSets === 0) {
      Alert.alert('Complete at least one set', 'Log a working set before finishing.');
      return;
    }

    const completedAt = new Date();
    const duration = Math.max(
      1,
      Math.round((completedAt.getTime() - startedAt.getTime()) / 60000)
    );
    const prCount = sets.filter((set) => set.completed && set.isPR).length;
    const xp = calculateSessionXP({
      completedSets,
      durationMinutes: duration,
      prCount,
      streakDays: 7,
    });
    const strengthXP = calculateStrengthXP({
      completedSets,
      volume,
      prCount,
    });

    const sessionId = makeId('session');
    const completed = sets.filter((set) => set.completed);

    await saveCompletedWorkout(db, {
      sessionId,
      templateId: template.id,
      name: template.name,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationMinutes: duration,
      totalVolume: volume,
      totalXP: xp,
      strengthXP,
      sets: completed.map((set) => ({
        id: set.id,
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName,
        setNumber: set.setNumber,
        weight: Number(set.weight || 0),
        reps: Number(set.reps || 0),
        isPR: set.isPR,
      })),
    });

    setResult({
      xp,
      strengthXP,
      volume,
      completedSets,
      prCount,
      duration,
    });
  }

  if (result) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.result}>
          <Text style={styles.resultEyebrow}>QUEST COMPLETE</Text>
          <Text style={styles.resultTitle}>{template.name}</Text>

          <View style={styles.xpBurst}>
            <Text style={styles.plus}>+</Text>
            <Text style={styles.bigXp}>{result.xp}</Text>
            <Text style={styles.xpUnit}>XP</Text>
          </View>

          <View style={styles.resultStats}>
            <ResultStat value={`${result.completedSets}`} label="SETS" />
            <ResultStat value={`${result.volume.toLocaleString()}`} label="LB VOLUME" />
            <ResultStat value={`${result.duration}`} label="MIN" />
          </View>

          <View style={styles.attributeGain}>
            <Text style={styles.attributeLabel}>STRENGTH</Text>
            <Text style={styles.attributeValue}>+{result.strengthXP}</Text>
          </View>

          {result.prCount > 0 ? (
            <View style={styles.prBanner}>
              <Text style={styles.prText}>
                NEW RECORD · {result.prCount} PR{result.prCount === 1 ? '' : 's'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.synced}>
            Saved locally · queued for cloud sync
          </Text>

          <Pressable
            style={styles.finishButton}
            onPress={() => router.replace('/(tabs)/hero')}
          >
            <Text style={styles.finishButtonText}>VIEW HERO</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.secondaryButtonText}>BACK TO TODAY</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (template.id === 'run') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.runPlaceholder}>
          <Text style={styles.resultEyebrow}>ENDURANCE</Text>
          <Text style={styles.resultTitle}>Run logger</Text>
          <Text style={styles.runCopy}>
            GPS + HealthKit ingestion lands after the lifting loop is validated.
            The template is already reserved in navigation.
          </Text>
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>GO BACK</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.cancel}>CANCEL</Text>
          </Pressable>

          <View style={styles.topCenter}>
            <Text style={styles.topTitle}>{template.name}</Text>
            <Text style={styles.topMeta}>
              {completedSets}/{sets.length} sets · {volume.toLocaleString()} lb
            </Text>
          </View>

          <Pressable onPress={finishWorkout}>
            <Text style={styles.finishLink}>FINISH</Text>
          </Pressable>
        </View>

        {restSeconds > 0 ? (
          <View style={styles.restBar}>
            <Text style={styles.restLabel}>REST</Text>
            <Text style={styles.restTime}>
              {Math.floor(restSeconds / 60)}:
              {String(restSeconds % 60).padStart(2, '0')}
            </Text>
            <Pressable onPress={() => setRestSeconds(0)}>
              <Text style={styles.skip}>SKIP</Text>
            </Pressable>
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {groups.map(({ exercise, sets: exerciseSets }) => (
            <View key={exercise.id} style={styles.exercise}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>

              <View style={styles.rowHeader}>
                <Text style={[styles.columnLabel, styles.setCol]}>SET</Text>
                <Text style={[styles.columnLabel, styles.inputCol]}>WEIGHT</Text>
                <Text style={[styles.columnLabel, styles.inputCol]}>REPS</Text>
                <Text style={[styles.columnLabel, styles.prCol]}>PR</Text>
                <View style={styles.checkCol} />
              </View>

              {exerciseSets.map((set) => {
                const previous = exercise.previous[set.setNumber - 1];
                return (
                  <View
                    key={set.id}
                    style={[styles.setRow, set.completed && styles.completedRow]}
                  >
                    <View style={styles.setCol}>
                      <Text style={styles.setNumber}>{set.setNumber}</Text>
                      <Text style={styles.previous}>
                        {previous.weight}×{previous.reps}
                      </Text>
                    </View>

                    <TextInput
                      value={set.weight}
                      onChangeText={(value) => updateSet(set.id, 'weight', value)}
                      keyboardType="decimal-pad"
                      selectTextOnFocus
                      style={[styles.input, styles.inputCol]}
                    />
                    <TextInput
                      value={set.reps}
                      onChangeText={(value) => updateSet(set.id, 'reps', value)}
                      keyboardType="number-pad"
                      selectTextOnFocus
                      style={[styles.input, styles.inputCol]}
                    />

                    <Pressable
                      style={styles.prCol}
                      onPress={() => togglePR(set.id)}
                    >
                      <Text
                        style={[
                          styles.pr,
                          set.isPR && styles.prActive,
                        ]}
                      >
                        ★
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.check,
                        styles.checkCol,
                        set.completed && styles.checkDone,
                      ]}
                      onPress={() => completeSet(set.id)}
                    >
                      <Text
                        style={[
                          styles.checkText,
                          set.completed && styles.checkTextDone,
                        ]}
                      >
                        ✓
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}

          <Pressable style={styles.finishButton} onPress={finishWorkout}>
            <Text style={styles.finishButtonText}>FINISH WORKOUT</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ResultStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.resultStat}>
      <Text style={styles.resultStatValue}>{value}</Text>
      <Text style={styles.resultStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  cancel: {
    color: colors.muted,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.8,
    width: 58,
  },
  topCenter: {
    alignItems: 'center',
  },
  topTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 15,
  },
  topMeta: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 3,
  },
  finishLink: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.8,
    width: 58,
    textAlign: 'right',
  },
  restBar: {
    backgroundColor: '#15130F',
    borderBottomWidth: 1,
    borderBottomColor: colors.goldSoft,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  restLabel: {
    color: colors.muted,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  restTime: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 19,
    fontVariant: ['tabular-nums'],
  },
  skip: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 10,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 80,
    gap: 24,
  },
  exercise: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  exerciseMuscle: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
    marginBottom: 18,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7,
  },
  columnLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    borderRadius: radius.md,
    paddingVertical: 5,
  },
  completedRow: {
    backgroundColor: '#121B16',
  },
  setCol: {
    width: 45,
    alignItems: 'center',
  },
  inputCol: {
    flex: 1,
  },
  prCol: {
    width: 32,
    alignItems: 'center',
  },
  checkCol: {
    width: 42,
  },
  setNumber: {
    color: colors.text,
    fontWeight: '900',
  },
  previous: {
    color: colors.muted,
    fontSize: 8,
    marginTop: 2,
  },
  input: {
    minHeight: 46,
    borderRadius: radius.sm,
    backgroundColor: colors.surface2,
    color: colors.text,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pr: {
    color: colors.border,
    fontSize: 20,
  },
  prActive: {
    color: colors.gold,
  },
  check: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkText: {
    color: colors.muted,
    fontWeight: '900',
  },
  checkTextDone: {
    color: '#081009',
  },
  finishButton: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
  },
  finishButtonText: {
    color: '#15120C',
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  secondaryButton: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 12,
  },
  result: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  resultEyebrow: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
  },
  resultTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 34,
    textAlign: 'center',
    marginTop: 8,
  },
  xpBurst: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 36,
  },
  plus: {
    color: colors.gold,
    fontSize: 28,
    fontWeight: '900',
    marginRight: 4,
  },
  bigXp: {
    color: colors.text,
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -4,
  },
  xpUnit: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
  resultStats: {
    flexDirection: 'row',
    gap: 8,
  },
  resultStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
  },
  resultStatValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  resultStatLabel: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 0.8,
  },
  attributeGain: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginVertical: 22,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attributeLabel: {
    color: colors.text,
    fontWeight: '900',
    letterSpacing: 1,
  },
  attributeValue: {
    color: colors.strength,
    fontWeight: '900',
    fontSize: 20,
  },
  prBanner: {
    backgroundColor: '#18150F',
    borderWidth: 1,
    borderColor: colors.goldSoft,
    borderRadius: radius.md,
    padding: 13,
    marginBottom: 18,
  },
  prText: {
    color: colors.gold,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 0.8,
    fontSize: 11,
  },
  synced: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 11,
    marginBottom: 18,
  },
  runPlaceholder: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  runCopy: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 24,
  },
});
