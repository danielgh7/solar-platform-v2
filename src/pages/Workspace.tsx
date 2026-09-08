import { ArrowRight, CheckCircle2, MapPin, PanelTop, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkflowStrip } from '../components/ProjectContext';
import { project } from '../data';

export function Workspace(){
  return <main className="page project-page"><div className="workspace-head"><div><span className="eyebrow">SOLAR PROJECT COCKPIT</span><h1>{project.name}</h1><p><MapPin size={13}/>{project.address} · {project.tariff} · {project.service}</p></div><Link className="primary" to={`/projects/${project.id}/design`}>Continue design <ArrowRight size={14}/></Link></div>
    <WorkflowStrip active="Design"/>
    <section className="cockpit-summary"><div><small>ANNUAL CONSUMPTION</small><b>21.84 <em>MWh</em></b><span>CFE baseline</span></div><div><small>PROPOSED PV</small><b>12.80 <em>kWp</em></b><span>20 × 640 W modules</span></div><div><small>ANNUAL PRODUCTION</small><b>20.89 <em>MWh</em></b><span>1,632 kWh/kWp</span></div><div><small>ENERGY COVERAGE</small><b>95.6<em>%</em></b><span>Target 95%</span></div><div><small>PROJECT COMPLETENESS</small><b>{project.completeness}<em>%</em></b><span>Design in progress</span></div></section>
    <div className="cockpit-grid"><section className="engineering-panel"><header><div><small>CURRENT ENGINEERING STATE</small><h2>Design requires final module layout</h2></div><PanelTop size={20}/></header><div className="engineering-checklist"><span className="done"><CheckCircle2 size={16}/><b>Consumption baseline</b><small>12 months · DAC · 21,840 kWh</small></span><span className="active"><Zap size={16}/><b>Solar design</b><small>20 modules placed · validate geometry and strings</small></span><span><i/> <b>Equipment</b><small>Jinko 640 W selected · inverter pending confirmation</small></span><span><i/> <b>Economics</b><small>Scenario available after equipment confirmation</small></span></div><Link className="next-action" to={`/projects/${project.id}/design`}>Open Solar Designer <ArrowRight size={15}/></Link></section>
      <section className="technical-panel"><header><small>SELECTED SYSTEM</small><h2>Current technical package</h2></header><dl><div><dt>PV modules</dt><dd>{project.panel}</dd></div><div><dt>Inverter</dt><dd>{project.inverter}</dd></div><div><dt>DC / AC ratio</dt><dd>1.07</dd></div><div><dt>Roof planes</dt><dd>1 active plane</dd></div><div><dt>Strings</dt><dd>2 strings · 2 MPPT</dd></div><div><dt>Battery</dt><dd>Not included</dd></div></dl></section>
    </div>
  </main>;
}
