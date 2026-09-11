import {z} from 'zod';

const schema=z.object({
 NODE_ENV:z.enum(['development','test','production']).default('development'),
 PORT:z.coerce.number().int().min(1).max(65535).default(8787),
 DATABASE_URL:z.string().min(1),
 SESSION_SECRET:z.string().min(32),
 APP_ORIGIN:z.string().url().default('http://127.0.0.1:4173'),
 SESSION_TTL_HOURS:z.coerce.number().int().min(1).max(24*30).default(12),
 AUTH_RATE_LIMIT:z.coerce.number().int().min(1).max(1000).default(20),
 API_RATE_LIMIT:z.coerce.number().int().min(10).max(100000).default(2000),
});
export type ServerEnv=z.infer<typeof schema>;
export function parseEnv(input:NodeJS.ProcessEnv):ServerEnv{return schema.parse(input)}
const testDefaults:NodeJS.ProcessEnv={NODE_ENV:'test',DATABASE_URL:'postgres://solar:solar@127.0.0.1:5432/solar_platform_v2_test',SESSION_SECRET:'r7-vitest-isolated-session-secret-32chars'};
export const env=parseEnv(process.env.NODE_ENV==='test'?{...testDefaults,...process.env}:process.env);
