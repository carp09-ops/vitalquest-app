import { router } from 'expo-router';
import React from 'react';
import { ImageBackground,Platform,SafeAreaView,ScrollView,StyleSheet,Text,useWindowDimensions,View } from 'react-native';
import { templates } from './data';
import { ActionPressable,Entrance } from './Interaction';
import { getTrainingRecommendation } from './recommendation';
import { useProgressionSnapshot } from './useProgression';
import { useTrainingIntelligence } from './useTrainingIntelligence';
import { useTrainingSetup } from './useTrainingSetup';
import { useTrainingBlock } from './useTrainingBlock';
import { buildAdaptiveWeeklyPlan } from './weeklyPlan';
import { useVitalTheme } from './ThemeProvider';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype,paletteForArchetype } from './designSystem';
import { deriveHeroEvolution } from './heroEvolution';
import BrandLoadingScreen from './BrandLoadingScreen';
import DataStatePanel from './DataStatePanel';

const BASE=Platform.OS==='web'?'/vitalquest-app':'';
const WORLD_ART={
  mystic:`${BASE}/art/v1/mythic-world.webp`,
  athlete:`${BASE}/art/v1/celestial-world.webp`,
  spartan:`${BASE}/art/v1/titan-world.webp`,
} as const;
const HERO_ART={
  mystic:`${BASE}/art/v1/mythic-hero.webp`,
  athlete:`${BASE}/art/v1/celestial-world.webp`,
  spartan:`${BASE}/art/v1/titan-world.webp`,
} as const;

