import { router,useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React,{useState} from 'react';
import { ImageBackground,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,useWindowDimensions,View } from 'react-native';
import { ActionPressable } from './Interaction';
import { HERO_ARCHETYPES,type HeroArchetype } from './heroEvolution';
import { ARC_GOALS,type TrainingArcGoal } from './trainingBlock';
import { DEFAULT_EQUIPMENT,EQUIPMENT_OPTIONS,type EquipmentId } from './trainingPreferences';
import { saveOnboardingProfile,type TrainingExperience } from './onboarding';
import { materialForArchetype,paletteForArchetype } from './designSystem';
import { IconArt,type VQIconName } from './IconArt';
import { heroArtFor } from './vitalquestArt';
import { BRAND_LAUNCH_IMAGE } from './brandLaunchAsset';
import BrandLoadingScreen from './BrandLoadingScreen';

type Step=0|1|2|3|4|5;
const PANEL='rgba(4,10,15,.88)';
const EQ_ICON:Record<EquipmentId,VQIconName>={barbell:'strength',dumbbells:'strength',bench:'strength',rack:'strength',cables:'strength',machines:'strength',pullup:'agility',cardio:'stamina',bodyweight:'streak'};
const EQ_LABEL:Record<EquipmentId,string>={barbell:'Barbell',dumbbells:'Dumbbells',bench:'Bench',rack:'Rack',cables:'Bands / Cables',machines:'Machines',pullup:'Pull-Up Bar',cardio:'Cardio',bodyweight:'Bodyweight'};
const WORLD_COPY:Record<HeroArchetype,{tag:string;vow:string}>={
 mystic:{tag:'FOCUS · BALANCE · LONGEVITY',vow:'Luminous. Intentional. Ascending.'},
 athlete:{tag:'DISCIPLINE · PROGRESS · POTENTIAL',vow:'Technical. Powerful. Precise.'},
 spartan:{tag:'RESILIENCE · STRENGTH · LEGACY',vow:'Forged. Relentless. Enduring.'},
};

export default function OnboardingV3(){
 const db=useSQLiteContext();
 useWindowDimensions();
 const {reset}=useLocalSearchParams<{reset?:string}>();
 const [step,setStep]=useState<Step>(reset?1:0);
 const [archetype,setArchetype]=useState<HeroArchetype>('athlete');
 const [equipment,setEquipment]=useState<EquipmentId[]>(DEFAULT_EQUIPMENT);
 const [goal,setGoal]=useState<TrainingArcGoal>('HYBRID');
 const [weeklyDays,setWeeklyDays]=useState<3|4|5>(4);
 const [experience,setExperience]=useState<TrainingExperience>('INTERMEDIATE');
 const [saving,setSaving]=useState(false);
 const toggleEquipment=(id:EquipmentId)=>setEquipment(cur=>cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]);
 const next=()=>setStep(Math.min(5,step+1) as Step);
 const back=()=>setStep(Math.max(reset?1:0,step-1) as Step);
 async function finish(){
  setSaving(true);
  const safeEquipment:EquipmentId[]=equipment.length?equipment:['bodyweight'];
  await saveOnboardingProfile(db,{goal,archetype,experience,weeklyDays,equipment:safeEquipment});
  setSaving(false);
  setStep(5);
 }
 if(saving)return <BrandLoadingScreen variant="calibrating" message="BUILDING YOUR FIRST ARC"/>;
 if(step===0)return <Welcome onStart={next}/>;
 if(step===1)return <WorldSelect archetype={archetype} setArchetype={setArchetype} onNext={next} onBack={back}/>;
 if(step===2)return <ArchetypeScreen archetype={archetype} onNext={next} onBack={back}/>;
 if(step===3)return <EquipmentScreen archetype={archetype} equipment={equipment} toggle={toggleEquipment} onNext={next} onBack={back}/>;
 if(step===4)return <ArcGoalScreen archetype={archetype} goal={goal} setGoal={setGoal} weeklyDays={weeklyDays} setWeeklyDays={setWeeklyDays} experience={experience} setExperience={setExperience} onFinish={finish} onBack={back} reset={Boolean(reset)}/>;
 return <Ready archetype={archetype}/>;
}

function Shell({children,archetype='athlete',step,onBack}:{children:React.ReactNode;archetype?:HeroArchetype;step:number;onBack?:()=>void}){
 const p=paletteForArchetype(archetype);
 return <SafeAreaView style={s.safe}><View style={s.bg}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}><View style={s.shell}>
  <View style={s.chrome}>{onBack?<Pressable onPress={onBack} hitSlop={12}><Text style={s.back}>‹</Text></Pressable>:<View style={{width:24}}/>}<Text style={s.brand}>VITALQUEST</Text><Text style={[s.step,{color:p.highlight}]}>0{step} / 04</Text></View>
  {children}
 </View></ScrollView></View></SafeAreaView>
}

