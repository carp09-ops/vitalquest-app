import React,{ReactNode,useEffect,useRef,useState} from 'react';
import { AccessibilityInfo,Animated,Easing,Pressable,PressableProps,StyleProp,Text,TextStyle,View,ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

const AnimatedPressable=Animated.createAnimatedComponent(Pressable);

export function useReducedMotion(){
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    let active=true;
    AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(active)setReduced(value)}).catch(()=>{});
    const subscription=AccessibilityInfo.addEventListener?.('reduceMotionChanged',setReduced);
    return()=>{active=false;subscription?.remove?.()};
  },[]);
  return reduced;
}

export function ActionPressable({children,onPress,onPressIn,onPressOut,disabled=false,style,pressedScale=.982,accessibilityRole='button',...rest}:{children:ReactNode;onPress?:PressableProps['onPress'];onPressIn?:PressableProps['onPressIn'];onPressOut?:PressableProps['onPressOut'];disabled?:boolean;style?:StyleProp<ViewStyle>;pressedScale?:number;accessibilityRole?:PressableProps['accessibilityRole']} & Omit<PressableProps,'children'|'style'|'onPress'|'onPressIn'|'onPressOut'|'disabled'|'accessibilityRole'>){
  const reduced=useReducedMotion();
  const scale=useRef(new Animated.Value(1)).current;
  const lift=useRef(new Animated.Value(0)).current;
  const opacity=useRef(new Animated.Value(disabled?.48:1)).current;
  useEffect(()=>{Animated.timing(opacity,{toValue:disabled?.48:1,duration:150,easing:Easing.out(Easing.cubic),useNativeDriver:true}).start()},[disabled,opacity]);
  const animate=(pressed:boolean)=>{
    if(reduced){scale.setValue(1);lift.setValue(0);return}
    Animated.parallel([
      Animated.spring(scale,{toValue:pressed?pressedScale:1,useNativeDriver:true,speed:34,bounciness:pressed?0:2}),
      Animated.spring(lift,{toValue:pressed?1.5:0,useNativeDriver:true,speed:32,bounciness:0}),
    ]).start();
  };
  return <AnimatedPressable {...rest} disabled={disabled} accessibilityRole={accessibilityRole} onPress={onPress} onPressIn={event=>{animate(true);onPressIn?.(event)}} onPressOut={event=>{animate(false);onPressOut?.(event)}} style={[style,{transform:[{translateY:lift},{scale}],opacity}]}>{children}</AnimatedPressable>;
}

export function Entrance({children,delay=0,distance=12,style}:{children:ReactNode;delay?:number;distance?:number;style?:StyleProp<ViewStyle>}){  const reduced=useReducedMotion();
  const [done,setDone]=useState(false);
  const opacity=useRef(new Animated.Value(reduced?1:0)).current;
  const translateY=useRef(new Animated.Value(reduced?0:distance)).current;
  const scale=useRef(new Animated.Value(reduced?1:.992)).current;
  useEffect(()=>{
    if(reduced){opacity.setValue(1);translateY.setValue(0);scale.setValue(1);setDone(true);return}
    const anim=Animated.parallel([
      Animated.timing(opacity,{toValue:1,duration:360,delay,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      Animated.timing(translateY,{toValue:0,duration:440,delay,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      Animated.timing(scale,{toValue:1,duration:460,delay,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
    ]);
    anim.start(({finished})=>{if(finished)setDone(true)});
    return()=>anim.stop();
  },[delay,distance,opacity,reduced,scale,translateY]);
  // Once the entrance finishes, swap the animated wrapper for a plain View.
  // A lingering (identity) transform on an ancestor of a ScrollView is a
  // known iOS Safari touch-scroll breaker.
  if(done)return <View style={style}>{children}</View>;
  return <Animated.View style={[style,{opacity,transform:[{translateY},{scale}]}]}>{children}</Animated.View>;
}

export function hapticTap(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light){
  try{ Haptics.impactAsync(style); }catch{ /* haptics unavailable (e.g. desktop web) */ }
}

export function hapticSuccess(){
  try{ Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }catch{ /* unavailable */ }
}

/** Mount-and-forget success haptic for completion screens rendered in conditional branches. */
export function SuccessHaptic(){ useEffect(()=>{ hapticSuccess(); },[]); return null; }

/** Progress bar whose fill sweeps to the new value instead of snapping. */
export function AnimatedBar({progress,duration=520,trackStyle,barStyle,color}:{progress:number;duration?:number;trackStyle?:StyleProp<ViewStyle>;barStyle?:StyleProp<ViewStyle>;color:string}){
  const reduced=useReducedMotion();
  const anim=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const target=Math.max(0,Math.min(1,progress));
    if(reduced){ anim.setValue(target); return; }
    Animated.timing(anim,{toValue:target,duration,easing:Easing.out(Easing.cubic),useNativeDriver:false}).start();
  },[progress,anim,reduced,duration]);
  const width=anim.interpolate({inputRange:[0,1],outputRange:['0%','100%']});
  return <View style={trackStyle}><Animated.View style={[barStyle,{width,backgroundColor:color}]}/></View>;
}

/** Number that counts up to its value on mount — for XP rewards and stat reveals. */
export function CountUp({value,duration=950,prefix='',suffix='',style,format}:{value:number;duration?:number;prefix?:string;suffix?:string;style?:StyleProp<TextStyle>;format?:(n:number)=>string}){
  const reduced=useReducedMotion();
  const [display,setDisplay]=useState(reduced?value:0);
  useEffect(()=>{
    if(reduced){ setDisplay(value); return; }
    let raf=0; const start=Date.now();
    const tick=()=>{
      const p=Math.min(1,(Date.now()-start)/duration);
      const eased=1-Math.pow(1-p,3);
      setDisplay(Math.round(eased*value));
      if(p<1) raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf);
  },[value,duration,reduced]);
  const text=format?format(display):display.toLocaleString();
  return <Text style={style}>{prefix}{text}{suffix}</Text>;
}
