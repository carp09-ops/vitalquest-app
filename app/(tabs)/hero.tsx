import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import HeroV2 from '../../src/HeroV2';

export default function HeroScreen() {
  return <>
    <HeroV2 />
    <Pressable onPress={()=>router.push('/verification')} style={styles.verify}><Text style={styles.verifyText}>CONNECT VERIFICATION</Text></Pressable>
  </>;
}

const styles=StyleSheet.create({verify:{position:'absolute',right:14,top:54,minHeight:36,paddingHorizontal:12,borderRadius:8,backgroundColor:'rgba(9,11,15,.88)',borderWidth:1,borderColor:'rgba(231,188,103,.55)',alignItems:'center',justifyContent:'center'},verifyText:{color:'#E7BC67',fontSize:7,fontWeight:'900',letterSpacing:.8}});
