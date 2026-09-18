import { router } from 'expo-router';
import React,{useMemo,useState} from 'react';
import { ImageBackground,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,useWindowDimensions,View } from 'react-native';
import { templates } from './data';
import { ActionPressable,Entrance } from './Interaction';
import { getTrainingRecommendation } from './recommendation';
import { useProgressionSnapshot } from './useProgression';
import { useTrainingIntelligence } from './useTrainingIntelligence';
import { useTrainingSetup } from './useTrainingSetup';
import { useTrainingBlockGoalController } from './useTrainingBlock';
import { buildAdaptiveWeeklyPlan } from './weeklyPlan';
import { useVitalTheme } from './ThemeProvider';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype,paletteForArchetype } from './designSystem';
import { trainingArtForArchetype } from './artAssets';
import BrandLoadingScreen from './BrandLoadingScreen';
import DataStatePanel from './DataStatePanel';

type Discipline='RECOMMENDED'|'STRENGTH'|'ENDURANCE'|'RECOVERY';

export default function TrainV3(){
  const {width}=useWindowDimensions();const wide=width>=900;const compact=width<430;
  const {theme}=useVitalTheme();const t=theme.tokens;
  const {snapshot,loading,error,refresh}=useProgressionSnapshot();
  const intelligence=useTrainingIntelligence();const {block}=useTrainingBlockGoalController(intelligence);const {equipment}=useTrainingSetup();const {archetype}=useHeroArchetype();
  const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);
  const [discipline,setDiscipline]=useState<Discipline>('RECOMMENDED');
  const recommendation=getTrainingRecommendation(snapshot,equipment,intelligence,block);
  const plan=buildAdaptiveWeeklyPlan(block,recommendation,intelligence);
  const featured=templates.find(x=>x.id===recommendation.templateId)??templates[0];
  const filtered=useMemo(()=>templates.filter(x=>{
    if(discipline==='RECOMMENDED')return x.id===featured.id;
    if(discipline==='STRENGTH')return ['push','pull','legs'].includes(x.id);
    if(discipline==='ENDURANCE')return x.id==='run';
    return x.id==='recovery';
  }),[discipline,featured.id]);
  const preview=featured.exercises.slice(0,4);

  if(loading)return <BrandLoadingScreen variant="calibrating" message="CALIBRATING YOUR TRAINING PLAN"/>;
  if(error)return <SafeAreaView style={[s.safe,{backgroundColor:t.background}]}><View style={s.state}><DataStatePanel kind="error" title="Training couldn’t load" copy={error} actionLabel="Try again" onAction={()=>void refresh()} icon="strength"/></View></SafeAreaView>;

  return <SafeAreaView style={[s.safe,{backgroundColor:'transparent'}]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.page,wide&&s.pageWide]}><View style={s.shell}>
    <Entrance><View style={s.header}><Text style={[s.kicker,{color:palette.highlight}]}>TRAINING · {material.motif}</Text><Text style={[s.title,compact&&s.titleCompact,{color:t.text}]}>Choose your trial.</Text><Text style={[s.lede,{color:t.muted}]}>VitalQuest adapts the next session to your Arc, readiness, history and available equipment.</Text></View></Entrance>

    <Entrance delay={40}><View style={[s.hero,{borderColor:material.edgeStrong}]}>
      <ImageBackground source={{uri:trainingArtForArchetype(archetype)}} resizeMode="cover" style={s.heroImage} imageStyle={s.heroImageRadius}>
        <View style={s.heroShade}/>
        <View style={[s.heroRail,{borderColor:material.edgeStrong,backgroundColor:'rgba(4,8,12,.80)'}]}>
          <View style={s.heroTop}><View style={{flex:1}}><Text style={[s.kicker,{color:palette.highlight}]}>NEXT TRIAL · {recommendation.priority}</Text><Text style={[s.heroTitle,compact&&s.heroTitleCompact]}>{featured.name}</Text><Text style={s.heroSub}>{recommendation.title}</Text></View><View style={[s.readiness,{borderColor:material.edgeStrong,backgroundColor:'rgba(4,8,12,.76)'}]}><Text style={s.readinessLabel}>READINESS</Text><Text style={s.readinessValue}>{recommendation.readiness}</Text></View></View>
          <Text style={s.reason}>{recommendation.reason}</Text>
          <View style={s.preview}>{preview.map((ex,index)=><View key={ex.id} style={s.exercise}><Text style={[s.index,{color:palette.highlight}]}>{String(index+1).padStart(2,'0')}</Text><View style={{flex:1}}><Text style={s.exerciseName}>{ex.name}</Text><Text style={s.exerciseMeta}>{ex.prescribedSets} × {ex.targetReps}</Text></View></View>)}</View>
          <View style={s.metaRow}><Text style={s.meta}>{featured.exercises.length} EXERCISES</Text><Text style={s.meta}>~{featured.estimatedMinutes} MIN</Text><Text style={s.meta}>{recommendation.confidence} CONFIDENCE</Text></View>
          <ActionPressable onPress={()=>router.push({pathname:'/workout',params:{templateId:featured.id}})} style={[s.primary,{backgroundColor:palette.primary}]}><Text style={s.primaryText}>BEGIN {featured.name.toUpperCase()}</Text></ActionPressable>
        </View>
      </ImageBackground>
    </View></Entrance>

    <Entrance delay={80}><View style={[s.disciplines,{borderColor:material.edge,backgroundColor:material.railSurface}]}>{(['RECOMMENDED','STRENGTH','ENDURANCE','RECOVERY'] as Discipline[]).map(item=>{const active=item===discipline;return <Pressable key={item} onPress={()=>setDiscipline(item)} style={[s.discipline,active&&{borderColor:material.edgeStrong,backgroundColor:material.elevatedSurface}]}><Text style={[s.disciplineText,{color:active?palette.highlight:t.muted}]}>{item}</Text></Pressable>})}</View></Entrance>

    <Entrance delay={110}><View style={s.library}><View style={s.sectionHead}><View><Text style={[s.kicker,{color:palette.highlight}]}>TRIAL LIBRARY</Text><Text style={[s.sectionTitle,{color:t.text}]}>Train with purpose.</Text></View><Text style={[s.small,{color:t.muted}]}>{filtered.length} AVAILABLE</Text></View><View style={[s.cards,wide&&s.cardsWide]}>{filtered.map(item=><ActionPressable key={item.id} onPress={()=>router.push({pathname:'/workout',params:{templateId:item.id}})} style={[s.card,{borderColor:material.edge,backgroundColor:'rgba(5,9,13,.68)'}]} pressedScale={.99}><Text style={[s.cardTag,{color:palette.highlight}]}>TRIAL</Text><Text style={[s.cardTitle,{color:t.text}]}>{item.name}</Text><Text style={[s.cardCopy,{color:t.muted}]}>{item.subtitle}</Text><View style={s.cardFoot}><Text style={[s.small,{color:t.muted}]}>{item.exercises.length} EXERCISES</Text><Text style={[s.small,{color:palette.highlight}]}>START ›</Text></View></ActionPressable>)}</View></View></Entrance>

    {block?<Entrance delay={145}><View style={[s.arc,{borderColor:material.edgeStrong,backgroundColor:material.commandSurface}]}><View style={s.sectionHead}><View><Text style={[s.kicker,{color:palette.highlight}]}>ACTIVE ARC · WEEK {block.week}/{block.totalWeeks}</Text><Text style={[s.arcTitle,{color:t.text}]}>{block.goalLabel}</Text><Text style={[s.arcMeta,{color:t.muted}]}>{block.phase} · {Math.round(block.loadMultiplier*100)}% load guide</Text></View><View style={s.arcScore}><Text style={[s.arcPct,{color:t.text}]}>{block.scorecard.adherence}%</Text><Text style={[s.small,{color:t.muted}]}>ADHERENCE</Text></View></View><View style={[s.track,{backgroundColor:t.surfaceElevated}]}><View style={[s.fill,{width:`${Math.min(100,block.weeklyProgress*100)}%`,backgroundColor:palette.primary}]}/></View><View style={s.week}>{plan.slots.slice(0,7).map(slot=><View key={slot.day} style={[s.day,{borderColor:slot.status==='NEXT'?material.edgeStrong:material.edge,backgroundColor:slot.status==='NEXT'?material.glow:'transparent'}]}><Text style={[s.dayLabel,{color:slot.status==='NEXT'?palette.highlight:t.muted}]}>{slot.label}</Text><Text numberOfLines={2} style={[s.dayTitle,{color:t.text}]}>{slot.title}</Text></View>)}</View></View></Entrance>:null}

    <Entrance delay={180}><View style={[s.tools,{borderColor:material.edge}]}><ActionPressable onPress={()=>router.push('/forge')} style={s.tool}><Text style={[s.toolTitle,{color:t.text}]}>Adaptive Builder</Text><Text style={[s.toolCopy,{color:t.muted}]}>Generate around equipment, fatigue and Arc context.</Text></ActionPressable><ActionPressable onPress={()=>router.push('/insights')} style={s.tool}><Text style={[s.toolTitle,{color:t.text}]}>Training Intelligence</Text><Text style={[s.toolCopy,{color:t.muted}]}>Review performance, fatigue and progression signals.</Text></ActionPressable><ActionPressable onPress={()=>router.push('/equipment')} style={s.tool}><Text style={[s.toolTitle,{color:t.text}]}>Equipment</Text><Text style={[s.toolCopy,{color:t.muted}]}>{equipment.length} categories currently shape recommendations.</Text></ActionPressable></View></Entrance>
  </View></ScrollView></SafeAreaView>;
}

