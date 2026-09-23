import {router,useLocalSearchParams} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import React,{useMemo,useState} from 'react';
import {ImageBackground,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,View} from 'react-native';
import {ActionPressable,Entrance,hapticTap} from './Interaction';
import {HERO_ARCHETYPES,type HeroArchetype} from './heroEvolution';
import {ARC_GOALS,type TrainingArcGoal} from './trainingBlock';
import {DEFAULT_EQUIPMENT,EQUIPMENT_OPTIONS,type EquipmentId} from './trainingPreferences';
import {firstSessionForGoal,saveOnboardingProfile,type TrainingExperience} from './onboarding';
import {paletteForArchetype,fonts} from './designSystem';
import {IconArt,type VQIconName} from './IconArt';
import BrandLoadingScreen from './BrandLoadingScreen';
import {ART,heroArtForArchetype,worldArtForArchetype} from './artAssets';

type Step=0|1|2|3|4;
const PANEL='rgba(4,10,15,.90)';
const EQ_ICON:Record<EquipmentId,VQIconName>={barbell:'strength',dumbbells:'strength',bench:'strength',rack:'strength',cables:'strength',machines:'strength',pullup:'agility',cardio:'stamina',bodyweight:'streak'};
const EQ_LABEL:Record<EquipmentId,string>={barbell:'Barbell',dumbbells:'Dumbbells',bench:'Bench',rack:'Rack',cables:'Bands / Cables',machines:'Machines',pullup:'Pull-Up Bar',cardio:'Cardio',bodyweight:'Bodyweight'};
const WORLD_COPY:Record<HeroArchetype,{tag:string;vow:string;descriptor:string}>={
 mystic:{tag:'FOCUS · BALANCE · LONGEVITY',vow:'Luminous. Intentional. Ascending.',descriptor:'Moonlit observatories, celestial geometry, quiet power.'},
 athlete:{tag:'DISCIPLINE · PROGRESS · POTENTIAL',vow:'Technical. Powerful. Precise.',descriptor:'Elite performance architecture, precision, measurable growth.'},
 spartan:{tag:'RESILIENCE · STRENGTH · LEGACY',vow:'Forged. Relentless. Enduring.',descriptor:'Bronze, iron, fire and a world built through resilience.'},
};
const EXPERIENCE:Array<{id:TrainingExperience;label:string}>=[
 {id:'BEGINNER',label:'BUILDING BASE'},
 {id:'INTERMEDIATE',label:'CONSISTENT'},
 {id:'ADVANCED',label:'EXPERIENCED'},
];

export default function OnboardingV6(){
 const db=useSQLiteContext();const {reset}=useLocalSearchParams<{reset?:string}>();
 const [step,setStep]=useState<Step>(reset?1:0);
 const [archetype,setArchetype]=useState<HeroArchetype>('athlete');
 const [equipment,setEquipment]=useState<EquipmentId[]>(DEFAULT_EQUIPMENT);
 const [goal,setGoal]=useState<TrainingArcGoal>('HYBRID');
 const [weeklyDays,setWeeklyDays]=useState<3|4|5>(4);
 const [experience,setExperience]=useState<TrainingExperience>('INTERMEDIATE');
 const [saving,setSaving]=useState(false);
 const session=useMemo(()=>firstSessionForGoal(goal,equipment),[goal,equipment]);
 const next=()=>setStep(Math.min(4,step+1) as Step);
 const back=()=>setStep(Math.max(reset?1:0,step-1) as Step);
 const toggle=(id:EquipmentId)=>{hapticTap();setEquipment(cur=>cur.includes(id)?cur.filter(x=>x!==id):[...cur,id])};
 const pickArchetype=(id:HeroArchetype)=>{hapticTap();setArchetype(id)};
 async function finish(){setSaving(true);const safe=equipment.length?equipment:['bodyweight'] as EquipmentId[];await saveOnboardingProfile(db,{goal,archetype,experience,weeklyDays,equipment:safe});setSaving(false);setStep(4)}
 if(saving)return <BrandLoadingScreen variant="calibrating" message="BUILDING YOUR FIRST ARC"/>;
 if(step===0)return <Welcome onStart={next}/>;
 if(step===1)return <Entrance><WorldStep archetype={archetype} pick={pickArchetype} onNext={next} onBack={back}/></Entrance>;
 if(step===2)return <Entrance><BaselineStep archetype={archetype} goal={goal} setGoal={setGoal} weeklyDays={weeklyDays} setWeeklyDays={setWeeklyDays} experience={experience} setExperience={setExperience} equipment={equipment} toggle={toggle} onNext={next} onBack={back}/></Entrance>;
 if(step===3)return <Entrance><TrialStep archetype={archetype} goal={goal} weeklyDays={weeklyDays} experience={experience} equipment={equipment} session={session} onFinish={finish} onBack={back} reset={Boolean(reset)}/></Entrance>;
 return <Ready archetype={archetype} templateId={session.templateId}/>;
}

