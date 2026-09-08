export type TariffCode='1'|'1A'|'1B'|'1C'|'1D'|'1E'|'1F'|'DAC'|'PDBT'|'GDBT'|'GDMTO'|'GDMTH';
export type TariffFamily='residential'|'commercial'|'demand';
export type BillingPeriod={id:string;period:string;label:string};
export type ConsumptionEntry={period:string;kwh:number;amountMxn?:number};
export type DemandEntry={period:string;kw:number};
export type PowerFactorEntry={period:string;value:number};
export type ConsumptionSource={kind:'manual'|'csv'|'document';status:'pending manual extraction'|'manually entered'|'validated';fileName?:string;mimeType?:string;size?:number;uploadedAt?:string};
export type ValidationSeverity='error'|'warning'|'info';
export type ConsumptionValidation={code:string;severity:ValidationSeverity;message:string;period?:string};
export type DataQualityStatus='Incomplete'|'Needs review'|'Ready for sizing';
export type SizingObjective={kind:'offset'|'maximize-savings'|'minimize-size';targetOffset:number;label:string};
export type SizingAssumptions={panelWattage:number;specificYield:number;lossFactor:number;designMargin:number};
export type SizingScenario={id:'conservative'|'recommended'|'maximum';name:string;targetOffset:number;panelCount:number;requiredDcKwp:number;dcKwp:number;annualProduction:number;achievedOffset:number;deltaToTarget:number;assumptions:SizingAssumptions};
export type CfeService={tariff:TariffCode;serviceNumber?:string;siteType:'Residential'|'Commercial'|'Industrial';voltage?:string;phases?:string};
export type ProjectEnergyProfile={version:1;service:CfeService;consumption:ConsumptionEntry[];demand:DemandEntry[];powerFactor:PowerFactorEntry[];source:ConsumptionSource;objective:SizingObjective;assumptions:SizingAssumptions;selectedScenarioId?:SizingScenario['id'];updatedAt:string};

export const tariffs:TariffCode[]=['1','1A','1B','1C','1D','1E','1F','DAC','PDBT','GDBT','GDMTO','GDMTH'];
export function tariffFamily(t:TariffCode):TariffFamily{if(['1','1A','1B','1C','1D','1E','1F','DAC'].includes(t))return'residential';if(['GDMTO','GDMTH'].includes(t))return'demand';return'commercial'}
export const requiresDemand=(t:TariffCode)=>tariffFamily(t)==='demand';
export const supportsPowerFactor=(t:TariffCode)=>tariffFamily(t)==='demand';
const base=[1650,1710,1540,1480,1605,1690,1840,1975,2110,2250,2080,1910];
const labels=['2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08'];
export const defaultEnergyProfile:ProjectEnergyProfile={version:1,service:{tariff:'DAC',siteType:'Residential',voltage:'127/220 V',phases:'1Φ'},consumption:labels.map((period,i)=>({period,kwh:base[i],amountMxn:Math.round(base[i]*3.02)})),demand:[],powerFactor:[],source:{kind:'manual',status:'manually entered'},objective:{kind:'offset',targetOffset:95,label:'95% offset'},assumptions:{panelWattage:640,specificYield:1632,lossFactor:1,designMargin:0},selectedScenarioId:'recommended',updatedAt:new Date(0).toISOString()};
