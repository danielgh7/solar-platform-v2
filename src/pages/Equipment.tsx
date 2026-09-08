import { BatteryCharging, CheckCircle2, PanelTop, PlugZap } from 'lucide-react';
import { useState } from 'react';
import { EquipmentCard } from '../components/EquipmentCard';
import { WorkflowStrip } from '../components/ProjectContext';
import { equipment } from '../data';

export function Equipment(){
  const [tab,setTab]=useState<'panels'|'inverters'|'batteries'>('panels'); const [selected,setSelected]=useState({panels:0,inverters:0,batteries:-1});
  const items=equipment[tab];
  return <main className="page project-page"><div className="page-header"><div><span className="eyebrow">TECHNICAL PACKAGE</span><h1>Equipment</h1><p>Select components against the current 12.80 kWp design.</p></div><div className="design-link-state"><CheckCircle2 size={15}/><span><small>DESIGN LINK</small><b>20 modules · 2 strings · 12.80 kWp DC</b></span></div></div><WorkflowStrip active="Equipment"/>
    <section className="selected-equipment"><div><PanelTop size={17}/><span><small>SELECTED MODULE</small><b>Jinko Tiger Neo 640 W</b><em>20 × · 12.80 kWp DC</em></span></div><div><PlugZap size={17}/><span><small>SELECTED INVERTER</small><b>Huawei SUN2000-12K-MAP0</b><em>12 kW AC · DC/AC 1.07</em></span></div><div><BatteryCharging size={17}/><span><small>BATTERY</small><b>Not included</b><em>Optional storage scenario</em></span></div></section>
    <section className="equipment-catalog"><header><nav><button className={tab==='panels'?'active':''} onClick={()=>setTab('panels')}>Panels</button><button className={tab==='inverters'?'active':''} onClick={()=>setTab('inverters')}>Inverters</button><button className={tab==='batteries'?'active':''} onClick={()=>setTab('batteries')}>Batteries</button></nav><span>Technical compatibility view</span></header><div className="equipment-list">{items.map((item,i)=><EquipmentCard key={item.model} item={item} selected={selected[tab]===i} onSelect={()=>setSelected(s=>({...s,[tab]:i}))}/>)}</div></section>
  </main>;
}
