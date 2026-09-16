import * as HealthKit from '@appeeky/expo-healthkit';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import type { ActivityModality, VerificationEvidence, VerificationSource } from './xpTrust';

export type VerificationCapabilities={
  healthAvailable:boolean;
  gpsAvailable:boolean;
  platform:'ios'|'android'|'web'|'other';
};

export type GpsCaptureResult={
  distanceMiles:number;
  durationMinutes:number;
  pointCount:number;
  startedAt:string;
  completedAt:string;
  source:VerificationSource;
};

type StopGpsCapture=()=>Promise<GpsCaptureResult>;

const metersToMiles=(meters:number)=>meters/1609.344;
const rad=(degrees:number)=>degrees*Math.PI/180;
function distanceMeters(a:Location.LocationObjectCoords,b:Location.LocationObjectCoords){
  const earth=6371000;
  const dLat=rad(b.latitude-a.latitude);const dLon=rad(b.longitude-a.longitude);
  const lat1=rad(a.latitude);const lat2=rad(b.latitude);
  const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*earth*Math.asin(Math.sqrt(h));
}

export function getVerificationCapabilities():VerificationCapabilities{
  const platform=Platform.OS==='ios'||Platform.OS==='android'||Platform.OS==='web'?Platform.OS:'other';
  let healthAvailable=false;
  try{healthAvailable=Boolean(HealthKit.isAvailable());}catch{healthAvailable=false;}
  return {healthAvailable,gpsAvailable:Platform.OS==='ios'||Platform.OS==='android'||Platform.OS==='web',platform};
}

export async function requestHealthVerificationAccess(){
  if(!HealthKit.isAvailable())return {available:false,granted:false};
  await HealthKit.requestAuthorization({
    toRead:[HealthKit.QuantityType.heartRate,HealthKit.WorkoutType.workout],
    toShare:[],
  });
  return {available:true,granted:true};
}

export async function requestGpsVerificationAccess(){
  const permission=await Location.requestForegroundPermissionsAsync();
  return {available:true,granted:permission.granted,status:permission.status};
}

export async function startGpsVerification():Promise<StopGpsCapture>{
  const permission=await Location.requestForegroundPermissionsAsync();
  if(!permission.granted)throw new Error('GPS permission is required for location-verified endurance sessions.');
  const startedAt=new Date();let totalMeters=0;let points=0;let last:Location.LocationObjectCoords|null=null;
  const subscription=await Location.watchPositionAsync({accuracy:Location.Accuracy.High,timeInterval:3000,distanceInterval:5},location=>{
    const current=location.coords;
    if(last){const delta=distanceMeters(last,current);if(Number.isFinite(delta)&&delta>=0&&delta<1000)totalMeters+=delta;}
    last=current;points+=1;
  });
  return async()=>{
    subscription.remove();const completedAt=new Date();
    return {distanceMiles:metersToMiles(totalMeters),durationMinutes:Math.max(1,(completedAt.getTime()-startedAt.getTime())/60000),pointCount:points,startedAt:startedAt.toISOString(),completedAt:completedAt.toISOString(),source:'gps'};
  };
}

export async function collectHealthVerificationEvidence(args:{startedAt:string;completedAt:string;modality:ActivityModality}):Promise<VerificationEvidence|null>{
  if(!HealthKit.isAvailable())return null;
  const from=new Date(args.startedAt);const to=new Date(args.completedAt);
  try{
    const workouts:any[]=await HealthKit.queryWorkouts({from,to,limit:20,ascending:false});
    const heartRate:any[]=await HealthKit.queryQuantitySamples({type:HealthKit.QuantityType.heartRate,unit:HealthKit.Unit.countPerMinute,from,to,limit:500,ascending:true});
    const matching=workouts.find(workout=>{
      const start=new Date(workout.startDate??workout.start_date??0).getTime();const end=new Date(workout.endDate??workout.end_date??0).getTime();
      return start<=to.getTime()+5*60000&&end>=from.getTime()-5*60000;
    });
    const workoutMinutes=matching?Math.max(0,(new Date(matching.endDate??matching.end_date).getTime()-new Date(matching.startDate??matching.start_date).getTime())/60000):0;
    if(!matching&&heartRate.length<4)return null;
    return {
      source:'healthkit',modality:args.modality,liveTracked:true,
      sensorMinutes:Math.max(workoutMinutes,heartRate.length>=4?Math.min((to.getTime()-from.getTime())/60000,heartRate.length/2):0),
    };
  }catch{return null;}
}

export function mergeVerificationEvidence(primary:VerificationEvidence,secondary?:VerificationEvidence|null):VerificationEvidence{
  if(!secondary)return primary;
  const sensorPriority=(source?:VerificationSource)=>source==='wearable'?4:source==='healthkit'?3:source==='gps'?2:source==='live_app'?1:0;
  return {...primary,...secondary,source:sensorPriority(secondary.source)>=sensorPriority(primary.source)?secondary.source:primary.source,sensorMinutes:Math.max(Number(primary.sensorMinutes||0),Number(secondary.sensorMinutes||0))};
}
