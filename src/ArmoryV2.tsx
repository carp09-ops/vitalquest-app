import React,{useState} from 'react';
import { ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { armory } from './data';
import { IconArt } from './IconArt';
import { themes, ThemeId } from './theme';
import { useProgressionSnapshot } from './useProgression';
import { useVitalTheme } from './ThemeProvider';

type Tab='Gear'|'Badges'|'Titles'|'Worlds';
const tabs:Tab[]=['Gear','Badges','Titles','Worlds'];
const art:Record<ThemeId,string>={mythicForge:'/vitalquest-app/art/premium/mythic-hero.jpg',celestialPulse:'/vitalquest-app/art/today-celestial-premium.webp',titanCore:'/vitalquest-app/art/today-titan-premium.webp'};

export default function ArmoryV2(){
  const {theme,themeId,setThemeId}=useVitalTheme();const {snapshot}=useProgressionSnapshot();const t=theme.tokens;const {width}=useWindowDimensions();const wide=width>=760;const [tab,setTab]=useState<Tab>('Gear');
  return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page,wide&&styles.pageWide]}><View style={styles.shell}>
    <View style={styles.header}><View style={{flex:1}}><Text style={[styles.eyebrow,{color:t.accent}]}>REWARD REGISTRY</Text><Text style={[styles.title,{color:t.text}]}>The Armory</Text><Text style={[styles.lede,{color:t.muted}]}>Wear the proof. Display what your training has earned.</Text></View><View style={[styles.currency,{borderColor:t.border,backgroundColor:t.surface}]}><IconArt name="xp" size={28}/><View><Text style={[styles.currencyLabel,{color:t.muted}]}>LIFETIME XP</Text><Text style={[styles.currencyValue,{color:t.text}]}>{snapshot.totalXP.toLocaleString()}</Text></View></View></View>
    <View style={[styles.tabs,{borderColor:t.border,backgroundColor:t.surface}]}>{tabs.map(item=>{const active=item===tab;return <Pressable key={item} onPress={()=>setTab(item)} style={[styles.tab,active&&{backgroundColor:t.surfaceElevated,borderColor:t.accentSoft}]}><Text style={[styles.tabText,{color:active?t.accent:t.muted}]}>{item.toUpperCase()}</Text></Pressable>})}</View>
    {tab==='Worlds'?<View style={styles.worldStack}>{(Object.keys(themes) as ThemeId[]).map(id=>{const item=themes[id];const active=id===themeId;return <Pressable key={id} onPress={()=>setThemeId(id)}><View style={[styles.worldCard,{borderColor:active?item.tokens.accent:item.tokens.border,backgroundColor:item.tokens.surface}]}><ImageBackground source={{uri:art[id]}} resizeMode="cover" style={styles.worldArt}><View style={styles.worldShade}/><View style={styles.worldCopy}><Text style={[styles.eyebrow,{color:item.tokens.accent}]}>{active?'ACTIVE WORLD':'AVAILABLE WORLD'}</Text><Text style={[styles.worldName,{color:item.tokens.text}]}>{item.name}</Text><Text style={[styles.worldTag,{color:item.tokens.text}]}>{item.tagline}</Text></View></ImageBackground><View style={styles.worldFooter}><Text style={[styles.worldFlavor,{color:item.tokens.muted}]}>{item.flavor}</Text><Text style={[styles.apply,{color:item.tokens.accent}]}>{active?'EQUIPPED':'EQUIP WORLD  ›'}</Text></View></View></Pressable>})}</View>:<RewardGrid tab={tab} wide={wide}/>} 
  </View></ScrollView></SafeAreaView>
}

