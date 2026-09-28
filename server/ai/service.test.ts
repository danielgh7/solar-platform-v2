import {describe,it,expect} from 'vitest';
import {scenarioForRole} from './service';

describe('R8 scenario confidentiality',()=>{
 it('allowlists customer-safe scenario fields outside internal economics roles',()=>{const source={id:'s1',name:'Ahorro',source:'accepted-r1-r4-engines',panelCount:12,kWp:6.6,salePrice:180000,annualSavings:42000,directCost:100000,unitCost:9000,markup:.8,grossProfit:80000,grossMargin:.44,contributionMargin:.3,cac:5000,commission:8000,contingency:3000};const safe=scenarioForRole(source,'Commercial');expect(safe).toMatchObject({id:'s1',panelCount:12,salePrice:180000,internalFieldsRedacted:true});for(const key of ['directCost','unitCost','markup','grossProfit','grossMargin','contributionMargin','cac','commission','contingency'])expect(safe).not.toHaveProperty(key)});
 it('preserves accepted scenario details for authorized internal economics roles',()=>{const source={id:'s1',directCost:100000,grossMargin:.4};expect(scenarioForRole(source,'Admin')).toBe(source)});
});
