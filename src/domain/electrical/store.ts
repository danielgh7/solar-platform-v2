import {useEffect,useMemo,useState} from 'react';
import {MEXICO_RESOURCE_FIXTURE} from './production';
import type {ElectricalDesign} from './types';
export const ELECTRICAL_STORAGE_KEY='solar-platform-v2:r3:electrical:SOL-2026-0184';
export function createDefaultElectricalDesign():ElectricalDesign{return{version:3,projectId:'SOL-2026-0184',selectedModuleSpecId:'mod-640',inverters:[{id:'inv-1',specId:'inv-20',name:'INV-1'}],strings:[],assumptions:{minimumDesignTempC:-5,stcTempC:25,moduleVocTempCoeffPctPerC:-0.24,soilingPct:2,mismatchPct:1.5,wiringPct:1.5,availabilityPct:1,userShadingPct:0,year1DegradationPct:0,inverterEfficiencyPct:97.8},resource:MEXICO_RESOURCE_FIXTURE,resourceLabel:'Mexico planning fixture — editable example data, no external provider',updatedAt:new Date(0).toISOString()};}
export function loadElectricalDesign(storage:Pick<Storage,'getItem'>=localStorage){try{const raw=storage.getItem(ELECTRICAL_STORAGE_KEY);return raw?JSON.parse(raw) as ElectricalDesign:createDefaultElectricalDesign()}catch{return createDefaultElectricalDesign()}}
export function saveElectricalDesign(d:ElectricalDesign,storage:Pick<Storage,'setItem'>=localStorage){storage.setItem(ELECTRICAL_STORAGE_KEY,JSON.stringify(d));}
export function useElectricalDesign(){const [electrical,setElectrical]=useState<ElectricalDesign>(()=>loadElectricalDesign());useEffect(()=>saveElectricalDesign(electrical),[electrical]);return useMemo(()=>({electrical,setElectrical}),[electrical]);}
