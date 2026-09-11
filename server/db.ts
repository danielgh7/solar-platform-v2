import pg from 'pg';
import {env} from './env';
const {Pool}=pg;
export const pool=new Pool({connectionString:env.DATABASE_URL,max:12,ssl:env.NODE_ENV==='production'?{rejectUnauthorized:true}:undefined});
export type DbClient=pg.PoolClient;
export async function tx<T>(fn:(client:DbClient)=>Promise<T>):Promise<T>{const c=await pool.connect();try{await c.query('BEGIN');const out=await fn(c);await c.query('COMMIT');return out}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}}
export async function ping(){const r=await pool.query('select now() as now');return r.rows[0]}