export default function TodayV3(){
  const {width}=useWindowDimensions();const wide=width>=900;const compact=width<430;
  const {theme}=useVitalTheme();const t=theme.tokens;const {snapshot,loading,error,refresh}=useProgressionSnapshot();
  const intelligence=useTrainingIntelligence();const block=useTrainingBlock(intelligence);const {equipment}=useTrainingSetup();const {archetype}=useHeroArchetype();
  const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);const hero=deriveHeroEvolution(snapshot,archetype);
  const recommendation=getTrainingRecommendation(snapshot,equipment,intelligence,block);const plan=buildAdaptiveWeeklyPlan(block,recommendation,intelligence);const focus=templates.find(x=>x.id===recommendation.templateId)??templates[0];
  const levelPct=Math.max(0,Math.min(100,Math.round(snapshot.levelRatio*100)));const nextSlots=plan.slots.slice(0,3);
  if(loading)return <BrandLoadingScreen variant="calibrating" message="PREPARING TODAY'S QUEST"/>;
  if(error)return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><View style={styles.state}><DataStatePanel kind="error" title="Today couldn’t load" copy={error} actionLabel="Try again" onAction={()=>void refresh()} icon="xp"/></View></SafeAreaView>;

  return <SafeAreaView style={[styles.safe,{backgroundColor:'transparent'}]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page,wide&&styles.pageWide]}><View style={styles.shell}>
    <Entrance><View style={styles.brandRow}><View><Text style={[styles.wordmark,{color:t.text}]}>VITAL<Text style={{color:palette.highlight}}>QUEST</Text></Text><Text style={[styles.brandLine,{color:t.muted}]}>YOUR ARC · IN MOTION</Text></View><Text style={[styles.todayTag,{color:palette.highlight,borderColor:material.edgeStrong}]}>TODAY</Text></View></Entrance>

    <Entrance delay={25}><ImageBackground source={{uri:WORLD_ART[archetype]}} resizeMode="cover" imageStyle={styles.heroImage} style={[styles.heroStage,{borderColor:material.edgeStrong}]}>
      <View style={styles.heroShade}/><View style={[styles.heroGlow,{backgroundColor:material.glow}]}/>
      <View style={[styles.heroLayout,wide&&styles.heroLayoutWide]}>
        <View style={styles.heroCopyCol}>
          <Text style={[styles.kicker,{color:palette.highlight}]}>WELCOME BACK · {hero.archetypeName.toUpperCase()}</Text>
          <Text style={[styles.heroTitle,compact&&styles.heroTitleCompact,{color:t.text}]}>Your Arc is alive.</Text>
          <Text style={[styles.heroSub,{color:'rgba(247,248,250,.78)'}]}>Today is one move inside a larger transformation. Train the next step, then let the system adapt.</Text>
          <View style={styles.identityRow}><View style={[styles.identitySeal,{borderColor:material.edgeStrong,backgroundColor:'rgba(5,8,12,.58)'}]}><Text style={[styles.identityTitle,{color:t.text}]}>{hero.title}</Text><Text style={[styles.identityMeta,{color:palette.highlight}]}>FORM {hero.formTier} · {material.motif}</Text></View></View>
        </View>
        <View style={[styles.levelMedallion,{borderColor:palette.primary,backgroundColor:'rgba(4,8,12,.68)'}]}><Text style={[styles.levelLabel,{color:t.muted}]}>LEVEL</Text><Text style={[styles.levelValue,{color:t.text}]}>{snapshot.level}</Text><Text style={[styles.levelPct,{color:palette.highlight}]}>{levelPct}%</Text><View style={[styles.levelTrack,{backgroundColor:'rgba(255,255,255,.10)'}]}><View style={[styles.levelFill,{width:`${levelPct}%`,backgroundColor:palette.primary}]}/></View></View>
      </View>
      <View style={styles.medalRail}><Medal label="READINESS" value={recommendation.readiness} accent={palette.highlight}/><Medal label="STREAK" value={`${snapshot.streakDays}D`} accent={t.text}/><Medal label="THIS WEEK" value={String(snapshot.thisWeekWorkouts)} accent={t.text}/><Medal label="XP" value={`+${snapshot.thisWeekXP}`} accent={palette.highlight}/></View>
    </ImageBackground></Entrance>

    <Entrance delay={60}><View style={[styles.questFrame,{borderColor:material.edgeStrong,backgroundColor:'rgba(5,9,13,.90)'}]}><View style={[styles.questRail,{backgroundColor:palette.primary}]}/><View style={styles.questHead}><View><Text style={[styles.kicker,{color:palette.highlight}]}>TODAY'S QUEST · {recommendation.priority}</Text><Text style={[styles.questTitle,{color:t.text}]}>{focus.name}</Text><Text style={[styles.questSub,{color:t.text}]}>{recommendation.title}</Text></View><View style={[styles.durationSeal,{borderColor:material.edge}]}><Text style={[styles.durationValue,{color:t.text}]}>~{focus.estimatedMinutes}</Text><Text style={[styles.durationLabel,{color:t.muted}]}>MIN</Text></View></View><Text style={[styles.questReason,{color:t.muted}]}>{recommendation.reason}</Text><View style={styles.signalRow}>{recommendation.signals.slice(0,3).map(signal=><View key={signal} style={[styles.signal,{borderColor:material.edge}]}><Text style={[styles.signalText,{color:t.muted}]}>{signal}</Text></View>)}</View><ActionPressable onPress={()=>router.push({pathname:'/workout',params:{templateId:focus.id}})} style={[styles.primary,{backgroundColor:palette.primary}]}><Text style={styles.primaryText}>BEGIN TODAY'S QUEST</Text></ActionPressable><ActionPressable onPress={()=>router.push('/(tabs)/train')} style={styles.secondary}><Text style={[styles.secondaryText,{color:palette.highlight}]}>WHY THIS · VIEW FULL ARC PLAN ›</Text></ActionPressable></View></Entrance>

    {block?<Entrance delay={90}><View style={[styles.arcFrame,{borderColor:material.edge,backgroundColor:material.railSurface}]}><View style={styles.arcHead}><View><Text style={[styles.kicker,{color:palette.highlight}]}>ACTIVE ARC · WEEK {block.week}/{block.totalWeeks}</Text><Text style={[styles.arcTitle,{color:t.text}]}>{block.goalLabel}</Text><Text style={[styles.arcMeta,{color:t.muted}]}>{block.title} · {block.phase}</Text></View><View style={styles.adherence}><Text style={[styles.adherenceValue,{color:t.text}]}>{block.scorecard.adherence}%</Text><Text style={[styles.micro,{color:t.muted}]}>ADHERENCE</Text></View></View><View style={[styles.track,{backgroundColor:t.surfaceElevated}]}><View style={[styles.fill,{width:`${Math.min(100,Math.max(0,block.weeklyProgress*100))}%`,backgroundColor:palette.primary}]}/></View><View style={styles.nextRow}>{nextSlots.map(slot=><View key={slot.day} style={[styles.nextSlot,{borderColor:slot.status==='NEXT'?material.edgeStrong:material.edge,backgroundColor:slot.status==='NEXT'?material.glow:'rgba(6,9,13,.45)'}]}><Text style={[styles.nextDay,{color:slot.status==='NEXT'?palette.highlight:t.muted}]}>{slot.label}</Text><Text style={[styles.nextName,{color:t.text}]}>{slot.title}</Text></View>)}</View></View></Entrance>:null}

    <Entrance delay={120}><View style={[styles.proofRail,{borderColor:material.edge}]}><Proof label="PERFORMANCE" value={intelligence.performanceTrend}/><Proof label="CONFIDENCE" value={recommendation.confidence}/><Proof label="HARD DAYS" value={String(intelligence.consecutiveHardDays)}/><Proof label="LIFETIME XP" value={snapshot.totalXP.toLocaleString()}/></View></Entrance>
  </View></ScrollView></SafeAreaView>;
}

