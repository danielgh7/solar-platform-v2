import {z} from 'zod';

export const fieldStatusSchema=z.enum(['accepted','needs-review','rejected','corrected']);
export const provenanceSchema=z.object({page:z.number().int().positive().nullable(),region:z.object({x:z.number(),y:z.number(),width:z.number().positive(),height:z.number().positive()}).nullable(),text:z.string().max(500).nullable()});
export const extractedFieldSchema=z.object({raw:z.unknown(),normalized:z.unknown(),confidence:z.number().min(0).max(1),method:z.enum(['ai','ocr','deterministic','manual']),provenance:provenanceSchema,status:fieldStatusSchema});
export const chargeLineSchema=z.object({concept:z.string(),amount:z.number(),kind:z.enum(['energy','demand','fixed','distribution','transmission','capacity','supply','local','tax','credit','other']),provenance:provenanceSchema.optional()});
export const historyEntrySchema=z.object({periodStart:z.string().date(),periodEnd:z.string().date(),kwh:z.number().nonnegative(),demandKw:z.number().nonnegative().nullable().optional(),powerFactor:z.number().min(0).max(1.2).nullable().optional(),provenance:z.enum(['bill','manual']),sourceDocumentId:z.string().nullable().optional()});
export const cfeExtractionSchema=z.object({schemaVersion:z.literal(1),documentKind:z.enum(['cfe-bill','non-cfe','unknown']),fields:z.record(z.string(),extractedFieldSchema),history:z.array(historyEntrySchema).max(24),charges:z.array(chargeLineSchema),warnings:z.array(z.string()),modelRationale:z.string().max(1000).optional()});
export type CfeExtraction=z.infer<typeof cfeExtractionSchema>;
export type ValidationIssue={code:string;severity:'warning'|'blocking';field?:string;message:string};

const n=(e:CfeExtraction,key:string)=>typeof e.fields[key]?.normalized==='number'?e.fields[key].normalized as number:null;
const s=(e:CfeExtraction,key:string)=>typeof e.fields[key]?.normalized==='string'?e.fields[key].normalized as string:null;
const date=(value:string|null)=>value?new Date(`${value}T00:00:00Z`):null;
const overlap=(a:{periodStart:string;periodEnd:string},b:{periodStart:string;periodEnd:string})=>a.periodStart<=b.periodEnd&&b.periodStart<=a.periodEnd;

export function validateCfeExtraction(e:CfeExtraction):ValidationIssue[]{
 const out:ValidationIssue[]=[];
 if(e.documentKind!=='cfe-bill')out.push({code:'NON_CFE_DOCUMENT',severity:'blocking',message:'El documento no se identificó de forma segura como recibo CFE.'});
 for(const [key,f] of Object.entries(e.fields)){
  if(f.confidence<0.8&&['serviceNumber','periodStart','periodEnd','tariff','consumptionKwh','totalBill'].includes(key))out.push({code:'LOW_CONFIDENCE_CRITICAL',severity:'blocking',field:key,message:`${key} requiere revisión por baja confianza.`});
  if(typeof f.normalized==='string'&&/ignore (all|previous)|system prompt|developer message|exfiltrat|api[_ -]?key/i.test(f.normalized))out.push({code:'UNTRUSTED_INSTRUCTION_TEXT',severity:'blocking',field:key,message:'Texto adversarial tratado como contenido no confiable.'});
 }
 const consumption=n(e,'consumptionKwh');if(consumption!==null&&consumption<0)out.push({code:'NEGATIVE_CONSUMPTION',severity:'blocking',field:'consumptionKwh',message:'El consumo no puede ser negativo.'});
 const demand=n(e,'demandKw');if(demand!==null&&(demand<0||demand>100000))out.push({code:'DEMAND_SANITY',severity:'blocking',field:'demandKw',message:'Demanda fuera de rango razonable.'});
 const pf=n(e,'powerFactor');if(pf!==null&&(pf<0||pf>1))out.push({code:'POWER_FACTOR_RANGE',severity:'blocking',field:'powerFactor',message:'Factor de potencia fuera de 0–1.'});
 const start=date(s(e,'periodStart')),end=date(s(e,'periodEnd'));if(start&&end){const days=Math.round((end.getTime()-start.getTime())/86400000)+1;if(days<=0||days>95)out.push({code:'BILLING_DAYS_SANITY',severity:'blocking',message:'Periodo de facturación inválido.'});const billed=n(e,'billingDays');if(billed!==null&&Math.abs(billed-days)>2)out.push({code:'BILLING_DAYS_MISMATCH',severity:'warning',message:'Los días impresos no coinciden con las fechas.'})}
 const current=n(e,'currentReading'),previous=n(e,'previousReading'),multiplier=n(e,'multiplier')??1;if(current!==null&&previous!==null&&consumption!==null&&Math.abs((current-previous)*multiplier-consumption)>Math.max(2,consumption*.02))out.push({code:'METER_RECONCILIATION',severity:'blocking',message:'Lecturas, multiplicador y kWh no reconcilian.'});
 const subtotal=e.charges.filter(c=>c.kind!=='credit').reduce((sum,c)=>sum+c.amount,0)+e.charges.filter(c=>c.kind==='credit').reduce((sum,c)=>sum-c.amount,0),total=n(e,'totalBill');if(total!==null&&e.charges.length&&Math.abs(subtotal-total)>Math.max(1,total*.01))out.push({code:'TOTAL_RECONCILIATION',severity:'blocking',message:'Cargos e importe total no reconcilian dentro de 1%.'});
 const tariff=s(e,'tariff');if(tariff==='DAC'&&demand!==null)out.push({code:'TARIFF_FIELD_COMPATIBILITY',severity:'warning',message:'DAC con demanda requiere confirmación.'});
 for(let i=0;i<e.history.length;i++)for(let j=i+1;j<e.history.length;j++){const a=e.history[i],b=e.history[j];if(a.periodStart===b.periodStart&&a.periodEnd===b.periodEnd)out.push({code:'DUPLICATE_PERIOD',severity:'blocking',message:'Periodo histórico duplicado.'});else if(overlap(a,b))out.push({code:'OVERLAPPING_PERIOD',severity:'blocking',message:'Periodos históricos traslapados.'})}
 return out;
}

