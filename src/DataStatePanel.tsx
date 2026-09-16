import React from 'react';
import { Pressable,StyleSheet,Text,View } from 'react-native';
import { IconArt,VQIconName } from './IconArt';
import { useVitalTheme } from './ThemeProvider';

type Kind='loading'|'error'|'empty';
export default function DataStatePanel({kind,title,copy,actionLabel,onAction,icon}:{kind:Kind;title:string;copy:string;actionLabel?:string;onAction?:()=>void;icon?:VQIconName}){
  const {theme}=useVitalTheme();const t=theme.tokens;
  const resolvedIcon=icon??(kind==='error'?'streak':kind==='loading'?'xp':'trophy');
  return <View style={[styles.panel,{borderColor:t.border,backgroundColor:t.surface}]}>
    <View style={[styles.iconWrap,{borderColor:t.border,backgroundColor:t.heroSurface}]}><IconArt name={resolvedIcon} size={40}/></View>
    <Text style={[styles.title,{color:t.text}]}>{title}</Text>
    <Text style={[styles.copy,{color:t.muted}]}>{copy}</Text>
    {actionLabel&&onAction?<Pressable accessibilityRole="button" onPress={onAction} style={({pressed})=>[styles.action,{borderColor:t.accentSoft,backgroundColor:t.heroSurface,opacity:pressed?.72:1}]}><Text style={[styles.actionText,{color:t.accent}]}>{actionLabel.toUpperCase()}</Text></Pressable>:null}
  </View>;
}
const styles=StyleSheet.create({panel:{borderWidth:1,borderRadius:18,padding:28,alignItems:'center',justifyContent:'center',minHeight:210},iconWrap:{width:66,height:66,borderRadius:33,borderWidth:1,alignItems:'center',justifyContent:'center'},title:{fontSize:20,fontWeight:'900',marginTop:12,textAlign:'center'},copy:{fontSize:10,lineHeight:16,textAlign:'center',marginTop:6,maxWidth:440},action:{marginTop:14,minHeight:42,borderRadius:11,borderWidth:1,paddingHorizontal:16,alignItems:'center',justifyContent:'center'},actionText:{fontSize:8,fontWeight:'900',letterSpacing:.8}});
