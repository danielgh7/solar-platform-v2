export type Role='Admin'|'Commercial'|'Engineering'|'Operations'|'Viewer';
export type Permission=
 |'org.settings.read'|'org.settings.write'|'members.manage'
 |'projects.read'|'projects.write'|'engineering.edit'
 |'economics.read'|'economics.internal.read'
 |'proposal.read'|'proposal.write'
 |'crm.read'|'crm.write'|'tasks.write'|'activities.write'
 |'handoff.read'|'handoff.write'|'audit.read';

const all:Permission[]=['org.settings.read','org.settings.write','members.manage','projects.read','projects.write','engineering.edit','economics.read','economics.internal.read','proposal.read','proposal.write','crm.read','crm.write','tasks.write','activities.write','handoff.read','handoff.write','audit.read'];
export const ROLE_PERMISSIONS:Record<Role,ReadonlySet<Permission>>={
 Admin:new Set(all),
 Commercial:new Set(['org.settings.read','projects.read','projects.write','economics.read','proposal.read','proposal.write','crm.read','crm.write','tasks.write','activities.write','handoff.read']),
 Engineering:new Set(['org.settings.read','projects.read','projects.write','engineering.edit','economics.read','proposal.read','tasks.write','activities.write','handoff.read']),
 Operations:new Set(['org.settings.read','projects.read','proposal.read','crm.read','tasks.write','activities.write','handoff.read','handoff.write']),
 Viewer:new Set(['org.settings.read','projects.read','proposal.read','crm.read','handoff.read'])
};
export function hasPermission(role:Role,permission:Permission){return ROLE_PERMISSIONS[role].has(permission)}
