import { ArrowLeft } from 'lucide-react';
import {useEffect,useState} from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { project } from '../data';
import {api} from '../r7/api';
import {useAuth} from '../r7/auth';

const steps=[
  ['Consumption','consumption'],['Design','design'],['Equipment','equipment'],['Economics','economics'],['Proposal','proposal']
];

export function ProjectContext(){
  const {id=project.id}=useParams(),{session}=useAuth(),[record,setRecord]=useState<any>(null),[state,setState]=useState<any>(null);
  useEffect(()=>{let active=true;if(!session)return;Promise.all([api.projects(session.organizationId),api.projectState(session.organizationId,id)]).then(([rows,next])=>{if(active){setRecord(rows.find((row:any)=>row.id===id)||null);setState(next)}}).catch(()=>{if(active){setRecord(null);setState(null)}});return()=>{active=false}},[session?.organizationId,id]);
  const seeded=id===project.id,name=seeded?project.name:record?.name||id,customer=seeded?project.customer:record?.customerName||'—',address=seeded?project.address:state?.r1?.serviceAddress||record?.location||'—',annualKwh=seeded?project.consumption:Number(state?.r1?.annualKwh||0),offset=seeded?project.offset:Number(state?.r1?.targetOffsetPct||0);
  return <div className="project-context">
    <div className="project-identity"><Link to="/projects"><ArrowLeft size={14}/></Link><div><b>{name}</b><span>{customer} · {address}</span></div></div>
    <nav className="project-tabs"><NavLink end to={`/projects/${id}`}>Overview</NavLink>{steps.map(([label,path])=><NavLink key={path} to={`/projects/${id}/${path}`}>{label}</NavLink>)}</nav>
    <div className="context-engineering"><span><small>PV</small><b>{seeded?project.kwp:'—'} kWp</b></span><span><small>LOAD</small><b>{(annualKwh/1000).toFixed(1)} MWh</b></span><span><small>OFFSET</small><b>{offset}%</b></span><em>{seeded?project.status:record?.status||'Draft'}</em></div>
  </div>;
}

export function WorkflowStrip({active}:{active:string}){
  const order=['Consumption','Design','Equipment','Economics','Proposal'];
  const current=order.indexOf(active);
  return <div className="workflow-strip">{order.map((s,i)=><div key={s} className={`${i<current?'complete':''} ${i===current?'active':''}`}><i>{i<current?'✓':i+1}</i><span>{s}</span>{i<order.length-1&&<b/>}</div>)}</div>;
}
