import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { saveCompletedWorkout } from './db';
import { calculateDisciplineXP, calculateRecoveryXP, calculateVitalityXP } from './gameEngine';
import { IconArt } from './IconArt';
import { useProgressionSnapshot } from './useProgression';
import { useVitalTheme } from './ThemeProvider';

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
  const [duration,setDuration]=useState('20');
  const [done,setDone]=useState<string[]>([]);
  const [result,setResult]=useState<null|{xp:number;vitality:number;discipline:number;duration:number}>(null);
  const mins=Math.max(0,Number(duration)||0);
  const projected=useMemo(()=>({
    xp:calculateRecoveryXP({durationMinutes:mins,completedBlocks:done.length,streakDays:snapshot.streakDays}),
    vitality:calculateVitalityXP({durationMinutes:mins,completedBlocks:done.length}),
    discipline:calculateDisciplineXP({completedBlocks:done.length,streakDays:snapshot.streakDays}),
  }),[mins,done.length,snapshot.streakDays]);

  function toggle(id:string){setDone(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);}

  async function finish(){
    if(done.length<2||mins<5){Alert.alert('Complete more of the protocol','Finish at least two recovery blocks and log at least five minutes.');return;}
    const completedAt=new Date();
    const sessionId=makeId('recovery');
    await saveCompletedWorkout(db,{
      sessionId,templateId:'recovery',name:'Recovery Protocol',startedAt:new Date(completedAt.getTime()-mins*60000).toISOString(),completedAt:completedAt.toISOString(),durationMinutes:mins,totalVolume:0,totalXP:projected.xp,sets:[],
      attributeGains:[
        {attribute:'vitality',amount:projected.vitality,reason:'mobility_recovery'},
        {attribute:'discipline',amount:projected.discipline,reason:'recovery_consistency'},
      ],
    });
    setResult({xp:projected.xp,vitality:projected.vitality,discipline:projected.discipline,duration:mins});
  }

  if(result){return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><View style={styles.result}><IconArt name="trophy" size={80}/><Text style={[styles.kicker,{color:t.accent}]}>RECOVERY COMPLETE</Text><Text style={[styles.resultTitle,{color:t.text}]}>Capacity restored.</Text><Text style={[styles.resultCopy,{color:t.muted}]}>Recovery counts as progression because sustainable training is part of the build.</Text><View style={styles.resultGrid}><Reward label="SESSION XP" value={`+${result.xp}`} /><Reward label="VITALITY" value={`+${result.vitality}`} /><Reward label="DISCIPLINE" value={`+${result.discipline}`} /></View><Pressable style={[styles.primary,{backgroundColor:t.accent}]} onPress={()=>router.replace('/(tabs)/train')}><Text style={[styles.primaryText,{color:t.background}]}>RETURN TO TRAINING HALL</Text></Pressable></View></SafeAreaView>}

  return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}><View style={styles.shell}>
    <View style={styles.top}><Pressable onPress={()=>router.back()}><Text style={[styles.back,{color:t.muted}]}>‹ EXIT</Text></Pressable><Text style={[styles.topLabel,{color:t.accent}]}>RECOVERY ENCOUNTER</Text><View style={{width:38}}/></View>
    <View style={[styles.hero,{backgroundColor:t.heroSurface,borderColor:t.border}]}><IconArt name="streak" size={60}/><Text style={[styles.kicker,{color:t.accent}]}>VITALITY · DISCIPLINE</Text><Text style={[styles.title,{color:t.text}]}>Restore capacity.</Text><Text style={[styles.copy,{color:t.muted}]}>Mobility, easy range work and a deliberate downshift build the attributes that keep harder training repeatable.</Text><View style={styles.preview}><Metric label="XP" value={`+${projected.xp}`} /><Metric label="VITALITY" value={`+${projected.vitality}`} /><Metric label="DISCIPLINE" value={`+${projected.discipline}`} /></View></View>

    <View style={[styles.durationCard,{backgroundColor:t.surface,borderColor:t.border}]}><View><Text style={[styles.kicker,{color:t.accent}]}>PROTOCOL DURATION</Text><Text style={[styles.smallCopy,{color:t.muted}]}>Adjust if your recovery session runs shorter or longer.</Text></View><View style={[styles.inputWrap,{borderColor:t.border,backgroundColor:t.surfaceElevated}]}><TextInput value={duration} onChangeText={setDuration} keyboardType="numeric" style={[styles.input,{color:t.text}]} /><Text style={[styles.unit,{color:t.muted}]}>MIN</Text></View></View>

    <View><Text style={[styles.kicker,{color:t.accent}]}>MOBILITY BLOCKS</Text><Text style={[styles.sectionTitle,{color:t.text}]}>Complete what your body needs.</Text></View>
    <View style={styles.blocks}>{blocks.map((block,index)=>{const complete=done.includes(block.id);return <Pressable key={block.id} onPress={()=>toggle(block.id)} style={[styles.block,{backgroundColor:t.surface,borderColor:complete?t.positive:t.border}]}><View style={[styles.blockIndex,{borderColor:complete?t.positive:t.border,backgroundColor:complete?`${t.positive}18`:t.surfaceElevated}]}><Text style={[styles.blockIndexText,{color:complete?t.positive:t.accent}]}>{complete?'✓':index+1}</Text></View><View style={{flex:1}}><Text style={[styles.blockTitle,{color:t.text}]}>{block.title}</Text><Text style={[styles.blockCopy,{color:t.muted}]}>{block.copy}</Text></View><Text style={[styles.minutes,{color:t.muted}]}>{block.minutes} MIN</Text></Pressable>})}</View>
    <Pressable onPress={finish} style={[styles.primary,{backgroundColor:t.accent}]}><Text style={[styles.primaryText,{color:t.background}]}>COMPLETE RECOVERY</Text><Text style={[styles.arrow,{color:t.background}]}>›</Text></Pressable>
  </View></ScrollView></SafeAreaView>

  function Metric({label,value}:{label:string;value:string}){return <View style={[styles.metric,{borderColor:t.border}]}><Text style={[styles.metricValue,{color:t.text}]}>{value}</Text><Text style={[styles.metricLabel,{color:t.muted}]}>{label}</Text></View>}
  function Reward({label,value}:{label:string;value:string}){return <View style={[styles.reward,{borderColor:t.border,backgroundColor:t.surface}]}><Text style={[styles.rewardValue,{color:t.accent}]}>{value}</Text><Text style={[styles.rewardLabel,{color:t.muted}]}>{label}</Text></View>}
}

