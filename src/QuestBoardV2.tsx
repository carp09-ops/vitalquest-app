import React, { useMemo, useState } from 'react';
import { ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useVitalTheme } from './ThemeProvider';
import { IconArt, VQIconName } from './IconArt';
import { useProgressionSnapshot } from './useProgression';

type QuestTab = 'Active' | 'Completed' | 'Guild';
type WorldId = 'mythicForge'|'celestialPulse'|'titanCore';

const worldArt: Record<WorldId,string> = {
  mythicForge:'/vitalquest-app/art/premium/mythic-quest.jpg',
  celestialPulse:'/vitalquest-app/art/today-celestial-premium.webp',
  titanCore:'/vitalquest-app/art/today-titan-premium.webp',
};

export default function QuestBoardV2() {
  const {themeId,theme} = useVitalTheme();
  const {snapshot}=useProgressionSnapshot();
  const t = theme.tokens;
  const {width}=useWindowDimensions();
  const wide=width>=760;
  const [tab,setTab]=useState<QuestTab>('Active');
  const art=worldArt[themeId as WorldId] ?? worldArt.mythicForge;
  const activeQuests=useMemo(()=>[
    {title:'Iron Week',type:'WEEKLY TRIAL',description:'Complete three resistance workouts this week.',progress:snapshot.quests.ironWeek.progress,target:snapshot.quests.ironWeek.target,reward:'+300 XP',icon:'strength' as VQIconName,complete:snapshot.quests.ironWeek.complete},
    {title:'Five-Ton Trial',type:'VOLUME MILESTONE',description:'Accumulate 10,000 lb of lifting volume this week.',progress:Math.round(snapshot.quests.fiveTonTrial.progress),target:snapshot.quests.fiveTonTrial.target,reward:'Iron Initiate',icon:'trophy' as VQIconName,complete:snapshot.quests.fiveTonTrial.complete},
    {title:'Veteran Path',type:'CAREER MILESTONE',description:'Complete 25 lifetime training sessions.',progress:snapshot.quests.veteranPath.progress,target:snapshot.quests.veteranPath.target,reward:'Forged Helm',icon:'quest' as VQIconName,complete:snapshot.quests.veteranPath.complete},
  ],[snapshot]);
  const completedCount=activeQuests.filter(q=>q.complete).length;
  const campaignRatio=completedCount/activeQuests.length;

  return <SafeAreaView style={[styles.safe,{backgroundColor:t.background}]}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page,wide&&styles.pageWide]}>
      <View style={styles.shell}>
        <View><Text style={[styles.eyebrow,{color:t.accent}]}>QUEST BOARD</Text><Text style={[styles.title,{color:t.text}]}>Choose the next objective.</Text><Text style={[styles.lede,{color:t.muted}]}>Quest chains turn consistency and volume into visible progression and permanent rewards.</Text></View>

        <View style={[styles.tabs,{borderColor:t.border,backgroundColor:t.surface}]}>
          {(['Active','Completed','Guild'] as QuestTab[]).map(item=>{const active=item===tab;return <Pressable key={item} onPress={()=>setTab(item)} style={[styles.tab,active&&{backgroundColor:t.surfaceElevated,borderColor:t.accentSoft}]}><Text style={[styles.tabText,{color:active?t.accent:t.muted}]}>{item.toUpperCase()}</Text></Pressable>})}
        </View>

        {tab==='Active' ? <>
          <View style={[styles.campaign,{borderColor:t.border,backgroundColor:t.surface}]}>
            <ImageBackground source={{uri:art}} resizeMode="cover" style={[styles.campaignArt,wide&&styles.campaignArtWide]} imageStyle={{opacity:.95}}>
              <View style={styles.shade}/><View style={styles.campaignCopy}><Text style={[styles.eyebrow,{color:t.accent}]}>MAIN QUEST · CHAPTER I</Text><Text style={[styles.campaignTitle,{color:t.text}]}>Forge a Stronger You</Text><Text style={[styles.campaignText,{color:t.text}]}>Clear the opening progression chain through consistency, training volume and career accumulation.</Text></View>
            </ImageBackground>
            <View style={styles.campaignHud}>
              <View style={styles.campaignMeta}><View><Text style={[styles.metaLabel,{color:t.muted}]}>OBJECTIVES</Text><Text style={[styles.metaValue,{color:t.text}]}>{completedCount} / {activeQuests.length}</Text></View><View><Text style={[styles.metaLabel,{color:t.muted}]}>REWARD</Text><Text style={[styles.metaValue,{color:t.accent}]}>THE FORGED</Text></View><IconArt name="trophy" size={50}/></View>
              <View style={[styles.track,{backgroundColor:t.surfaceElevated}]}><View style={[styles.fill,{width:`${campaignRatio*100}%`,backgroundColor:t.accent}]}/></View>
              <Text style={[styles.progressCopy,{color:t.muted}]}>{Math.round(campaignRatio*100)}% complete · {activeQuests.length-completedCount} objectives remain</Text>
            </View>
          </View>

          <View style={styles.sectionHead}><View><Text style={[styles.eyebrow,{color:t.accent}]}>ACTIVE OBJECTIVES</Text><Text style={[styles.sectionTitle,{color:t.text}]}>Earn the next unlock.</Text></View><Text style={[styles.count,{color:t.muted}]}>{activeQuests.filter(q=>!q.complete).length} ACTIVE</Text></View>

          <View style={[styles.questGrid,wide&&styles.questGridWide]}>{activeQuests.map((quest,index)=>{const ratio=Math.min(1,quest.progress/quest.target);return <View key={quest.title} style={[styles.questCard,{borderColor:quest.complete?t.positive:t.border,backgroundColor:t.surface}]}><View style={styles.questHeader}><IconArt name={quest.icon} size={48}/><View style={{flex:1}}><Text style={[styles.questType,{color:quest.complete?t.positive:t.accent}]}>{quest.complete?'CLEARED':quest.type}</Text><Text style={[styles.questTitle,{color:t.text}]}>{quest.title}</Text></View></View><Text style={[styles.questDescription,{color:t.muted}]}>{quest.description}</Text><View style={styles.questNumbers}><Text style={[styles.questCurrent,{color:t.text}]}>{quest.progress.toLocaleString()}</Text><Text style={[styles.questTarget,{color:t.muted}]}>/ {quest.target.toLocaleString()}</Text><Text style={[styles.reward,{color:t.accent}]}>{quest.reward}</Text></View><View style={[styles.track,{backgroundColor:t.surfaceElevated}]}><View style={[styles.fill,{width:`${ratio*100}%`,backgroundColor:quest.complete?t.positive:index===0?t.positive:t.accent}]}/></View><Text style={[styles.questFooter,{color:quest.complete?t.positive:t.muted}]}>{quest.complete?'OBJECTIVE CLEARED':`${Math.round(ratio*100)}% COMPLETE`}</Text></View>})}</View>

          <View style={[styles.lockedRaid,{borderColor:t.border,backgroundColor:t.heroSurface}]}><IconArt name="quest" size={48}/><View style={{flex:1}}><Text style={[styles.eyebrow,{color:t.accent}]}>BOSS QUEST</Text><Text style={[styles.raidTitle,{color:t.text}]}>Cooperative raids unlock in Phase 3.</Text><Text style={[styles.raidCopy,{color:t.muted}]}>Shared training volume will eventually damage bosses, advance guild chapters and unlock group cosmetics.</Text></View></View>
        </> : tab==='Completed' ? <View style={[styles.empty,{borderColor:t.border,backgroundColor:t.surface}]}><IconArt name="trophy" size={62}/><Text style={[styles.emptyTitle,{color:t.text}]}>{completedCount} quest{completedCount===1?'':'s'} cleared</Text><Text style={[styles.emptyCopy,{color:t.muted}]}>{completedCount?'Completed objectives are now derived from your workout ledger and will remain cleared as your career advances.':'Your first completed quest will appear here automatically.'}</Text></View> : <View style={[styles.empty,{borderColor:t.border,backgroundColor:t.surface}]}><IconArt name="quest" size={62}/><Text style={[styles.emptyTitle,{color:t.text}]}>Guild campaigns</Text><Text style={[styles.emptyCopy,{color:t.muted}]}>Co-op boss battles and shared quest chains are reserved for the social phase.</Text></View>}
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const styles=StyleSheet.create({safe:{flex:1},page:{padding:14,paddingBottom:120},pageWide:{padding:24},shell:{width:'100%',maxWidth:1120,alignSelf:'center',gap:16},eyebrow:{fontSize:8,fontWeight:'900',letterSpacing:1.5},title:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:34,lineHeight:39,fontWeight:'900',marginTop:6},lede:{fontSize:12,lineHeight:18,maxWidth:620,marginTop:6},tabs:{flexDirection:'row',borderWidth:1,borderRadius:14,padding:4,gap:4},tab:{flex:1,minHeight:42,borderWidth:1,borderColor:'transparent',borderRadius:10,alignItems:'center',justifyContent:'center'},tabText:{fontSize:8,fontWeight:'900',letterSpacing:.9},campaign:{overflow:'hidden',borderWidth:1,borderRadius:20},campaignArt:{height:300,justifyContent:'flex-end'},campaignArtWide:{height:390},shade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.34)'},campaignCopy:{padding:20,maxWidth:620},campaignTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:32,lineHeight:36,fontWeight:'900',marginTop:5,textShadowColor:'rgba(0,0,0,.8)',textShadowOffset:{width:0,height:2},textShadowRadius:8},campaignText:{fontSize:11,lineHeight:17,marginTop:7,maxWidth:500,textShadowColor:'rgba(0,0,0,.8)',textShadowOffset:{width:0,height:1},textShadowRadius:6},campaignHud:{padding:16},campaignMeta:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:12},metaLabel:{fontSize:7,fontWeight:'900',letterSpacing:1},metaValue:{fontSize:16,fontWeight:'900',marginTop:3},track:{height:7,borderRadius:99,overflow:'hidden'},fill:{height:'100%',borderRadius:99},progressCopy:{fontSize:8,marginTop:7},sectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:12,marginTop:4},sectionTitle:{fontFamily:Platform.select({ios:'Georgia',default:'serif'}),fontSize:23,fontWeight:'800',marginTop:4},count:{fontSize:7,fontWeight:'900',letterSpacing:1},questGrid:{gap:10},questGridWide:{flexDirection:'row'},questCard:{flex:1,borderWidth:1,borderRadius:17,padding:15,minHeight:235},questHeader:{flexDirection:'row',alignItems:'center',gap:10},questType:{fontSize:7,fontWeight:'900',letterSpacing:1.1},questTitle:{fontSize:18,fontWeight:'900',marginTop:3},questDescription:{fontSize:10,lineHeight:16,marginTop:13,minHeight:48},questNumbers:{flexDirection:'row',alignItems:'baseline',marginTop:16,marginBottom:8},questCurrent:{fontSize:20,fontWeight:'900'},questTarget:{fontSize:10,fontWeight:'700',marginLeft:4},reward:{marginLeft:'auto',fontSize:8,fontWeight:'900'},questFooter:{fontSize:7,fontWeight:'900',letterSpacing:.8,marginTop:7},lockedRaid:{borderWidth:1,borderRadius:17,padding:16,flexDirection:'row',alignItems:'center',gap:12},raidTitle:{fontSize:17,fontWeight:'900',marginTop:4},raidCopy:{fontSize:9.5,lineHeight:15,marginTop:4},empty:{borderWidth:1,borderRadius:18,padding:36,alignItems:'center'},emptyTitle:{fontSize:22,fontWeight:'900',marginTop:12},emptyCopy:{fontSize:11,lineHeight:17,textAlign:'center',maxWidth:470,marginTop:7}});