function RewardGrid({tab,wide}:{tab:Exclude<Tab,'Worlds'>;wide:boolean}){
  const {theme}=useVitalTheme();const {snapshot}=useProgressionSnapshot();const t=theme.tokens;
  const items=armory.filter(item=>tab==='Gear'?['Head','Chest','Legs','Aura'].includes(item.kind):tab==='Titles'?item.kind==='Title':item.kind==='Badge');
  const stateFor=(name:string)=>{
    if(name==='Iron Initiate') return snapshot.unlocks.ironInitiate?'unlocked':'locked';
    if(name==='The Relentless') return snapshot.unlocks.relentless?'unlocked':'locked';
    if(name==='The Restored') return snapshot.unlocks.restored?'unlocked':snapshot.recoveryCount>0?'progress':'locked';
    if(name==='Forged Helm') return snapshot.unlocks.forgedHelm?'unlocked':snapshot.workoutCount>0?'progress':'locked';
    if(name==='Titan Plate') return snapshot.unlocks.titanPlate?'unlocked':snapshot.totalVolume>0?'progress':'locked';
    if(name==='Roadrunner Greaves') return snapshot.unlocks.roadrunnerGreaves?'unlocked':snapshot.lifetimeMiles>0?'progress':'locked';
    if(name==='Ember Aura') return snapshot.totalXP>=5000?'unlocked':snapshot.totalXP>0?'progress':'locked';
    return 'locked';
  };
  const requirementFor=(name:string)=>{
    if(name==='Iron Initiate') return `${Math.min(snapshot.workoutCount,1)} / 1 workout`;
    if(name==='The Relentless') return `${Math.min(snapshot.streakDays,7)} / 7 day streak`;
    if(name==='The Restored') return `${Math.min(snapshot.recoveryCount,5)} / 5 recovery protocols`;
    if(name==='Forged Helm') return `${Math.min(snapshot.workoutCount,10)} / 10 workouts`;
    if(name==='Titan Plate') return `${Math.min(Math.round(snapshot.totalVolume),100000).toLocaleString()} / 100,000 lb`;
    if(name==='Roadrunner Greaves') return `${Math.min(snapshot.lifetimeMiles,25).toFixed(1)} / 25.0 miles`;
    if(name==='Ember Aura') return `${Math.min(snapshot.totalXP,5000).toLocaleString()} / 5,000 XP`;
    return 'Requirement hidden';
  };
  const unlocked=items.filter(i=>stateFor(i.name)==='unlocked').length;
  return <View><View style={styles.sectionHead}><View><Text style={[styles.eyebrow,{color:t.accent}]}>{tab.toUpperCase()} VAULT</Text><Text style={[styles.sectionTitle,{color:t.text}]}>Collected rewards</Text></View><Text style={[styles.count,{color:t.muted}]}>{unlocked} / {items.length} UNLOCKED</Text></View><View style={[styles.grid,wide&&styles.gridWide]}>{items.map((item,index)=>{const state=stateFor(item.name);return <View key={item.name} style={[styles.item,{borderColor:state==='unlocked'?t.accentSoft:t.border,backgroundColor:t.surface},state==='locked'&&{opacity:.48}]}><View style={styles.itemTop}><IconArt name={index%2===0?'armory':'trophy'} size={54}/><Text style={[styles.state,{color:state==='unlocked'?t.accent:t.muted}]}>{state==='unlocked'?'UNLOCKED':state==='progress'?'IN PROGRESS':'LOCKED'}</Text></View><Text style={[styles.kind,{color:t.muted}]}>{item.kind.toUpperCase()}</Text><Text style={[styles.name,{color:t.text}]}>{item.name}</Text><Text style={[styles.itemCopy,{color:t.muted}]}>{state==='unlocked'?'Earned through real-world progression.':requirementFor(item.name)}</Text></View>})}</View></View>
}

const styles=StyleSheet.create({safe:{flex:1},page:{padding:14,paddingBottom:120},pageWide:{padding:24},shell:{width:'100%',maxWidth:1120,alignSelf:'center',gap:16},header:{flexDirection:'row',alignItems:'flex-start',gap:14},eyebrow:{fontSize:8,fontWeight:'900',letterSpacing:1.5},title:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:36,fontWeight:'900',marginTop:5},lede:{fontSize:11,lineHeight:17,marginTop:5,maxWidth:560},currency:{borderWidth:1,borderRadius:14,padding:10,flexDirection:'row',alignItems:'center',gap:8},currencyLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.9},currencyValue:{fontSize:14,fontWeight:'900',marginTop:2},tabs:{flexDirection:'row',borderWidth:1,borderRadius:14,padding:4,gap:4},tab:{flex:1,minHeight:42,borderWidth:1,borderColor:'transparent',borderRadius:10,alignItems:'center',justifyContent:'center'},tabText:{fontSize:8,fontWeight:'900',letterSpacing:.8},sectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginBottom:12},sectionTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:23,fontWeight:'800',marginTop:4},count:{fontSize:7,fontWeight:'900',letterSpacing:.9},grid:{gap:10},gridWide:{flexDirection:'row',flexWrap:'wrap'},item:{borderWidth:1,borderRadius:17,padding:15,minHeight:210},itemTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},state:{fontSize:7,fontWeight:'900',letterSpacing:.9},kind:{fontSize:7,fontWeight:'900',letterSpacing:1.1,marginTop:18},name:{fontSize:18,fontWeight:'900',marginTop:4},itemCopy:{fontSize:9.5,lineHeight:15,marginTop:7},worldStack:{gap:12},worldCard:{overflow:'hidden',borderWidth:1,borderRadius:18},worldArt:{height:260,justifyContent:'flex-end'},worldShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.35)'},worldCopy:{padding:18,maxWidth:600},worldName:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:28,fontWeight:'900',marginTop:4,textShadowColor:'rgba(0,0,0,.8)',textShadowOffset:{width:0,height:2},textShadowRadius:8},worldTag:{fontSize:11,fontWeight:'700',marginTop:6,textShadowColor:'rgba(0,0,0,.8)',textShadowOffset:{width:0,height:1},textShadowRadius:6},worldFooter:{padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},worldFlavor:{fontSize:9},apply:{fontSize:8,fontWeight:'900',letterSpacing:.9}});