function Welcome({onStart}:{onStart:()=>void}){
 return <SafeAreaView style={s.safe}><ImageBackground source={{uri:BRAND_LAUNCH_IMAGE}} resizeMode="cover" style={s.welcome}><View style={s.welcomeShade}/><View style={s.welcomeInner}><Text style={s.welcomeBrand}>VITALQUEST</Text><View style={{flex:1}}/><Text style={s.welcomeTitle}>Welcome to{`\n`}VitalQuest</Text><Text style={s.welcomeSub}>Train with purpose.{`\n`}Build a stronger you.</Text><ActionPressable onPress={onStart} style={s.goldButton}><Text style={s.goldButtonText}>GET STARTED</Text></ActionPressable><Text style={s.welcomeFoot}>STRONGER EVERY DAY</Text></View></ImageBackground></SafeAreaView>
}

function WorldSelect({archetype,setArchetype,onNext,onBack}:{archetype:HeroArchetype;setArchetype:(v:HeroArchetype)=>void;onNext:()=>void;onBack:()=>void}){
 return <Shell archetype={archetype} step={1} onBack={onBack}><View style={s.header}><Text style={s.title}>Choose Your World</Text><Text style={s.sub}>Different paths. A stronger you.</Text></View><View style={s.worldStack}>{(Object.keys(HERO_ARCHETYPES) as HeroArchetype[]).map(id=><WorldCard key={id} id={id} active={id===archetype} onPress={()=>setArchetype(id)}/>)}</View><ActionPressable onPress={onNext} style={s.goldButton}><Text style={s.goldButtonText}>CONTINUE</Text></ActionPressable><Text style={s.footerMark}>MORE THAN FITNESS  ·  A STRONGER YOU</Text></Shell>
}

function WorldCard({id,active,onPress}:{id:HeroArchetype;active:boolean;onPress:()=>void}){
 const p=paletteForArchetype(id);const m=materialForArchetype(id);
 return <Pressable onPress={onPress} style={[s.worldCard,{borderColor:active?p.highlight:'rgba(255,255,255,.20)'}]}><ImageBackground source={{uri:heroArtFor(id)}} resizeMode="cover" style={s.worldImage} imageStyle={s.worldImageStyle}><View style={s.worldShade}/><View style={s.worldCopy}><Text style={[s.kicker,{color:active?p.highlight:'#D9DDE3'}]}>{active?'YOUR WORLD':'SELECT PATH'}</Text><Text style={s.worldName}>{HERO_ARCHETYPES[id].name.toUpperCase()}</Text><Text style={s.worldDesc}>{m.descriptor}</Text><Text style={[s.worldTag,{color:p.highlight}]}>{WORLD_COPY[id].tag}</Text></View><View style={[s.chevron,{borderColor:p.highlight}]}><Text style={[s.chevronText,{color:p.highlight}]}>›</Text></View></ImageBackground></Pressable>
}

function ArchetypeScreen({archetype,onNext,onBack}:{archetype:HeroArchetype;onNext:()=>void;onBack:()=>void}){
 const p=paletteForArchetype(archetype);
 return <Shell archetype={archetype} step={2} onBack={onBack}><View style={s.header}><Text style={s.title}>Your Archetype</Text><Text style={s.sub}>Your work shapes what this becomes.</Text></View><View style={[s.heroCard,{borderColor:p.highlight}]}><ImageBackground source={{uri:heroArtFor(archetype)}} resizeMode="cover" style={s.heroImage} imageStyle={s.heroImageStyle}><View style={s.heroShade}/><View style={s.heroBottom}><Text style={[s.kicker,{color:p.highlight}]}>YOUR PATH</Text><Text style={s.heroName}>{HERO_ARCHETYPES[archetype].name.toUpperCase()}</Text><Text style={s.heroVow}>{WORLD_COPY[archetype].vow}</Text></View></ImageBackground></View><ActionPressable onPress={onNext} style={s.goldButton}><Text style={s.goldButtonText}>SELECT THIS PATH</Text></ActionPressable></Shell>
}

function EquipmentScreen({archetype,equipment,toggle,onNext,onBack}:{archetype:HeroArchetype;equipment:EquipmentId[];toggle:(id:EquipmentId)=>void;onNext:()=>void;onBack:()=>void}){
 const p=paletteForArchetype(archetype);
 return <Shell archetype={archetype} step={3} onBack={onBack}><View style={s.header}><Text style={s.title}>Select Your Equipment</Text><Text style={s.sub}>Choose what you have access to.</Text></View><View style={s.eqGrid}>{EQUIPMENT_OPTIONS.map(item=>{const active=equipment.includes(item.id);return <Pressable key={item.id} onPress={()=>toggle(item.id)} style={[s.eqCard,{borderColor:active?p.highlight:'rgba(255,255,255,.10)',backgroundColor:active?'rgba(215,165,55,.12)':PANEL}]}><IconArt name={EQ_ICON[item.id]} size={32} tint={active?p.highlight:'#F3F5F7'}/><Text style={[s.eqText,{color:active?p.highlight:'#F3F5F7'}]}>{EQ_LABEL[item.id]}</Text>{active?<View style={[s.dot,{backgroundColor:p.highlight}]}/>:null}</Pressable>})}</View><ActionPressable onPress={onNext} style={s.goldButton}><Text style={s.goldButtonText}>CONTINUE</Text></ActionPressable></Shell>
}

