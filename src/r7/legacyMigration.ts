export const LEGACY_MIGRATION_FORMAT_VERSION=1 as const;
export type LegacyMigrationPayload={formatVersion:1;legacyWorkspaceId:string;projectId:string;records:Record<string,unknown>};
const globalKeys={r1:'solar-platform-v2:r1:energy-profile',r6:'solar-platform-v2:r6:crm:default'} as const;
const projectKey=(r:'r2'|'r3'|'r4'|'r5',projectId:string)=>r==='r2'?`solar-platform-v2:r2:site-design:${projectId}`:r==='r3'?`solar-platform-v2:r3:electrical:${projectId}`:r==='r4'?`solar-platform-v2:r4:economics:${projectId}`:`solar-platform-v2:r5:proposal:${projectId}`;
function read(storage:Storage,key:string){const raw=storage.getItem(key);if(raw===null)return null;try{return JSON.parse(raw)}catch{return{__legacyParseError:true,key,raw}}}
export function collectLegacyProjectState(storage:Storage,projectId:string):LegacyMigrationPayload{return{formatVersion:LEGACY_MIGRATION_FORMAT_VERSION,legacyWorkspaceId:'default',projectId,records:{r1:read(storage,globalKeys.r1),r2:read(storage,projectKey('r2',projectId)),r3:read(storage,projectKey('r3',projectId)),r4:read(storage,projectKey('r4',projectId)),r5:read(storage,projectKey('r5',projectId)),r6:read(storage,globalKeys.r6)}}}
export function legacyRecordCount(payload:LegacyMigrationPayload){return Object.values(payload.records).filter(v=>v!==null).length}
