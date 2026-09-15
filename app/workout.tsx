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
import { calculateSessionXP, calculateStrengthXP } from '../src/gameEngine';
import { saveCompletedWorkout } from '../src/db';
import { useVitalTheme } from '../src/ThemeProvider';
import { radius, spacing, VitalTheme } from '../src/theme';

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
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const styles = useMemo(() => makeStyles(t), [t]);
  const template = templates.find((item) => item.id === params.templateId) ?? templates[0];

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
    setSets((current) => current.map((set) => (set.id === id ? { ...set, [field]: value } : set)));
  }

  function completeSet(id: string) {
    setSets((current) => current.map((set) => (set.id === id ? { ...set, completed: !set.completed } : set)));
    setRestSeconds(90);
  }

  function togglePR(id: string) {
    setSets((current) => current.map((set) => (set.id === id ? { ...set, isPR: !set.isPR } : set)));
  }

  async function finishWorkout() {
    if (completedSets === 0) {
      Alert.alert('Complete at least one set', 'Log a working set before finishing.');
      return;
    }

    const completedAt = new Date();
    const duration = Math.max(1, Math.round((completedAt.getTime() - startedAt.getTime()) / 60000));
    const prCount = sets.filter((set) => set.completed && set.isPR).length;
    const xp = calculateSessionXP({ completedSets, durationMinutes: duration, prCount, streakDays: 12 });
    const strengthXP = calculateStrengthXP({ completedSets, volume, prCount });
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

    setResult({ xp, strengthXP, volume, completedSets, prCount, duration });
  }

  if (result) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.result}>
          <Text style={styles.resultEyebrow}>QUEST COMPLETE</Text>
          <Text style={styles.resultTitle}>{template.name}</Text>
          <Text style={styles.resultCopy}>The work is logged. The hero moves forward.</Text>

          <View style={styles.xpBurst}>
            <Text style={styles.plus}>+</Text>
            <Text style={styles.bigXp}>{result.xp}</Text>
            <Text style={styles.xpUnit}>XP</Text>
          </View>

          <View style={styles.resultStats}>
            <ResultStat value={`${result.completedSets}`} label="SETS" />
            <ResultStat value={result.volume.toLocaleString()} label="LB VOLUME" />
            <ResultStat value={`${result.duration}`} label="MIN" />
          </View>

          <View style={styles.attributeGain}>
            <View>
              <Text style={styles.attributeKicker}>ATTRIBUTE GAIN</Text>
              <Text style={styles.attributeLabel}>Strength</Text>
            </View>
            <Text style={styles.attributeValue}>+{result.strengthXP}</Text>
          </View>

          {result.prCount > 0 ? (
            <View style={styles.prBanner}>
              <Text style={styles.prKicker}>NEW RECORD</Text>
              <Text style={styles.prText}>{result.prCount} PR{result.prCount === 1 ? '' : 's'} forged today.</Text>
            </View>
          ) : null}

          <View style={styles.rewardPanel}>
            <Text style={styles.rewardKicker}>STREAK PRESERVED</Text>
            <Text style={styles.rewardTitle}>12 days of discipline.</Text>
            <Text style={styles.rewardCopy}>Complete one more resistance session to finish Iron Week.</Text>
          </View>

          <Text style={styles.synced}>Saved locally · queued for cloud sync</Text>

          <Pressable style={styles.finishButton} onPress={() => router.replace('/(tabs)/hero')}>
            <Text style={styles.finishButtonText}>VIEW HERO</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.secondaryButtonText}>BACK TO TODAY</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (template.id === 'run') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.runPlaceholder}>
          <Text style={styles.resultEyebrow}>ENDURANCE</Text>
          <Text style={styles.resultTitle}>Run logger</Text>
          <Text style={styles.runCopy}>GPS + HealthKit ingestion is reserved for the native integration pass. The endurance path is already part of the North Star architecture.</Text>
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>GO BACK</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.cancel}>‹ BACK</Text>
          </Pressable>
          <View style={styles.topCenter}>
            <Text style={styles.topTitle}>Workout Logger</Text>
            <Text style={styles.topMeta}>{completedSets}/{sets.length} sets · {volume.toLocaleString()} lb</Text>
          </View>
          <Pressable onPress={finishWorkout}>
            <Text style={styles.finishLink}>FINISH</Text>
          </Pressable>
        </View>

        {restSeconds > 0 ? (
          <View style={styles.restBar}>
            <Text style={styles.restLabel}>REST TIMER</Text>
            <Text style={styles.restTime}>{Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}</Text>
            <Pressable onPress={() => setRestSeconds(0)}><Text style={styles.skip}>SKIP</Text></Pressable>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.modeTabs}>
            {['Strength', 'Cardio', 'Mobility', 'Custom'].map((mode, index) => (
              <View key={mode} style={[styles.modeTab, index === 0 && styles.modeTabActive]}>
                <Text style={[styles.modeTabText, index === 0 && styles.modeTabTextActive]}>{mode}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sessionHero}>
            <Text style={styles.sessionHeroKicker}>TODAY'S TRIAL</Text>
            <Text style={styles.sessionHeroTitle}>{template.name}</Text>
            <Text style={styles.sessionHeroCopy}>Strength builds more than muscle. Log the work. Forge the progress.</Text>
            <View style={styles.sessionMetaRow}>
              <Text style={styles.sessionMeta}>{template.exercises.length} exercises</Text>
              <Text style={styles.sessionMeta}>•</Text>
              <Text style={styles.sessionMeta}>Est. {template.estimatedMinutes} min</Text>
            </View>
          </View>

          {groups.map(({ exercise, sets: exerciseSets }) => (
            <View key={exercise.id} style={styles.exercise}>
              <View style={styles.exerciseHeader}>
                <View>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
                </View>
                <Text style={styles.exerciseCount}>{exerciseSets.filter((set) => set.completed).length}/{exerciseSets.length}</Text>
              </View>

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
                  <View key={set.id} style={[styles.setRow, set.completed && styles.completedRow]}>
                    <View style={styles.setCol}>
                      <Text style={styles.setNumber}>{set.setNumber}</Text>
                      <Text style={styles.previous}>{previous.weight}×{previous.reps}</Text>
                    </View>
                    <TextInput value={set.weight} onChangeText={(value) => updateSet(set.id, 'weight', value)} keyboardType="decimal-pad" selectTextOnFocus style={[styles.input, styles.inputCol]} />
                    <TextInput value={set.reps} onChangeText={(value) => updateSet(set.id, 'reps', value)} keyboardType="number-pad" selectTextOnFocus style={[styles.input, styles.inputCol]} />
                    <Pressable style={styles.prCol} onPress={() => togglePR(set.id)}>
                      <Text style={[styles.pr, set.isPR && styles.prActive]}>★</Text>
                    </Pressable>
                    <Pressable style={[styles.check, styles.checkCol, set.completed && styles.checkDone]} onPress={() => completeSet(set.id)}>
                      <Text style={[styles.checkText, set.completed && styles.checkTextDone]}>✓</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}

          <Pressable style={styles.addExercise}><Text style={styles.addExerciseText}>+ ADD EXERCISE</Text></Pressable>
          <Pressable style={styles.finishButton} onPress={finishWorkout}><Text style={styles.finishButtonText}>FINISH WORKOUT</Text></Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ResultStat({ value, label }: { value: string; label: string }) {
  const { theme } = useVitalTheme();
  const s = useMemo(() => makeStyles(theme.tokens), [theme]);
  return (
    <View style={s.resultStat}>
      <Text style={s.resultStatValue}>{value}</Text>
      <Text style={s.resultStatLabel}>{label}</Text>
    </View>
  );
}

function makeStyles(t: VitalTheme['tokens']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.background },
    flex: { flex: 1 },
    topBar: { minHeight: 70, borderBottomWidth: 1, borderBottomColor: t.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, justifyContent: 'space-between' },
    cancel: { color: t.muted, fontWeight: '900', fontSize: 10, letterSpacing: 0.7, width: 64 },
    topCenter: { alignItems: 'center' },
    topTitle: { color: t.text, fontWeight: '900', fontSize: 15 },
    topMeta: { color: t.muted, fontSize: 9, marginTop: 3 },
    finishLink: { color: t.accent, fontWeight: '900', fontSize: 10, letterSpacing: 0.8, width: 64, textAlign: 'right' },
    restBar: { backgroundColor: t.heroSurface, borderBottomWidth: 1, borderBottomColor: t.accentSoft, minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
    restLabel: { color: t.muted, fontWeight: '900', fontSize: 8, letterSpacing: 1.1 },
    restTime: { color: t.accent, fontWeight: '900', fontSize: 20, fontVariant: ['tabular-nums'] },
    skip: { color: t.text, fontWeight: '900', fontSize: 9 },
    content: { padding: spacing.md, paddingBottom: 90, gap: 16, width: '100%', maxWidth: 760, alignSelf: 'center' },
    modeTabs: { flexDirection: 'row', gap: 5, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radius.md, padding: 4 },
    modeTab: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },
    modeTabActive: { backgroundColor: t.surfaceElevated },
    modeTabText: { color: t.muted, fontSize: 9, fontWeight: '800' },
    modeTabTextActive: { color: t.accent },
    sessionHero: { backgroundColor: t.heroSurface, borderWidth: 1, borderColor: t.accentSoft, borderRadius: radius.lg, padding: spacing.lg },
    sessionHeroKicker: { color: t.accent, fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
    sessionHeroTitle: { color: t.text, fontSize: 28, fontWeight: '900', marginTop: 5 },
    sessionHeroCopy: { color: t.muted, fontSize: 12, lineHeight: 18, marginTop: 6, maxWidth: 500 },
    sessionMetaRow: { flexDirection: 'row', gap: 7, marginTop: 14 },
    sessionMeta: { color: t.accent, fontSize: 9, fontWeight: '800' },
    exercise: { backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radius.lg, padding: spacing.md },
    exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    exerciseName: { color: t.text, fontSize: 20, fontWeight: '900' },
    exerciseMuscle: { color: t.accent, fontSize: 10, fontWeight: '800', marginTop: 3 },
    exerciseCount: { color: t.muted, fontSize: 10, fontWeight: '900' },
    rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
    columnLabel: { color: t.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
    setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, borderRadius: radius.md, paddingVertical: 5 },
    completedRow: { backgroundColor: `${t.positive}18` },
    setCol: { width: 45, alignItems: 'center' },
    inputCol: { flex: 1 },
    prCol: { width: 32, alignItems: 'center' },
    checkCol: { width: 42 },
    setNumber: { color: t.text, fontWeight: '900' },
    previous: { color: t.muted, fontSize: 8, marginTop: 2 },
    input: { minHeight: 46, borderRadius: radius.sm, backgroundColor: t.surfaceElevated, color: t.text, textAlign: 'center', fontSize: 18, fontWeight: '900', borderWidth: 1, borderColor: t.border },
    pr: { color: t.border, fontSize: 20 },
    prActive: { color: t.accent },
    check: { height: 42, borderRadius: 21, borderWidth: 1, borderColor: t.border, alignItems: 'center', justifyContent: 'center' },
    checkDone: { backgroundColor: t.positive, borderColor: t.positive },
    checkText: { color: t.muted, fontWeight: '900' },
    checkTextDone: { color: t.background },
    addExercise: { borderWidth: 1, borderColor: t.border, borderRadius: radius.md, paddingVertical: 15, alignItems: 'center' },
    addExerciseText: { color: t.text, fontWeight: '900', fontSize: 10, letterSpacing: 1 },
    finishButton: { backgroundColor: t.accent, borderRadius: radius.md, paddingVertical: 17, alignItems: 'center', marginTop: 4 },
    finishButtonText: { color: t.background, fontWeight: '900', letterSpacing: 1.2 },
    secondaryButton: { borderColor: t.border, borderWidth: 1, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
    secondaryButtonText: { color: t.text, fontWeight: '900', letterSpacing: 1, fontSize: 11 },
    result: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 60, width: '100%', maxWidth: 620, alignSelf: 'center', justifyContent: 'center' },
    resultEyebrow: { color: t.accent, fontWeight: '900', fontSize: 10, letterSpacing: 2, textAlign: 'center' },
    resultTitle: { color: t.text, fontWeight: '900', fontSize: 36, textAlign: 'center', marginTop: 8 },
    resultCopy: { color: t.muted, textAlign: 'center', fontSize: 12, marginTop: 7 },
    xpBurst: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginVertical: 34 },
    plus: { color: t.accent, fontSize: 28, fontWeight: '900', marginRight: 4 },
    bigXp: { color: t.text, fontSize: 72, fontWeight: '900', letterSpacing: -4 },
    xpUnit: { color: t.accent, fontSize: 18, fontWeight: '900', marginLeft: 8 },
    resultStats: { flexDirection: 'row', gap: 8 },
    resultStat: { flex: 1, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radius.md, padding: 12, alignItems: 'center' },
    resultStatValue: { color: t.text, fontSize: 17, fontWeight: '900' },
    resultStatLabel: { color: t.muted, fontSize: 8, fontWeight: '900', marginTop: 4, letterSpacing: 0.8 },
    attributeGain: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: t.border, marginVertical: 22, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    attributeKicker: { color: t.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
    attributeLabel: { color: t.text, fontWeight: '900', fontSize: 18, marginTop: 3 },
    attributeValue: { color: t.strength, fontWeight: '900', fontSize: 25 },
    prBanner: { backgroundColor: t.heroSurface, borderWidth: 1, borderColor: t.accentSoft, borderRadius: radius.md, padding: 14, marginBottom: 12 },
    prKicker: { color: t.accent, textAlign: 'center', fontWeight: '900', fontSize: 8, letterSpacing: 1.3 },
    prText: { color: t.text, textAlign: 'center', fontWeight: '900', marginTop: 4 },
    rewardPanel: { backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radius.md, padding: 16, marginBottom: 16 },
    rewardKicker: { color: t.positive, fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
    rewardTitle: { color: t.text, fontSize: 18, fontWeight: '900', marginTop: 5 },
    rewardCopy: { color: t.muted, fontSize: 11, lineHeight: 17, marginTop: 4 },
    synced: { color: t.muted, textAlign: 'center', fontSize: 10, marginBottom: 18 },
    runPlaceholder: { flex: 1, padding: 24, justifyContent: 'center', width: '100%', maxWidth: 600, alignSelf: 'center' },
    runCopy: { color: t.muted, textAlign: 'center', lineHeight: 20, marginVertical: 24 },
  });
}
