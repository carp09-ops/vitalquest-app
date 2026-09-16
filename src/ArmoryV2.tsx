import React,{useState} from 'react';
import { ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { armory } from './data';
import { IconArt } from './IconArt';
import { progressionRules } from './progressionRules';
import { ProgressionSnapshot } from './progression';
import { deriveHeroEvolution } from './heroEvolution';
import { useHeroArchetype } from './useHeroArchetype';
import { useProgressionSnapshot } from './useProgression';
import { useVitalTheme } from './ThemeProvider';

type Tab='Gear'|'Badges'|'Titles';
const tabs:Tab[]=['Gear','Badges','Titles'];
const archetypeArt={mystic:'/vitalquest-app/art/premium/mythic-hero.jpg',athlete:'/vitalquest-app/art/today-celestial-premium.webp',spartan:'/vitalquest-app/art/today-titan-premium.webp'} as const;
const archetypeAccent={mystic:'#6FC8C0',athlete:'#6FAEFF',spartan:'#B58A55'} as const;

export default function ArmoryV2(){
  const {theme}=useVitalTheme();const {snapshot}=useProgressionSnapshot();const {archetype}=useHeroArchetype();const hero=deriveHeroEvolution(snapshot,archetype);const t=theme.tokens;const {width}=useWindowDimensions();const wide=width>=760;const [tab,setTab]=useState<Tab>('Gear');const accent=archetypeAccent[archetype];
  return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page,wide&&styles.pageWide]}><View style={styles.shell}>
    <View style={styles.header}><View style={{flex:1}}><Text style={[styles.eyebrow,{color:t.accent}]}>ARMORY</Text><Text style={[styles.title,{color:t.text}]}>What your work has earned.</Text><Text style={[styles.lede,{color:t.muted}]}>Gear, badges and titles stay locked until your real progression unlocks them.</Text></View><View style={[styles.currency,{borderColor:t.border,backgroundColor:t.surface}]}><IconArt name="xp" size={28}/><View><Text style={[styles.currencyLabel,{color:t.muted}]}>LIFETIME XP</Text><Text style={[styles.currencyValue,{color:t.text}]}>{snapshot.totalXP.toLocaleString()}</Text></View></View></View>

    <View style={[styles.loadout,{borderColor:t.border,backgroundColor:t.surface}]}><ImageBackground source={{uri:archetypeArt[archetype]}} resizeMode="cover" style={[styles.loadoutArt,wide&&styles.loadoutArtWide]} imageStyle={{opacity:.96}}><View style={styles.shade}/><View style={styles.loadoutTop}><View style={[styles.pathPill,{borderColor:`${accent}88`,backgroundColor:'rgba(7,12,17,.72)'}]}><Text style={[styles.pathText,{color:accent}]}>{hero.archetypeName.toUpperCase()} · FORM {hero.formTier}</Text></View></View><View style={styles.loadoutCopy}><Text style={[styles.eyebrow,{color:'#F2F5F7'}]}>CURRENT LOADOUT</Text><Text style={styles.loadoutTitle}>{hero.gear}</Text><Text style={styles.loadoutSub}>{hero.title} · {hero.physique}</Text></View></ImageBackground><View style={styles.loadoutHud}><View><Text style={[styles.metaLabel,{color:t.muted}]}>ENVIRONMENT</Text><Text style={[styles.metaValue,{color:t.text}]}>{hero.environment}</Text></View><View><Text style={[styles.metaLabel,{color:t.muted}]}>DOMINANT TRAIT</Text><Text style={[styles.metaValue,{color:accent}]}>{hero.dominantAttribute.toUpperCase()}</Text></View><IconArt name="armory" size={44}/></View></View>

    <View style={[styles.tabs,{borderColor:t.border,backgroundColor:t.surface}]}>{tabs.map(item=>{const active=item===tab;return <Pressable key={item} onPress={()=>setTab(item)} style={[styles.tab,active&&{backgroundColor:t.surfaceElevated,borderColor:t.accentSoft}]}><Text style={[styles.tabText,{color:active?t.accent:t.muted}]}>{item.toUpperCase()}</Text></Pressable>})}</View>
    <RewardGrid tab={tab} wide={wide} snapshot={snapshot}/>
  </View></ScrollView></SafeAreaView>
}

