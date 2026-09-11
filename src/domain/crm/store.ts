import {useCallback,useEffect,useState} from 'react';import type {CrmState} from './types';import {migrateCrmState} from './migration';import {seedCrmState} from './fixtures';
const KEY='solar-platform-v2:r6:crm:default';
export function loadCrmState():CrmState{try{const raw=localStorage.getItem(KEY);return raw?migrateCrmState(JSON.parse(raw)):seedCrmState()}catch{return seedCrmState()}}
export function saveCrmState(state:CrmState){localStorage.setItem(KEY,JSON.stringify(state))}
export function useCrmState(){const [state,setState]=useState<CrmState>(()=>typeof localStorage==='undefined'?seedCrmState():loadCrmState());useEffect(()=>{if(typeof localStorage!=='undefined')saveCrmState(state)},[state]);const reset=useCallback(()=>setState(seedCrmState()),[]);return{state,setState,reset,key:KEY}}
export const CRM_STORAGE_KEY=KEY;