const serif=Platform.select({ios:'Georgia',default:'serif'});
const s=StyleSheet.create({safe:{flex:1},state:{flex:1,padding:20,justifyContent:'center'},page:{padding:16,paddingBottom:124},pageWide:{padding:28},shell:{width:'100%',maxWidth:1120,alignSelf:'center',gap:16},header:{gap:5},kicker:{fontSize:7,fontWeight:'900',letterSpacing:1.45},title:{fontFamily:serif,fontSize:42,lineHeight:47,fontWeight:'900'},titleCompact:{fontSize:35,lineHeight:40},lede:{fontSize:10.5,lineHeight:17,maxWidth:650},hero:{borderWidth:1,borderRadius:30,overflow:'hidden',minHeight:520},heroImage:{minHeight:520,justifyContent:'flex-end'},heroImageRadius:{borderRadius:29},heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,9,.30)'},heroRail:{margin:14,borderWidth:1,borderRadius:22,padding:18},heroTop:{flexDirection:'row',gap:12,alignItems:'flex-start'},heroTitle:{fontFamily:serif,fontSize:44,lineHeight:48,color:'#FFF8EB',fontWeight:'800',marginTop:4},heroTitleCompact:{fontSize:36,lineHeight:40},heroSub:{fontSize:13,fontWeight:'900',color:'#F4F6F8',marginTop:4},reason:{fontSize:10.5,lineHeight:16,color:'rgba(244,246,248,.75)',marginTop:10,maxWidth:700},readiness:{borderWidth:1,borderRadius:16,padding:10,minWidth:100,alignItems:'center'},readinessLabel:{fontSize:6,fontWeight:'900',letterSpacing:1,color:'rgba(244,246,248,.58)'},readinessValue:{fontSize:15,fontWeight:'900',color:'#F4F6F8',marginTop:3},preview:{marginTop:14,gap:7},exercise:{flexDirection:'row',gap:10,alignItems:'center',paddingVertical:6,borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,.08)'},index:{fontSize:8,fontWeight:'900'},exerciseName:{fontSize:11,fontWeight:'900',color:'#F4F6F8'},exerciseMeta:{fontSize:7.5,color:'rgba(244,246,248,.58)',marginTop:2},metaRow:{flexDirection:'row',gap:14,flexWrap:'wrap',marginTop:12},meta:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,color:'rgba(244,246,248,.58)'},primary:{minHeight:56,borderRadius:13,alignItems:'center',justifyContent:'center',marginTop:16},primaryText:{fontSize:9.5,fontWeight:'900',letterSpacing:1,color:'#F7F8FA'},disciplines:{flexDirection:'row',gap:4,padding:4,borderWidth:1,borderRadius:15,flexWrap:'wrap'},discipline:{flexGrow:1,minWidth:120,minHeight:42,borderWidth:1,borderColor:'transparent',borderRadius:11,alignItems:'center',justifyContent:'center'},disciplineText:{fontSize:7.5,fontWeight:'900',letterSpacing:.9},library:{gap:11},sectionHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',gap:12,flexWrap:'wrap'},sectionTitle:{fontFamily:serif,fontSize:24,fontWeight:'800',marginTop:3},small:{fontSize:6.5,fontWeight:'900',letterSpacing:.7},cards:{gap:10},cardsWide:{flexDirection:'row',flexWrap:'wrap'},card:{borderWidth:1,borderRadius:18,padding:15,minHeight:150,flexGrow:1,flexBasis:240},cardTag:{fontSize:6.5,fontWeight:'900',letterSpacing:1.1},cardTitle:{fontSize:18,fontWeight:'900',marginTop:6},cardCopy:{fontSize:9,lineHeight:14,marginTop:5},cardFoot:{flexDirection:'row',justifyContent:'space-between',marginTop:'auto',paddingTop:14},arc:{borderWidth:1,borderRadius:22,padding:16},arcTitle:{fontFamily:serif,fontSize:25,fontWeight:'800',marginTop:4},arcMeta:{fontSize:8,fontWeight:'800',marginTop:3},arcScore:{alignItems:'flex-end'},arcPct:{fontSize:26,fontWeight:'900'},track:{height:8,borderRadius:99,overflow:'hidden',marginTop:13},fill:{height:'100%',borderRadius:99},week:{flexDirection:'row',gap:6,marginTop:13,flexWrap:'wrap'},day:{flexGrow:1,flexBasis:120,borderWidth:1,borderRadius:12,padding:10,minHeight:68},dayLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8},dayTitle:{fontSize:9.5,fontWeight:'900',marginTop:4},tools:{borderTopWidth:1,borderBottomWidth:1,paddingVertical:12,flexDirection:'row',gap:8,flexWrap:'wrap'},tool:{flexGrow:1,flexBasis:220,padding:10},toolTitle:{fontSize:12,fontWeight:'900'},toolCopy:{fontSize:8.5,lineHeight:13,marginTop:3}});
