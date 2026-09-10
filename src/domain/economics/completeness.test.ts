import {describe,expect,it} from 'vitest';
import {calculateProjectPricing} from './pricing';
import {createDefaultR4State,loadR4State,saveR4State} from './store';
import type {CostBreakdown} from './types';
const costs:CostBreakdown={equipmentCost:0,materialsCost:0,laborCost:0,engineeringCost:0,logisticsCost:0,permitsCost:0,contingencyCost:0,directProjectCost:100000,overheadAllocation:0,totalCostBeforeVat:100000,inputVat:16000,totalCashOutIncludingVat:116000,byCategory:{'pv-module':0,inverter:0,mounting:0,'dc-electrical':0,'ac-electrical':0,protections:0,'cabling-connectors':0,monitoring:0,'installation-labor':0,'engineering-design':0,'permits-interconnection':0,'freight-logistics':0,'misc-contingency':0}};
describe('R4 exact-scope completeness',()=>{
 it('supports fixed commercial commission distinct from percentage mode',()=>{const p=calculateProjectPricing(costs,{strategy:'fixed',markupPct:0,targetGrossMarginPct:0,fixedSellPriceBeforeVat:150000},{salesCommissionType:'fixed',salesCommissionValue:7500,cacAllowance:2500,projectOperatingAllowance:1000},16,10);expect(p.salesCommission).toBe(7500);expect(p.grossProfit).toBe(50000);expect(p.contributionAfterCommercialCosts).toBe(39000)});
 it('persists direct local catalog edits including price currency and VAT treatment',()=>{const mem=new Map<string,string>();const storage={getItem:(k:string)=>mem.get(k)||null,setItem:(k:string,v:string)=>{mem.set(k,v)}};const s=createDefaultR4State();s.catalog[0]={...s.catalog[0],unitCost:123,currency:'MXN',vatApplicable:false};saveR4State(s,storage);const r=loadR4State(storage);expect(r.catalog[0].unitCost).toBe(123);expect(r.catalog[0].currency).toBe('MXN');expect(r.catalog[0].vatApplicable).toBe(false)});
});
