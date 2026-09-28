export type Role='Admin'|'Commercial'|'Engineering'|'Operations'|'Viewer';
export type Permission=
 |'org.settings.read'|'org.settings.write'|'members.manage'
 |'projects.read'|'projects.write'|'engineering.edit'
 |'economics.read'|'economics.internal.read'
 |'proposal.read'|'proposal.write'
 |'crm.read'|'crm.write'|'tasks.write'|'activities.write'
 |'handoff.read'|'handoff.write'|'audit.read'
 |'ai.documents.read'|'ai.documents.write'|'ai.review'|'ai.execute'|'ai.admin';

const all:Permission[]=['org.settings.read','org.settings.write','members.manage','projects.read','projects.write','engineering.edit','economics.read','economics.internal.read','proposal.read','proposal.write','crm.read','crm.write','tasks.write','activities.write','handoff.read','handoff.write','audit.read','ai.documents.read','ai.documents.write','ai.review','ai.execute','ai.admin'];
export const ROLE_PERMISSIONS:Record<Role,ReadonlySet<Permission>>={
 Admin:new Set(all),
 Commercial:new Set(['org.settings.read','projects.read','projects.write','economics.read','proposal.read','proposal.write','crm.read','crm.write','tasks.write','activities.write','handoff.read','ai.documents.read','ai.documents.write','ai.review','ai.execute']),
 Engineering:new Set(['org.settings.read','projects.read','projects.write','engineering.edit','economics.read','proposal.read','tasks.write','activities.write','handoff.read','ai.documents.read','ai.documents.write','ai.review','ai.execute']),
 Operations:new Set(['org.settings.read','projects.read','proposal.read','crm.read','tasks.write','activities.write','handoff.read','handoff.write','ai.documents.read','ai.review']),
 Viewer:new Set(['org.settings.read','projects.read','economics.read','proposal.read','crm.read','handoff.read','ai.documents.read'])
};
export function hasPermission(role:Role,permission:Permission){return ROLE_PERMISSIONS[role].has(permission)}
export function redactEconomicsForRole(role:Role,r4:any){
 if(hasPermission(role,'economics.internal.read'))return r4;
 return{projectId:r4?.projectId,selectedScenarioId:r4?.selectedScenarioId,updatedAt:r4?.updatedAt,internalFieldsRedacted:true};
}
