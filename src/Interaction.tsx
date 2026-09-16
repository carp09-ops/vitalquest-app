import React,{ReactNode,useEffect,useRef,useState} from 'react';
import { AccessibilityInfo,Animated,Easing,Pressable,PressableProps,StyleProp,ViewStyle } from 'react-native';

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

export function Entrance({children,delay=0,distance=12,style}:{children:ReactNode;delay?:number;distance?:number;style?:StyleProp<ViewStyle>}){
  const reduced=useReducedMotion();
  const opacity=useRef(new Animated.Value(reduced?1:0)).current;
  const translateY=useRef(new Animated.Value(reduced?0:distance)).current;
  const scale=useRef(new Animated.Value(reduced?1:.992)).current;
  useEffect(()=>{
    if(reduced){opacity.setValue(1);translateY.setValue(0);scale.setValue(1);return}
    Animated.parallel([
      Animated.timing(opacity,{toValue:1,duration:360,delay,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      Animated.timing(translateY,{toValue:0,duration:440,delay,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      Animated.timing(scale,{toValue:1,duration:460,delay,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
    ]).start();
  },[delay,distance,opacity,reduced,scale,translateY]);
  return <Animated.View style={[style,{opacity,transform:[{translateY},{scale}]}]}>{children}</Animated.View>;
}
