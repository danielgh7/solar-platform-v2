import type {Activity,TimelineEvent,CrmState} from './types';
export const activityToTimeline=(a:Activity):TimelineEvent=>({id:a.id,opportunityId:a.opportunityId,projectId:a.projectId,type:a.type,occurredAt:a.occurredAt,title:a.system?'System event':a.type.replaceAll('-',' '),body:a.body,system:a.system,actorId:a.actorId});
export const timelineForOpportunity=(state:CrmState,id:string)=>state.activities.filter(a=>a.opportunityId===id).map(activityToTimeline).sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));
