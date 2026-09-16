import React,{useEffect,useRef} from 'react';
import { Animated,ImageBackground,Platform,StyleSheet,Text,View,useWindowDimensions } from 'react-native';
import { BRAND_LAUNCH_IMAGE } from './brandLaunchAsset';
import { BRAND_CALIBRATING_IMAGE } from './brandCalibratingAsset';

type Variant='launch'|'calibrating';

export default function BrandLoadingScreen({variant='launch',message}:{variant?:Variant;message?:string}){
  const {width}=useWindowDimensions();const tablet=width>=760;
  const opacity=useRef(new Animated.Value(0)).current;const pulse=useRef(new Animated.Value(.45)).current;
  useEffect(()=>{Animated.timing(opacity,{toValue:1,duration:260,useNativeDriver:true}).start();const loop=Animated.loop(Animated.sequence([Animated.timing(pulse,{toValue:1,duration:900,useNativeDriver:true}),Animated.timing(pulse,{toValue:.45,duration:900,useNativeDriver:true})]));loop.start();return()=>loop.stop()},[opacity,pulse]);
  const calibrating=variant==='calibrating';
  return <View style={styles.root} accessibilityRole="progressbar" accessibilityLabel={message??(calibrating?'Calibrating your next session':'Loading VitalQuest')}>
    <ImageBackground source={{uri:calibrating?BRAND_CALIBRATING_IMAGE:BRAND_LAUNCH_IMAGE}} resizeMode="cover" style={styles.image} imageStyle={styles.imageStyle}>
      <View style={styles.scrim}/>
      <Animated.View style={[styles.content,tablet&&styles.contentTablet,{opacity}]}>
        {!calibrating?<><Text style={styles.wordmark}>VITALQUEST</Text><Text style={styles.tagline}>REAL WORK · VISIBLE GROWTH</Text></>:null}
        <View style={[styles.status,calibrating&&styles.statusCalibrating]}>
          <Animated.View style={[styles.dot,{opacity:pulse}]}/>
          <Text style={styles.statusText}>{message??(calibrating?'CALIBRATING YOUR NEXT SESSION':'PREPARING YOUR ARC')}</Text>
        </View>
      </Animated.View>
    </ImageBackground>
  </View>;
}

const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#080A0A'},image:{flex:1,width:'100%',height:'100%',justifyContent:'flex-end'},imageStyle:{backgroundColor:'#080A0A'},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(5,7,8,.18)'},content:{paddingHorizontal:28,paddingBottom:Platform.OS==='ios'?54:42,alignItems:'center'},contentTablet:{paddingBottom:72},wordmark:{color:'#F7F8FA',fontSize:28,fontWeight:'900',letterSpacing:7,textAlign:'center',textShadowColor:'rgba(0,0,0,.65)',textShadowRadius:12},tagline:{color:'rgba(247,248,250,.62)',fontSize:8,fontWeight:'900',letterSpacing:2.2,marginTop:8},status:{minHeight:34,marginTop:22,paddingHorizontal:13,borderRadius:999,backgroundColor:'rgba(8,10,10,.56)',borderWidth:1,borderColor:'rgba(247,248,250,.12)',flexDirection:'row',alignItems:'center',gap:8},statusCalibrating:{marginTop:0},dot:{width:6,height:6,borderRadius:3,backgroundColor:'#F7F8FA'},statusText:{color:'rgba(247,248,250,.78)',fontSize:7,fontWeight:'900',letterSpacing:1.25}});
