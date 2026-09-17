import React from 'react';
import { ImageBackground,Platform,StyleSheet,Text,View } from 'react-native';
import VerificationSetupV2 from './VerificationSetupV2';
import { ART } from './artAssets';
import { useHeroArchetype } from './useHeroArchetype';
import { materialForArchetype,paletteForArchetype } from './designSystem';

export default function VerificationExperienceV3(){
  const {archetype}=useHeroArchetype();const palette=paletteForArchetype(archetype);const material=materialForArchetype(archetype);
  return <View style={styles.root}>
    <ImageBackground source={{uri:ART.quest}} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
      <View style={styles.scrim}/><View style={[styles.edge,{backgroundColor:palette.primary}]}/>
      <View style={styles.inner}><View style={[styles.badge,{borderColor:material.edgeStrong,backgroundColor:'rgba(5,7,10,.54)'}]}><Text style={[styles.badgeText,{color:palette.highlight}]}>EVIDENCE · TRUST · PROGRESSION</Text></View><Text style={[styles.kicker,{color:palette.highlight}]}>VERIFICATION</Text><Text style={styles.title}>Strengthen the proof behind the XP.</Text><Text style={styles.sub}>Connect supported evidence sources so more of your real work can be confidently banked into progression.</Text></View>
    </ImageBackground>
    <View style={styles.body}><VerificationSetupV2/></View>
  </View>;
}
const serif=Platform.select({ios:'Georgia',default:'serif'});
const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#03070A'},hero:{height:205,justifyContent:'flex-end',overflow:'hidden'},heroImage:{backgroundColor:'#070B0F'},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,5,9,.48)'},edge:{position:'absolute',left:0,right:0,bottom:0,height:2},inner:{paddingHorizontal:18,paddingBottom:18,maxWidth:960,width:'100%',alignSelf:'center'},badge:{alignSelf:'flex-start',borderWidth:1,borderRadius:999,paddingHorizontal:10,paddingVertical:6,marginBottom:9},badgeText:{fontSize:7,fontWeight:'900',letterSpacing:1.1},kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.4},title:{fontFamily:serif,fontSize:29,lineHeight:33,color:'#FFF9EE',fontWeight:'800',marginTop:4},sub:{fontSize:10,lineHeight:15,color:'rgba(247,248,250,.74)',maxWidth:640,marginTop:5},body:{flex:1,minHeight:0}});
