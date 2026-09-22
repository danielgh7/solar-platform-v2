import { Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { SolarDesignerR3 } from './components/SolarDesignerR3';
import { Consumption } from './pages/Consumption';
import { EconomicsR4 } from './pages/EconomicsR4';
import { Equipment } from './pages/Equipment';
import { Login } from './pages/Login';
import { NewProject } from './pages/NewProject';
import { Projects } from './pages/Projects';
import { Proposal } from './pages/Proposal';
import { Workspace } from './pages/Workspace';
import { Crm } from './pages/Crm';
import { OpportunityDetail } from './pages/OpportunityDetail';
import {CompanySettings} from './pages/CompanySettings';
import {ProjectAccessGate,ProtectedRoute} from './r7/auth';
import {NetworkStatus} from './components/NetworkStatus';
const projectRoute=(page:React.ReactNode)=><ProjectAccessGate>{page}</ProjectAccessGate>;
export default function App(){return <><NetworkStatus/><Routes><Route path="/login" element={<Login/>}/><Route element={<ProtectedRoute><Shell/></ProtectedRoute>}><Route index element={<Navigate to="/projects" replace/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/new" element={<NewProject/>}/><Route path="/projects/:id" element={projectRoute(<Workspace/>)}/><Route path="/projects/:id/consumption" element={projectRoute(<Consumption/>)}/><Route path="/projects/:id/design" element={projectRoute(<SolarDesignerR3/>)}/><Route path="/projects/:id/equipment" element={projectRoute(<Equipment/>)}/><Route path="/projects/:id/economics" element={projectRoute(<EconomicsR4/>)}/><Route path="/projects/:id/proposal" element={projectRoute(<Proposal/>)}/><Route path="/crm" element={<Crm/>}/><Route path="/crm/opportunities/:id" element={<OpportunityDetail/>}/><Route path="/settings/company" element={<CompanySettings/>}/><Route path="*" element={<Navigate to="/projects" replace/>}/></Route></Routes></>}
