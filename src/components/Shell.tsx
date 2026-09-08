import { Bell, Box, ClipboardCheck, Grid3X3, Search, Sun, Users } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ProjectContext } from './ProjectContext';

export function Logo({dark=false}:{dark?:boolean}){
  return <div className="brand"><div className="brand-mark"><Sun size={16}/></div><div><b className={dark?'ink':''}>HELIO</b><span>solar engineering</span></div></div>;
}

export function Shell(){
  const loc=useLocation();
  const isProject=loc.pathname.includes('/projects/') && !loc.pathname.endsWith('/new');
  return <div className="app-shell">
    <header className="topnav"><Logo/><nav><NavLink to="/projects"><Grid3X3 size={15}/>Projects</NavLink><a><Users size={15}/>Customers</a><a><Box size={15}/>Equipment</a><a><ClipboardCheck size={15}/>Operations</a></nav><div className="top-actions"><button className="icon"><Search size={16}/></button><button className="icon"><Bell size={16}/></button><span className="avatar">DG</span></div></header>
    {isProject&&<ProjectContext/>}<Outlet/>
  </div>;
}
