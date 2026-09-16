import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ART } from './artAssets';
import { templates } from './data';
import { IconArt, VQIconName } from './IconArt';
import { getTrainingRecommendation } from './recommendation';
import { useProgressionSnapshot } from './useProgression';
import { useTrainingSetup } from './useTrainingSetup';
import { useVitalTheme } from './ThemeProvider';

const web=(s:Record<string,unknown>)=>Platform.OS==='web'?s as any:undefined;

export default function TodayV2(){
  const {width}=useWindowDimensions();
  const wide=width>=760;
  const {theme}=useVitalTheme();
  const t=theme.tokens;
  const {snapshot}=useProgressionSnapshot();
  const {equipment}=useTrainingSetup();
  const recommendation=getTrainingRecommendation(snapshot,equipment);
  const focusTemplate=templates.find(x=>x.id===recommendation.templateId)??templates[0];
  const completedQuests=[snapshot.quests.ironWeek.complete,snapshot.quests.fiveTonTrial.complete,snapshot.quests.longRoad.complete,snapshot.quests.veteranPath.complete,snapshot.quests.restorationRitual.complete].filter(Boolean).length;
  const attributes:Array<{label:string;value:number;icon:VQIconName;color:string}>=[
    {label:'Strength',value:snapshot.strengthXP,icon:'strength',color:t.strength},
    {label:'Stamina',value:snapshot.staminaXP,icon:'stamina',color:t.stamina},
    {label:'Agility',value:snapshot.agilityXP,icon:'agility',color:t.agility},
    {label:'Vitality',value:snapshot.vitalityXP,icon:'streak',color:t.positive},
    {label:'Discipline',value:snapshot.disciplineXP,icon:'trophy',color:t.discipline},
  ];

  return <SafeAreaView style={[styles.safe,{backgroundColor:'transparent'}]}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page,wide&&styles.pageWide]}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View><Text style={[styles.wordmark,{color:t.text}]}>VITAL<Text style={{color:t.accent}}>QUEST</Text></Text><Text style={[styles.kicker,{color:t.muted}]}>REAL EFFORT · VISIBLE GROWTH</Text></View>
          <View style={[styles.levelChip,{backgroundColor:t.surface,borderColor:t.border}]}><Text style={[styles.levelLabel,{color:t.muted}]}>LEVEL</Text><Text style={[styles.levelValue,{color:t.text}]}>{snapshot.level}</Text></View>
        </View>

        <View style={[styles.heroCard,{backgroundColor:t.heroSurface,borderColor:t.border},web({boxShadow:'0 28px 76px rgba(0,0,0,.38)'})]}>
          <ImageBackground source={{uri:ART.training}} resizeMode="cover" style={[styles.heroArt,wide&&styles.heroArtWide]} imageStyle={{opacity:.96}}>
            <View style={styles.heroShade}/>
            <View style={styles.heroTop}><View style={styles.livePill}><Text style={styles.livePillText}>TODAY · LEVEL {snapshot.level}</Text></View></View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>YOUR NEXT MOVE</Text>
              <Text style={styles.heroTitle}>Keep building.</Text>
              <Text style={styles.heroText}>Your training feeds XP, attributes, quests, and the hero evolution system.</Text>
            </View>
          </ImageBackground>
          <View style={styles.heroHud}>
            <View style={{flex:1}}><View style={styles.xpRow}><Text style={[styles.xpMain,{color:t.text}]}>{snapshot.totalXP.toLocaleString()} XP</Text><Text style={[styles.xpSub,{color:t.muted}]}>{snapshot.levelCurrentXP.toLocaleString()} / {snapshot.levelNeededXP.toLocaleString()} to next level</Text></View><View style={[styles.track,{backgroundColor:t.surfaceElevated}]}><View style={[styles.fill,{width:`${Math.min(100,snapshot.levelRatio*100)}%`,backgroundColor:t.accent}]}/></View></View><IconArt name="xp" size={52}/>
          </View>
        </View>

        <View style={[styles.grid,wide&&styles.gridWide]}>
          <View style={[styles.focusCard,{backgroundColor:t.surface,borderColor:t.border}]}>
            <Text style={[styles.eyebrow,{color:t.accent}]}>RECOMMENDED NEXT</Text>
            <Text style={[styles.cardTitle,{color:t.text}]}>{focusTemplate.name}</Text>
            <Text style={[styles.copy,{color:t.muted}]}>{recommendation.reason}</Text>
            <View style={styles.metaRow}><Text style={[styles.meta,{color:t.muted}]}>~{focusTemplate.estimatedMinutes} min</Text><Text style={[styles.meta,{color:t.accent}]}>{recommendation.attributeFocus}</Text></View>
            <Pressable onPress={()=>router.push({pathname:'/workout',params:{templateId:focusTemplate.id}})} style={({pressed})=>[styles.primary,{backgroundColor:t.text,opacity:pressed?.82:1}]}><Text style={[styles.primaryText,{color:t.background}]}>START WORKOUT</Text></Pressable>
          </View>

          <View style={[styles.summaryCard,{backgroundColor:t.surface,borderColor:t.border}]}>
            <Text style={[styles.eyebrow,{color:t.accent}]}>THIS WEEK</Text>
            <Metric label="Resistance" value={`${snapshot.thisWeekResistanceWorkouts}`} detail="sessions" t={t}/>
            <Metric label="Volume" value={Math.round(snapshot.thisWeekVolume).toLocaleString()} detail="lb" t={t}/>
            <Metric label="Distance" value={snapshot.thisWeekMiles.toFixed(1)} detail="mi" t={t}/>
            <Metric label="XP earned" value={`+${snapshot.thisWeekXP.toLocaleString()}`} detail="xp" t={t}/>
          </View>
        </View>

        <View style={styles.sectionHead}><View><Text style={[styles.eyebrow,{color:t.accent}]}>ATTRIBUTES</Text><Text style={[styles.sectionTitle,{color:t.text}]}>What your work is building</Text></View><Text style={[styles.sectionMeta,{color:t.muted}]}>{snapshot.workoutCount} sessions · {snapshot.streakDays} day streak</Text></View>
        <View style={[styles.attributeGrid,wide&&styles.attributeGridWide]}>{attributes.map(item=><Attribute key={item.label} {...item} t={t}/>)}</View>

        <View style={[styles.statusStrip,{backgroundColor:t.surface,borderColor:t.border}]}>
          <Status icon="quest" label="Quests cleared" value={String(completedQuests)} t={t}/>
          <Status icon="trophy" label="PRs logged" value={String(snapshot.prCount)} t={t}/>
          <Status icon="streak" label="Recovery" value={String(snapshot.recoveryCount)} t={t}/>
        </View>

        <View style={[styles.principle,{backgroundColor:t.surfaceElevated,borderColor:t.border}]}><Text style={[styles.eyebrow,{color:t.accent}]}>VITALQUEST PRINCIPLE</Text><Text style={[styles.principleText,{color:t.text}]}>Your character does not level up because you tapped a button. It levels up because you did.</Text></View>
      </View>
    </ScrollView>
  </SafeAreaView>;
}