function Chrome({step,total,onBack}:{step:number;total:number;onBack?:()=>void}){
 return <View style={s.chrome}>
  {onBack?<Pressable onPress={onBack} hitSlop={14}><Text style={s.back}>‹</Text></Pressable>:<View style={{width:24}}/>}
  <Text style={s.brand}>VITALQUEST</Text>
  <Text style={s.stepLabel}>0{step} / 0{total}</Text>
 </View>;
}

function Welcome({onStart}:{onStart:()=>void}){
 return <SafeAreaView style={s.safe}><ImageBackground source={{uri:ART.loading}} resizeMode="cover" style={s.welcome}>
  <View style={s.welcomeShade}/>
  <View style={s.welcomeInner}>
   <Text style={s.welcomeBrand}>VITALQUEST</Text><View style={{flex:1}}/>
   <Entrance delay={120}><Text style={s.welcomeTitle}>Build Your Hero{`\n`}Through Real Work</Text></Entrance>
   <Entrance delay={220}><Text style={s.welcomeSub}>Train with purpose. Track what changes. Become more.</Text></Entrance>
   <Entrance delay={320}><ActionPressable onPress={onStart} style={s.goldButton}><Text style={s.goldButtonText}>BEGIN YOUR ARC</Text></ActionPressable></Entrance>
   <Text style={s.welcomeFoot}>60 SECONDS TO YOUR FIRST TRIAL</Text>
  </View>
 </ImageBackground></SafeAreaView>;
}

function WorldStep({archetype,pick,onNext,onBack}:{archetype:HeroArchetype;pick:(v:HeroArchetype)=>void;onNext:()=>void;onBack:()=>void}){
 const p=paletteForArchetype(archetype);
 return <SafeAreaView style={s.safe}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
  <View style={s.shell}>
   <Chrome step={1} total={3} onBack={onBack}/>
   <View style={s.header}><Text style={s.title}>Choose Your World</Text><Text style={s.sub}>The work stays real. The world changes how the journey feels — and the hero it builds.</Text></View>
   <View style={s.worldStack}>
    {(Object.keys(HERO_ARCHETYPES) as HeroArchetype[]).map((id,i)=><Entrance key={id} delay={i*90}><WorldCard id={id} active={id===archetype} onPress={()=>pick(id)}/></Entrance>)}
   </View>
   <Entrance delay={300}>
    <View style={[s.heroPreview,{borderColor:p.highlight}]}>
     <ImageBackground source={{uri:heroArtForArchetype(archetype)}} resizeMode="cover" style={s.heroImage} imageStyle={s.rounded}>
      <View style={s.heroShade}/>
      <View style={s.heroBottom}>
       <Text style={[s.kicker,{color:p.highlight}]}>YOUR ARCHETYPE</Text>
       <Text style={s.heroName}>{HERO_ARCHETYPES[archetype].name.toUpperCase()}</Text>
       <Text style={s.heroVow}>{WORLD_COPY[archetype].vow}</Text>
      </View>
     </ImageBackground>
    </View>
   </Entrance>
   <ActionPressable onPress={onNext} style={s.goldButton}><Text style={s.goldButtonText}>SELECT THIS PATH</Text></ActionPressable>
  </View>
 </ScrollView></SafeAreaView>;
}

