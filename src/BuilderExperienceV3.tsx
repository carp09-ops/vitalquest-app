import React from 'react';
import { ImageBackground,Platform,StyleSheet,Text,View } from 'react-native';
import WorkoutForgeV2 from './WorkoutForgeV2';
import CustomWorkoutBuilderV2 from './CustomWorkoutBuilderV2';
import { trainingArtForArchetype } from './artAssets';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype, paletteForArchetype, fonts } from './designSystem';

type Mode='adaptive'|'custom';
export default function BuilderExperienceV3({mode}:{mode:Mode}){
  const {archetype}=useHeroArchetype();const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);
  const adaptive=mode==='adaptive';
  return <View style={styles.root}>
    <ImageBackground source={{uri:trainingArtForArchetype(archetype)}} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
      <View style={styles.scrim}/><View style={[styles.edge,{backgroundColor:palette.primary}]}/>
      <View style={styles.inner}><View style={[styles.badge,{borderColor:material.edgeStrong,backgroundColor:'rgba(5,7,10,.52)'}]}><Text style={[styles.badgeText,{color:palette.highlight}]}>{adaptive?'TRAINING INTELLIGENCE':'PLAYER-CREATED SESSION'}</Text></View><Text style={[styles.kicker,{color:palette.highlight}]}>{adaptive?'ADAPTIVE BUILDER':'CUSTOM WORKOUT'}</Text><Text style={styles.title}>{adaptive?'Forge the next session.':'Build your own encounter.'}</Text><Text style={styles.sub}>{adaptive?'VitalQuest combines your equipment, recent work, fatigue and Arc objective to build a session that fits today.':'Choose the movements, sets and targets. Your completed work still feeds the same progression and trust ledger.'}</Text></View>
    </ImageBackground>
    <View style={styles.body}>{adaptive?<WorkoutForgeV2/>:<CustomWorkoutBuilderV2/>}</View>
  </View>;
}
const serif=fonts.display;
const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#03070A'},hero:{height:220,justifyContent:'flex-end',overflow:'hidden'},heroImage:{backgroundColor:'#070B0F'},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,9,.44)'},edge:{position:'absolute',left:0,right:0,bottom:0,height:2},inner:{paddingHorizontal:18,paddingBottom:18,maxWidth:1040,width:'100%',alignSelf:'center'},badge:{alignSelf:'flex-start',borderWidth:1,borderRadius:999,paddingHorizontal:10,paddingVertical:6,marginBottom:9},badgeText:{fontSize:9,fontWeight:'900',letterSpacing:1.1},kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.4},title:{fontFamily:serif,fontSize:30,lineHeight:34,color:'#FFF9EE',fontWeight:'800',marginTop:4},sub:{fontSize:10,lineHeight:15,color:'rgba(247,248,250,.74)',maxWidth:660,marginTop:5},body:{flex:1,minHeight:0}});