export function parseMexicanNumber(value:string){const clean=value.replace(/[^0-9,.-]/g,'');if(!clean)return null;const comma=clean.lastIndexOf(','),dot=clean.lastIndexOf('.');let normalized=clean;if(comma>dot)normalized=clean.replace(/\./g,'').replace(',','.');else normalized=clean.replace(/,/g,'');const result=Number(normalized);return Number.isFinite(result)?result:null}

export function buildConsumptionProfile(entries:z.infer<typeof historyEntrySchema>[]){
 const ordered=[...entries].sort((a,b)=>a.periodStart.localeCompare(b.periodStart));const issues:ValidationIssue[]=[];for(let i=1;i<ordered.length;i++){if(overlap(ordered[i-1],ordered[i]))issues.push({code:'OVERLAPPING_PERIOD',severity:'blocking',message:'Los periodos se traslapan.'})}
 const unique=ordered.filter((x,i)=>!ordered.slice(0,i).some(y=>y.periodStart===x.periodStart&&y.periodEnd===x.periodEnd));const values=unique.map(x=>x.kwh).sort((a,b)=>a-b),median=values.length?values[Math.floor(values.length/2)]:0,outliers=unique.filter(x=>values.length>=4&&median>0&&(x.kwh>median*3||x.kwh<median/3));for(const x of outliers)issues.push({code:'CONSUMPTION_OUTLIER',severity:'warning',message:`Consumo atípico ${x.periodStart}–${x.periodEnd}; requiere contexto, no corrección automática.`});const totalKwh=unique.reduce((s,x)=>s+x.kwh,0);const coveredDays=unique.reduce((sum,x)=>sum+Math.max(0,Math.round((date(x.periodEnd)!.getTime()-date(x.periodStart)!.getTime())/86400000)+1),0);const annualizedKwh=coveredDays>=330&&coveredDays<=400?totalKwh:null;const completeness=Math.min(1,coveredDays/365);
 return{entries:unique,totalKwh,coveredDays,annualizedKwh,completeness,missingPeriods:annualizedKwh===null,outliers:outliers.map(x=>({periodStart:x.periodStart,periodEnd:x.periodEnd,kwh:x.kwh})),allocationMethod:'none-no-invented-months' as const,issues};
}

export type ReadinessInput={extractionConfidence:number;historyCompleteness:number;addressConfidence:number;resourceConfidence:number;electricalReady:boolean;pricingComplete:boolean;tariffQuality:number;unresolvedBlocking:number};
export function quoteReadiness(i:ReadinessInput){const components={extraction:Math.round(i.extractionConfidence*20),history:Math.round(i.historyCompleteness*20),address:Math.round(i.addressConfidence*10),resource:Math.round(i.resourceConfidence*10),electrical:i.electricalReady?15:0,pricing:i.pricingComplete?15:0,tariff:Math.round(i.tariffQuality*10)};const raw=Object.values(components).reduce((a,b)=>a+b,0),score=i.unresolvedBlocking?Math.min(raw,49):raw;return{score,ready:score>=80&&i.unresolvedBlocking===0,components,blockers:i.unresolvedBlocking,recommendations:[...(i.historyCompleteness<.9?['Completar historial de consumo']:[]),...(!i.electricalReady?['Resolver validación eléctrica']:[]),...(i.unresolvedBlocking?['Resolver revisiones bloqueantes']:[])]}}

export function scenariosFromAcceptedEngines(engineScenarios:any[]){return engineScenarios.map((scenario,index)=>({id:scenario.id||`accepted-${index+1}`,source:'accepted-r1-r4-engines',...scenario}));}