function WorldCard({id,active,onPress}:{id:HeroArchetype;active:boolean;onPress:()=>void}){
 const p=paletteForArchetype(id);
 return <Pressable onPress={onPress} style={[s.worldCard,{borderColor:active?p.highlight:'rgba(255,255,255,.16)'}]}>
  <ImageBackground source={{uri:worldArtForArchetype(id)}} resizeMode="cover" style={s.worldImage} imageStyle={s.rounded}>
   <View style={s.worldShade}/>
   <View style={s.worldCopy}>
    <Text style={[s.kicker,{color:active?p.highlight:'#D9DDE3'}]}>{active?'YOUR WORLD':'SELECT PATH'}</Text>
    <Text style={s.worldName}>{HERO_ARCHETYPES[id].name.toUpperCase()}</Text>
    <Text style={s.worldDesc}>{WORLD_COPY[id].descriptor}</Text>
   </View>
   <Text style={[s.chevron,{color:p.highlight}]}>›</Text>
  </ImageBackground>
 </Pressable>;
}

function BaselineStep({archetype,goal,setGoal,weeklyDays,setWeeklyDays,experience,setExperience,equipment,toggle,onNext,onBack}:{archetype:HeroArchetype;goal:TrainingArcGoal;setGoal:(v:TrainingArcGoal)=>void;weeklyDays:3|4|5;setWeeklyDays:(v:3|4|5)=>void;experience:TrainingExperience;setExperience:(v:TrainingExperience)=>void;equipment:EquipmentId[];toggle:(id:EquipmentId)=>void;onNext:()=>void;onBack:()=>void}){
 const p=paletteForArchetype(archetype);
 const pickGoal=(id:TrainingArcGoal)=>{hapticTap();setGoal(id)};
 const iconFor=(id:TrainingArcGoal):VQIconName=>id==='STRENGTH'?'strength':id==='CONDITIONING'?'stamina':id==='REBUILD'?'agility':'trophy';
 return <SafeAreaView style={s.safe}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
  <View style={s.shell}>
   <Chrome step={2} total={3} onBack={onBack}/>
   <View style={s.header}><Text style={[s.kicker,{color:p.highlight}]}>FORGE YOUR BASELINE</Text><Text style={s.title}>What should training change first?</Text><Text style={s.sub}>Thirty seconds of honesty now; VitalQuest adapts everything after from real evidence.</Text></View>
   <View style={s.goalList}>{ARC_GOALS.map(item=>{const active=item.id===goal;return <Pressable key={item.id} onPress={()=>pickGoal(item.id)} style={[s.goalRow,{borderColor:active?p.highlight:'rgba(255,255,255,.12)',backgroundColor:active?'rgba(215,165,55,.12)':PANEL}]}><View style={s.goalIcon}><IconArt name={iconFor(item.id)} size={22} tint={active?p.highlight:'#DDE2E8'}/></View><View style={{flex:1}}><Text style={s.goalName}>{item.label}</Text><Text style={s.goalDesc}>{item.description}</Text></View>{active?<Text style={[s.check,{color:p.highlight}]}>✓</Text>:null}</Pressable>})}</View>
   <Text style={s.fieldLabel}>TRAINING DAYS</Text>
   <View style={s.chips}>{([3,4,5] as const).map(v=><Pressable key={v} onPress={()=>{hapticTap();setWeeklyDays(v)}} style={[s.chip,{borderColor:weeklyDays===v?p.highlight:'rgba(255,255,255,.15)'}]}><Text style={[s.chipText,{color:weeklyDays===v?p.highlight:'#DDE2E8'}]}>{v} / WEEK</Text></Pressable>)}</View>
   <Text style={s.fieldLabel}>EXPERIENCE</Text>
   <View style={s.chips}>{EXPERIENCE.map(e=><Pressable key={e.id} onPress={()=>{hapticTap();setExperience(e.id)}} style={[s.chip,{borderColor:experience===e.id?p.highlight:'rgba(255,255,255,.15)'}]}><Text style={[s.chipText,{color:experience===e.id?p.highlight:'#DDE2E8'}]}>{e.label}</Text></Pressable>)}</View>
   <Text style={s.fieldLabel}>YOUR EQUIPMENT</Text>
   <View style={s.eqGrid}>{EQUIPMENT_OPTIONS.map(item=>{const active=equipment.includes(item.id);return <Pressable key={item.id} onPress={()=>toggle(item.id)} style={[s.eqCard,{borderColor:active?p.highlight:'rgba(255,255,255,.10)',backgroundColor:active?'rgba(215,165,55,.12)':PANEL}]}><IconArt name={EQ_ICON[item.id]} size={30} tint={active?p.highlight:'#F3F5F7'}/><Text style={[s.eqText,{color:active?p.highlight:'#F3F5F7'}]}>{EQ_LABEL[item.id]}</Text></Pressable>})}</View>
   <ActionPressable onPress={onNext} style={s.goldButton}><Text style={s.goldButtonText}>CONTINUE</Text></ActionPressable>
  </View>
 </ScrollView></SafeAreaView>;
}

