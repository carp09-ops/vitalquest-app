import { useLocalSearchParams } from 'expo-router';
import React,{useMemo} from 'react';
import { ImageBackground,Platform,StyleSheet,Text,View } from 'react-native';
import GeneratedWorkoutV2 from './GeneratedWorkoutV2';
import type { GeneratedWorkoutPlan } from './workoutGenerator';
import { trainingArtForArchetype } from './artAssets';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype, paletteForArchetype, fonts } from './designSystem';

export default function GeneratedWorkoutExperienceV3(){
  const {plan:raw}=useLocalSearchParams<{plan?:string}>();
  const plan=useMemo<GeneratedWorkoutPlan|null>(()=>{try{return raw?JSON.parse(decodeURIComponent(raw)):null}catch{return null}},[raw]);
  const {archetype}=useHeroArchetype();const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);
  return <View style={styles.root}>
    <ImageBackground source={{uri:trainingArtForArchetype(archetype)}} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
      <View style={styles.scrim}/><View style={[styles.edge,{backgroundColor:palette.primary}]}/>
      <View style={styles.inner}><View style={[styles.badge,{borderColor:material.edgeStrong,backgroundColor:'rgba(5,7,10,.52)'}]}><Text style={[styles.badgeText,{color:palette.highlight}]}>ADAPTIVE BUILDER · LIVE ENCOUNTER</Text></View><Text style={[styles.kicker,{color:palette.highlight}]}>{plan?.deload?'DELOAD PROTOCOL':'GENERATED TRIAL'}</Text><Text style={styles.title}>{plan?.name??'Adaptive Session'}</Text><Text style={styles.sub}>{plan?`${plan.exercises.length} movements · target ${plan.targetXP} XP · built from your equipment, history and current fatigue.`:'Your generated training session is being prepared.'}</Text></View>
    </ImageBackground>
    <View style={styles.body}><GeneratedWorkoutV2/></View>
  </View>;
}

const serif=fonts.display;
const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#03070A'},hero:{height:220,justifyContent:'flex-end',overflow:'hidden'},heroImage:{backgroundColor:'#070B0F'},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,9,.42)'},edge:{position:'absolute',left:0,right:0,bottom:0,height:2},inner:{paddingHorizontal:18,paddingBottom:18,maxWidth:1000,width:'100%',alignSelf:'center'},badge:{alignSelf:'flex-start',borderWidth:1,borderRadius:999,paddingHorizontal:10,paddingVertical:6,marginBottom:9},badgeText:{fontSize:9,fontWeight:'900',letterSpacing:1.1},kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.4},title:{fontFamily:serif,fontSize:30,lineHeight:34,color:'#FFF9EE',fontWeight:'800',marginTop:4},sub:{fontSize:10,lineHeight:15,color:'rgba(247,248,250,.74)',maxWidth:640,marginTop:5},body:{flex:1,minHeight:0}});