function RewardGrid({tab,wide,snapshot}:{tab:Tab;wide:boolean;snapshot:ProgressionSnapshot}){
  const {theme}=useVitalTheme();const t=theme.tokens;const u=progressionRules.unlocks;
  const items=armory.filter(item=>tab==='Gear'?['Head','Chest','Legs','Aura'].includes(item.kind):tab==='Titles'?item.kind==='Title':item.kind==='Badge');
  const stateFor=(name:string)=>{
    if(name==='Iron Initiate') return snapshot.unlocks.ironInitiate?'unlocked':'locked';
    if(name==='The Relentless') return snapshot.unlocks.relentless?'unlocked':snapshot.streakDays>0?'progress':'locked';
    if(name==='The Restored') return snapshot.unlocks.restored?'unlocked':snapshot.recoveryCount>0?'progress':'locked';
    if(name==='Forged Helm') return snapshot.unlocks.forgedHelm?'unlocked':snapshot.workoutCount>0?'progress':'locked';
    if(name==='Titan Plate') return snapshot.unlocks.titanPlate?'unlocked':snapshot.totalVolume>0?'progress':'locked';
    if(name==='Roadrunner Greaves') return snapshot.unlocks.roadrunnerGreaves?'unlocked':snapshot.lifetimeMiles>0?'progress':'locked';
    if(name==='Ember Aura') return snapshot.unlocks.emberAura?'unlocked':snapshot.totalXP>0?'progress':'locked';
    return 'locked';
  };
  const requirementFor=(name:string)=>{
    if(name==='Iron Initiate') return `${Math.min(snapshot.workoutCount,u.ironInitiate.target)} / ${u.ironInitiate.target} workout`;
    if(name==='The Relentless') return `${Math.min(snapshot.streakDays,u.relentless.target)} / ${u.relentless.target} day streak`;
    if(name==='The Restored') return `${Math.min(snapshot.recoveryCount,u.restored.target)} / ${u.restored.target} recovery protocols`;
    if(name==='Forged Helm') return `${Math.min(snapshot.workoutCount,u.forgedHelm.target)} / ${u.forgedHelm.target} workouts`;
    if(name==='Titan Plate') return `${Math.min(Math.round(snapshot.totalVolume),u.titanPlate.target).toLocaleString()} / ${u.titanPlate.target.toLocaleString()} lb`;
    if(name==='Roadrunner Greaves') return `${Math.min(snapshot.lifetimeMiles,u.roadrunnerGreaves.target).toFixed(1)} / ${u.roadrunnerGreaves.target.toFixed(1)} miles`;
    if(name==='Ember Aura') return `${Math.min(snapshot.totalXP,u.emberAura.target).toLocaleString()} / ${u.emberAura.target.toLocaleString()} XP`;
    return 'Requirement hidden';
  };
  const unlocked=items.filter(i=>stateFor(i.name)==='unlocked').length;
  return <View><View style={styles.sectionHead}><View><Text style={[styles.eyebrow,{color:t.accent}]}>{tab.toUpperCase()}</Text><Text style={[styles.sectionTitle,{color:t.text}]}>Collected rewards</Text></View><Text style={[styles.count,{color:t.muted}]}>{unlocked} / {items.length} UNLOCKED</Text></View><View style={[styles.grid,wide&&styles.gridWide]}>{items.map((item,index)=>{const state=stateFor(item.name);return <View key={item.name} style={[styles.item,{borderColor:state==='unlocked'?t.accentSoft:t.border,backgroundColor:t.surface},state==='locked'&&{opacity:.48}]}><View style={styles.itemTop}><IconArt name={index%2===0?'armory':'trophy'} size={52}/><Text style={[styles.state,{color:state==='unlocked'?t.accent:t.muted}]}>{state==='unlocked'?'UNLOCKED':state==='progress'?'IN PROGRESS':'LOCKED'}</Text></View><Text style={[styles.kind,{color:t.muted}]}>{item.kind.toUpperCase()}</Text><Text style={[styles.name,{color:t.text}]}>{item.name}</Text><Text style={[styles.itemCopy,{color:t.muted}]}>{state==='unlocked'?'Earned through real-world progression.':requirementFor(item.name)}</Text></View>})}</View></View>
}

const styles=StyleSheet.create({safe:{flex:1},page:{padding:14,paddingBottom:120},pageWide:{padding:24},shell:{width:'100%',maxWidth:1120,alignSelf:'center',gap:16},header:{flexDirection:'row',alignItems:'flex-start',gap:14},eyebrow:{fontSize:8,fontWeight:'900',letterSpacing:1.5},title:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:36,fontWeight:'900',marginTop:5},lede:{fontSize:11,lineHeight:17,marginTop:5,maxWidth:560},currency:{borderWidth:1,borderRadius:14,padding:10,flexDirection:'row',alignItems:'center',gap:8},currencyLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.9},currencyValue:{fontSize:14,fontWeight:'900',marginTop:2},loadout:{overflow:'hidden',borderWidth:1,borderRadius:22},loadoutArt:{height:300,justifyContent:'space-between'},loadoutArtWide:{height:390},shade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,7,10,.42)'},loadoutTop:{padding:16,alignItems:'flex-start'},pathPill:{borderWidth:1,borderRadius:999,paddingHorizontal:10,paddingVertical:6},pathText:{fontSize:7,fontWeight:'900',letterSpacing:1},loadoutCopy:{padding:22,maxWidth:650},loadoutTitle:{color:'#FFFFFF',fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:32,fontWeight:'900',marginTop:5,textShadowColor:'rgba(0,0,0,.82)',textShadowOffset:{width:0,height:2},textShadowRadius:8},loadoutSub:{color:'#E7EDF3',fontSize:11,fontWeight:'700',marginTop:7,textShadowColor:'rgba(0,0,0,.72)',textShadowOffset:{width:0,height:1},textShadowRadius:5},loadoutHud:{padding:15,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:14},metaLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.9},metaValue:{fontSize:13,fontWeight:'900',marginTop:3},tabs:{flexDirection:'row',borderWidth:1,borderRadius:14,padding:4,gap:4},tab:{flex:1,minHeight:42,borderWidth:1,borderColor:'transparent',borderRadius:10,alignItems:'center',justifyContent:'center'},tabText:{fontSize:8,fontWeight:'900',letterSpacing:.8},sectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginBottom:12},sectionTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:23,fontWeight:'800',marginTop:4},count:{fontSize:7,fontWeight:'900',letterSpacing:.9},grid:{gap:10},gridWide:{flexDirection:'row',flexWrap:'wrap'},item:{borderWidth:1,borderRadius:17,padding:15,minHeight:210},itemTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},state:{fontSize:7,fontWeight:'900',letterSpacing:.9},kind:{fontSize:7,fontWeight:'900',letterSpacing:1.1,marginTop:18},name:{fontSize:18,fontWeight:'900',marginTop:4},itemCopy:{fontSize:9.5,lineHeight:15,marginTop:7}});