const styles=StyleSheet.create({safe:{flex:1},page:{padding:14,paddingBottom:60},shell:{width:'100%',maxWidth:900,alignSelf:'center',gap:16},top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',minHeight:44},back:{fontSize:9,fontWeight:'900',letterSpacing:1},topLabel:{fontSize:8,fontWeight:'900',letterSpacing:1.4},hero:{borderWidth:1,borderRadius:20,padding:20,alignItems:'center'},kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.4,marginTop:8},title:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:34,fontWeight:'900',marginTop:5},copy:{fontSize:11,lineHeight:18,textAlign:'center',maxWidth:580,marginTop:8},preview:{flexDirection:'row',gap:8,width:'100%',marginTop:18},metric:{flex:1,borderWidth:1,borderRadius:12,padding:11,alignItems:'center'},metricValue:{fontSize:18,fontWeight:'900'},metricLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,marginTop:3},durationCard:{borderWidth:1,borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:16},smallCopy:{fontSize:9,lineHeight:14,marginTop:4},inputWrap:{borderWidth:1,borderRadius:10,flexDirection:'row',alignItems:'center',paddingHorizontal:10},input:{width:54,height:46,fontSize:18,fontWeight:'900',textAlign:'right'},unit:{fontSize:7,fontWeight:'900',marginLeft:5},sectionTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:23,fontWeight:'800',marginTop:4},blocks:{gap:9},block:{borderWidth:1,borderRadius:15,padding:13,flexDirection:'row',alignItems:'center',gap:11},blockIndex:{width:36,height:36,borderRadius:18,borderWidth:1,alignItems:'center',justifyContent:'center'},blockIndexText:{fontSize:13,fontWeight:'900'},blockTitle:{fontSize:14,fontWeight:'900'},blockCopy:{fontSize:9,lineHeight:14,marginTop:3},minutes:{fontSize:7,fontWeight:'900',letterSpacing:.6},primary:{minHeight:54,borderRadius:10,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:4},primaryText:{fontSize:9,fontWeight:'900',letterSpacing:1.1},arrow:{fontSize:25},result:{flex:1,padding:24,alignItems:'center',justifyContent:'center'},resultTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:36,fontWeight:'900',marginTop:6},resultCopy:{fontSize:11,lineHeight:18,textAlign:'center',maxWidth:520,marginTop:8},resultGrid:{flexDirection:'row',gap:8,width:'100%',maxWidth:620,marginTop:22,marginBottom:16},reward:{flex:1,borderWidth:1,borderRadius:12,padding:14,alignItems:'center'},rewardValue:{fontSize:20,fontWeight:'900'},rewardLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,marginTop:4}});
