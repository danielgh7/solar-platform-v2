import {describe,it,expect} from 'vitest';import {parseEnv} from './env';import {hasPermission,ROLE_PERMISSIONS} from './rbac';import {brandUpdateSchema,localeSchema,migrationPreviewSchema,projectStateSchema,proposalVersionSchema,signInSchema} from './schemas';
const env={NODE_ENV:'test',DATABASE_URL:'postgres://x:x@127.0.0.1:5432/x',SESSION_SECRET:'12345678901234567890123456789012',APP_ORIGIN:'http://127.0.0.1:4173'} as any;
describe('R7 production foundation',()=>{
 it('validates environment',()=>expect(parseEnv(env).PORT).toBe(8787));
 it('rejects short session secrets',()=>expect(()=>parseEnv({...env,SESSION_SECRET:'short'})).toThrow());
 it('accepts es-MX and en-US only',()=>{expect(localeSchema.parse('es-MX')).toBe('es-MX');expect(()=>localeSchema.parse('es-ES')).toThrow()});
 it('requires real sign-in fields',()=>expect(signInSchema.parse({email:'a@b.com',password:'12345678'}).email).toBe('a@b.com'));
 it('Admin owns all declared permissions',()=>expect(ROLE_PERMISSIONS.Admin.size).toBeGreaterThan(10));
 it('Commercial cannot see internal margin',()=>expect(hasPermission('Commercial','economics.internal.read')).toBe(false));
 it('Viewer cannot see internal margin',()=>expect(hasPermission('Viewer','economics.internal.read')).toBe(false));
 it('Engineering can edit engineering',()=>expect(hasPermission('Engineering','engineering.edit')).toBe(true));
 it('Operations can write handoff',()=>expect(hasPermission('Operations','handoff.write')).toBe(true));
 it('Viewer cannot mutate CRM',()=>expect(hasPermission('Viewer','crm.write')).toBe(false));
 it('brand update requires expected version',()=>expect(()=>brandUpdateSchema.parse({})).toThrow());
 it('brand colors require canonical hex',()=>expect(()=>brandUpdateSchema.partial().parse({primaryColor:'red'})).toThrow());
 it('project state uses optimistic version',()=>expect(projectStateSchema.parse({schemaVersion:1,r1:{},r2:{},r3:{},r4:{},r5:{},r6:{},expectedVersion:0}).expectedVersion).toBe(0));
 it('proposal version schema preserves canonical IDs',()=>expect(proposalVersionSchema.parse({proposalId:'proposal-v2',versionNumber:2,status:'Exported',canonicalSnapshot:{projectId:'SOL-2026-0184'},brandingSnapshot:{displayName:'Brand'},locale:'es-MX'}).proposalId).toBe('proposal-v2'));
 it('legacy migration format is versioned',()=>expect(migrationPreviewSchema.parse({formatVersion:1,legacyWorkspaceId:'default',projectId:'SOL-X',records:{r1:{}}}).formatVersion).toBe(1));
});
