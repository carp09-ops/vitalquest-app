import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import ActiveWorkoutV2 from './ActiveWorkoutV2';
import EnduranceWorkoutV2 from './EnduranceWorkoutV2';
import RecoveryEncounterV2 from './RecoveryEncounterV2';
import { templates } from './data';
import { trainingArtForArchetype } from './artAssets';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype,paletteForArchetype } from './designSystem';

const ENCOUNTER_COPY:Record<string,{kicker:string;title:string;sub:string}>={
  push:{kicker:'STRENGTH ENCOUNTER',title:'Enter the Pressing Hall',sub:'Every completed set becomes evidence. Load, control and work density shape the reward.'},
  pull:{kicker:'STRENGTH ENCOUNTER',title:'Enter the Pulling Hall',sub:'Build force through the back and arms. The ledger is watching volume, pace and progression.'},
  legs:{kicker:'STRENGTH ENCOUNTER',title:'Enter the Lower Forge',sub:'Heavy work. Full range. Durable strength. Bank the work one set at a time.'},
  run:{kicker:'ENDURANCE ENCOUNTER',title:'Take the Long Road',sub:'Distance, duration and consistency move your endurance path forward.'},
  recovery:{kicker:'RECOVERY ENCOUNTER',title:'Return to Center',sub:'Recovery is part of the Arc. Restore readiness so the next hard day can actually be hard.'},
};

export default function WorkoutExperienceV3(){
  const params=useLocalSearchParams<{templateId?:string}>();
  const templateId=params.templateId??'push';
  const template=templates.find(item=>item.id===templateId);
  const copy=ENCOUNTER_COPY[templateId]??{kicker:'ACTIVE ENCOUNTER',title:template?.name??'Training Session',sub:'Complete the work. Build the record. Let the next recommendation adapt to what happened here.'};
  const {archetype}=useHeroArchetype();
  const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);
  const art=trainingArtForArchetype(archetype);
  const encounter=templateId==='run'?<EnduranceWorkoutV2/>:templateId==='recovery'?<RecoveryEncounterV2/>:<ActiveWorkoutV2/>;

  return <View style={styles.root}>
    <ImageBackground source={{uri:art}} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
      <View style={styles.scrim}/>
      <View style={[styles.edge,{backgroundColor:palette.primary}]}/>
      <View style={styles.heroInner}>
        <View style={[styles.chapter,{borderColor:material.edgeStrong,backgroundColor:'rgba(5,7,10,.52)'}]}><Text style={[styles.chapterText,{color:palette.highlight}]}>ACTIVE ARC · ENCOUNTER</Text></View>
        <Text style={[styles.kicker,{color:palette.highlight}]}>{copy.kicker}</Text>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.sub}>{copy.sub}</Text>
      </View>
    </ImageBackground>
    <View style={styles.body}>{encounter}</View>
  </View>;
}

const serif=Platform.select({ios:'Georgia',default:'serif'});
const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:'#03070A'},
  hero:{height:230,justifyContent:'flex-end',overflow:'hidden'},
  heroImage:{backgroundColor:'#060B10'},
  scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,9,.44)'},
  edge:{position:'absolute',left:0,right:0,bottom:0,height:2},
  heroInner:{paddingHorizontal:18,paddingBottom:18,maxWidth:1120,width:'100%',alignSelf:'center'},
  chapter:{alignSelf:'flex-start',borderWidth:1,borderRadius:999,paddingHorizontal:10,paddingVertical:6,marginBottom:9},
  chapterText:{fontSize:7,fontWeight:'900',letterSpacing:1.15},
  kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.45},
  title:{fontFamily:serif,fontSize:31,lineHeight:35,fontWeight:'800',color:'#FFF9EE',marginTop:4,textShadowColor:'rgba(0,0,0,.6)',textShadowRadius:12},
  sub:{fontSize:10,lineHeight:15,color:'rgba(247,248,250,.74)',maxWidth:640,marginTop:5},
  body:{flex:1,minHeight:0},
});