function ArcGoalScreen({archetype,goal,setGoal,weeklyDays,setWeeklyDays,experience,setExperience,onFinish,onBack,reset}:{archetype:HeroArchetype;goal:TrainingArcGoal;setGoal:(v:TrainingArcGoal)=>void;weeklyDays:3|4|5;setWeeklyDays:(v:3|4|5)=>void;experience:TrainingExperience;setExperience:(v:TrainingExperience)=>void;onFinish:()=>void;onBack:()=>void;reset:boolean}){
 const p=paletteForArchetype(archetype);
 return <Shell archetype={archetype} step={4} onBack={onBack}><View style={s.header}><Text style={[s.kicker,{color:p.highlight}]}>DEFINE THE ARC</Text><Text style={s.title}>What should your training change first?</Text><Text style={s.sub}>VitalQuest uses this to bias your first four-week Arc. You can recalibrate later without losing progress.</Text></View><View style={s.goalList}>{ARC_GOALS.map(item=>{const active=item.id===goal;const goalIcon:VQIconName=item.id==='STRENGTH'?'strength':item.id==='CONDITIONING'?'stamina':item.id==='REBUILD'?'agility':'trophy';return <Pressable key={item.id} onPress={()=>setGoal(item.id)} style={[s.goalRow,{borderColor:active?p.highlight:'rgba(255,255,255,.12)',backgroundColor:active?'rgba(215,165,55,.12)':PANEL}]}><View style={[s.goalIcon,{borderColor:active?p.highlight:'rgba(255,255,255,.15)'}]}><IconArt name={goalIcon} size={22} tint={active?p.highlight:'#DDE2E8'}/></View><View style={{flex:1}}><Text style={s.goalName}>{item.label}</Text><Text style={s.goalDesc}>{item.description}</Text></View>{active?<Text style={[s.check,{color:p.highlight}]}>✓</Text>:null}</Pressable>})}</View><View style={s.baseline}><Text style={s.baselineLabel}>TRAINING DAYS</Text><View style={s.chips}>{([3,4,5] as const).map(v=><Pressable key={v} onPress={()=>setWeeklyDays(v)} style={[s.chip,{borderColor:weeklyDays===v?p.highlight:'rgba(255,255,255,.15)'}]}><Text style={[s.chipText,{color:weeklyDays===v?p.highlight:'#DDE2E8'}]}>{v} / WEEK</Text></Pressable>)}</View><Text style={s.baselineLabel}>EXPERIENCE</Text><View style={s.chips}>{(['BEGINNER','INTERMEDIATE','ADVANCED'] as TrainingExperience[]).map(v=><Pressable key={v} onPress={()=>setExperience(v)} style={[s.chip,{borderColor:experience===v?p.highlight:'rgba(255,255,255,.15)'}]}><Text style={[s.chipText,{color:experience===v?p.highlight:'#DDE2E8'}]}>{v==='BEGINNER'?'BUILDING BASE':v==='INTERMEDIATE'?'CONSISTENT':'EXPERIENCED'}</Text></Pressable>)}</View></View><ActionPressable onPress={onFinish} style={s.goldButton}><Text style={s.goldButtonText}>{reset?'RECALIBRATE ARC':'BUILD MY ARC'}</Text></ActionPressable></Shell>
}

