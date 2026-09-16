import React,{useEffect,useRef} from 'react';
import { Animated,Easing,ImageBackground,Platform,StyleSheet,Text,View,useWindowDimensions } from 'react-native';
import { useReducedMotion } from './Interaction';
import { VITALQUEST_ART } from './vitalquestArt';

type Variant='launch'|'calibrating';

export default function BrandLoadingScreen({variant='launch',message}:{variant?:Variant;message?:string}){
  const {width}=useWindowDimensions();const tablet=width>=760;const reduced=useReducedMotion();
  const opacity=useRef(new Animated.Value(reduced?1:0)).current;const rise=useRef(new Animated.Value(reduced?0:10)).current;const pulse=useRef(new Animated.Value(.42)).current;
  useEffect(()=>{
    if(reduced){opacity.setValue(1);rise.setValue(0);pulse.setValue(.78);return}
    Animated.parallel([
      Animated.timing(opacity,{toValue:1,duration:420,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      Animated.timing(rise,{toValue:0,duration:520,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
    ]).start();
    const loop=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:1250,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(pulse,{toValue:.42,duration:1250,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
    ]));
    loop.start();return()=>loop.stop();
  },[opacity,pulse,reduced,rise]);
  const calibrating=variant==='calibrating';
  return <View style={styles.root} accessibilityRole="progressbar" accessibilityLabel={message??(calibrating?'Calibrating your next session':'Loading VitalQuest')}>
    <ImageBackground source={{uri:calibrating?VITALQUEST_ART.brand.calibrating:VITALQUEST_ART.brand.launch}} resizeMode="cover" style={styles.image} imageStyle={styles.imageStyle}>
      <View style={styles.scrim}/>
      <Animated.View style={[styles.content,tablet&&styles.contentTablet,{opacity,transform:[{translateY:rise}]}]}>
        {!calibrating?<><Text style={styles.wordmark}>VITALQUEST</Text><Text style={styles.tagline}>REAL WORK · VISIBLE GROWTH</Text></>:null}
        <View style={[styles.status,calibrating&&styles.statusCalibrating]}>
          <View style={styles.dotShell}><Animated.View style={[styles.dotHalo,{opacity:pulse}]}/><Animated.View style={[styles.dot,{opacity:pulse}]}/></View>
          <Text style={styles.statusText}>{message??(calibrating?'CALIBRATING YOUR NEXT SESSION':'PREPARING YOUR ARC')}</Text>
        </View>
      </Animated.View>
    </ImageBackground>
  </View>;
}

const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#080A0A'},image:{flex:1,width:'100%',height:'100%',justifyContent:'flex-end'},imageStyle:{backgroundColor:'#080A0A'},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(5,7,8,.18)'},content:{paddingHorizontal:28,paddingBottom:Platform.OS==='ios'?54:42,alignItems:'center'},contentTablet:{paddingBottom:72},wordmark:{color:'#F7F8FA',fontSize:28,fontWeight:'900',letterSpacing:7,textAlign:'center',textShadowColor:'rgba(0,0,0,.65)',textShadowRadius:12},tagline:{color:'rgba(247,248,250,.62)',fontSize:8,fontWeight:'900',letterSpacing:2.2,marginTop:8},status:{minHeight:36,marginTop:22,paddingHorizontal:13,borderRadius:999,backgroundColor:'rgba(8,10,10,.56)',borderWidth:1,borderColor:'rgba(247,248,250,.12)',flexDirection:'row',alignItems:'center',gap:9},statusCalibrating:{marginTop:0},dotShell:{width:12,height:12,alignItems:'center',justifyContent:'center'},dotHalo:{position:'absolute',width:12,height:12,borderRadius:6,backgroundColor:'rgba(247,248,250,.20)'},dot:{width:5,height:5,borderRadius:3,backgroundColor:'#F7F8FA'},statusText:{color:'rgba(247,248,250,.78)',fontSize:7,fontWeight:'900',letterSpacing:1.25}});