function TrialStep({archetype,goal,weeklyDays,experience,equipment,session,onFinish,onBack,reset}:{archetype:HeroArchetype;goal:TrainingArcGoal;weeklyDays:3|4|5;experience:TrainingExperience;equipment:EquipmentId[];session:{templateId:string;name:string;reason:string};onFinish:()=>void;onBack:()=>void;reset:boolean}){
 const p=paletteForArchetype(archetype);const goalInfo=ARC_GOALS.find(x=>x.id===goal)!;
 const sessionIcon:VQIconName=session.templateId==='run'?'agility':session.templateId==='recovery'?'streak':'strength';
 return <SafeAreaView style={s.safe}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
  <View style={s.shell}>
   <Chrome step={3} total={3} onBack={onBack}/>
   <View style={s.header}><Text style={[s.kicker,{color:p.highlight}]}>YOUR FIRST TRIAL</Text><Text style={s.title}>One session. Real evidence.</Text><Text style={s.sub}>Complete this trial and VitalQuest banks verified XP, updates your hero, and starts adapting your Arc.</Text></View>
   <View style={[s.trialCard,{borderColor:p.highlight}]}>
    <ImageBackground source={{uri:worldArtForArchetype(archetype)}} resizeMode="cover" style={s.trialArt} imageStyle={s.rounded}>
     <View style={s.trialShade}/>
     <View style={s.trialCopy}>
      <View style={s.trialRow}><IconArt name={sessionIcon} size={40} tint={p.highlight}/><View style={{flex:1}}><Text style={[s.micro,{color:p.highlight}]}>RECOMMENDED FIRST SESSION</Text><Text style={s.trialName}>{session.name}</Text></View></View>
      <Text style={s.trialReason}>{session.reason}</Text>
      <View style={s.trialMeta}>
       <Meta value={goalInfo.label} label="ARC DIRECTION"/>
       <Meta value={`${weeklyDays}× / WEEK`} label="AVAILABILITY"/>
       <Meta value={experience.replace('_',' ')} label="BASELINE"/>
       <Meta value={`${equipment.length} TYPES`} label="EQUIPMENT"/>
      </View>
     </View>
    </ImageBackground>
   </View>
   <ActionPressable onPress={onFinish} style={s.goldButton}><Text style={s.goldButtonText}>{reset?'RECALIBRATE ARC':'BUILD MY ARC'}</Text></ActionPressable>
  </View>
 </ScrollView></SafeAreaView>;
}

