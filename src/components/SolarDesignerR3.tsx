import {useState} from 'react';
import {ElectricalDesigner} from './ElectricalDesigner';
import {SolarDesigner} from './SolarDesigner';
export function SolarDesignerR3(){const [tab,setTab]=useState<'geometry'|'electrical'|'production'>('electrical');return <div className="r3-shell"><nav className="r3-tabs"><button className={tab==='geometry'?'active':''} onClick={()=>setTab('geometry')}>Geometry · R2</button><button className={tab==='electrical'?'active':''} onClick={()=>setTab('electrical')}>Electrical · R3</button><button className={tab==='production'?'active':''} onClick={()=>setTab('production')}>Production · R3</button></nav>{tab==='geometry'?<SolarDesigner/>:tab==='electrical'?<ElectricalDesigner mode="electrical"/>:<ElectricalDesigner mode="production"/>}</div>}
