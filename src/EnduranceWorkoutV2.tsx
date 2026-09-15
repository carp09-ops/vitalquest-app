import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconArt } from './IconArt';
import { useVitalTheme } from './ThemeProvider';
import { saveCompletedEnduranceSession } from './db';
import { calculateAgilityXP, calculateEnduranceXP, calculateStaminaXP, formatPace, paceSecondsPerMile } from './gameEngine';

const makeId = (prefix:string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function EnduranceWorkoutV2() {
  const db = useSQLiteContext();
  const { theme } = useVitalTheme();
  const t = theme.tokens;
  const styles = useMemo(() => makeStyles(t), [t]);
  const [distance, setDistance] = useState('3.10');
  const [duration, setDuration] = useState('30');
  const [result, setResult] = useState<null | { xp:number; stamina:number; agility:number; pace:number }>(null);

  const distanceMiles = Number(distance || 0);
  const durationMinutes = Number(duration || 0);
  const pace = paceSecondsPerMile(distanceMiles, durationMinutes);
  const projectedXP = calculateEnduranceXP({ distanceMiles, durationMinutes, streakDays: 0 });
  const staminaXP = calculateStaminaXP({ distanceMiles, durationMinutes });
  const agilityXP = calculateAgilityXP({ distanceMiles, avgPaceSeconds: pace });

  async function finishRun() {
    if (distanceMiles <= 0 || durationMinutes <= 0) {
      Alert.alert('Add distance and duration', 'VitalQuest needs both values to calculate pace and progression.');
      return;
    }
    const completedAt = new Date();
    const startedAt = new Date(completedAt.getTime() - durationMinutes * 60000);
    const sessionId = makeId('run');
    await saveCompletedEnduranceSession(db, {
      sessionId,
      templateId: 'run',
      name: 'Endurance Run',
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationMinutes,
      totalVolume: 0,
      totalXP: projectedXP,
      distanceMiles,
      avgPaceSeconds: pace,
      activityType: 'run',
      attributeGains: [
        { attribute: 'stamina', amount: staminaXP, reason: 'endurance_training' },
        { attribute: 'agility', amount: agilityXP, reason: 'pace_training' },
      ],
    });
    setResult({ xp: projectedXP, stamina: staminaXP, agility: agilityXP, pace });
  }

  if (result) {
    return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.result}>
      <Text style={styles.eyebrow}>ENDURANCE ENCOUNTER COMPLETE</Text>
      <Text style={styles.resultTitle}>The Long Road advances.</Text>
      <Text style={styles.resultCopy}>Distance and pace have been converted into permanent hero progression.</Text>
      <View style={styles.reward}><IconArt name="xp" size={70}/><Text style={styles.rewardXp}>+{result.xp} XP</Text></View>
      <View style={styles.resultGrid}>
        <ResultStat label="DISTANCE" value={`${distanceMiles.toFixed(2)} mi`} styles={styles}/>
        <ResultStat label="PACE" value={`${formatPace(result.pace)}/mi`} styles={styles}/>
        <ResultStat label="TIME" value={`${durationMinutes} min`} styles={styles}/>
      </View>
      <View style={styles.attributeRow}><IconArt name="stamina" size={42}/><View style={{flex:1}}><Text style={styles.attributeLabel}>STAMINA</Text><Text style={styles.attributeCopy}>Endurance capacity increased.</Text></View><Text style={styles.attributeGain}>+{result.stamina}</Text></View>
      <View style={styles.attributeRow}><IconArt name="agility" size={42}/><View style={{flex:1}}><Text style={styles.attributeLabel}>AGILITY</Text><Text style={styles.attributeCopy}>Pace efficiency increased.</Text></View><Text style={styles.attributeGain}>+{result.agility}</Text></View>
      <Pressable style={styles.primary} onPress={() => router.replace('/(tabs)/hero')}><Text style={styles.primaryText}>VIEW HERO PROGRESSION</Text></Pressable>
      <Pressable style={styles.secondary} onPress={() => router.replace('/(tabs)')}><Text style={styles.secondaryText}>RETURN TO TODAY</Text></Pressable>
    </ScrollView></SafeAreaView>;
  }

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <View style={styles.topBar}><Pressable onPress={() => router.back()}><Text style={styles.back}>‹ EXIT</Text></Pressable><Text style={styles.topTitle}>Endurance Run</Text><Text style={styles.topMeta}>ACTIVE</Text></View>
    <View style={styles.hero}>
      <IconArt name="agility" size={64}/>
      <Text style={styles.eyebrow}>ENDURANCE PROTOCOL</Text>
      <Text style={styles.title}>Distance becomes stamina. Pace becomes agility.</Text>
      <Text style={styles.copy}>Manual logging is the beta path. Native GPS and HealthKit ingestion can replace these fields later without changing the progression model.</Text>
    </View>
    <View style={styles.inputGrid}>
      <View style={styles.inputCard}><Text style={styles.inputLabel}>DISTANCE · MILES</Text><TextInput value={distance} onChangeText={setDistance} keyboardType="decimal-pad" selectTextOnFocus style={styles.input}/></View>
      <View style={styles.inputCard}><Text style={styles.inputLabel}>DURATION · MINUTES</Text><TextInput value={duration} onChangeText={setDuration} keyboardType="decimal-pad" selectTextOnFocus style={styles.input}/></View>
    </View>
    <View style={styles.livePanel}>
      <View><Text style={styles.liveLabel}>LIVE PACE</Text><Text style={styles.liveValue}>{formatPace(pace)} <Text style={styles.liveUnit}>/ MI</Text></Text></View>
      <View style={styles.liveDivider}/>
      <View><Text style={styles.liveLabel}>PROJECTED XP</Text><Text style={styles.liveValue}>+{projectedXP}</Text></View>
    </View>
    <View style={styles.gainGrid}>
      <Gain icon="stamina" label="STAMINA" value={staminaXP} styles={styles}/>
      <Gain icon="agility" label="AGILITY" value={agilityXP} styles={styles}/>
    </View>
    <View style={styles.note}><Text style={styles.noteTitle}>BETA LOGGER</Text><Text style={styles.noteCopy}>This path is intentionally usable before device integrations ship. Once GPS is available, distance, duration and pace will populate automatically and this same save contract will be used.</Text></View>
    <Pressable style={styles.primary} onPress={finishRun}><Text style={styles.primaryText}>COMPLETE ENDURANCE ENCOUNTER</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

function Gain({icon,label,value,styles}:{icon:'stamina'|'agility';label:string;value:number;styles:any}) { return <View style={styles.gainCard}><IconArt name={icon} size={46}/><Text style={styles.gainLabel}>{label}</Text><Text style={styles.gainValue}>+{value}</Text></View>; }
function ResultStat({label,value,styles}:{label:string;value:string;styles:any}) { return <View style={styles.resultStat}><Text style={styles.resultStatValue}>{value}</Text><Text style={styles.resultStatLabel}>{label}</Text></View>; }

function makeStyles(t:any) { return StyleSheet.create({
  safe:{flex:1,backgroundColor:t.background},page:{padding:16,paddingBottom:80,gap:14,width:'100%',maxWidth:760,alignSelf:'center'},topBar:{minHeight:54,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{color:t.muted,fontSize:9,fontWeight:'900',width:70},topTitle:{color:t.text,fontSize:14,fontWeight:'900'},topMeta:{color:t.accent,fontSize:8,fontWeight:'900',letterSpacing:1,width:70,textAlign:'right'},hero:{borderWidth:1,borderColor:t.border,borderRadius:18,backgroundColor:t.heroSurface,padding:20,alignItems:'center'},eyebrow:{color:t.accent,fontSize:8,fontWeight:'900',letterSpacing:1.4,marginTop:8},title:{color:t.text,fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:28,lineHeight:33,fontWeight:'900',textAlign:'center',marginTop:7},copy:{color:t.muted,fontSize:10.5,lineHeight:17,textAlign:'center',maxWidth:520,marginTop:8},inputGrid:{flexDirection:'row',gap:10},inputCard:{flex:1,borderWidth:1,borderColor:t.border,borderRadius:14,backgroundColor:t.surface,padding:12},inputLabel:{color:t.muted,fontSize:7,fontWeight:'900',letterSpacing:.8},input:{color:t.text,fontSize:28,fontWeight:'900',marginTop:5,paddingVertical:4},livePanel:{borderWidth:1,borderColor:t.accentSoft,borderRadius:16,backgroundColor:t.heroSurface,padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},liveLabel:{color:t.muted,fontSize:7,fontWeight:'900',letterSpacing:.9,textAlign:'center'},liveValue:{color:t.text,fontSize:25,fontWeight:'900',textAlign:'center',marginTop:3},liveUnit:{color:t.muted,fontSize:9},liveDivider:{width:1,height:42,backgroundColor:t.border},gainGrid:{flexDirection:'row',gap:10},gainCard:{flex:1,borderWidth:1,borderColor:t.border,borderRadius:14,backgroundColor:t.surface,padding:14,alignItems:'center'},gainLabel:{color:t.muted,fontSize:7,fontWeight:'900',letterSpacing:.9,marginTop:3},gainValue:{color:t.accent,fontSize:22,fontWeight:'900',marginTop:2},note:{borderWidth:1,borderColor:t.border,borderRadius:14,padding:14,backgroundColor:t.surface},noteTitle:{color:t.accent,fontSize:7,fontWeight:'900',letterSpacing:1},noteCopy:{color:t.muted,fontSize:9.5,lineHeight:15,marginTop:4},primary:{minHeight:54,borderRadius:12,backgroundColor:t.accent,alignItems:'center',justifyContent:'center'},primaryText:{color:t.background,fontSize:9.5,fontWeight:'900',letterSpacing:1},secondary:{minHeight:50,borderRadius:12,borderWidth:1,borderColor:t.border,alignItems:'center',justifyContent:'center'},secondaryText:{color:t.text,fontSize:9,fontWeight:'900',letterSpacing:.8},result:{padding:20,paddingBottom:70,gap:14,width:'100%',maxWidth:700,alignSelf:'center'},resultTitle:{color:t.text,fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:32,fontWeight:'900',textAlign:'center'},resultCopy:{color:t.muted,fontSize:11,lineHeight:17,textAlign:'center'},reward:{alignItems:'center',paddingVertical:12},rewardXp:{color:t.accent,fontSize:31,fontWeight:'900'},resultGrid:{flexDirection:'row',gap:8},resultStat:{flex:1,borderWidth:1,borderColor:t.border,borderRadius:14,padding:12,backgroundColor:t.surface,alignItems:'center'},resultStatValue:{color:t.text,fontSize:16,fontWeight:'900'},resultStatLabel:{color:t.muted,fontSize:6.5,fontWeight:'900',letterSpacing:.7,marginTop:3},attributeRow:{borderWidth:1,borderColor:t.border,borderRadius:14,padding:14,backgroundColor:t.surface,flexDirection:'row',alignItems:'center',gap:10},attributeLabel:{color:t.text,fontSize:14,fontWeight:'900'},attributeCopy:{color:t.muted,fontSize:8.5,marginTop:2},attributeGain:{color:t.accent,fontSize:26,fontWeight:'900'}
}); }
