import type {AuditEntry,AuditEventType} from './types';
export const auditEntry=(eventType:AuditEventType,entityId:string,occurredAt:string,actorId:string,before?:unknown,after?:unknown,note?:string):AuditEntry=>({id:`audit-${occurredAt}-${eventType}-${entityId}`.replace(/[^a-zA-Z0-9-]/g,''),eventType,entityId,occurredAt,actorId,before,after,note});
