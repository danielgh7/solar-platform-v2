import type {InverterSpec,PVModuleElectricalSpec} from './types';
export const MODULE_CATALOG:PVModuleElectricalSpec[]=[
{id:'mod-640',manufacturer:'Fixture Solar',model:'FS-640N',pmaxW:640,vocV:52.1,vmpV:44.0,iscA:15.65,impA:14.55,tempCoeffVocPctPerC:-0.24,tempCoeffPmaxPctPerC:-0.29,maxSystemVoltageV:1500,fixture:true},
{id:'mod-585',manufacturer:'Fixture PV',model:'FP-585M',pmaxW:585,vocV:51.0,vmpV:42.8,iscA:14.45,impA:13.67,tempCoeffVocPctPerC:-0.25,tempCoeffPmaxPctPerC:-0.30,maxSystemVoltageV:1500,fixture:true},
{id:'mod-550',manufacturer:'Fixture Energy',model:'FE-550B',pmaxW:550,vocV:49.9,vmpV:41.7,iscA:14.10,impA:13.19,tempCoeffVocPctPerC:-0.26,tempCoeffPmaxPctPerC:-0.31,maxSystemVoltageV:1500,fixture:true}
];
export const INVERTER_CATALOG:InverterSpec[]=[
{id:'inv-20',manufacturer:'Fixture Grid',model:'FG-20KTL',ratedAcKw:20,maxDcInputKw:30,maxDcVoltageV:1100,mppt:{count:4,inputsPerMppt:2,minVoltageV:200,maxVoltageV:1000,startupVoltageV:200,maxInputCurrentA:30,maxShortCircuitCurrentA:40},nominalEfficiency:97.8,maxEfficiency:98.6,fixture:true},
{id:'inv-30',manufacturer:'Fixture Grid',model:'FG-30KTL',ratedAcKw:30,maxDcInputKw:45,maxDcVoltageV:1100,mppt:{count:4,inputsPerMppt:2,minVoltageV:200,maxVoltageV:1000,startupVoltageV:200,maxInputCurrentA:32,maxShortCircuitCurrentA:42},nominalEfficiency:98.0,maxEfficiency:98.7,fixture:true},
{id:'inv-50',manufacturer:'Fixture Grid',model:'FG-50KTL',ratedAcKw:50,maxDcInputKw:75,maxDcVoltageV:1100,mppt:{count:6,inputsPerMppt:2,minVoltageV:200,maxVoltageV:1000,startupVoltageV:200,maxInputCurrentA:32,maxShortCircuitCurrentA:45},nominalEfficiency:98.1,maxEfficiency:98.8,fixture:true}
];
export const moduleById=(id:string)=>MODULE_CATALOG.find(x=>x.id===id)!;export const inverterById=(id:string)=>INVERTER_CATALOG.find(x=>x.id===id)!;
