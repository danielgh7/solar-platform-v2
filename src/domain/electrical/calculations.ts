import type {ElectricalDesign,InverterSpec,PVModuleElectricalSpec,StringCircuit} from './types';
export function installedDcKwp(moduleCount:number,module:PVModuleElectricalSpec){return moduleCount*module.pmaxW/1000;}
export function inverterAcKw(design:ElectricalDesign,inverters:InverterSpec[]){return design.inverters.reduce((s,i)=>s+(inverters.find(x=>x.id===i.specId)?.ratedAcKw||0),0);}
export function dcAcRatio(dcKw:number,acKw:number){return acKw>0?dcKw/acKw:0;}
export function coldVocPerModule(module:PVModuleElectricalSpec,minTempC:number,stcTempC:number,overrideCoeffPct?:number){const coeff=(overrideCoeffPct??module.tempCoeffVocPctPerC)/100;return module.vocV*(1+coeff*(minTempC-stcTempC));}
export function stringElectrical(s:StringCircuit,module:PVModuleElectricalSpec,minTempC:number,stcTempC:number,overrideCoeffPct?:number){const n=s.moduleIds.length;return{count:n,vocV:n*module.vocV,coldVocV:n*coldVocPerModule(module,minTempC,stcTempC,overrideCoeffPct),vmpV:n*module.vmpV,impA:module.impA,iscA:module.iscA};}
export function assignedModuleIds(strings:StringCircuit[]){return strings.flatMap(s=>s.moduleIds);}
export function duplicateModuleIds(strings:StringCircuit[]){const seen=new Set<string>(),dups=new Set<string>();for(const id of assignedModuleIds(strings)){if(seen.has(id))dups.add(id);seen.add(id);}return [...dups];}
export function mpptParallelCurrent(design:ElectricalDesign,inverterId:string,mpptIndex:number,module:PVModuleElectricalSpec,kind:'imp'|'isc'='imp'){return design.strings.filter(s=>s.inverterId===inverterId&&s.mpptIndex===mpptIndex).reduce((sum,s)=>sum+(s.moduleIds.length?(kind==='imp'?module.impA:module.iscA):0),0);}
