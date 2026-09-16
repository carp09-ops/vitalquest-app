import React from 'react';
import { Image,StyleSheet,useWindowDimensions,View } from 'react-native';
import type { HeroArchetype } from './heroEvolution';
import { MYSTIC_WORLD } from './worldMystic';
import { ATHLETE_WORLD } from './worldAthlete';
import { SPARTAN_WORLD } from './worldSpartan';

type Props={archetype:HeroArchetype;strength?:'soft'|'medium'|'strong';position?:'top'|'center'};
const WORLD:Record<HeroArchetype,string>={mystic:MYSTIC_WORLD,athlete:ATHLETE_WORLD,spartan:SPARTAN_WORLD};

export default function WorldArt({archetype,strength='medium',position='center'}:Props){
  const {width,height}=useWindowDimensions();
  const tablet=width>=760;
  const landscape=width>height;
  const veil=strength==='soft' ? (tablet?.50:.62) : strength==='strong' ? (tablet?.24:.34) : (tablet?.38:.48);
  const topTransform=tablet
    ? [{translateY:landscape?-82:-58},{scale:landscape?1.02:1.06}]
    : [{translateY:-26},{scale:1.12}];
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Image source={{uri:WORLD[archetype]}} resizeMode="cover" style={[StyleSheet.absoluteFill,position==='top'&&{transform:topTransform}]}/>
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
