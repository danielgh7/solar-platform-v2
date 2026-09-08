import {useEffect,useMemo,useState} from 'react';
import type {ProjectEnergyProfile} from './types';
import {defaultEnergyProfile} from './types';
const KEY='solar-platform-v2:r1:energy-profile';
export function loadEnergyProfile(storage:Pick<Storage,'getItem'>=localStorage):ProjectEnergyProfile{try{const raw=storage.getItem(KEY);if(!raw)return structuredClone(defaultEnergyProfile);return{...structuredClone(defaultEnergyProfile),...JSON.parse(raw)} as ProjectEnergyProfile}catch{return structuredClone(defaultEnergyProfile)}}
export function saveEnergyProfile(profile:ProjectEnergyProfile,storage:Pick<Storage,'setItem'>=localStorage){storage.setItem(KEY,JSON.stringify(profile));}
export function useEnergyProfile(){const [profile,setProfile]=useState<ProjectEnergyProfile>(()=>loadEnergyProfile());useEffect(()=>saveEnergyProfile(profile),[profile]);const update=(patch:Partial<ProjectEnergyProfile>)=>setProfile(p=>({...p,...patch,updatedAt:new Date().toISOString()}));return useMemo(()=>({profile,setProfile,update}),[profile]);}
export {KEY as ENERGY_STORAGE_KEY};
