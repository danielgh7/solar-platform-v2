import { Eye, FileText } from 'lucide-react';
import { WorkflowStrip } from '../components/ProjectContext';
import { ProposalDocument } from '../components/ProposalDocument';

export function Proposal(){
  return <main className="page project-page proposal-page"><div className="page-header"><div><span className="eyebrow">CLIENT-FACING OUTPUT</span><h1>Proposal</h1><p>In-app preview of the current solar project scenario.</p></div><div className="proposal-actions"><span><Eye size={14}/>Preview mode</span><button className="secondary"><FileText size={14}/>PDF export unavailable in R0.1</button></div></div><WorkflowStrip active="Proposal"/><div className="proposal-workspace"><aside className="proposal-outline"><small>DOCUMENT OUTLINE</small>{['Cover','System summary','Production','Economics','Equipment','Terms'].map((s,i)=><button className={i===0?'active':''} key={s}><i>{String(i+1).padStart(2,'0')}</i>{s}</button>)}</aside><ProposalDocument/></div></main>;
}
