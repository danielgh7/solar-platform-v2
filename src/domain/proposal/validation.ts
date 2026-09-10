import type {AcceptedProjectOutputs} from '../acceptedProjectOutputs';
import type {ProposalValidationIssue,ProposalVersion} from './types';
export function validateProposal(version:ProposalVersion,currentFingerprint:string,o:AcceptedProjectOutputs):ProposalValidationIssue[]{const x:ProposalValidationIssue[]=[];const error=(id:string,message:string)=>x.push({id,severity:'error',code:id,message});const warn=(id:string,message:string)=>x.push({id,severity:'warning',code:id,message});
if(!version.customer.customerName.trim())error('missing-customer','Customer/company display name is required.');
if(!version.customer.projectName.trim())error('missing-project-name','Project/site display name is required.');
if(o.r1Quality==='Incomplete')error('r1-incomplete','R1 consumption is incomplete.');else if(o.r1Quality==='Needs review')warn('r1-needs-review','R1 consumption has review warnings that remain visible in this proposal workflow.');
if(!o.design.roofs.length||!o.design.layout.placements.length)error('r2-no-design','A valid R2 roof design with placed modules is required.');
if(o.r3Issues.some(i=>i.severity==='error'))error('r3-electrical-errors','R3 electrical design has blocking errors.');else if(o.r3Issues.some(i=>i.severity==='warning'))warn('r3-electrical-warning','R3 electrical design has non-blocking warnings.');
if(!(o.r3Summary.annualProductionKwh>0))error('r3-no-production','R3 annual production output is missing or invalid.');
if(o.r4Economics.readiness==='Blocked')error('r4-blocked','R4 economics has blocking validation errors.');else if(o.r4Economics.readiness==='Needs review')warn('r4-needs-review','R4 economics has non-blocking warnings that remain visible in this proposal workflow.');
if(!(version.snapshot.investment.priceBeforeVat>0)||!(version.snapshot.investment.totalIncludingVat>0))error('invalid-price','Customer sell price is missing or invalid.');
if(!(version.validity.validityDays>0)||!version.validity.validUntil)error('missing-validity','Proposal validity is required.');
for(const key of ['scope','exclusions','warranties','assumptions','disclaimer'] as const){const block=version.contentBlocks.find(b=>b.key===key);if(!block?.body.trim())error(`missing-${key}`,`${block?.title||key} content is required.`);}
if(version.sourceFingerprint!==currentFingerprint)error('source-changed','Source changed · Proposal out of date. Create a new version from the current R1–R4 project state.');
if(version.exportMetadata?.status==='failed')error('pdf-export-failed',`Last PDF export failed: ${version.exportMetadata.error||'unknown error'}`);
if(!version.branding.companyDisplayName.trim())warn('branding-name','Company display name is empty; neutral fallback will be used.');
if(version.contentBlocks.find(b=>b.key==='warranties')?.templateContent)warn('template-warranty','Warranty text is still marked as editable template content; verify it before customer issue.');
return x;}
export const proposalReadiness=(issues:ProposalValidationIssue[])=>issues.some(x=>x.severity==='error')?'Blocked':issues.some(x=>x.severity==='warning')?'Needs review':'Ready';
