import type {Task,CrmState} from './types';
export const isOverdue=(task:Task,nowIso:string)=>task.status==='open'&&task.dueDate<nowIso.slice(0,10);
export const dueToday=(task:Task,nowIso:string)=>task.status==='open'&&task.dueDate===nowIso.slice(0,10);
export const completeTask=(task:Task,at:string):Task=>({...task,status:'completed',completedAt:at});
export const tasksForOpportunity=(state:CrmState,id:string)=>state.tasks.filter(t=>t.link.opportunityId===id);
export const nextOpenTask=(tasks:Task[])=>[...tasks].filter(t=>t.status==='open').sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0];
