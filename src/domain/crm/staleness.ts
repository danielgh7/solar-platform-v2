import type {CrmState,Opportunity,PipelineStage,Task} from './types';
export type StalenessResult={daysSinceActivity:number;thresholdDays:number;stale:boolean;reasons:string[]};
const days=(a:string,b:string)=>Math.max(0,Math.floor((Date.parse(a)-Date.parse(b))/86400000));
export function staleOpportunity(opportunity:Opportunity,state:CrmState,nowIso:string):StalenessResult{
 const stage=state.pipeline.stages.find(s=>s.id===opportunity.stageId) as PipelineStage|undefined;
 const latest=state.activities.filter(a=>a.opportunityId===opportunity.id).sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0]?.occurredAt||opportunity.createdAt;
 const daysSinceActivity=days(nowIso,latest),thresholdDays=stage?.staleAfterDays??7,reasons:string[]=[];
 const overdue=state.tasks.some(t=>t.link.opportunityId===opportunity.id&&t.status==='open'&&t.dueDate<nowIso.slice(0,10));
 if(daysSinceActivity>thresholdDays)reasons.push(`${daysSinceActivity} days since meaningful activity (threshold ${thresholdDays})`);
 if(overdue)reasons.push('Overdue next action');
 if(opportunity.stageId==='proposal-sent'&&!state.tasks.some(t=>t.link.opportunityId===opportunity.id&&t.status==='open'&&t.category==='follow-up'))reasons.push('Proposal exported/sent without open follow-up task');
 return{daysSinceActivity,thresholdDays,stale:reasons.length>0,reasons};
}
export const staleDays=(o:Opportunity,state:CrmState,nowIso:string)=>staleOpportunity(o,state,nowIso).daysSinceActivity;