function Ready({archetype}:{archetype:HeroArchetype}){
 const p=paletteForArchetype(archetype);
 return <SafeAreaView style={s.safe}><ImageBackground source={{uri:heroArtFor(archetype)}} resizeMode="cover" style={s.ready}><View style={s.readyShade}/><View style={s.readyInner}><View style={{flex:1}}/><Text style={[s.kicker,{color:p.highlight}]}>CALIBRATION COMPLETE</Text><Text style={s.readyTitle}>Your Arc is live.</Text><Text style={s.readySub}>Every trusted workout sharpens what VitalQuest recommends next.</Text><ActionPressable onPress={()=>router.replace('/(tabs)')} style={s.goldButton}><Text style={s.goldButtonText}>ENTER VITALQUEST</Text></ActionPressable></View></ImageBackground></SafeAreaView>
}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#02070B'},bg:{flex:1,backgroundColor:'#02070B'},scroll:{padding:18,paddingBottom:36},shell:{width:'100%',maxWidth:720,alignSelf:'center',gap:18},chrome:{height:42,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{fontSize:38,lineHeight:38,color:'#F3F5F7',fontWeight:'300'},brand:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),color:'#F7F2E8',fontSize:18,letterSpacing:5},step:{fontSize:8,fontWeight:'900',letterSpacing:1.1},header:{gap:5,marginTop:4},title:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:34,lineHeight:39,color:'#F7F2E8',fontWeight:'700'},sub:{fontSize:13,lineHeight:20,color:'#AAB3BF',maxWidth:560},kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.5},worldStack:{gap:12},worldCard:{borderWidth:1.2,borderRadius:20,overflow:'hidden',backgroundColor:'#071019'},worldImage:{width:'100%',aspectRatio:1.8,justifyContent:'flex-end'},worldImageStyle:{borderRadius:19},worldShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,10,.24)'},worldCopy:{padding:18,paddingRight:68,gap:4},worldName:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:30,color:'#FFF9EE',fontWeight:'700'},worldDesc:{fontSize:11,lineHeight:16,color:'#D2D7DE'},worldTag:{fontSize:7,fontWeight:'900',letterSpacing:1.2,marginTop:3},chevron:{position:'absolute',right:16,bottom:18,width:38,height:38,borderRadius:19,borderWidth:1.5,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.38)'},chevronText:{fontSize:33,lineHeight:33,fontWeight:'300'},goldButton:{minHeight:54,borderRadius:14,backgroundColor:'#E7B858',alignItems:'center',justifyContent:'center',paddingHorizontal:18},goldButtonText:{fontSize:11,fontWeight:'900',letterSpacing:.9,color:'#171106'},footerMark:{textAlign:'center',color:'#87909B',fontSize:7,letterSpacing:1.8,marginTop:4},heroCard:{borderWidth:1.2,borderRadius:22,overflow:'hidden',backgroundColor:'#071019'},heroImage:{width:'100%',aspectRatio:.72,justifyContent:'flex-end'},heroImageStyle:{borderRadius:21},heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(1,5,9,.14)'},heroBottom:{padding:24,gap:5,backgroundColor:'rgba(1,5,10,.34)'},heroName:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:34,color:'#FFF9EE',fontWeight:'700'},heroVow:{fontSize:12,color:'#E2E6EB'},eqGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},eqCard:{width:'31%',aspectRatio:1,borderWidth:1,borderRadius:15,alignItems:'center',justifyContent:'center',padding:8,gap:7,position:'relative'},eqText:{fontSize:9,textAlign:'center',fontWeight:'800'},dot:{position:'absolute',top:7,right:7,width:6,height:6,borderRadius:3},goalList:{gap:8},goalRow:{minHeight:70,borderWidth:1,borderRadius:14,flexDirection:'row',alignItems:'center',gap:12,padding:11},goalIcon:{width:42,height:42,borderRadius:12,borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.035)'},goalName:{fontSize:14,fontWeight:'900',color:'#F4F5F7'},goalDesc:{fontSize:9.5,lineHeight:14,color:'#9EA8B4',marginTop:2},check:{fontSize:18,fontWeight:'900'},baseline:{gap:8,marginTop:2},baselineLabel:{fontSize:7,fontWeight:'900',letterSpacing:1.2,color:'#7F8995',marginTop:4},chips:{flexDirection:'row',gap:8},chip:{flex:1,minHeight:42,borderWidth:1,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(7,13,19,.88)',paddingHorizontal:5},chipText:{fontSize:7,fontWeight:'900',letterSpacing:.7,textAlign:'center'},welcome:{flex:1},welcomeShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,6,10,.18)'},welcomeInner:{flex:1,paddingHorizontal:28,paddingTop:24,paddingBottom:30,alignItems:'center'},welcomeBrand:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),color:'#F7F2E8',fontSize:20,letterSpacing:6},welcomeTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:42,lineHeight:45,textAlign:'center',color:'#FFF8EB',fontWeight:'700',textShadowColor:'rgba(0,0,0,.9)',textShadowRadius:12},welcomeSub:{fontSize:14,lineHeight:21,textAlign:'center',color:'#F0F2F4',marginTop:12,marginBottom:20,textShadowColor:'rgba(0,0,0,.9)',textShadowRadius:8},welcomeFoot:{fontSize:7,color:'#D3D8DD',letterSpacing:2.4,marginTop:14},ready:{flex:1},readyShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,6,10,.36)'},readyInner:{flex:1,padding:28,gap:10,justifyContent:'flex-end'},readyTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:40,color:'#FFF9EE',fontWeight:'700'},readySub:{fontSize:13,lineHeight:20,color:'#D7DDE3',marginBottom:8}
});