function Ready({archetype,templateId}:{archetype:HeroArchetype;templateId:string}){
 const p=paletteForArchetype(archetype);
 return <SafeAreaView style={s.safe}><ImageBackground source={{uri:heroArtForArchetype(archetype)}} resizeMode="cover" style={s.ready}>
  <View style={s.readyShade}/>
  <View style={s.readyInner}><View style={{flex:1}}/>
   <Entrance delay={100}><Text style={[s.kicker,{color:p.highlight}]}>CALIBRATION COMPLETE</Text></Entrance>
   <Entrance delay={200}><Text style={s.readyTitle}>Your Arc is live.{"\n"}Your hero is waiting.</Text></Entrance>
   <Entrance delay={300}><Text style={s.readySub}>Your first trial is ready. Finish it and watch verified XP forge your hero — that is the whole game.</Text></Entrance>
   <Entrance delay={420}><ActionPressable onPress={()=>router.replace({pathname:'/workout',params:{templateId}})} style={s.goldButton}><Text style={s.goldButtonText}>START FIRST TRIAL</Text></ActionPressable></Entrance>
   <Entrance delay={500}><ActionPressable onPress={()=>router.replace('/(tabs)')} style={s.ghostButton}><Text style={s.ghostButtonText}>EXPLORE FIRST</Text></ActionPressable></Entrance>
  </View>
 </ImageBackground></SafeAreaView>;
}

function Meta({value,label}:{value:string;label:string}){
 return <View style={s.meta}><Text style={s.metaValue}>{value}</Text><Text style={s.metaLabel}>{label}</Text></View>;
}

