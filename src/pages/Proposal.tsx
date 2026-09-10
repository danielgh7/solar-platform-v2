import {CheckCircle2,Download,Eye,FilePlus2,LockKeyhole,Save,TriangleAlert,X} from 'lucide-react';
import {useEffect,useMemo,useState} from 'react';
import {WorkflowStrip} from '../components/ProjectContext';
import {ProposalDocument} from '../components/ProposalDocument';
import {ProposalInspector,ProposalSectionNavigator} from '../components/proposal/ProposalEditorParts';
import {project} from '../data';
import {deriveAcceptedProjectOutputs} from '../domain/acceptedProjectOutputs';
import {createDefaultSiteDesign} from '../domain/design/types';
import {useSiteDesign} from '../domain/design/store';
import {useElectricalDesign} from '../domain/electrical/store';
import {useEnergyProfile} from '../domain/energy/store';
import {useR4State} from '../domain/economics/store';
import {buildProposalDocumentModel} from '../domain/proposal/document';
import {proposalSourceFingerprint} from '../domain/proposal/fingerprint';
import {downloadProposalPdf} from '../domain/proposal/pdf';
import {buildProposalSnapshot} from '../domain/proposal/snapshot';
import {useProposalState} from '../domain/proposal/store';
import type {ProposalSectionKey,ProposalVersion} from '../domain/proposal/types';
import {proposalReadiness,validateProposal} from '../domain/proposal/validation';
import {createNextVersion,createProposal,recordProposalExport,setVersionStatus,updateActiveDraft} from '../domain/proposal/versioning';

