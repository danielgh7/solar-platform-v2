import bcrypt from 'bcryptjs';
import {createHash,randomBytes} from 'node:crypto';
import type {Request,Response,NextFunction} from 'express';
import {pool} from './db';import {env} from './env';import type {Role,Permission} from './rbac';import {hasPermission} from './rbac';

export const SESSION_COOKIE='solar_session';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
export type AuthContext={userId:string;email:string;displayName:string;organizationId:string;organizationSlug:string;role:Role;locale:'es-MX'|'en-US'};
declare global{namespace Express{interface Request{auth?:AuthContext}}}

export async function hashPassword(password:string){return bcrypt.hash(password,12)}
export async function verifyPassword(password:string,passwordHash:string){return bcrypt.compare(password,passwordHash)}
export async function createSession(userId:string,res:Response,req:Request){const token=randomBytes(32).toString('base64url');const expires=new Date(Date.now()+env.SESSION_TTL_HOURS*3600_000);await pool.query('insert into sessions(user_id,token_hash,expires_at,user_agent,ip_hash) values($1,$2,$3,$4,$5)',[userId,hash(token),expires,req.get('user-agent')||null,req.ip?hash(req.ip):null]);res.cookie(SESSION_COOKIE,token,{httpOnly:true,sameSite:'lax',secure:env.NODE_ENV==='production',expires,path:'/'});return expires}
export async function destroySession(req:Request,res:Response){const token=req.cookies?.[SESSION_COOKIE];if(token)await pool.query('delete from sessions where token_hash=$1',[hash(token)]);res.clearCookie(SESSION_COOKIE,{httpOnly:true,sameSite:'lax',secure:env.NODE_ENV==='production',path:'/'});}

export async function requireAuth(req:Request,res:Response,next:NextFunction){try{const token=req.cookies?.[SESSION_COOKIE];if(!token)return res.status(401).json({error:{code:'UNAUTHENTICATED'}});const orgId=req.params.orgId||req.header('x-organization-id');const q=await pool.query(`select u.id user_id,u.email,u.display_name,o.id organization_id,o.slug organization_slug,m.role,coalesce(p.locale,o.default_locale) locale
 from sessions s join users u on u.id=s.user_id join memberships m on m.user_id=u.id and m.active join organizations o on o.id=m.organization_id left join user_preferences p on p.user_id=u.id and p.organization_id=o.id
 where s.token_hash=$1 and s.expires_at>now() and u.active and ($2::uuid is null or o.id=$2::uuid) order by o.created_at limit 1`,[hash(token),orgId||null]);if(!q.rowCount)return res.status(401).json({error:{code:'SESSION_EXPIRED_OR_FORBIDDEN'}});const r=q.rows[0];req.auth={userId:r.user_id,email:r.email,displayName:r.display_name,organizationId:r.organization_id,organizationSlug:r.organization_slug,role:r.role,locale:r.locale};await pool.query('update sessions set last_seen_at=now() where token_hash=$1',[hash(token)]);next()}catch(e){next(e)}}
export function requirePermission(permission:Permission){return (req:Request,res:Response,next:NextFunction)=>{if(!req.auth)return res.status(401).json({error:{code:'UNAUTHENTICATED'}});if(!hasPermission(req.auth.role,permission))return res.status(403).json({error:{code:'FORBIDDEN',permission}});next()}}
