import React from 'react';
import { ImageBackground,Platform,StyleSheet,Text,View } from 'react-native';
import EquipmentProfileV2 from './EquipmentProfileV2';
import { armoryArtForArchetype } from './artAssets';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype, paletteForArchetype, fonts } from './designSystem';

export default function EquipmentExperienceV3(){
  const {archetype}=useHeroArchetype();const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);
  return <View style={styles.root}>
    <ImageBackground source={{uri:armoryArtForArchetype(archetype)}} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
      <View style={styles.scrim}/><View style={[styles.edge,{backgroundColor:palette.primary}]}/>
      <View style={styles.inner}><View style={[styles.badge,{borderColor:material.edgeStrong,backgroundColor:'rgba(5,7,10,.52)'}]}><Text style={[styles.badgeText,{color:palette.highlight}]}>LOADOUT · TRAINING INPUT</Text></View><Text style={[styles.kicker,{color:palette.highlight}]}>EQUIPMENT</Text><Text style={styles.title}>Build your training loadout.</Text><Text style={styles.sub}>VitalQuest uses this profile to keep recommendations realistic. Add what you actually have access to and the Arc will adapt around it.</Text></View>
    </ImageBackground>
    <View style={styles.body}><EquipmentProfileV2/></View>
  </View>;
}
const serif=fonts.display;
const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#03070A'},hero:{height:205,justifyContent:'flex-end',overflow:'hidden'},heroImage:{backgroundColor:'#070B0F'},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,9,.48)'},edge:{position:'absolute',left:0,right:0,bottom:0,height:2},inner:{paddingHorizontal:18,paddingBottom:18,maxWidth:960,width:'100%',alignSelf:'center'},badge:{alignSelf:'flex-start',borderWidth:1,borderRadius:999,paddingHorizontal:10,paddingVertical:6,marginBottom:9},badgeText:{fontSize:9,fontWeight:'900',letterSpacing:1.1},kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.4},title:{fontFamily:serif,fontSize:29,lineHeight:33,color:'#FFF9EE',fontWeight:'800',marginTop:4},sub:{fontSize:10,lineHeight:15,color:'rgba(247,248,250,.74)',maxWidth:640,marginTop:5},body:{flex:1,minHeight:0}});