function Metric({label,value,detail,t}:{label:string;value:string;detail:string;t:any}){return <View style={[styles.metricRow,{borderBottomColor:t.border}]}><Text style={[styles.metricLabel,{color:t.muted}]}>{label}</Text><View style={styles.metricValueRow}><Text style={[styles.metricValue,{color:t.text}]}>{value}</Text><Text style={[styles.metricDetail,{color:t.muted}]}>{detail}</Text></View></View>}
function Attribute({label,value,icon,color,t}:{label:string;value:number;icon:VQIconName;color:string;t:any}){const pct=Math.min(100,Math.max(8,value/9));return <View style={[styles.attributeCard,{backgroundColor:t.surface,borderColor:t.border}]}><View style={styles.attributeTop}><IconArt name={icon} size={34}/><Text style={[styles.attributeValue,{color:t.text}]}>{value.toLocaleString()}</Text></View><Text style={[styles.attributeLabel,{color:t.muted}]}>{label.toUpperCase()}</Text><View style={[styles.attributeTrack,{backgroundColor:t.surfaceElevated}]}><View style={[styles.attributeFill,{width:`${pct}%`,backgroundColor:color}]}/></View></View>}
function Status({icon,label,value,t}:{icon:VQIconName;label:string;value:string;t:any}){return <View style={styles.statusItem}><IconArt name={icon} size={31}/><View><Text style={[styles.statusValue,{color:t.text}]}>{value}</Text><Text style={[styles.statusLabel,{color:t.muted}]}>{label}</Text></View></View>}

