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
  useWindowDimensions,
  View,
} from 'react-native';
import { templates } from './data';
import { calculateSessionXP, calculateStrengthXP } from './gameEngine';
import { saveCompletedWorkout } from './db';
import { useVitalTheme } from './ThemeProvider';
import { IconArt } from './IconArt';

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

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function ActiveWorkoutV2() {
  const params = useLocalSearchParams<{ templateId?: string }>();
  const db = useSQLiteContext();
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const template = templates.find((x) => x.id === params.templateId) ?? templates[0];
  const styles = useMemo(() => makeStyles(t), [t]);

  const [startedAt] = useState(() => new Date());
  const [sets, setSets] = useState<SetState[]>(() =>
    template.exercises.flatMap((exercise) =>
      exercise.previous.map((previous, index) => ({
        id: makeId(exercise.id), exerciseId: exercise.id, exerciseName: exercise.name,
        setNumber: index + 1, weight: String(previous.weight), reps: String(previous.reps),
        completed: false, isPR: false,
      }))
    )
  );
  const [restSeconds, setRestSeconds] = useState(0);
  const [result, setResult] = useState<null | { xp:number; strengthXP:number; volume:number; completedSets:number; prCount:number; duration:number }>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (restSeconds <= 0) return;
    timerRef.current = setInterval(() => setRestSeconds((s) => {
      if (s <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; }
      return s - 1;
    }), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restSeconds > 0]);

  const completedSets = sets.filter((s) => s.completed).length;
  const volume = useMemo(() => sets.reduce((sum, s) => s.completed ? sum + Number(s.weight || 0) * Number(s.reps || 0) : sum, 0), [sets]);
  const liveStrengthXP = calculateStrengthXP({ completedSets, volume, prCount: sets.filter((s) => s.completed && s.isPR).length });
  const progress = sets.length ? completedSets / sets.length : 0;
  const groups = template.exercises.map((exercise) => ({ exercise, sets: sets.filter((s) => s.exerciseId === exercise.id) }));

  const updateSet = (id:string, field:'weight'|'reps', value:string) => setSets((all) => all.map((s) => s.id === id ? {...s,[field]:value} : s));
  const togglePR = (id:string) => setSets((all) => all.map((s) => s.id === id ? {...s,isPR:!s.isPR} : s));
  const completeSet = (id:string) => {
    setSets((all) => all.map((s) => s.id === id ? {...s,completed:!s.completed} : s));
    setRestSeconds(90);
  };

  async function finishWorkout() {
    if (completedSets === 0) { Alert.alert('Complete at least one set', 'Log a working set before finishing.'); return; }
    const completedAt = new Date();
    const duration = Math.max(1, Math.round((completedAt.getTime() - startedAt.getTime()) / 60000));
    const prCount = sets.filter((s) => s.completed && s.isPR).length;
    const xp = calculateSessionXP({ completedSets, durationMinutes: duration, prCount, streakDays: 12 });
    const strengthXP = calculateStrengthXP({ completedSets, volume, prCount });
    const completed = sets.filter((s) => s.completed);
    await saveCompletedWorkout(db, {
      sessionId: makeId('session'), templateId: template.id, name: template.name,
      startedAt: startedAt.toISOString(), completedAt: completedAt.toISOString(), durationMinutes: duration,
      totalVolume: volume, totalXP: xp, strengthXP,
      sets: completed.map((s) => ({ id:s.id, exerciseId:s.exerciseId, exerciseName:s.exerciseName, setNumber:s.setNumber, weight:Number(s.weight||0), reps:Number(s.reps||0), isPR:s.isPR })),
    });
    setResult({xp,strengthXP,volume,completedSets,prCount,duration});
  }

  if (result) return <Completion result={result} templateName={template.name} styles={styles} />;

  if (template.id === 'run') {
    return <SafeAreaView style={styles.safe}><View style={styles.runState}><Text style={styles.kicker}>ENDURANCE PROTOCOL</Text><Text style={styles.runTitle}>Run tracking comes in the native pass.</Text><Text style={styles.runCopy}>GPS and HealthKit ingestion are reserved for the native integration layer. The Stamina path is already represented in progression.</Text><Pressable style={styles.secondaryButton} onPress={()=>router.back()}><Text style={styles.secondaryButtonText}>RETURN TO TRAINING HALL</Text></Pressable></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹ EXIT</Text></Pressable>
          <View style={styles.topCenter}><Text style={styles.topTitle}>{template.name}</Text><Text style={styles.topMeta}>{completedSets}/{sets.length} sets complete</Text></View>
          <Pressable onPress={finishWorkout}><Text style={styles.finish}>FINISH</Text></Pressable>
        </View>

        {restSeconds > 0 && <View style={styles.restDock}>
          <View><Text style={styles.restEyebrow}>RECOVERY WINDOW</Text><Text style={styles.restHint}>Next set unlocks at full readiness.</Text></View>
          <Text style={styles.restTime}>{Math.floor(restSeconds/60)}:{String(restSeconds%60).padStart(2,'0')}</Text>
          <View style={styles.restActions}><Pressable onPress={()=>setRestSeconds((s)=>s+30)}><Text style={styles.restAction}>+30</Text></Pressable><Pressable onPress={()=>setRestSeconds(0)}><Text style={styles.restAction}>SKIP</Text></Pressable></View>
        </View>}

        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, wide&&styles.contentWide]}>
          <View style={[styles.sessionHud, wide&&styles.sessionHudWide]}>
            <View style={{flex:1}}><Text style={styles.kicker}>ACTIVE ENCOUNTER</Text><Text style={styles.sessionTitle}>{template.name}</Text><Text style={styles.sessionCopy}>Log the work. The game engine handles the conversion.</Text></View>
            <View style={styles.liveStats}><HudStat icon="strength" value={volume.toLocaleString()} label="LB VOLUME"/><HudStat icon="xp" value={`+${liveStrengthXP}`} label="STR XP"/><HudStat icon="streak" value={`${Math.round(progress*100)}%`} label="COMPLETE"/></View>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${progress*100}%`}]} /></View>

          {groups.map(({exercise,sets:exerciseSets}, exerciseIndex) => {
            const done = exerciseSets.filter((s)=>s.completed).length;
            return <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseBadge}><Text style={styles.exerciseBadgeText}>{String(exerciseIndex+1).padStart(2,'0')}</Text></View>
                <View style={{flex:1}}><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.exerciseMuscle}>{exercise.muscle}</Text></View>
                <Text style={styles.exerciseCount}>{done}/{exerciseSets.length}</Text>
              </View>
              <View style={styles.columns}><Text style={[styles.colLabel,styles.setCol]}>SET</Text><Text style={[styles.colLabel,styles.inputCol]}>LOAD</Text><Text style={[styles.colLabel,styles.inputCol]}>REPS</Text><Text style={[styles.colLabel,styles.prCol]}>PR</Text><View style={styles.checkCol}/></View>
              {exerciseSets.map((set) => {
                const previous = exercise.previous[set.setNumber-1];
                return <View key={set.id} style={[styles.setRow,set.completed&&styles.setRowDone]}>
                  <View style={styles.setCol}><Text style={styles.setNumber}>{set.setNumber}</Text><Text style={styles.previous}>{previous.weight}×{previous.reps}</Text></View>
                  <TextInput value={set.weight} onChangeText={(v)=>updateSet(set.id,'weight',v)} keyboardType="decimal-pad" selectTextOnFocus style={[styles.input,styles.inputCol,set.completed&&styles.inputDone]}/>
                  <TextInput value={set.reps} onChangeText={(v)=>updateSet(set.id,'reps',v)} keyboardType="number-pad" selectTextOnFocus style={[styles.input,styles.inputCol,set.completed&&styles.inputDone]}/>
                  <Pressable style={styles.prCol} onPress={()=>togglePR(set.id)}><Text style={[styles.pr,set.isPR&&styles.prActive]}>PR</Text></Pressable>
                  <Pressable onPress={()=>completeSet(set.id)} style={[styles.check,styles.checkCol,set.completed&&styles.checkDone]}><Text style={[styles.checkText,set.completed&&styles.checkTextDone]}>{set.completed?'✓':'+'}</Text></Pressable>
                </View>;
              })}
            </View>;
          })}

          <View style={styles.sessionFooter}><Text style={styles.footerEyebrow}>SESSION PROJECTION</Text><Text style={styles.footerTitle}>{completedSets === sets.length ? 'Encounter cleared.' : `${sets.length-completedSets} working sets remain.`}</Text><Text style={styles.footerCopy}>Your live volume and Strength XP update as each set is confirmed.</Text></View>
          <Pressable style={styles.finishButton} onPress={finishWorkout}><Text style={styles.finishButtonText}>COMPLETE ENCOUNTER</Text></Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function HudStat({icon,value,label}:{icon:'strength'|'xp'|'streak';value:string;label:string}) { const {theme}=useVitalTheme(); const t=theme.tokens; return <View style={[stylesStatic.hudStat,{borderColor:t.border,backgroundColor:`${t.surface}DD`}]}><IconArt name={icon} size={26}/><Text style={[stylesStatic.hudValue,{color:t.text}]}>{value}</Text><Text style={[stylesStatic.hudLabel,{color:t.muted}]}>{label}</Text></View>; }

function Completion({result,templateName,styles}:{result:{xp:number;strengthXP:number;volume:number;completedSets:number;prCount:number;duration:number};templateName:string;styles:any}) {
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.result}>
    <Text style={styles.resultEyebrow}>ENCOUNTER COMPLETE</Text><Text style={styles.resultTitle}>{templateName}</Text><Text style={styles.resultCopy}>Your real-world effort has been converted into progression.</Text>
    <View style={styles.rewardMedallion}><IconArt name="xp" size={68}/><Text style={styles.rewardXP}>+{result.xp} XP</Text></View>
    <View style={styles.resultGrid}><ResultStat value={`${result.completedSets}`} label="SETS" styles={styles}/><ResultStat value={result.volume.toLocaleString()} label="LB VOLUME" styles={styles}/><ResultStat value={`${result.duration}`} label="MIN" styles={styles}/></View>
    <View style={styles.attributePanel}><View><Text style={styles.attributeEyebrow}>ATTRIBUTE GAIN</Text><Text style={styles.attributeTitle}>Strength advanced</Text></View><Text style={styles.attributeGain}>+{result.strengthXP}</Text></View>
    {result.prCount>0&&<View style={styles.prBanner}><Text style={styles.prBannerKicker}>PERSONAL RECORD</Text><Text style={styles.prBannerText}>{result.prCount} PR{result.prCount===1?'':'s'} forged in this encounter.</Text></View>}
    <View style={styles.streakPanel}><IconArt name="streak" size={44}/><View style={{flex:1}}><Text style={styles.streakTitle}>Streak preserved</Text><Text style={styles.streakCopy}>12 days of discipline. One more resistance session completes Iron Week.</Text></View></View>
    <Text style={styles.sync}>Saved locally · queued for cloud sync</Text>
    <Pressable style={styles.finishButton} onPress={()=>router.replace('/(tabs)/hero')}><Text style={styles.finishButtonText}>VIEW HERO PROGRESSION</Text></Pressable>
    <Pressable style={styles.secondaryButton} onPress={()=>router.replace('/(tabs)')}><Text style={styles.secondaryButtonText}>RETURN TO TODAY</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

function ResultStat({value,label,styles}:{value:string;label:string;styles:any}) { return <View style={styles.resultStat}><Text style={styles.resultStatValue}>{value}</Text><Text style={styles.resultStatLabel}>{label}</Text></View>; }

const stylesStatic = StyleSheet.create({
  hudStat:{flex:1,minWidth:96,borderWidth:1,borderRadius:12,padding:10,alignItems:'center'},hudValue:{fontSize:15,fontWeight:'900',marginTop:2},hudLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,marginTop:2}
});

function makeStyles(t:any) { return StyleSheet.create({
  safe:{flex:1,backgroundColor:t.background},
  topBar:{minHeight:72,borderBottomWidth:1,borderBottomColor:t.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,backgroundColor:t.navBackground},
  back:{color:t.muted,fontSize:10,fontWeight:'900',letterSpacing:.8,width:62},topCenter:{alignItems:'center'},topTitle:{color:t.text,fontSize:15,fontWeight:'900'},topMeta:{color:t.muted,fontSize:8.5,marginTop:3},finish:{color:t.accent,fontSize:10,fontWeight:'900',letterSpacing:.8,width:62,textAlign:'right'},
  restDock:{minHeight:66,paddingHorizontal:16,borderBottomWidth:1,borderBottomColor:t.accentSoft,backgroundColor:t.heroSurface,flexDirection:'row',alignItems:'center',gap:14},restEyebrow:{color:t.accent,fontSize:7,fontWeight:'900',letterSpacing:1.2},restHint:{color:t.muted,fontSize:8,marginTop:3},restTime:{color:t.accent,fontSize:28,fontWeight:'900',fontVariant:['tabular-nums']},restActions:{marginLeft:'auto',gap:4},restAction:{color:t.text,fontSize:8,fontWeight:'900',paddingVertical:3,textAlign:'right'},
  content:{padding:14,paddingBottom:90,gap:14,width:'100%',maxWidth:900,alignSelf:'center'},contentWide:{padding:22},
  sessionHud:{borderWidth:1,borderColor:t.border,borderRadius:18,padding:16,backgroundColor:t.surface},sessionHudWide:{flexDirection:'row',alignItems:'center',gap:18},kicker:{color:t.accent,fontSize:8,fontWeight:'900',letterSpacing:1.4},sessionTitle:{color:t.text,fontSize:28,fontWeight:'900',marginTop:4},sessionCopy:{color:t.muted,fontSize:11,lineHeight:17,marginTop:5,maxWidth:430},liveStats:{flexDirection:'row',gap:8,marginTop:14,flexWrap:'wrap'},progressTrack:{height:7,backgroundColor:t.surfaceElevated,borderRadius:99,overflow:'hidden'},progressFill:{height:'100%',backgroundColor:t.accent,borderRadius:99},
  exerciseCard:{borderWidth:1,borderColor:t.border,borderRadius:18,backgroundColor:t.surface,padding:13},exerciseHeader:{flexDirection:'row',alignItems:'center',gap:11,paddingBottom:12},exerciseBadge:{width:38,height:38,borderRadius:10,borderWidth:1,borderColor:t.accentSoft,alignItems:'center',justifyContent:'center',backgroundColor:t.heroSurface},exerciseBadgeText:{color:t.accent,fontSize:10,fontWeight:'900'},exerciseName:{color:t.text,fontSize:16,fontWeight:'900'},exerciseMuscle:{color:t.muted,fontSize:9.5,marginTop:3},exerciseCount:{color:t.accent,fontSize:12,fontWeight:'900'},
  columns:{flexDirection:'row',alignItems:'center',paddingVertical:6,borderTopWidth:1,borderTopColor:t.border},colLabel:{color:t.muted,fontSize:6.5,fontWeight:'900',letterSpacing:.8,textAlign:'center'},setCol:{width:54},inputCol:{flex:1,minWidth:72},prCol:{width:42,alignItems:'center'},checkCol:{width:42},
  setRow:{flexDirection:'row',alignItems:'center,gap:6',minHeight:58,borderTopWidth:1,borderTopColor:t.border},setRowDone:{backgroundColor:`${t.positive}0E`},setNumber:{color:t.text,fontSize:15,fontWeight:'900',textAlign:'center'},previous:{color:t.muted,fontSize:7,textAlign:'center',marginTop:2},input:{height:40,borderWidth:1,borderColor:t.border,borderRadius:9,color:t.text,backgroundColor:t.surfaceElevated,textAlign:'center',fontWeight:'900'},inputDone:{borderColor:`${t.positive}66`},pr:{color:t.muted,fontSize:8,fontWeight:'900'},prActive:{color:t.accent},check:{height:36,borderRadius:10,borderWidth:1,borderColor:t.accentSoft,alignItems:'center',justifyContent:'center'},checkDone:{backgroundColor:t.positive,borderColor:t.positive},checkText:{color:t.accent,fontSize:16,fontWeight:'900'},checkTextDone:{color:t.background},
  sessionFooter:{borderWidth:1,borderColor:t.border,borderRadius:16,padding:15,backgroundColor:t.heroSurface},footerEyebrow:{color:t.accent,fontSize:7,fontWeight:'900',letterSpacing:1.2},footerTitle:{color:t.text,fontSize:18,fontWeight:'900',marginTop:5},footerCopy:{color:t.muted,fontSize:9.5,lineHeight:15,marginTop:4},finishButton:{minHeight:54,borderRadius:12,backgroundColor:t.accent,alignItems:'center',justifyContent:'center'},finishButtonText:{color:t.background,fontSize:10,fontWeight:'900',letterSpacing:1.1},secondaryButton:{minHeight:50,borderRadius:12,borderWidth:1,borderColor:t.border,alignItems:'center',justifyContent:'center',marginTop:10},secondaryButtonText:{color:t.text,fontSize:9,fontWeight:'900',letterSpacing:.9},
  result:{padding:20,paddingBottom:60,gap:14,width:'100%',maxWidth:700,alignSelf:'center'},resultEyebrow:{color:t.accent,fontSize:9,fontWeight:'900',letterSpacing:1.6,textAlign:'center',marginTop:14},resultTitle:{color:t.text,fontSize:34,fontWeight:'900',textAlign:'center'},resultCopy:{color:t.muted,fontSize:11,lineHeight:17,textAlign:'center'},rewardMedallion:{alignItems:'center',justifyContent:'center',paddingVertical:14},rewardXP:{color:t.accent,fontSize:32,fontWeight:'900',marginTop:2},resultGrid:{flexDirection:'row',gap:8},resultStat:{flex:1,borderWidth:1,borderColor:t.border,borderRadius:14,padding:14,backgroundColor:t.surface,alignItems:'center'},resultStatValue:{color:t.text,fontSize:18,fontWeight:'900'},resultStatLabel:{color:t.muted,fontSize:7,fontWeight:'900',letterSpacing:.8,marginTop:3},attributePanel:{borderWidth:1,borderColor:t.accentSoft,borderRadius:16,padding:16,backgroundColor:t.heroSurface,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},attributeEyebrow:{color:t.accent,fontSize:7,fontWeight:'900',letterSpacing:1.1},attributeTitle:{color:t.text,fontSize:18,fontWeight:'900',marginTop:4},attributeGain:{color:t.accent,fontSize:30,fontWeight:'900'},prBanner:{borderWidth:1,borderColor:t.accent,borderRadius:14,padding:14,backgroundColor:t.surface},prBannerKicker:{color:t.accent,fontSize:7,fontWeight:'900',letterSpacing:1.2},prBannerText:{color:t.text,fontSize:13,fontWeight:'800',marginTop:4},streakPanel:{borderWidth:1,borderColor:t.border,borderRadius:14,padding:14,backgroundColor:t.surface,flexDirection:'row',alignItems:'center',gap:10},streakTitle:{color:t.text,fontSize:14,fontWeight:'900'},streakCopy:{color:t.muted,fontSize:9,lineHeight:14,marginTop:3},sync:{color:t.muted,fontSize:8,textAlign:'center'},
  runState:{flex:1,padding:24,alignItems:'center',justifyContent:'center'},runTitle:{color:t.text,fontSize:30,fontWeight:'900',textAlign:'center',marginTop:8},runCopy:{color:t.muted,fontSize:11,lineHeight:18,textAlign:'center',maxWidth:460,marginTop:10}
}); }
