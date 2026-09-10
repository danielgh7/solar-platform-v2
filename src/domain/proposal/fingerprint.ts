import type {AcceptedProjectOutputs} from '../acceptedProjectOutputs';
export function stableStringify(value:unknown):string{if(value===null||typeof value!=='object')return JSON.stringify(value);if(Array.isArray(value))return`[${value.map(stableStringify).join(',')}]`;const obj=value as Record<string,unknown>;return`{${Object.keys(obj).sort().map(k=>`${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;}
export function fnv1a(input:string):string{let h=0x811c9dc5;for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,0x01000193);}return(h>>>0).toString(16).padStart(8,'0');}
export function proposalSourceFingerprint(o:AcceptedProjectOutputs):string{return fnv1a(stableStringify({
r1:{version:o.profile.version,updatedAt:o.profile.updatedAt,service:o.profile.service,consumption:o.profile.consumption},
r2:{version:o.design.version,updatedAt:o.design.updatedAt,designBasisId:o.design.designBasisId,roofs:o.design.roofs,obstructions:o.design.obstructions,restrictedZones:o.design.restrictedZones,moduleDimensions:o.design.moduleDimensions,placements:o.design.layout.placements,panelWattage:o.design.panelWattage,targetPanelCount:o.design.targetPanelCount,targetOffset:o.design.targetOffset},
r3:{version:o.electrical.version,updatedAt:o.electrical.updatedAt,module:o.electrical.selectedModuleSpecId,inverters:o.electrical.inverters,strings:o.electrical.strings,assumptions:o.electrical.assumptions,resource:o.electrical.resource},
r4:{version:o.r4State.version,updatedAt:o.r4State.updatedAt,pricing:o.r4Economics.pricing,baseline:o.r4Economics.baseline,solarValue:o.r4Economics.solarValue,financial:o.r4Economics.metrics,selectedScenarioId:o.r4State.selectedScenarioId,financialAssumptions:o.r4State.financial}
}));}
