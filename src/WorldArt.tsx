import React,{useEffect,useRef} from 'react';
import { Animated,Easing,StyleSheet,useWindowDimensions,View } from 'react-native';
import type { HeroArchetype } from './heroEvolution';
import { MYSTIC_WORLD } from './worldMystic';
import { ATHLETE_WORLD } from './worldAthlete';
import { SPARTAN_WORLD } from './worldSpartan';
import { useReducedMotion } from './Interaction';

type Props={archetype:HeroArchetype;strength?:'soft'|'medium'|'strong';position?:'top'|'center'};
const WORLD:Record<HeroArchetype,string>={mystic:MYSTIC_WORLD,athlete:ATHLETE_WORLD,spartan:SPARTAN_WORLD};

export default function WorldArt({archetype,strength='medium',position='center'}:Props){
  const {width,height}=useWindowDimensions();
  const reduced=useReducedMotion();
  const drift=useRef(new Animated.Value(0)).current;
  const tablet=width>=760;
  const landscape=width>height;
  const veil=strength==='soft' ? (tablet?.50:.62) : strength==='strong' ? (tablet?.24:.34) : (tablet?.38:.48);
  const baseY=position==='top'?(tablet?(landscape?-82:-58):-26):0;
  const baseScale=position==='top'?(tablet?(landscape?1.02:1.06):1.12):1.035;

  useEffect(()=>{
    if(reduced){drift.stopAnimation();drift.setValue(0);return}
    const loop=Animated.loop(Animated.sequence([
      Animated.timing(drift,{toValue:1,duration:9000,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(drift,{toValue:0,duration:9000,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
    ]));
    loop.start();
    return()=>loop.stop();
  },[drift,reduced]);

  const translateX=drift.interpolate({inputRange:[0,1],outputRange:[landscape?-4:-2,landscape?5:3]});
  const translateY=drift.interpolate({inputRange:[0,1],outputRange:[baseY,baseY+(tablet?5:7)]});
  const scale=drift.interpolate({inputRange:[0,1],outputRange:[baseScale,baseScale*(tablet?1.008:1.012)]});

  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Animated.Image source={{uri:WORLD[archetype]}} resizeMode="cover" style={[StyleSheet.absoluteFill,{transform:[{translateX},{translateY},{scale}]}]}/>
    <View style={[StyleSheet.absoluteFill,{backgroundColor:`rgba(4,7,10,${veil})`}]}/>
    <View style={[styles.vignetteTop,{height:tablet?'26%':'34%',backgroundColor:strength==='strong'?'rgba(4,7,10,.05)':'rgba(4,7,10,.14)'}]}/>
    <View style={[styles.vignetteBottom,{height:tablet?'42%':'52%',backgroundColor:tablet?'rgba(4,7,10,.58)':'rgba(4,7,10,.70)'}]}/>
    <View style={[styles.edge,{width:tablet?'10%':'16%'}]}/>
    <View style={[styles.edge,styles.edgeRight,{width:tablet?'10%':'16%'}]}/>
  </View>
}

const styles=StyleSheet.create({
  vignetteTop:{position:'absolute',top:0,left:0,right:0},
  vignetteBottom:{position:'absolute',bottom:0,left:0,right:0},
  edge:{position:'absolute',left:0,top:0,bottom:0,backgroundColor:'rgba(4,7,10,.24)'},
  edgeRight:{left:undefined,right:0},
});
