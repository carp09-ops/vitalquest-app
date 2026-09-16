import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { saveCompletedWorkout } from './db';
import { calculateDisciplineXP, calculateRecoveryXP, calculateVitalityXP } from './gameEngine';
import { IconArt } from './IconArt';
import { useProgressionSnapshot } from './useProgression';
import { useVitalTheme } from './ThemeProvider';
import { scaleTrustedAmount, XPTrustResult } from './xpTrust';
import BetaSessionFeedback from './BetaSessionFeedback';

const blocks = [
  { id: 'upper', title: 'Thoracic Opener', copy: 'Restore upper-back rotation and shoulder position.', minutes: 5 },
  { id: 'hips', title: 'Hip Reset', copy: 'Open hip flexors and restore comfortable extension.', minutes: 5 },
  { id: 'posterior', title: 'Posterior Chain', copy: 'Easy hamstring and calf mobility without forcing range.', minutes: 5 },
  { id: 'breath', title: 'Downshift', copy: 'Slow breathing and low-intensity movement to finish recovered.', minutes: 5 },
];
const makeId=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function RecoveryEncounterV2(){
  const db=useSQLiteContext();
  const {theme}=useVitalTheme();
  const {snapshot}=useProgressionSnapshot();
  const t=theme.tokens;
  const [targetDuration,setTargetDuration]=useState('20');
  const [startedAt]=useState(()=>new Date());
  const [elapsedSeconds,setElapsedSeconds]=useState(0);
  const [done,setDone]=useState<Record<string,string>>({});
  const [result,setResult]=useState<null|{sessionId:string;rawXP:number;awardedXP:number;vitality:number;discipline:number;duration:number;trust:XPTrustResult}>(null);
  const targetMins=Math.max(5,Number(targetDuration)||20);
  const actualMins=Math.max(0,Math.floor(elapsedSeconds/60));
  const completedBlocks=Object.keys(done).length;
  useEffect(()=>{const timer=setInterval(()=>setElapsedSeconds(Math.max(0,Math.floor((Date.now()-startedAt.getTime())/1000))),1000);return()=>clearInterval(timer);},[startedAt]);
  const projection=useMemo(()=>({
    xp:calculateRecoveryXP({durationMinutes:targetMins,completedBlocks:Math.max(2,completedBlocks),streakDays:snapshot.streakDays}),
    vitality:calculateVitalityXP({durationMinutes:targetMins,completedBlocks:Math.max(2,completedBlocks)}),
    discipline:calculateDisciplineXP({completedBlocks:Math.max(2,completedBlocks),streakDays:snapshot.streakDays}),
  }),[targetMins,completedBlocks,snapshot.streakDays]);

  function toggle(id:string){setDone(current=>{const next={...current};if(next[id])delete next[id];else next[id]=new Date().toISOString();return next;});}

  async function finish(){
    if(completedBlocks<2){Alert.alert('Complete more of the protocol','Finish at least two recovery blocks before completing the encounter.');return;}
    if(actualMins<5){Alert.alert('Recovery is still in progress',`VitalQuest has tracked ${actualMins} live minute${actualMins===1?'':'s'}. At least 5 live minutes are required before recovery XP can be banked.`);return;}
    const completedAt=new Date();const rawXP=calculateRecoveryXP({durationMinutes:actualMins,completedBlocks,streakDays:snapshot.streakDays});const rawVitality=calculateVitalityXP({durationMinutes:actualMins,completedBlocks});const rawDiscipline=calculateDisciplineXP({completedBlocks,streakDays:snapshot.streakDays});const sessionId=makeId('recovery');const blockTimestamps=Object.values(done).sort();
    const trust=await saveCompletedWorkout(db,{
      sessionId,templateId:'recovery',name:'Recovery Protocol',startedAt:startedAt.toISOString(),completedAt:completedAt.toISOString(),durationMinutes:actualMins,totalVolume:0,totalXP:rawXP,sets:[],verificationEvidence:{source:'live_app',modality:'recovery',liveTracked:true,completedUnits:completedBlocks},syncDetails:{targetDurationMinutes:targetMins,blockTimestamps},
      attributeGains:[
        {attribute:'vitality',amount:rawVitality,reason:'mobility_recovery'},
        {attribute:'discipline',amount:rawDiscipline,reason:'recovery_consistency'},
      ],
    });
    setResult({sessionId,rawXP,awardedXP:trust.awardedXP,vitality:scaleTrustedAmount(rawVitality,trust.multiplier),discipline:scaleTrustedAmount(rawDiscipline,trust.multiplier),duration:actualMins,trust});
  }

  if(result){return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><ScrollView contentContainerStyle={styles.result}><IconArt name="trophy" size={80}/><Text style={[styles.kicker,{color:t.accent}]}>RECOVERY COMPLETE · {result.trust.tier}</Text><Text style={[styles.resultTitle,{color:t.text}]}>Capacity restored.</Text><Text style={[styles.resultCopy,{color:t.muted}]}>+{result.awardedXP} XP banked from {result.duration} live minutes and {completedBlocks} completed recovery blocks. Raw value {result.rawXP} XP · {result.trust.confidence}% confidence.</Text><View style={styles.resultGrid}><Reward label="BANKED XP" value={`+${result.awardedXP}`} /><Reward label="VITALITY" value={`+${result.vitality}`} /><Reward label="DISCIPLINE" value={`+${result.discipline}`} /></View><BetaSessionFeedback sessionId={result.sessionId} context={{modality:'recovery',rawXP:result.rawXP,awardedXP:result.awardedXP,confidence:result.trust.confidence,tier:result.trust.tier,duration:result.duration,completedBlocks}}/><Pressable style={[styles.primary,{backgroundColor:t.accent}]} onPress={()=>router.replace('/insights')}><Text style={[styles.primaryText,{color:t.background}]}>VIEW XP TRUST LEDGER</Text></Pressable></ScrollView></SafeAreaView>}

  return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}><View style={styles.shell}>
    <View style={styles.top}><Pressable onPress={()=>router.back()}><Text style={[styles.back,{color:t.muted}]}>‹ EXIT</Text></Pressable><Text style={[styles.topLabel,{color:t.accent}]}>RECOVERY ENCOUNTER · LIVE</Text><View style={{width:38}}/></View>
    <View style={[styles.hero,{backgroundColor:t.heroSurface,borderColor:t.border}]}><IconArt name="streak" size={60}/><Text style={[styles.kicker,{color:t.accent}]}>VITALITY · DISCIPLINE</Text><Text style={[styles.title,{color:t.text}]}>Restore capacity.</Text><Text style={[styles.copy,{color:t.muted}]}>Target duration shapes the protocol. XP uses actual elapsed time and completed blocks, so typing a longer duration cannot create progression.</Text><View style={styles.preview}><Metric label="TARGET RAW XP" value={`+${projection.xp}`} /><Metric label="LIVE TIME" value={`${actualMins}:${String(elapsedSeconds%60).padStart(2,'0')}`} /><Metric label="BLOCKS" value={`${completedBlocks}/4`} /></View></View>

    <View style={[styles.durationCard,{backgroundColor:t.surface,borderColor:t.border}]}><View><Text style={[styles.kicker,{color:t.accent}]}>TARGET DURATION</Text><Text style={[styles.smallCopy,{color:t.muted}]}>This plans the session only. The live clock is authoritative for XP.</Text></View><View style={[styles.inputWrap,{borderColor:t.border,backgroundColor:t.surfaceElevated}]}><TextInput value={targetDuration} onChangeText={setTargetDuration} keyboardType="numeric" style={[styles.input,{color:t.text}]} /><Text style={[styles.unit,{color:t.muted}]}>MIN</Text></View></View>

    <View><Text style={[styles.kicker,{color:t.accent}]}>MOBILITY BLOCKS</Text><Text style={[styles.sectionTitle,{color:t.text}]}>Complete what your body needs.</Text></View>
    <View style={styles.blocks}>{blocks.map((block,index)=>{const complete=Boolean(done[block.id]);return <Pressable key={block.id} onPress={()=>toggle(block.id)} style={[styles.block,{backgroundColor:t.surface,borderColor:complete?t.positive:t.border}]}><View style={[styles.blockIndex,{borderColor:complete?t.positive:t.border,backgroundColor:complete?`${t.positive}18`:t.surfaceElevated}]}><Text style={[styles.blockIndexText,{color:complete?t.positive:t.accent}]}>{complete?'✓':index+1}</Text></View><View style={{flex:1}}><Text style={[styles.blockTitle,{color:t.text}]}>{block.title}</Text><Text style={[styles.blockCopy,{color:t.muted}]}>{block.copy}</Text></View><Text style={[styles.minutes,{color:t.muted}]}>{block.minutes} MIN</Text></Pressable>})}</View>
    <Pressable onPress={finish} style={[styles.primary,{backgroundColor:t.accent}]}><Text style={[styles.primaryText,{color:t.background}]}>COMPLETE RECOVERY</Text><Text style={[styles.arrow,{color:t.background}]}>›</Text></Pressable>
  </View></ScrollView></SafeAreaView>

  function Metric({label,value}:{label:string;value:string}){return <View style={[styles.metric,{borderColor:t.border}]}><Text style={[styles.metricValue,{color:t.text}]}>{value}</Text><Text style={[styles.metricLabel,{color:t.muted}]}>{label}</Text></View>}
  function Reward({label,value}:{label:string;value:string}){return <View style={[styles.reward,{borderColor:t.border,backgroundColor:t.surface}]}><Text style={[styles.rewardValue,{color:t.accent}]}>{value}</Text><Text style={[styles.rewardLabel,{color:t.muted}]}>{label}</Text></View>}
}

