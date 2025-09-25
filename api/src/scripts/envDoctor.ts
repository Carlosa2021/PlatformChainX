import { requireEnv, env } from '../config/env.js';

const REQUIRED: (keyof typeof env)[] = [
  'DATABASE_URL',
  'JWT_SECRET',
  'COOKIE_SECRET',
  'AUTH_DOMAIN',
  'THIRDWEB_SECRET_KEY',
];

let missing: string[] = [];

for (const key of REQUIRED) {
  try {
    requireEnv(key);
  } catch {
    missing.push(key);
  }
}

if (missing.length) {
  console.error('\n[env:doctor] ❌ Faltan variables obligatorias:');
  for (const m of missing) console.error(' - ' + m);
  process.exitCode = 1;
} else {
  console.log('[env:doctor] ✅ Variables obligatorias presentes');
}

// Checks adicionales
if ((env.JWT_SECRET || '').length < 16) {
  console.warn('[env:doctor] ⚠️  JWT_SECRET debería tener >=16 chars');
}
if ((env.COOKIE_SECRET || '').length < 16) {
  console.warn('[env:doctor] ⚠️  COOKIE_SECRET debería tener >=16 chars');
}

if (!env.THIRDWEB_ADMIN_PRIVATE_KEY) {
  console.log(
    '[env:doctor] ℹ️  THIRDWEB_ADMIN_PRIVATE_KEY no configurada (opcional).',
  );
}

if (!env.ALLOWED_ORIGINS) {
  console.log(
    '[env:doctor] ℹ️  ALLOWED_ORIGINS no definida (por defecto CORS abierto en dev).',
  );
}
