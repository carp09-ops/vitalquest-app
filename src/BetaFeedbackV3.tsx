import React from 'react';
import { ImageBackground,SafeAreaView,ScrollView,StyleSheet,Text,View } from 'react-native';
import BetaFeedbackV2 from './BetaFeedbackV2';
import { ART } from './artAssets';

export default function BetaFeedbackV3(){
  return <SafeAreaView style={styles.safe}>
    <ImageBackground source={{uri:ART.quest}} resizeMode="cover" style={styles.hero}>
      <View style={styles.scrim}/>
      <View style={styles.heroCopy}>
        <Text style={styles.kicker}>FIELD REPORT</Text>
        <Text style={styles.title}>Help us sharpen the world.</Text>
        <Text style={styles.copy}>Capture the issue while the context is fresh. Your report becomes part of the QA ledger.</Text>
      </View>
    </ImageBackground>
    <View style={styles.body}><BetaFeedbackV2/></View>
  </SafeAreaView>;
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#03070B'},
  hero:{height:250,justifyContent:'flex-end'},
  scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,7,11,.42)'},
  heroCopy:{padding:22,paddingBottom:26},
  kicker:{fontSize:8,fontWeight:'900',letterSpacing:1.5,color:'#E6BA63'},
  title:{fontSize:34,lineHeight:38,fontWeight:'900',color:'#F8F5EE',marginTop:5},
  copy:{fontSize:10,lineHeight:16,color:'rgba(248,245,238,.72)',marginTop:7,maxWidth:560},
  body:{flex:1,marginTop:-18,borderTopLeftRadius:22,borderTopRightRadius:22,overflow:'hidden',backgroundColor:'rgba(3,7,11,.96)'}
});