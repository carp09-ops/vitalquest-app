import React,{ReactNode,useEffect,useRef} from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

const AnimatedPressable=Animated.createAnimatedComponent(Pressable);

export function ActionPressable({children,onPress,onPressIn,onPressOut,disabled=false,style,pressedScale=.985,accessibilityRole='button',...rest}:{children:ReactNode;onPress?:PressableProps['onPress'];onPressIn?:PressableProps['onPressIn'];onPressOut?:PressableProps['onPressOut'];disabled?:boolean;style?:StyleProp<ViewStyle>;pressedScale?:number;accessibilityRole?:PressableProps['accessibilityRole']} & Omit<PressableProps,'children'|'style'|'onPress'|'onPressIn'|'onPressOut'|'disabled'|'accessibilityRole'>){
  const scale=useRef(new Animated.Value(1)).current;
  const opacity=useRef(new Animated.Value(disabled?.5:1)).current;
  useEffect(()=>{Animated.timing(opacity,{toValue:disabled?.5:1,duration:140,useNativeDriver:true}).start()},[disabled,opacity]);
  const animate=(toValue:number)=>Animated.spring(scale,{toValue,useNativeDriver:true,speed:36,bounciness:0}).start();
  return <AnimatedPressable {...rest} disabled={disabled} accessibilityRole={accessibilityRole} onPress={onPress} onPressIn={event=>{animate(pressedScale);onPressIn?.(event)}} onPressOut={event=>{animate(1);onPressOut?.(event)}} style={[style,{transform:[{scale}],opacity}]}>{children}</AnimatedPressable>;
}

export function Entrance({children,delay=0,distance=10,style}:{children:ReactNode;delay?:number;distance?:number;style?:StyleProp<ViewStyle>}){
  const opacity=useRef(new Animated.Value(0)).current;const translateY=useRef(new Animated.Value(distance)).current;
  useEffect(()=>{Animated.parallel([Animated.timing(opacity,{toValue:1,duration:280,delay,useNativeDriver:true}),Animated.spring(translateY,{toValue:0,delay,useNativeDriver:true,speed:20,bounciness:1})]).start()},[delay,distance,opacity,translateY]);
  return <Animated.View style={[style,{opacity,transform:[{translateY}]}]}>{children}</Animated.View>;
}