const serif=fonts.display;
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#02070B'},
 scroll:{padding:18,paddingBottom:36},
 shell:{width:'100%',maxWidth:720,alignSelf:'center',gap:16},
 chrome:{height:42,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 back:{fontSize:38,lineHeight:38,color:'#F3F5F7'},
 brand:{fontFamily:serif,color:'#F7F2E8',fontSize:18,letterSpacing:5},
 stepLabel:{fontSize:9,fontWeight:'900',letterSpacing:1.1,color:'#AAB3BF'},
 header:{gap:5},
 kicker:{fontSize:9,fontWeight:'900',letterSpacing:1.5},
 micro:{fontSize:9,fontWeight:'900',letterSpacing:1},
 title:{fontFamily:serif,fontSize:34,lineHeight:39,color:'#F7F2E8',fontWeight:'700'},
 sub:{fontSize:13,lineHeight:20,color:'#AAB3BF'},
 worldStack:{gap:12},
 worldCard:{borderWidth:1.2,borderRadius:20,overflow:'hidden',backgroundColor:'#071019'},
 worldImage:{width:'100%',aspectRatio:1.9,justifyContent:'flex-end'},
 rounded:{borderRadius:19},
 worldShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,10,.30)'},
 worldCopy:{padding:18,paddingRight:58,gap:4},
 worldName:{fontFamily:serif,fontSize:30,color:'#FFF9EE',fontWeight:'700'},
 worldDesc:{fontSize:11,lineHeight:16,color:'#D2D7DE'},
 chevron:{position:'absolute',right:18,bottom:22,fontSize:40,fontWeight:'300'},
 heroPreview:{borderWidth:1.2,borderRadius:22,overflow:'hidden',backgroundColor:'#071019',marginTop:2},
 heroImage:{width:'100%',aspectRatio:1.15,justifyContent:'flex-end'},
 heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(1,5,9,.10)'},
 heroBottom:{padding:20,gap:5,backgroundColor:'rgba(1,5,10,.44)'},
 heroName:{fontFamily:serif,fontSize:30,color:'#FFF9EE',fontWeight:'700'},
 heroVow:{fontSize:12,color:'#E2E6EB'},
 goalList:{gap:10},
 goalRow:{borderWidth:1,borderRadius:15,padding:13,flexDirection:'row',alignItems:'center',gap:12},
 goalIcon:{width:42,height:42,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.035)'},
 goalName:{fontSize:14,fontWeight:'900',color:'#F5F2EC'},
 goalDesc:{fontSize:9,lineHeight:14,color:'#9FA8B3',marginTop:3},
 check:{fontSize:20,fontWeight:'900'},
 fieldLabel:{fontSize:9,fontWeight:'900',letterSpacing:1.1,color:'#86919E',marginTop:6},
 chips:{flexDirection:'row',gap:8,flexWrap:'wrap'},
 chip:{borderWidth:1,borderRadius:999,paddingHorizontal:12,paddingVertical:10,backgroundColor:PANEL},
 chipText:{fontSize:9.5,fontWeight:'900'},
 eqGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},
 eqCard:{width:'31%',aspectRatio:1,borderWidth:1,borderRadius:15,alignItems:'center',justifyContent:'center',gap:9},
 eqText:{fontSize:9,fontWeight:'900',textAlign:'center'},
 trialCard:{borderWidth:1.2,borderRadius:20,overflow:'hidden',backgroundColor:'#071019'},
 trialArt:{minHeight:380,justifyContent:'flex-end'},
 trialShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,8,.45)'},
 trialCopy:{padding:20,gap:12},
 trialRow:{flexDirection:'row',alignItems:'center',gap:14},
 trialName:{fontFamily:serif,fontSize:26,color:'#FFF9EE',fontWeight:'700',marginTop:4},
 trialReason:{fontSize:11,lineHeight:17,color:'#D2D7DE'},
 trialMeta:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4},
 meta:{minWidth:120,flex:1,borderWidth:1,borderColor:'rgba(255,255,255,.14)',borderRadius:12,padding:11,backgroundColor:'rgba(3,7,10,.58)'},
 metaValue:{fontSize:13,fontWeight:'900',color:'#FFF'},
 metaLabel:{fontSize:9,fontWeight:'900',letterSpacing:.7,color:'#B5BBC2',marginTop:3},
 goldButton:{minHeight:54,borderRadius:14,backgroundColor:'#E7B858',alignItems:'center',justifyContent:'center',paddingHorizontal:18},
 goldButtonText:{fontSize:11,fontWeight:'900',letterSpacing:.9,color:'#171106'},
 ghostButton:{minHeight:52,borderRadius:14,borderWidth:1,borderColor:'rgba(255,255,255,.25)',alignItems:'center',justifyContent:'center',marginTop:10},
 ghostButtonText:{fontSize:9,fontWeight:'900',letterSpacing:.9,color:'#FFF'},
 welcome:{flex:1},
 welcomeShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,8,.30)'},
 welcomeInner:{flex:1,padding:28,paddingBottom:42,alignItems:'center'},
 welcomeBrand:{fontFamily:serif,fontSize:23,letterSpacing:6,color:'#FFF9EE',marginTop:22},
 welcomeTitle:{fontFamily:serif,fontSize:38,lineHeight:42,fontWeight:'700',color:'#FFF9EE',textAlign:'center'},
 welcomeSub:{fontSize:13,lineHeight:20,color:'#E0E4E8',textAlign:'center',marginTop:10,marginBottom:20,maxWidth:340},
 welcomeFoot:{fontSize:9,letterSpacing:2.5,color:'rgba(255,255,255,.62)',marginTop:18},
 ready:{flex:1},
 readyShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,8,.35)'},
 readyInner:{flex:1,padding:28,paddingBottom:42},
 readyTitle:{fontFamily:serif,fontSize:38,lineHeight:43,fontWeight:'700',color:'#FFF9EE',marginTop:7},
 readySub:{fontSize:13,lineHeight:20,color:'#E1E5E9',marginTop:8,marginBottom:18,maxWidth:420},
});
