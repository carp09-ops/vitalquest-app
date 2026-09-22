import { fonts } from './designSystem';
import React,{useEffect,useRef} from 'react';
import { Animated,Easing,Image,ImageBackground,Platform,StyleSheet,Text,View,useWindowDimensions } from 'react-native';
import { useReducedMotion } from './Interaction';
import { ART } from './artAssets';

type Variant='launch'|'calibrating';

export default function BrandLoadingScreen({variant='launch',message}:{variant?:Variant;message?:string}){
  const {width}=useWindowDimensions();
  const tablet=width>=760;
  const reduced=useReducedMotion();
  const opacity=useRef(new Animated.Value(reduced?1:0)).current;
  const rise=useRef(new Animated.Value(reduced?0:10)).current;
  const pulse=useRef(new Animated.Value(.35)).current;
  const spin=useRef(new Animated.Value(0)).current;
  const travel=useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    if(reduced){opacity.setValue(1);rise.setValue(0);pulse.setValue(.8);spin.setValue(0);travel.setValue(.6);return}
    Animated.parallel([
      Animated.timing(opacity,{toValue:1,duration:420,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      Animated.timing(rise,{toValue:0,duration:520,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
    ]).start();
    const pulseLoop=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:1100,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(pulse,{toValue:.35,duration:1100,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
    ]));
    const spinLoop=Animated.loop(Animated.timing(spin,{toValue:1,duration:3200,easing:Easing.linear,useNativeDriver:true}));
    const travelLoop=Animated.loop(Animated.sequence([
      Animated.timing(travel,{toValue:1,duration:1450,easing:Easing.inOut(Easing.cubic),useNativeDriver:true}),
      Animated.timing(travel,{toValue:0,duration:0,useNativeDriver:true}),
    ]));
    pulseLoop.start();spinLoop.start();travelLoop.start();
    return()=>{pulseLoop.stop();spinLoop.stop();travelLoop.stop()};
  },[opacity,pulse,reduced,rise,spin,travel]);

  const calibrating=variant==='calibrating';
  const rotate=spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']});
  const progressX=travel.interpolate({inputRange:[0,1],outputRange:[-38,58]});
  return <View style={styles.root} accessibilityRole="progressbar" accessibilityLabel={message??(calibrating?'Calibrating your next session':'Loading VitalQuest')}>
    <ImageBackground source={{uri:ART.loading}} resizeMode="cover" style={styles.image} imageStyle={styles.imageStyle}>
      <View style={styles.scrim}/>
      <Animated.View style={[styles.content,tablet&&styles.contentTablet,{opacity,transform:[{translateY:rise}]}]}>
        <View style={styles.brandBlock}>
          <View style={styles.logoStage}>
            <Animated.View style={[styles.orbit,{opacity:pulse,transform:[{rotate}]}]}><View style={styles.orbitNode}/></Animated.View>
            <View style={styles.logoDisc}><Image source={{uri:ART.branding.icon512}} resizeMode="contain" style={styles.logo}/></View>
          </View>
          <Text style={styles.wordmark}>VITALQUEST</Text>
          <Text style={styles.tagline}>MORE YOU AHEAD</Text>
        </View>
        <View style={styles.statusBlock}>
          <View style={styles.progressRail}><Animated.View style={[styles.progressGlow,{opacity:pulse,transform:[{translateX:progressX}]}]}/></View>
          <Text style={styles.statusText}>{message??(calibrating?'CALIBRATING YOUR NEXT SESSION':'PREPARING YOUR ARC')}</Text>
          <Text style={styles.statusSub}>{calibrating?'UPDATING YOUR ARC AND PROGRESSION':'BODY · MIND · PERFORMANCE · LONGEVITY'}</Text>
        </View>
      </Animated.View>
    </ImageBackground>
  </View>;
}

const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:'#050607'},
  image:{flex:1,width:'100%',height:'100%',justifyContent:'center'},
  imageStyle:{backgroundColor:'#050607'},
  scrim:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,5,7,.30)'},
  content:{paddingHorizontal:28,paddingVertical:Platform.OS==='ios'?54:42,alignItems:'center',justifyContent:'space-between',minHeight:'76%'},
  contentTablet:{paddingHorizontal:56},
  brandBlock:{alignItems:'center',marginTop:34},
  logoStage:{width:126,height:126,alignItems:'center',justifyContent:'center'},
  orbit:{position:'absolute',width:118,height:118,borderRadius:59,borderWidth:1,borderColor:'rgba(231,196,136,.38)'},
  orbitNode:{position:'absolute',top:-3,left:'50%',marginLeft:-3,width:6,height:6,borderRadius:3,backgroundColor:'#F3D6A0',shadowColor:'#F3D6A0',shadowOpacity:.9,shadowRadius:8},
  logoDisc:{width:92,height:92,borderRadius:46,backgroundColor:'rgba(5,7,9,.72)',borderWidth:1,borderColor:'rgba(245,231,205,.18)',alignItems:'center',justifyContent:'center'},
  logo:{width:72,height:72},
  wordmark:{color:'#F6F0E7',fontSize:25,fontWeight:'700',letterSpacing:6.5,textAlign:'center',marginTop:16,textShadowColor:'rgba(0,0,0,.60)',textShadowRadius:12},
  tagline:{color:'rgba(235,218,189,.72)',fontSize:9,fontWeight:'800',letterSpacing:3,marginTop:7},
  statusBlock:{width:'100%',maxWidth:520,alignItems:'center',marginBottom:38},
  progressRail:{width:88,height:3,borderRadius:99,overflow:'hidden',backgroundColor:'rgba(255,255,255,.12)'},
  progressGlow:{position:'absolute',left:0,top:0,bottom:0,width:'42%',borderRadius:99,backgroundColor:'#E7C488',shadowColor:'#E7C488',shadowOpacity:.8,shadowRadius:7},
  statusText:{color:'#F6F0E7',fontFamily:fonts.display,fontSize:20,textAlign:'center',marginTop:18},
  statusSub:{color:'rgba(247,248,250,.48)',fontSize:9,fontWeight:'900',letterSpacing:1.8,marginTop:8,textAlign:'center'}
});
