import React from 'react';
import { StyleSheet,Text,View } from 'react-native';
import TodayV2 from '../../src/TodayV2';
import WorldBackdrop from '../../src/WorldBackdrop';

export default function TodayScreen() {
  return <WorldBackdrop scene="today"><View style={styles.root}><View style={styles.welcome}><Text style={styles.kicker}>TODAY</Text><Text style={styles.title}>Welcome back.</Text><Text style={styles.copy}>Your Arc is ready. Pick up where the work left off.</Text></View><TodayV2 /></View></WorldBackdrop>;
}

const styles=StyleSheet.create({
  root:{flex:1},
  welcome:{paddingHorizontal:16,paddingTop:8,paddingBottom:2,maxWidth:1120,width:'100%',alignSelf:'center'},
  kicker:{fontSize:7,fontWeight:'900',letterSpacing:1.4,color:'#D8B56A'},
  title:{fontSize:24,lineHeight:28,fontWeight:'900',color:'#F7F8FA',marginTop:3},
  copy:{fontSize:9,lineHeight:14,color:'rgba(247,248,250,.58)',marginTop:2},
});
