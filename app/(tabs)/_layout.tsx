import { router, Tabs, useSegments } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React,{useEffect,useRef,useState} from 'react';
import { Animated,Easing,Image,Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { IconArt, VQIconName } from '../../src/IconArt';
import { useVitalTheme } from '../../src/ThemeProvider';
import { useHeroArchetype } from '../../src/useHeroArchetype';
import WorldArt from '../../src/WorldArt';
import { ART, tabArtForRoute } from '../../src/artAssets';
import BrandLoadingScreen from '../../src/BrandLoadingScreen';
import { shouldShowOnboarding } from '../../src/onboarding';
import { useReducedMotion } from '../../src/Interaction';

const NAV: Record<string, VQIconName> = {
  index: 'xp', train: 'strength', quests: 'quest', armory: 'armory', hero: 'trophy',
};

const DOCK_GOLD = '#E7B858';

function NavIcon({ name, title, focused, compact }: { name: keyof typeof NAV; title: string; focused: boolean; compact?: boolean }) {
  const { theme } = useVitalTheme();const t = theme.tokens;const reduced=useReducedMotion();const focus=useRef(new Animated.Value(focused?1:0)).current;
  useEffect(()=>{Animated.timing(focus,{toValue:focused?1:0,duration:reduced?0:220,easing:Easing.out(Easing.cubic),useNativeDriver:true}).start()},[focus,focused,reduced]);
  const scale=focus.interpolate({inputRange:[0,1],outputRange:[1,1.05]});
  const ringOpacity=focus.interpolate({inputRange:[0,1],outputRange:[0,1]});
  return <View style={[styles.iconWrap,compact&&styles.iconWrapShort]}>
    <Animated.View style={[styles.iconShell,compact&&styles.iconShellShort,{transform:[{scale}],borderColor:focused?DOCK_GOLD:'rgba(255,255,255,.10)',backgroundColor:focused?'rgba(231,184,88,.08)':'rgba(255,255,255,.025)'}]}>
      <IconArt name={NAV[name]} size={compact?22:27} opacity={focused ? 1 : .55} tint={focused ? DOCK_GOLD : t.muted} quiet={!focused} />
    </Animated.View>
    <Text style={[styles.navLabel,compact&&styles.navLabelShort,{color:focused?DOCK_GOLD:t.muted}]}>{title}</Text>
    <Animated.View style={[styles.activeBar,{opacity:ringOpacity,backgroundColor:DOCK_GOLD}]}/>
  </View>;
}

export default function TabLayout() {
  const db=useSQLiteContext();const { theme } = useVitalTheme();const { archetype } = useHeroArchetype();const { width,height } = useWindowDimensions();const [gate,setGate]=useState<'checking'|'open'>('checking');const landscapeDock = width >= 900;const shortLandscape=landscapeDock&&height<650;const t = theme.tokens;
  useEffect(()=>{let active=true;shouldShowOnboarding(db).then(show=>{if(!active)return;if(show){router.replace('/onboarding');return}setGate('open')}).catch(()=>setGate('open'));return()=>{active=false}},[db]);
  const segments=useSegments();const tabRoute=segments[segments.length-1] as string|undefined;
  useEffect(()=>{Object.values(ART.tabArt).forEach(uri=>{Image.prefetch(uri).catch(()=>{})})},[]);
  if(gate==='checking')return <BrandLoadingScreen variant="launch" message="PREPARING VITALQUEST"/>;
  return <View style={[styles.world,{backgroundColor:'#05070A'}]}><WorldArt archetype={archetype} strength="soft" position="top" artUri={tabArtForRoute(tabRoute)} /><View pointerEvents="none" style={[styles.ambientTop,landscapeDock&&styles.ambientTopWide]}/><View pointerEvents="none" style={[styles.ambientBottom,landscapeDock&&styles.ambientBottomWide]}/><Tabs screenOptions={{headerShown:false,tabBarShowLabel:false,sceneStyle:{backgroundColor:'transparent'},tabBarHideOnKeyboard:true,tabBarStyle:[styles.tabBar,landscapeDock&&styles.tabBarWide,shortLandscape&&styles.tabBarShort,{backgroundColor:t.navBackground,borderColor:`${t.text}18`},Platform.OS==='web'?({boxShadow:'0 20px 64px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.065)',backdropFilter:'blur(34px) saturate(1.08)'} as any):null],tabBarActiveTintColor:'#E7B858',tabBarInactiveTintColor:t.muted,tabBarItemStyle:[styles.item,shortLandscape&&styles.itemShort]}}>
    <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ focused }) => <NavIcon name="index" title="Today" focused={focused} compact={shortLandscape} /> }} />
    <Tabs.Screen name="train" options={{ title: 'Trials', tabBarIcon: ({ focused }) => <NavIcon name="train" title="Trials" focused={focused} compact={shortLandscape} /> }} />
    <Tabs.Screen name="quests" options={{ title: 'Quests', tabBarIcon: ({ focused }) => <NavIcon name="quests" title="Quests" focused={focused} compact={shortLandscape} /> }} />
    <Tabs.Screen name="armory" options={{ title: 'Armory', tabBarIcon: ({ focused }) => <NavIcon name="armory" title="Armory" focused={focused} compact={shortLandscape} /> }} />
    <Tabs.Screen name="hero" options={{ title: 'Hero', tabBarIcon: ({ focused }) => <NavIcon name="hero" title="Hero" focused={focused} compact={shortLandscape} /> }} />
  </Tabs></View>;
}

const styles = StyleSheet.create({world:{flex:1,overflow:'hidden'},ambientTop:{position:'absolute',top:0,left:0,right:0,height:220,backgroundColor:'rgba(5,7,10,.08)'},ambientTopWide:{height:170,backgroundColor:'rgba(5,7,10,.04)'},ambientBottom:{position:'absolute',left:0,right:0,bottom:0,height:260,backgroundColor:'rgba(5,7,10,.50)'},ambientBottomWide:{height:210,backgroundColor:'rgba(5,7,10,.40)'},tabBar:{position:'absolute',left:16,right:16,bottom:14,height:96,borderWidth:1,borderTopWidth:1,borderRadius:24,paddingTop:8,paddingBottom:8,overflow:'hidden'},tabBarWide:{left:'50%',right:undefined,width:680,marginLeft:-340,height:96,bottom:16,borderRadius:22},tabBarShort:{height:74,width:620,marginLeft:-310,bottom:10,paddingTop:6,paddingBottom:6,borderRadius:20},item:{paddingTop:0},itemShort:{paddingTop:0},iconWrap:{height:80,alignItems:'center',justifyContent:'center'},iconWrapShort:{height:62},iconShell:{width:46,height:46,borderRadius:16,borderWidth:1.25,alignItems:'center',justifyContent:'center'},iconShellShort:{width:36,height:36,borderRadius:13},navLabel:{fontSize:8,fontWeight:'900',letterSpacing:1.35,textTransform:'uppercase',marginTop:6},navLabelShort:{fontSize:7.5,letterSpacing:1.2,marginTop:5},activeBar:{width:18,height:3,borderRadius:2,marginTop:4}});
