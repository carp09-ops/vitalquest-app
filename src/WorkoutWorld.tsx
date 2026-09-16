import React from 'react';
import { StyleSheet,View } from 'react-native';
import WorldArt from './WorldArt';
import { useHeroArchetype } from './useHeroArchetype';

type Props={children:React.ReactNode;intensity?:'focus'|'completion'};

export default function WorkoutWorld({children,intensity='focus'}:Props){
  const {archetype}=useHeroArchetype();
  const completion=intensity==='completion';
  return <View style={styles.root}>
    <WorldArt archetype={archetype} strength={completion?'strong':'medium'} position="top"/>
    <View pointerEvents="none" style={[StyleSheet.absoluteFill,{backgroundColor:completion?'rgba(4,7,10,.16)':'rgba(4,7,10,.30)'}]}/>
    <View pointerEvents="none" style={styles.bottomFade}/>
    {children}
  </View>
}

const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:'#05070A',overflow:'hidden'},
  bottomFade:{position:'absolute',left:0,right:0,bottom:0,height:'40%',backgroundColor:'rgba(4,7,10,.42)'},
});
