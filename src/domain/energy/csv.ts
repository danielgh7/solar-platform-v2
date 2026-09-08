import type {ConsumptionEntry,DemandEntry,PowerFactorEntry} from './types';
export type CsvImportResult={consumption:ConsumptionEntry[];demand:DemandEntry[];powerFactor:PowerFactorEntry[];errors:string[]};
const periodRe=/^\d{4}-(0[1-9]|1[0-2])$/;
function num(v:string|undefined){if(v==null||v.trim()==='')return undefined;const n=Number(v);return Number.isFinite(n)?n:NaN}
export function parseConsumptionCsv(text:string):CsvImportResult{
 const lines=text.trim().split(/\r?\n/).filter(Boolean);if(lines.length<2)return{consumption:[],demand:[],powerFactor:[],errors:['CSV must include a header and at least one data row.']};
 const headers=lines[0].split(',').map(x=>x.trim().toLowerCase());const req=['period','kwh'];const errors:string[]=[];for(const r of req)if(!headers.includes(r))errors.push(`Missing required column: ${r}`);if(errors.length)return{consumption:[],demand:[],powerFactor:[],errors};
 const rows=lines.slice(1);const consumption:ConsumptionEntry[]=[];const demand:DemandEntry[]=[];const powerFactor:PowerFactorEntry[]=[];const seen=new Set<string>();
 rows.forEach((line,idx)=>{const cols=line.split(',').map(x=>x.trim());const row=Object.fromEntries(headers.map((h,i)=>[h,cols[i]??'']));const period=row.period;const kwh=num(row.kwh);const amount=num(row.amount_mxn);const d=num(row.demand_kw);const pf=num(row.power_factor);const prefix=`Row ${idx+2}`;
 if(!periodRe.test(period)){errors.push(`${prefix}: unsupported period format ${period}; use YYYY-MM`);return}if(seen.has(period))errors.push(`${prefix}: duplicate period ${period}`);seen.add(period);if(kwh==null||Number.isNaN(kwh))errors.push(`${prefix}: invalid kWh`);else if(kwh<0)errors.push(`${prefix}: negative kWh`);if(amount!=null&&(Number.isNaN(amount)||amount<0))errors.push(`${prefix}: invalid amount_mxn`);if(d!=null&&(Number.isNaN(d)||d<0))errors.push(`${prefix}: invalid demand_kw`);if(pf!=null&&(Number.isNaN(pf)||pf<=0||pf>1))errors.push(`${prefix}: impossible power_factor`);if(kwh!=null&&!Number.isNaN(kwh)&&kwh>=0){consumption.push({period,kwh,amountMxn:amount!=null&&!Number.isNaN(amount)&&amount>=0?amount:undefined});if(d!=null&&!Number.isNaN(d)&&d>=0)demand.push({period,kw:d});if(pf!=null&&!Number.isNaN(pf)&&pf>0&&pf<=1)powerFactor.push({period,value:pf});}});
 return{consumption,demand,powerFactor,errors};
}
export const csvTemplate=`period,kwh,amount_mxn,demand_kw,power_factor\n2026-01,1800,5200,,\n2026-02,1720,4980,,`;
