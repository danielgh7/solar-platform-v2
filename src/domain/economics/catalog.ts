import type {EquipmentCatalogItem} from './types';
export const DEFAULT_EQUIPMENT_CATALOG:EquipmentCatalogItem[]=[
{id:'cat-mod-640',engineeringSpecId:'mod-640',description:'640 W PV module',model:'FS-640N',category:'pv-module',unit:'module',unitCost:100,currency:'USD',vatApplicable:true,markupPct:28,sourceStatus:'engineering-linked',notes:'Editable planning assumption; not live supplier pricing.'},
{id:'cat-inv-20',engineeringSpecId:'inv-20',description:'20 kW three-phase string inverter',model:'FG-20KTL',category:'inverter',unit:'unit',unitCost:52000,currency:'MXN',vatApplicable:true,markupPct:22,sourceStatus:'engineering-linked',notes:'Editable planning assumption; linked to R3 electrical spec.'},
{id:'cat-inv-30',engineeringSpecId:'inv-30',description:'30 kW three-phase string inverter',model:'FG-30KTL',category:'inverter',unit:'unit',unitCost:71000,currency:'MXN',vatApplicable:true,markupPct:22,sourceStatus:'engineering-linked'},
{id:'cat-inv-50',engineeringSpecId:'inv-50',description:'50 kW three-phase string inverter',model:'FG-50KTL',category:'inverter',unit:'unit',unitCost:106000,currency:'MXN',vatApplicable:true,markupPct:22,sourceStatus:'engineering-linked'},
{id:'cat-mount',description:'Mounting structure allowance per module',category:'mounting',unit:'module',unitCost:980,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption',notes:'Rule-derived allowance; final structural engineering deferred.'},
{id:'cat-dc',description:'DC electrical material allowance',category:'dc-electrical',unit:'kWp',unitCost:790,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption',notes:'Allowance, not engineered conductor quantity.'},
{id:'cat-ac',description:'AC electrical material allowance',category:'ac-electrical',unit:'inverter',unitCost:7600,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption',notes:'Allowance, not engineered conductor routing.'},
{id:'cat-prot',description:'Electrical protections allowance',category:'protections',unit:'inverter',unitCost:6800,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption',notes:'Allowance pending formal protection engineering.'},
{id:'cat-cable',description:'Cabling and connectors allowance',category:'cabling-connectors',unit:'module',unitCost:310,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption',notes:'Rule-derived allowance; not a cable takeoff.'},
{id:'cat-monitor',description:'Monitoring / communications allowance',category:'monitoring',unit:'project',unitCost:3500,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption'},
{id:'cat-labor',description:'Installation labor allowance',category:'installation-labor',unit:'module',unitCost:700,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption'},
{id:'cat-eng',description:'Engineering and design',category:'engineering-design',unit:'project',unitCost:8500,currency:'MXN',vatApplicable:true,markupPct:25,sourceStatus:'editable-assumption'},
{id:'cat-permit',description:'Permits / interconnection allowance',category:'permits-interconnection',unit:'project',unitCost:6500,currency:'MXN',vatApplicable:true,markupPct:20,sourceStatus:'editable-assumption'},
{id:'cat-freight',description:'Freight and logistics allowance',category:'freight-logistics',unit:'project',unitCost:8500,currency:'MXN',vatApplicable:true,markupPct:20,sourceStatus:'editable-assumption'},
{id:'cat-cont',description:'Miscellaneous / contingency',category:'misc-contingency',unit:'project',unitCost:5000,currency:'MXN',vatApplicable:true,markupPct:0,sourceStatus:'editable-assumption'}
];
export const catalogById=(catalog:EquipmentCatalogItem[],id:string)=>catalog.find(x=>x.id===id);
export const catalogByEngineeringSpec=(catalog:EquipmentCatalogItem[],specId:string)=>catalog.find(x=>x.engineeringSpecId===specId);
