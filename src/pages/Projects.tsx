import { ArrowRight, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data';

export function Projects(){
  return <main className="page projects-page"><div className="page-header"><div><span className="eyebrow">SOLAR PROJECT PORTFOLIO</span><h1>Projects</h1><p>Engineering work ordered by the next solar decision.</p></div><Link className="primary" to="/projects/new"><Plus size={15}/>New solar project</Link></div>
    <div className="portfolio-rail"><span><small>ACTIVE SITES</small><b>18</b></span><span><small>DESIGN CAPACITY</small><b>428.6 kWp</b></span><span><small>IN DESIGN</small><b>6 projects</b></span><span><small>READY FOR PROPOSAL</small><b>4 projects</b></span></div>
    <div className="table-toolbar"><div className="searchbox"><Search size={15}/><input placeholder="Search project, customer or site"/></div><button className="secondary"><SlidersHorizontal size={14}/>Filters</button></div>
    <section className="project-table"><div className="project-row head"><span>PROJECT / SITE</span><span>SERVICE</span><span>DESIGN STAGE</span><span>PV SYSTEM</span><span>OFFSET</span><span>NEXT ENGINEERING STEP</span></div>{projects.map(p=><Link to={`/projects/${projects[0].id}`} className="project-row" key={p.id}><span className="project-name"><b>{p.name}</b><small>{p.id} · {p.customer}<br/>{p.address}</small></span><span><b>{p.tariff}</b><small>{p.type}</small></span><span><em className="stage-pill">{p.stage}</em></span><span><b>{p.kwp} kWp</b><small>{p.modules} modules</small></span><span><b>{p.offset}%</b><i className="offset-bar"><i style={{width:`${p.offset}%`}}/></i></span><span className="next-step"><b>{p.next}</b><ArrowRight size={14}/></span></Link>)}</section>
  </main>;
}
