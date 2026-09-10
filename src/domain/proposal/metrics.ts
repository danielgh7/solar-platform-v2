import type {ProposalProjectSnapshot} from './types';
export const INTERNAL_ONLY_FIELDS=['unitCost','directProjectCost','markup','grossProfit','grossMargin','contributionMargin','cac','commission','salesCommission','commercialCosts','contingencyCost'] as const;
export function customerSafeMetrics(s:ProposalProjectSnapshot){return{
 annualConsumptionKwh:s.consumption.annualKwh,
 moduleCount:s.system.moduleCount,moduleWattage:s.system.moduleWattage,moduleModel:`${s.system.moduleManufacturer} ${s.system.moduleModel}`,
 installedDcKwp:s.system.installedDcKwp,inverterModels:s.system.inverterModels,inverterAcKw:s.system.inverterAcKw,dcAcRatio:s.system.dcAcRatio,
 annualProductionKwh:s.energy.annualProductionKwh,annualEnergyOffsetPct:s.energy.energyOffsetPct,
 year1AvoidedElectricityCostMxn:s.financial.year1AvoidedElectricityCostMxn,
 priceBeforeVat:s.investment.priceBeforeVat,vat:s.investment.vatMxn,totalIncludingVat:s.investment.totalIncludingVat,
 paybackYears:s.financial.simplePaybackYears,irrPct:s.financial.irrPct,npvMxn:s.financial.npvMxn,economicCase:s.financial.caseName,analysisHorizonYears:s.financial.analysisTermYears
};}
const blocked=new Set<string>(INTERNAL_ONLY_FIELDS.map(x=>x.toLowerCase()));
export function containsInternalField(value:unknown):boolean{if(value===null||typeof value!=='object')return false;if(Array.isArray(value))return value.some(containsInternalField);return Object.entries(value as Record<string,unknown>).some(([key,v])=>blocked.has(key.toLowerCase())||containsInternalField(v));}
