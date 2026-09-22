import { router } from 'expo-router';
import React from 'react';
import { ImageBackground,Platform,SafeAreaView,ScrollView,StyleSheet,Text,useWindowDimensions,View } from 'react-native';
import { templates } from './data';
import { ActionPressable,AnimatedBar,Entrance } from './Interaction';
import { getTrainingRecommendation } from './recommendation';
import { useProgressionSnapshot } from './useProgression';
import { useTrainingIntelligence } from './useTrainingIntelligence';
import { useTrainingSetup } from './useTrainingSetup';
import { useTrainingBlock } from './useTrainingBlock';
import { buildAdaptiveWeeklyPlan } from './weeklyPlan';
import { useVitalTheme } from './ThemeProvider';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype, paletteForArchetype, fonts } from './designSystem';
import { deriveHeroEvolution } from './heroEvolution';
import BrandLoadingScreen from './BrandLoadingScreen';
import DataStatePanel from './DataStatePanel';
import AttributeStrip from './AttributeStrip';
import { heroArtForArchetype } from './artAssets';

export default function TodayV3(){
  const {width}=useWindowDimensions();const wide=width>=900;const compact=width<430;
  const {theme}=useVitalTheme();const t=theme.tokens;const {snapshot,loading,error,refresh}=useProgressionSnapshot();
  const intelligence=useTrainingIntelligence();const block=useTrainingBlock(intelligence);const {equipment}=useTrainingSetup();const {archetype}=useHeroArchetype();
  const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);const hero=deriveHeroEvolution(snapshot,archetype);
  const recommendation=getTrainingRecommendation(snapshot,equipment,intelligence,block);const plan=buildAdaptiveWeeklyPlan(block,recommendation,intelligence);const focus=templates.find(x=>x.id===recommendation.templateId)??templates[0];
  const levelPct=Math.max(0,Math.min(100,Math.round(snapshot.levelRatio*100)));const nextSlots=plan.slots.slice(0,3);
  if(loading)return <BrandLoadingScreen variant="calibrating" message="PREPARING TODAY'S QUEST"/>;
  if(error)return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><View style={styles.state}><DataStatePanel kind="error" title="Today couldn’t load" copy={error} actionLabel="Try again" onAction={()=>void refresh()} icon="xp"/></View></SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page,wide&&styles.pageWide]}><View style={styles.shell}>
    <Entrance><View style={styles.brandRow}><View><Text style={styles.wordmark}>VITAL<Text style={{color:palette.highlight}}>QUEST</Text></Text><Text style={styles.brandLine}>YOUR ARC · IN MOTION</Text></View><View style={[styles.realmPill,{borderColor:material.edgeStrong,backgroundColor:material.railSurface}]}><Text style={[styles.realmPillText,{color:palette.highlight}]}>{hero.archetypeName.toUpperCase()} WORLD</Text></View></View></Entrance>

    <Entrance delay={30}><ImageBackground source={{uri:heroArtForArchetype(archetype)}} resizeMode="cover" imageStyle={[styles.stageImage,wide&&styles.stageImageWide]} style={[styles.stage,{borderColor:material.edgeStrong}]}>
      <View style={styles.stageVeil}/><View style={[styles.stageGlow,{backgroundColor:material.glow}]}/>

      <View style={[styles.stageHeader,wide&&styles.stageHeaderWide]}>
        <View style={styles.identity}>
          <Text style={[styles.kicker,{color:palette.highlight}]}>WELCOME BACK · {hero.archetypeName.toUpperCase()}</Text>
          <Text style={[styles.heroTitle,compact&&styles.heroTitleCompact]}>Become more.</Text>
          <Text style={styles.heroSub}>The world changes with the work. Today is one decisive step inside your Arc.</Text>
          <View style={[styles.formSeal,{borderColor:material.edgeStrong,backgroundColor:'rgba(3,7,11,.56)'}]}><Text style={styles.formTitle}>{hero.title}</Text><Text style={[styles.formMeta,{color:palette.highlight}]}>FORM {hero.formTier} · {material.motif}</Text></View>
        </View>

        <View style={[styles.levelCrest,{borderColor:palette.highlight,backgroundColor:'rgba(2,6,10,.72)'}]}>
          <Text style={styles.levelLabel}>LEVEL</Text><Text style={styles.levelValue}>{snapshot.level}</Text><Text style={[styles.levelPct,{color:palette.highlight}]}>{levelPct}% TO NEXT</Text>
          <AnimatedBar progress={levelPct/100} color={palette.primary} trackStyle={styles.levelTrack} barStyle={styles.levelFill}/>
        </View>
      </View>

      <View style={[styles.hud,wide&&styles.hudWide]}>
        <HudStat label="READINESS" value={recommendation.readiness} accent={palette.highlight}/>
        <HudStat label="STREAK" value={`${snapshot.streakDays} DAYS`}/>
        <HudStat label="SESSIONS" value={String(snapshot.thisWeekWorkouts)}/>
        <HudStat label="WEEK XP" value={`+${snapshot.thisWeekXP}`} accent={palette.highlight}/>
      </View>

      <View style={[styles.questDock,{borderColor:material.edgeStrong,backgroundColor:'rgba(3,8,12,.88)'}]}>
        <View style={[styles.questAccent,{backgroundColor:palette.primary}]}/>
        <View style={[styles.questLayout,wide&&styles.questLayoutWide]}>
          <View style={styles.questCopy}>
            <Text style={[styles.kicker,{color:palette.highlight}]}>TODAY'S FOCUS · {recommendation.priority}</Text>
            <Text style={styles.questTitle}>{focus.name}</Text>
            <Text style={styles.questSub}>{recommendation.title}</Text>
            <Text style={styles.questReason}>{recommendation.reason}</Text>
            <View style={styles.signalRow}>{recommendation.signals.slice(0,3).map(signal=><View key={signal} style={[styles.signal,{borderColor:material.edge}]}><Text style={styles.signalText}>{signal}</Text></View>)}</View>
          </View>
          <View style={[styles.questAction,wide&&styles.questActionWide]}>
            <View style={[styles.durationCrest,{borderColor:material.edgeStrong}]}><Text style={styles.durationValue}>~{focus.estimatedMinutes}</Text><Text style={styles.durationLabel}>MINUTES</Text></View>
            <ActionPressable onPress={()=>router.push({pathname:'/workout',params:{templateId:focus.id}})} style={[styles.primary,{backgroundColor:palette.primary}]}><Text style={styles.primaryText}>BEGIN TODAY'S QUEST</Text></ActionPressable>
            <ActionPressable onPress={()=>router.push('/(tabs)/train')} style={styles.secondary}><Text style={[styles.secondaryText,{color:palette.highlight}]}>VIEW FULL TRAINING PLAN ›</Text></ActionPressable>
          </View>
        </View>
      </View>
    </ImageBackground></Entrance>

    <Entrance delay={60}><AttributeStrip snapshot={snapshot} archetype={archetype}/></Entrance>

    {block?<Entrance delay={75}><View style={[styles.arcBand,{borderColor:material.edgeStrong,backgroundColor:material.railSurface}]}>
      <View style={styles.arcTop}><View><Text style={[styles.kicker,{color:palette.highlight}]}>ACTIVE ARC · WEEK {block.week}/{block.totalWeeks}</Text><Text style={styles.arcTitle}>{block.goalLabel}</Text><Text style={styles.arcMeta}>{block.title} · {block.phase}</Text></View><View style={styles.arcScore}><Text style={styles.arcScoreValue}>{block.scorecard.adherence}%</Text><Text style={styles.micro}>ADHERENCE</Text></View></View>
      <AnimatedBar progress={Math.min(1,Math.max(0,block.weeklyProgress))} color={palette.primary} trackStyle={styles.track} barStyle={styles.fill}/>
      <View style={styles.campaignRow}>{nextSlots.map(slot=><View key={slot.day} style={[styles.campaignNode,{borderColor:slot.status==='NEXT'?material.edgeStrong:material.edge,backgroundColor:slot.status==='NEXT'?material.glow:'rgba(4,8,12,.44)'}]}><Text style={[styles.campaignDay,{color:slot.status==='NEXT'?palette.highlight:'rgba(247,248,250,.48)'}]}>{slot.label}</Text><Text style={styles.campaignTitle}>{slot.title}</Text>{slot.status==='NEXT'?<Text style={[styles.nextMarker,{color:palette.highlight}]}>NEXT</Text>:null}</View>)}</View>
    </View></Entrance>:null}

    <Entrance delay={110}><View style={[styles.proofBand,{borderColor:material.edge}]}>
      <Proof label="PERFORMANCE" value={intelligence.performanceTrend}/>
      <Proof label="CONFIDENCE" value={recommendation.confidence}/>
      <Proof label="HARD DAYS" value={String(intelligence.consecutiveHardDays)}/>
      <Proof label="LIFETIME XP" value={snapshot.totalXP.toLocaleString()}/>
    </View></Entrance>
  </View></ScrollView></SafeAreaView>;
}

