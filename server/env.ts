import {z} from 'zod';

const schema=z.object({
 NODE_ENV:z.enum(['development','test','production']).default('development'),
 PORT:z.coerce.number().int().min(1).max(65535).default(8787),
 DATABASE_URL:z.string().min(1),
 DATABASE_SSL:z.enum(['require','disable']).default('require'),
 SESSION_SECRET:z.string().min(32),
 APP_ORIGIN:z.string().url().default('http://127.0.0.1:4173'),
 SESSION_TTL_HOURS:z.coerce.number().int().min(1).max(24*30).default(12),
 AUTH_RATE_LIMIT:z.coerce.number().int().min(1).max(1000).default(20),
 API_RATE_LIMIT:z.coerce.number().int().min(10).max(100000).default(2000),
 AI_PROVIDER:z.enum(['mock','openai']).default('mock'),
 OPENAI_API_KEY:z.string().min(20).optional(),
 OPENAI_MODEL:z.string().min(1).default('gpt-6-luna'),
 OPENAI_INPUT_USD_PER_M:z.coerce.number().min(0).default(0),OPENAI_OUTPUT_USD_PER_M:z.coerce.number().min(0).default(0),
 AI_TIMEOUT_MS:z.coerce.number().int().min(1000).max(120000).default(45000),
 AI_MAX_STEPS:z.coerce.number().int().min(1).max(12).default(6),
 AI_KILL_SWITCH:z.coerce.boolean().default(false),
 CFE_MAX_BYTES:z.coerce.number().int().min(1024).max(25*1024*1024).default(15*1024*1024),
});
export type ServerEnv=z.infer<typeof schema>;
export function parseEnv(input:NodeJS.ProcessEnv):ServerEnv{const renderOrigin=input.RENDER_EXTERNAL_HOSTNAME?`https://${input.RENDER_EXTERNAL_HOSTNAME}`:undefined;return schema.parse({...input,APP_ORIGIN:input.APP_ORIGIN||renderOrigin})}
const testDefaults:NodeJS.ProcessEnv={NODE_ENV:'test',DATABASE_URL:'postgres://solar:solar@127.0.0.1:5432/solar_platform_v2_test',SESSION_SECRET:'r7-vitest-isolated-session-secret-32chars'};
export const env=parseEnv(process.env.NODE_ENV==='test'?{...testDefaults,...process.env}:process.env);
