import { ArrowLeft } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { project } from '../data';

const steps=[
  ['Consumption','consumption'],['Design','design'],['Equipment','equipment'],['Economics','economics'],['Proposal','proposal']
];

export function ProjectContext(){
  return <div className="project-context">
    <div className="project-identity"><Link to="/projects"><ArrowLeft size={14}/></Link><div><b>{project.name}</b><span>{project.customer} · {project.address}</span></div></div>
    <nav className="project-tabs"><NavLink end to={`/projects/${project.id}`}>Overview</NavLink>{steps.map(([label,path])=><NavLink key={path} to={`/projects/${project.id}/${path}`}>{label}</NavLink>)}</nav>
    <div className="context-engineering"><span><small>PV</small><b>{project.kwp} kWp</b></span><span><small>LOAD</small><b>{(project.consumption/1000).toFixed(1)} MWh</b></span><span><small>OFFSET</small><b>{project.offset}%</b></span><em>{project.status}</em></div>
  </div>;
}

export function WorkflowStrip({active}:{active:string}){
  const order=['Consumption','Design','Equipment','Economics','Proposal'];
  const current=order.indexOf(active);
  return <div className="workflow-strip">{order.map((s,i)=><div key={s} className={`${i<current?'complete':''} ${i===current?'active':''}`}><i>{i<current?'✓':i+1}</i><span>{s}</span>{i<order.length-1&&<b/>}</div>)}</div>;
}
