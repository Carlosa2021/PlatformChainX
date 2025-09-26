import 'dotenv/config';
import { z } from 'zod';

// Esquema de validación de variables de entorno
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL requerida'),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET mínimo 16 chars'),
  COOKIE_SECRET: z.string().min(16, 'COOKIE_SECRET mínimo 16 chars'),
  AUTH_DOMAIN: z.string().min(1, 'AUTH_DOMAIN requerido'),
  THIRDWEB_SECRET_KEY: z.string().min(10, 'THIRDWEB_SECRET_KEY requerido'),
  THIRDWEB_ADMIN_PRIVATE_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info')
    .optional(),
  KYC_PROVIDER_API_KEY: z.string().optional(),
  STORAGE_PROVIDER: z.enum(['local', 's3', 'ipfs']).default('local').optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

const _parsed = envSchema.safeParse(process.env);
if (!_parsed.success) {
  console.error('\n[env] Errores de validación variables de entorno:');
  for (const issue of _parsed.error.issues) {
    console.error(` - ${issue.path.join('.')}: ${issue.message}`);
  }
  // No abortamos en dev para facilitar iteración
}

export const env = _parsed.success
  ? _parsed.data
  : ({} as z.infer<typeof envSchema>);

export type Env = typeof env;

export function requireEnv<K extends keyof Env>(key: K): Env[K] {
  const value = env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`[env] Falta variable obligatoria: ${String(key)}`);
  }
  return value;
}