function HudStat({label,value,accent}:{label:string;value:string;accent?:string}){return <View style={styles.hudStat}><Text style={styles.hudLabel}>{label}</Text><Text style={[styles.hudValue,accent?{color:accent}:null]} numberOfLines={1}>{value}</Text></View>}
function Proof({label,value}:{label:string;value:string}){return <View style={styles.proof}><Text style={styles.proofLabel}>{label}</Text><Text style={styles.proofValue}>{value}</Text></View>}

const serif=fonts.display;
const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:'transparent'},state:{flex:1,padding:20,justifyContent:'center'},page:{padding:12,paddingBottom:126},pageWide:{padding:24},shell:{width:'100%',maxWidth:1180,alignSelf:'center',gap:14},
  brandRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,paddingHorizontal:2},wordmark:{fontSize:24,fontWeight:'900',letterSpacing:-1,color:'#F7F8FA'},brandLine:{fontSize:9,fontWeight:'900',letterSpacing:1.7,color:'rgba(247,248,250,.48)',marginTop:2},realmPill:{borderWidth:1,borderRadius:999,paddingHorizontal:12,paddingVertical:8},realmPillText:{fontSize:9,fontWeight:'900',letterSpacing:1.1},
  stage:{minHeight:690,borderWidth:1,borderRadius:32,overflow:'hidden',padding:18,justifyContent:'space-between',position:'relative'},stageImage:{borderRadius:31},stageImageWide:Platform.OS==='web'?({objectPosition:'50% 18%'} as any):{transform:[{translateY:30}]},stageVeil:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(1,4,8,.30)'},stageGlow:{position:'absolute',left:-100,top:-120,width:390,height:390,borderRadius:195,opacity:.42},
  stageHeader:{zIndex:3,gap:18},stageHeaderWide:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},identity:{maxWidth:610},kicker:{fontSize:9.5,fontWeight:'900',letterSpacing:1.45},heroTitle:{fontFamily:serif,fontSize:50,lineHeight:53,fontWeight:'700',color:'#FFF9EE',marginTop:7,letterSpacing:-1.5},heroTitleCompact:{fontSize:40,lineHeight:44},heroSub:{fontSize:12,lineHeight:19,color:'rgba(247,248,250,.80)',maxWidth:510,marginTop:8},formSeal:{alignSelf:'flex-start',borderWidth:1,borderRadius:15,paddingHorizontal:14,paddingVertical:11,marginTop:16},formTitle:{fontFamily:serif,fontSize:17,fontWeight:'700',color:'#FFF9EE'},formMeta:{fontSize:9.5,fontWeight:'900',letterSpacing:1,marginTop:3},
  levelCrest:{zIndex:4,width:142,height:142,borderWidth:1.5,borderRadius:71,alignItems:'center',justifyContent:'center',padding:17,alignSelf:'flex-end'},levelLabel:{fontSize:9,fontWeight:'900',letterSpacing:1.2,color:'rgba(247,248,250,.54)'},levelValue:{fontFamily:serif,fontVariant:['tabular-nums'],fontSize:43,lineHeight:46,fontWeight:'700',color:'#FFF9EE'},levelPct:{fontSize:9.5,fontWeight:'900',letterSpacing:.4},levelTrack:{width:'100%',height:4,borderRadius:99,backgroundColor:'rgba(255,255,255,.12)',overflow:'hidden',marginTop:7},levelFill:{height:'100%',borderRadius:99},
  hud:{zIndex:4,flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:210},hudWide:{marginTop:245,maxWidth:710},hudStat:{minWidth:112,flexGrow:1,flexBasis:112,borderTopWidth:1,borderTopColor:'rgba(255,255,255,.18)',paddingTop:8,paddingRight:8},hudLabel:{fontSize:9,fontWeight:'900',letterSpacing:1,color:'rgba(247,248,250,.48)'},hudValue:{fontVariant:['tabular-nums'],fontSize:14,fontWeight:'900',color:'#F7F8FA',marginTop:4},
  questDock:{zIndex:5,borderWidth:1,borderRadius:24,overflow:'hidden',position:'relative',marginTop:14},questAccent:{position:'absolute',left:0,top:0,bottom:0,width:3},questLayout:{padding:16,gap:16},questLayoutWide:{flexDirection:'row',alignItems:'flex-end'},questCopy:{flex:1},questTitle:{fontFamily:serif,fontSize:33,lineHeight:36,fontWeight:'700',color:'#FFF9EE',marginTop:5},questSub:{fontSize:12.5,fontWeight:'900',color:'#F7F8FA',marginTop:3},questReason:{fontSize:10,lineHeight:16,color:'rgba(247,248,250,.62)',marginTop:9,maxWidth:650},signalRow:{flexDirection:'row',gap:6,flexWrap:'wrap',marginTop:10},signal:{borderWidth:1,borderRadius:999,paddingHorizontal:8,paddingVertical:5,backgroundColor:'rgba(255,255,255,.02)'},signalText:{fontSize:9,fontWeight:'800',color:'rgba(247,248,250,.62)'},questAction:{width:'100%',gap:8},questActionWide:{width:290,flexShrink:0},durationCrest:{alignSelf:'flex-end',width:68,height:68,borderWidth:1,borderRadius:34,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(1,5,9,.44)'},durationValue:{fontVariant:['tabular-nums'],fontSize:17,fontWeight:'900',color:'#FFF9EE'},durationLabel:{fontSize:9,fontWeight:'900',letterSpacing:.7,color:'rgba(247,248,250,.48)'},primary:{minHeight:56,borderRadius:14,alignItems:'center',justifyContent:'center'},primaryText:{fontSize:10,fontWeight:'900',letterSpacing:1,color:'#F7F8FA'},secondary:{minHeight:32,alignItems:'center',justifyContent:'center'},secondaryText:{fontSize:9,fontWeight:'900',letterSpacing:.9},
  arcBand:{borderWidth:1,borderRadius:22,padding:16},arcTop:{flexDirection:'row',justifyContent:'space-between',gap:12,alignItems:'flex-start'},arcTitle:{fontFamily:serif,fontSize:25,fontWeight:'700',color:'#FFF9EE',marginTop:4},arcMeta:{fontSize:8,fontWeight:'800',color:'rgba(247,248,250,.50)',marginTop:4},arcScore:{alignItems:'flex-end'},arcScoreValue:{fontVariant:['tabular-nums'],fontSize:26,fontWeight:'900',color:'#FFF9EE'},micro:{fontSize:9,fontWeight:'900',letterSpacing:.8,color:'rgba(247,248,250,.46)'},track:{height:6,borderRadius:99,overflow:'hidden',backgroundColor:'rgba(255,255,255,.08)',marginTop:12},fill:{height:'100%',borderRadius:99},campaignRow:{flexDirection:'row',gap:8,flexWrap:'wrap',marginTop:13},campaignNode:{flex:1,minWidth:102,borderWidth:1,borderRadius:14,padding:11,position:'relative'},campaignDay:{fontSize:9,fontWeight:'900',letterSpacing:.9},campaignTitle:{fontSize:10.5,fontWeight:'900',color:'#F7F8FA',marginTop:4,paddingRight:26},nextMarker:{position:'absolute',right:9,top:9,fontSize:9,fontWeight:'900',letterSpacing:.7},
  proofBand:{borderTopWidth:1,borderBottomWidth:1,flexDirection:'row',flexWrap:'wrap'},proof:{flex:1,minWidth:130,paddingVertical:14,paddingHorizontal:10},proofLabel:{fontSize:9,fontWeight:'900',letterSpacing:.8,color:'rgba(247,248,250,.42)'},proofValue:{fontVariant:['tabular-nums'],fontSize:13,fontWeight:'900',color:'#F7F8FA',marginTop:4}
});