const styles=StyleSheet.create({
  safe:{flex:1},page:{padding:16,paddingBottom:112},pageWide:{padding:28},shell:{width:'100%',maxWidth:1120,alignSelf:'center',gap:16},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:4},wordmark:{fontSize:25,fontWeight:'900',letterSpacing:-1},kicker:{fontSize:7,fontWeight:'900',letterSpacing:1.3,marginTop:2},
  levelChip:{minWidth:72,borderWidth:1,borderRadius:13,paddingHorizontal:13,paddingVertical:9,alignItems:'center'},levelLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:1},levelValue:{fontSize:18,fontWeight:'900',marginTop:1},
  heroCard:{borderWidth:1,borderRadius:22,overflow:'hidden'},heroArt:{height:300,justifyContent:'space-between'},heroArtWide:{height:370},heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,7,10,.38)'},heroTop:{padding:16,alignItems:'flex-start'},livePill:{borderWidth:1,borderColor:'rgba(255,255,255,.20)',backgroundColor:'rgba(7,12,17,.72)',borderRadius:999,paddingHorizontal:10,paddingVertical:6},livePillText:{color:'#F3F5F7',fontSize:7,fontWeight:'900',letterSpacing:1},heroCopy:{padding:22,maxWidth:650},heroEyebrow:{color:'#D8E2EC',fontSize:8,fontWeight:'900',letterSpacing:1.4},heroTitle:{color:'#FFFFFF',fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:38,fontWeight:'900',marginTop:5,textShadowColor:'rgba(0,0,0,.8)',textShadowOffset:{width:0,height:2},textShadowRadius:8},heroText:{color:'#E7EDF3',fontSize:11,lineHeight:17,marginTop:7,maxWidth:540,textShadowColor:'rgba(0,0,0,.72)',textShadowOffset:{width:0,height:1},textShadowRadius:5},heroHud:{padding:16,flexDirection:'row',alignItems:'center',gap:16},eyebrow:{fontSize:7,fontWeight:'900',letterSpacing:1.4},copy:{fontSize:10,lineHeight:16,marginTop:7,maxWidth:620},xpRow:{flexDirection:'row',alignItems:'baseline',gap:10,flexWrap:'wrap'},xpMain:{fontSize:20,fontWeight:'900'},xpSub:{fontSize:8.5,fontWeight:'700'},track:{height:7,borderRadius:99,overflow:'hidden',marginTop:8},fill:{height:'100%',borderRadius:99},
  grid:{gap:14},gridWide:{flexDirection:'row'},focusCard:{flex:1.45,borderWidth:1,borderRadius:18,padding:18},summaryCard:{flex:1,borderWidth:1,borderRadius:18,padding:18},cardTitle:{fontSize:25,fontWeight:'900',marginTop:7},metaRow:{flexDirection:'row',justifyContent:'space-between',marginTop:16},meta:{fontSize:8,fontWeight:'900',letterSpacing:.7,textTransform:'uppercase'},primary:{minHeight:50,borderRadius:11,alignItems:'center',justifyContent:'center',marginTop:18},primaryText:{fontSize:9,fontWeight:'900',letterSpacing:1},
  metricRow:{minHeight:48,borderBottomWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},metricLabel:{fontSize:9,fontWeight:'700'},metricValueRow:{flexDirection:'row',alignItems:'baseline',gap:5},metricValue:{fontSize:15,fontWeight:'900'},metricDetail:{fontSize:7,fontWeight:'800',textTransform:'uppercase'},
  sectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:16,marginTop:5},sectionTitle:{fontSize:20,fontWeight:'900',marginTop:4},sectionMeta:{fontSize:8,fontWeight:'700',textAlign:'right'},attributeGrid:{gap:10},attributeGridWide:{flexDirection:'row'},attributeCard:{flex:1,borderWidth:1,borderRadius:15,padding:13},attributeTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},attributeValue:{fontSize:18,fontWeight:'900'},attributeLabel:{fontSize:7,fontWeight:'900',letterSpacing:.9,marginTop:10},attributeTrack:{height:5,borderRadius:99,overflow:'hidden',marginTop:8},attributeFill:{height:'100%',borderRadius:99},
  statusStrip:{borderWidth:1,borderRadius:16,padding:12,flexDirection:'row',gap:10},statusItem:{flex:1,flexDirection:'row',alignItems:'center',gap:9},statusValue:{fontSize:16,fontWeight:'900'},statusLabel:{fontSize:7.5,fontWeight:'700',marginTop:1},principle:{borderWidth:1,borderRadius:16,padding:18},principleText:{fontSize:15,fontWeight:'800',lineHeight:22,marginTop:5,maxWidth:760},
});
