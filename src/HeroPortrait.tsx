import React from 'react';
import { Image,StyleSheet,View } from 'react-native';
import { useHeroArchetype } from './useHeroArchetype';
import { heroArtFor } from './vitalquestArt';
import { materialForArchetype } from './designSystem';

export default function HeroPortrait(){
  const {archetype}=useHeroArchetype();
  const material=materialForArchetype(archetype);
  return <View pointerEvents="none" style={[styles.shell,{borderColor:material.edgeStrong,backgroundColor:material.commandSurface}]}>
    <Image source={{uri:heroArtFor(archetype)}} resizeMode="cover" style={styles.image}/>
    <View style={styles.veil}/>
    <View style={[styles.edge,{backgroundColor:material.glow}]}/>
  </View>;
}

const styles=StyleSheet.create({
  shell:{position:'absolute',right:18,top:116,width:172,height:250,borderRadius:28,borderWidth:1,overflow:'hidden',zIndex:0,opacity:.96},
  image:{width:'100%',height:'100%'},
  veil:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(4,7,10,.14)'},
  edge:{position:'absolute',left:0,right:0,bottom:0,height:3},
});
