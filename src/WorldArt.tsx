import React from 'react';
import { Image,StyleSheet,View } from 'react-native';
import type { HeroArchetype } from './heroEvolution';
import { MYSTIC_WORLD } from './worldMystic';
import { ATHLETE_WORLD } from './worldAthlete';
import { SPARTAN_WORLD } from './worldSpartan';

type Props={archetype:HeroArchetype;strength?:'soft'|'medium'|'strong';position?:'top'|'center'};
const WORLD:Record<HeroArchetype,string>={mystic:MYSTIC_WORLD,athlete:ATHLETE_WORLD,spartan:SPARTAN_WORLD};

export default function WorldArt({archetype,strength='medium',position='center'}:Props){
  const veil=strength==='soft' ? .68 : strength==='strong' ? .32 : .48;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Image source={{uri:WORLD[archetype]}} resizeMode="cover" style={[StyleSheet.absoluteFill,position==='top'&&styles.top]}/>
    <View style={[StyleSheet.absoluteFill,{backgroundColor:`rgba(4,7,10,${veil})`}]}/>
    <View style={[styles.vignetteTop,{backgroundColor:strength==='strong'?'rgba(4,7,10,.08)':'rgba(4,7,10,.20)'}]}/>
    <View style={styles.vignetteBottom}/>
    <View style={styles.edge}/>
  </View>
}

const styles=StyleSheet.create({
  top:{transform:[{translateY:-36},{scale:1.08}]},
  vignetteTop:{position:'absolute',top:0,left:0,right:0,height:'34%'},
  vignetteBottom:{position:'absolute',bottom:0,left:0,right:0,height:'52%',backgroundColor:'rgba(4,7,10,.72)'},
  edge:{position:'absolute',left:0,top:0,bottom:0,width:'18%',backgroundColor:'rgba(4,7,10,.32)'},
});