const sectionCopy:Partial<Record<ProposalSectionKey,ProposalVersion['contentBlocks'][number]['key']>>={'executive-summary':'executive-summary','assumptions':'assumptions','scope':'scope','exclusions':'exclusions','warranties':'warranties','next-steps':'next-steps','disclaimers':'disclaimer'};
export function Proposal(){
 const {profile}=useEnergyProfile(),{design}=useSiteDesign(createDefaultSiteDesign()),{electrical}=useElectricalDesign(),{state:r4}=useR4State();
 const outputs=useMemo(()=>deriveAcceptedProjectOutputs(profile,design,electrical,r4),[profile,design,electrical,r4]);
 const fingerprint=useMemo(()=>proposalSourceFingerprint(outputs),[outputs]);
 const snapshot=useMemo(()=>buildProposalSnapshot(outputs),[outputs]);
 const {proposal,setProposal}=useProposalState(project.id);const [preview,setPreview]=useState(false),[selectedSection,setSelectedSection]=useState<ProposalSectionKey>('cover'),[notice,setNotice]=useState('');
 useEffect(()=>{if(!proposal)setProposal(createProposal(project.id,snapshot,fingerprint));},[proposal,setProposal,snapshot,fingerprint]);
 const active=proposal?.versions.find(v=>v.id===proposal.activeVersionId)||proposal?.versions.at(-1);const issues=active?validateProposal(active,fingerprint,outputs):[];const readiness=proposalReadiness(issues);const outdated=!!active&&active.sourceFingerprint!==fingerprint;const frozen=!!active?.frozen;const model=active?buildProposalDocumentModel(active):null;
 const mutate=(fn:(v:ProposalVersion)=>ProposalVersion)=>{if(!proposal)return;const next=updateActiveDraft(proposal,fn);if(next===proposal&&frozen){setNotice('This exported proposal is frozen. Create a new version to edit.');return;}setProposal(next);};
 const changeSection=(key:ProposalSectionKey,visible:boolean)=>mutate(v=>({...v,sections:v.sections.map(s=>s.key===key?{...s,visible}:s)}));
 const moveSection=(key:ProposalSectionKey,dir:-1|1)=>mutate(v=>{const ordered=[...v.sections].sort((a,b)=>a.order-b.order),i=ordered.findIndex(x=>x.key===key),j=i+dir;if(i<0||j<0||j>=ordered.length)return v;const a=ordered[i],b=ordered[j];if(a.required&&a.key==='cover')return v;const ao=a.order;a.order=b.order;b.order=ao;return{...v,sections:ordered};});
 const updateValidity=(days:number)=>mutate(v=>{const d=new Date(`${v.customer.proposalDate}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+Math.max(1,days));return{...v,validity:{validityDays:Math.max(1,days),validUntil:d.toISOString().slice(0,10)}};});
 const markReady=()=>{if(!proposal||!active||issues.some(x=>x.severity==='error'))return;setProposal(setVersionStatus(proposal,active.id,'Ready'));setNotice('Proposal marked Ready.');};
 const newVersion=()=>{if(!proposal)return;setProposal(createNextVersion(proposal,snapshot,fingerprint));setNotice(`Created proposal v${Math.max(...proposal.versions.map(x=>x.versionNumber))+1} from current R1–R4 state.`);setPreview(false);};
 const exportPdf=async()=>{if(!proposal||!active||!model||issues.some(x=>x.severity==='error'))return;try{const r=await downloadProposalPdf(model);const meta={...r,exportedAt:new Date().toISOString(),status:'success' as const};setProposal(recordProposalExport(proposal,active.id,meta));setNotice(`Exported ${r.filename} · ${(r.sizeBytes/1024).toFixed(1)} KB · ${r.pageCount} pages`);}catch(e){const meta={filename:`proposal-${project.id}-v${active.versionNumber}.pdf`,exportedAt:new Date().toISOString(),sizeBytes:0,pageCount:0,mimeType:'application/pdf' as const,status:'failed' as const,error:e instanceof Error?e.message:String(e)};setProposal(recordProposalExport(proposal,active.id,meta));setNotice(`PDF export failed: ${meta.error}`);}};
 if(!proposal||!active||!model)return <main className="page project-page"><p>Preparing proposal workspace…</p></main>;
 if(preview)return <main className="r5-customer-preview" data-testid="customer-preview"><button className="preview-exit" onClick={()=>setPreview(false)}><X size={15}/>Exit preview</button><ProposalDocument model={model}/></main>;
 const copyKey=sectionCopy[selectedSection],copyBlock=copyKey?active.contentBlocks.find(x=>x.key===copyKey):undefined;
 return <main className="page project-page r5-page"><div className="r5-topbar"><div><span className="eyebrow">CUSTOMER DOCUMENT · R5</span><h1>Proposal Builder</h1><p>Versioned customer document generated from accepted R1–R4 project truth.</p></div><div className="r5-version-actions"><select aria-label="Proposal version" value={active.id} onChange={e=>setProposal({...proposal,activeVersionId:e.target.value})}>{proposal.versions.map(v=><option value={v.id} key={v.id}>v{v.versionNumber} · {v.status}{v.frozen?' · frozen':''}</option>)}</select><span className={`proposal-status ${active.status.toLowerCase()}`}>{frozen&&<LockKeyhole size={12}/>} {active.status}</span><button className="secondary" onClick={()=>setNotice('Draft settings are persisted locally as you edit.')}><Save size={14}/>Save</button><button className="secondary" onClick={()=>setPreview(true)}><Eye size={14}/>Customer preview</button><button className="secondary" onClick={newVersion}><FilePlus2 size={14}/>New version</button><button className="primary" onClick={exportPdf} disabled={issues.some(x=>x.severity==='error')}><Download size={14}/>Export PDF</button></div></div><WorkflowStrip active="Proposal"/>
 {(outdated||notice)&&<div className={`r5-banner ${outdated?'warning':'info'}`}>{outdated?<><TriangleAlert size={16}/><b>Source changed · Proposal out of date.</b><span>The active snapshot is unchanged. Create a new version to capture the current R1–R4 state.</span></>:<><CheckCircle2 size={16}/><span>{notice}</span></>}<button onClick={()=>setNotice('')} aria-label="Dismiss notice"><X size={14}/></button></div>}
 <div className="proposal-builder-grid"><ProposalSectionNavigator proposal={proposal} active={active} selectedSection={selectedSection} onSelect={setSelectedSection} onToggle={changeSection} onSelectVersion={id=>setProposal({...proposal,activeVersionId:id})}/><section className="proposal-live-canvas" data-testid="proposal-live-preview"><div className="preview-ruler"><span>A4 · CUSTOMER PREVIEW</span><span>Snapshot {active.snapshot.capturedAt.slice(0,10)} · source {active.sourceFingerprint}</span></div><ProposalDocument model={model}/></section><ProposalInspector active={active} selectedSection={selectedSection} readiness={readiness} issues={issues} copyBlock={copyBlock} onMove={moveSection} onMutate={mutate} onValidity={updateValidity} onMarkReady={markReady}/></div></main>;
}