function Medal({label,value,accent}:{label:string;value:string;accent:string}){return <View style={styles.medal}><View style={[styles.medalRing,{borderColor:accent}]}><Text style={[styles.medalValue,{color:'#F7F8FA'}]} numberOfLines={1}>{value}</Text></View><Text style={styles.medalLabel}>{label}</Text></View>}
function Proof({label,value}:{label:string;value:string}){return <View style={styles.proof}><Text style={styles.proofLabel}>{label}</Text><Text style={styles.proofValue}>{value}</Text></View>}

const serif=Platform.select({ios:'Georgia',default:'serif'});
const styles=StyleSheet.create({safe:{flex:1},state:{flex:1,padding:20,justifyContent:'center'},page:{padding:14,paddingBottom:126},pageWide:{padding:26},shell:{width:'100%',maxWidth:1120,alignSelf:'center',gap:14},brandRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},wordmark:{fontSize:25,fontWeight:'900',letterSpacing:-1},brandLine:{fontSize:6.5,fontWeight:'900',letterSpacing:1.5,marginTop:2},todayTag:{borderWidth:1,borderRadius:999,paddingHorizontal:11,paddingVertical:7,fontSize:7,fontWeight:'900',letterSpacing:1.2},heroStage:{minHeight:410,borderWidth:1,borderRadius:30,overflow:'hidden',padding:20,justifyContent:'space-between'},heroImage:{borderRadius:29},heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,9,.34)'},heroGlow:{position:'absolute',right:-80,top:-100,width:260,height:260,borderRadius:130,opacity:.55},heroLayout:{gap:22},heroLayoutWide:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},heroCopyCol:{flex:1,maxWidth:700},kicker:{fontSize:7.5,fontWeight:'900',letterSpacing:1.45},heroTitle:{fontFamily:serif,fontSize:48,lineHeight:51,fontWeight:'700',marginTop:8,letterSpacing:-1.3},heroTitleCompact:{fontSize:39,lineHeight:43},heroSub:{fontSize:12,lineHeight:19,maxWidth:580,marginTop:10},identityRow:{flexDirection:'row',marginTop:18},identitySeal:{borderWidth:1,borderRadius:16,paddingHorizontal:14,paddingVertical:11},identityTitle:{fontFamily:serif,fontSize:17,fontWeight:'700'},identityMeta:{fontSize:7,fontWeight:'900',letterSpacing:1,marginTop:3},levelMedallion:{width:150,height:150,borderWidth:2,borderRadius:75,alignItems:'center',justifyContent:'center',alignSelf:'flex-end',padding:18},levelLabel:{fontSize:7,fontWeight:'900',letterSpacing:1.2},levelValue:{fontFamily:serif,fontSize:46,lineHeight:50,fontWeight:'700'},levelPct:{fontSize:10,fontWeight:'900'},levelTrack:{width:'100%',height:5,borderRadius:99,overflow:'hidden',marginTop:7},levelFill:{height:'100%',borderRadius:99},medalRail:{flexDirection:'row',justifyContent:'space-between',gap:8,flexWrap:'wrap',marginTop:28},medal:{alignItems:'center',minWidth:70,flex:1},medalRing:{width:62,height:62,borderWidth:1.5,borderRadius:31,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(3,6,10,.62)'},medalValue:{fontSize:13,fontWeight:'900',maxWidth:54},medalLabel:{fontSize:6,color:'rgba(247,248,250,.62)',fontWeight:'900',letterSpacing:.7,marginTop:6},questFrame:{borderWidth:1,borderRadius:24,padding:18,overflow:'hidden',position:'relative'},questRail:{position:'absolute',left:0,top:0,bottom:0,width:3},questHead:{flexDirection:'row',justifyContent:'space-between',gap:14,alignItems:'flex-start'},questTitle:{fontFamily:serif,fontSize:31,lineHeight:35,fontWeight:'700',marginTop:5},questSub:{fontSize:13,fontWeight:'900',marginTop:4},durationSeal:{width:74,height:74,borderWidth:1,borderRadius:37,alignItems:'center',justifyContent:'center'},durationValue:{fontSize:18,fontWeight:'900'},durationLabel:{fontSize:6,fontWeight:'900',letterSpacing:.8},questReason:{fontSize:10.5,lineHeight:17,marginTop:10,maxWidth:720},signalRow:{flexDirection:'row',gap:7,flexWrap:'wrap',marginTop:12},signal:{borderWidth:1,borderRadius:999,paddingHorizontal:9,paddingVertical:6},signalText:{fontSize:7,fontWeight:'800'},primary:{minHeight:58,borderRadius:14,alignItems:'center',justifyContent:'center',marginTop:17},primaryText:{fontSize:10,fontWeight:'900',letterSpacing:1,color:'#F7F8FA'},secondary:{minHeight:38,justifyContent:'center',alignItems:'center'},secondaryText:{fontSize:7,fontWeight:'900',letterSpacing:.9},arcFrame:{borderWidth:1,borderRadius:20,padding:16},arcHead:{flexDirection:'row',justifyContent:'space-between',gap:12,alignItems:'flex-start'},arcTitle:{fontFamily:serif,fontSize:24,fontWeight:'700',marginTop:4},arcMeta:{fontSize:8,fontWeight:'800',marginTop:4},adherence:{alignItems:'flex-end'},adherenceValue:{fontSize:25,fontWeight:'900'},micro:{fontSize:6.5,fontWeight:'900',letterSpacing:.7},track:{height:7,borderRadius:99,overflow:'hidden',marginTop:12},fill:{height:'100%',borderRadius:99},nextRow:{flexDirection:'row',gap:8,flexWrap:'wrap',marginTop:13},nextSlot:{flex:1,minWidth:100,borderWidth:1,borderRadius:13,padding:11},nextDay:{fontSize:6.5,fontWeight:'900',letterSpacing:.8},nextName:{fontSize:10,fontWeight:'900',marginTop:4},proofRail:{borderTopWidth:1,borderBottomWidth:1,flexDirection:'row',flexWrap:'wrap'},proof:{flex:1,minWidth:130,paddingVertical:14,paddingHorizontal:10},proofLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,color:'rgba(247,248,250,.45)'},proofValue:{fontSize:13,fontWeight:'900',color:'#F7F8FA',marginTop:4}});
