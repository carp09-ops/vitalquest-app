import React, { createContext, useContext, useEffect, useMemo } from 'react';

type WebStore = { workout_sessions:any[]; exercise_sets:any[]; endurance_sessions:any[]; xp_events:any[]; attribute_events:any[]; sync_outbox:any[]; };
const STORAGE_KEY='vitalquest.webdb.v2';
function emptyStore():WebStore{return{workout_sessions:[],exercise_sets:[],endurance_sessions:[],xp_events:[],attribute_events:[],sync_outbox:[]}}
function loadStore():WebStore{if(typeof window==='undefined')return emptyStore();try{const raw=window.localStorage.getItem(STORAGE_KEY)??window.localStorage.getItem('vitalquest.webdb.v1');return raw?{...emptyStore(),...JSON.parse(raw)}:emptyStore()}catch{return emptyStore()}}
function persistStore(store:WebStore){if(typeof window!=='undefined')window.localStorage.setItem(STORAGE_KEY,JSON.stringify(store))}
function normalize(sql:string){return sql.replace(/\s+/g,' ').trim().toLowerCase()}

function createWebDb(){return{
  async execAsync(){},
  async withTransactionAsync(callback:()=>Promise<void>){await callback()},
  async runAsync(sql:string,...params:any[]){const store=loadStore();const normalized=normalize(sql);
    if(normalized.includes('insert into workout_sessions'))store.workout_sessions.push({id:params[0],template_id:params[1],name:params[2],started_at:params[3],completed_at:params[4],duration_minutes:params[5],total_volume:params[6],total_xp:params[7]});
    else if(normalized.includes('insert into exercise_sets'))store.exercise_sets.push({id:params[0],session_id:params[1],exercise_id:params[2],exercise_name:params[3],set_number:params[4],weight:params[5],reps:params[6],is_pr:params[7],completed_at:params[8]});
    else if(normalized.includes('insert into endurance_sessions'))store.endurance_sessions.push({id:params[0],session_id:params[1],distance_miles:params[2],duration_minutes:params[3],avg_pace_seconds:params[4],activity_type:params[5],created_at:params[6]});
    else if(normalized.includes('insert into xp_events'))store.xp_events.push({id:params[0],session_id:params[1],amount:params[2],reason:params[3],created_at:params[4]});
    else if(normalized.includes('insert into attribute_events'))store.attribute_events.push({id:params[0],session_id:params[1],attribute:params[2],amount:params[3],reason:params[4],created_at:params[5]});
    else if(normalized.includes('insert into sync_outbox'))store.sync_outbox.push({id:params[0],entity_type:params[1],entity_id:params[2],operation:params[3],payload_json:params[4],status:'pending',retry_count:0,created_at:params[5]});
    persistStore(store);return{changes:1,lastInsertRowId:0};
  },
  async getFirstAsync<T=any>(sql:string,...params:any[]):Promise<T|null>{const store=loadStore();const normalized=normalize(sql);
    if(normalized.includes('select completed_at from workout_sessions')){const row=[...store.workout_sessions].sort((a,b)=>String(b.completed_at).localeCompare(String(a.completed_at)))[0];return(row?{completed_at:row.completed_at}:null) as T|null}
    if(normalized.includes('count(*)')&&normalized.includes('from workout_sessions')){let rows=store.workout_sessions;const literal=normalized.match(/template_id\s*=\s*['"]([^'"]+)['"]/i)?.[1];if(literal)rows=rows.filter(row=>row.template_id===literal);if(normalized.includes("template_id in ('push','pull','legs')"))rows=rows.filter(row=>['push','pull','legs'].includes(row.template_id));if(normalized.includes('completed_at >= ?'))rows=rows.filter(row=>row.completed_at>=params[0]);return{total:rows.length} as T}
    if(normalized.includes('sum(total_volume)')&&normalized.includes('from workout_sessions')){let rows=store.workout_sessions;if(normalized.includes('completed_at >= ?'))rows=rows.filter(row=>row.completed_at>=params[0]);return{total:rows.reduce((sum,row)=>sum+Number(row.total_volume||0),0)} as T}
    if(normalized.includes('sum(total_xp)')&&normalized.includes('from workout_sessions')){let rows=store.workout_sessions;if(normalized.includes('completed_at >= ?'))rows=rows.filter(row=>row.completed_at>=params[0]);return{total:rows.reduce((sum,row)=>sum+Number(row.total_xp||0),0)} as T}
    if(normalized.includes('count(*)')&&normalized.includes('from exercise_sets')&&normalized.includes('is_pr=1'))return{total:store.exercise_sets.filter(row=>Number(row.is_pr)===1).length} as T;
    if(normalized.includes('sum(distance_miles)')&&normalized.includes('from endurance_sessions')){let rows=store.endurance_sessions;if(normalized.includes('created_at >= ?'))rows=rows.filter(row=>row.created_at>=params[0]);return{total:rows.reduce((sum,row)=>sum+Number(row.distance_miles||0),0)} as T}
    if(normalized.includes('from xp_events'))return{total:store.xp_events.reduce((sum,row)=>sum+Number(row.amount||0),0)} as T;
    if(normalized.includes('from attribute_events')){const literal=normalized.match(/attribute\s*=\s*['"]([^'"]+)['"]/i)?.[1];const attribute=params[0]??literal;return{total:store.attribute_events.filter(row=>row.attribute===attribute).reduce((sum,row)=>sum+Number(row.amount||0),0)} as T}
    return null;
  },
  async getAllAsync<T=any>(sql:string,...params:any[]):Promise<T[]>{const store=loadStore();const normalized=normalize(sql);
    if(normalized.includes('distinct substr(completed_at,1,10)')&&normalized.includes('from workout_sessions')){const days=Array.from(new Set(store.workout_sessions.map(row=>String(row.completed_at).slice(0,10)))).sort((a,b)=>b.localeCompare(a)).slice(0,90).map(day=>({day}));return days as T[]}
    if(normalized.includes('from workout_sessions')&&normalized.includes('order by completed_at desc')&&normalized.includes('limit 12')){return [...store.workout_sessions].sort((a,b)=>String(b.completed_at).localeCompare(String(a.completed_at))).slice(0,12) as T[]}
    if(normalized.includes('from exercise_sets')&&normalized.includes('order by completed_at desc')){return [...store.exercise_sets].sort((a,b)=>String(b.completed_at).localeCompare(String(a.completed_at))).slice(0,240) as T[]}
    return[];
  }
}}

type WebDb=ReturnType<typeof createWebDb>;const DbContext=createContext<WebDb|null>(null);
export function SQLiteProvider({children,onInit}:{children:React.ReactNode;databaseName?:string;onInit?:(db:any)=>Promise<void>|void}){const db=useMemo(()=>createWebDb(),[]);useEffect(()=>{void onInit?.(db)},[db,onInit]);return <DbContext.Provider value={db}>{children}</DbContext.Provider>}
export function useSQLiteContext(){const db=useContext(DbContext);if(!db)throw new Error('useSQLiteContext must be used inside SQLiteProvider');return db as any}