const styles=StyleSheet.create({safe:{flex:1},page:{padding:14,paddingBottom:60},shell:{width:'100%',maxWidth:900,alignSelf:'center',gap:16},top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',minHeight:44},back:{fontSize:9,fontWeight:'900',letterSpacing:1},topLabel:{fontSize:8,fontWeight:'900',letterSpacing:1.4},hero:{borderWidth:1,borderRadius:20,padding:20,alignItems:'center'},kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.4,marginTop:8},title:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:34,fontWeight:'900',marginTop:5},copy:{fontSize:11,lineHeight:18,textAlign:'center',maxWidth:580,marginTop:8},preview:{flexDirection:'row',gap:8,width:'100%',marginTop:18},metric:{flex:1,borderWidth:1,borderRadius:12,padding:11,alignItems:'center'},metricValue:{fontSize:18,fontWeight:'900'},metricLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,marginTop:3},durationCard:{borderWidth:1,borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:16},smallCopy:{fontSize:9,lineHeight:14,marginTop:4},inputWrap:{borderWidth:1,borderRadius:10,flexDirection:'row',alignItems:'center',paddingHorizontal:10},input:{width:54,height:46,fontSize:18,fontWeight:'900',textAlign:'right'},unit:{fontSize:7,fontWeight:'900',marginLeft:5},sectionTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:23,fontWeight:'800',marginTop:4},blocks:{gap:9},block:{borderWidth:1,borderRadius:15,padding:13,flexDirection:'row',alignItems:'center',gap:11},blockIndex:{width:36,height:36,borderRadius:18,borderWidth:1,alignItems:'center',justifyContent:'center'},blockIndexText:{fontSize:13,fontWeight:'900'},blockTitle:{fontSize:14,fontWeight:'900'},blockCopy:{fontSize:9,lineHeight:14,marginTop:3},minutes:{fontSize:7,fontWeight:'900',letterSpacing:.6},primary:{minHeight:54,borderRadius:10,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10},primaryText:{fontSize:9,fontWeight:'900',letterSpacing:1.1},arrow:{fontSize:25},result:{padding:24,paddingBottom:100,alignItems:'center'},resultTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:36,fontWeight:'900',marginTop:6},resultCopy:{fontSize:11,lineHeight:18,textAlign:'center',maxWidth:520,marginTop:8},resultGrid:{flexDirection:'row',gap:8,width:'100%',maxWidth:620,marginTop:22,marginBottom:16},reward:{flex:1,borderWidth:1,borderRadius:12,padding:14,alignItems:'center'},rewardValue:{fontSize:20,fontWeight:'900'},rewardLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,marginTop:4}});
