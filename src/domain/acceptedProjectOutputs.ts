import type {ProjectEnergyProfile} from './energy/types';
import {deriveEnergyMetrics} from './energy/metrics';
import {dataQualityStatus,validateEnergyProfile} from './energy/validation';
import type {SiteDesign} from './design/types';
import {summarizeDesign} from './design/summary';
import type {ElectricalDesign} from './electrical/types';
import {INVERTER_CATALOG,moduleById,inverterById} from './electrical/catalog';
import {dcAcRatio,installedDcKwp,inverterAcKw} from './electrical/calculations';
import {monthlyProduction,annualProductionSummary} from './electrical/production';
import {validateElectricalDesign} from './electrical/validation';
import type {R4ProjectState} from './economics/types';
import {deriveProjectEconomics} from './economics/model';

export function deriveAcceptedProjectOutputs(profile:ProjectEnergyProfile,design:SiteDesign,electrical:ElectricalDesign,r4:R4ProjectState){
  const r1Metrics=deriveEnergyMetrics(profile);
  const r1Issues=validateEnergyProfile(profile);
  const r1Quality=dataQualityStatus(r1Issues);
  const r2Summary=summarizeDesign(design);
  const module=moduleById(electrical.selectedModuleSpecId);
  const placedIds=design.layout.placements.map(p=>p.id);
  const r3DcKwp=installedDcKwp(placedIds.length,module);
  const r3AcKw=inverterAcKw(electrical,INVERTER_CATALOG);
  const consumption=Array.from({length:12},(_,i)=>profile.consumption.slice(-12).find(x=>Number(x.period.slice(5,7))===i+1)?.kwh||0);
  const r3Monthly=monthlyProduction(r3DcKwp,electrical.resource,electrical.assumptions,consumption);
  const r3Summary=annualProductionSummary(r3DcKwp,r3Monthly,electrical.assumptions);
  const r3Issues=validateElectricalDesign(electrical,module,placedIds,design.panelWattage);
  const r4Economics=deriveProjectEconomics(profile,design,electrical,r4);
  const inverterSpecs=electrical.inverters.map(x=>({instance:x,spec:inverterById(x.specId)}));
  return{profile,r1Metrics,r1Issues,r1Quality,design,r2Summary,electrical,module,inverterSpecs,r3DcKwp,r3AcKw,r3DcAcRatio:dcAcRatio(r3DcKwp,r3AcKw),r3Monthly,r3Summary,r3Issues,r4State:r4,r4Economics};
}
export type AcceptedProjectOutputs=ReturnType<typeof deriveAcceptedProjectOutputs>;
