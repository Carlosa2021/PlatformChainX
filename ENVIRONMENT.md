# Variables de Entorno y Configuración

Guía consolidada de variables utilizadas en el monorepo. Mantén los secretos únicamente en el backend (`api/`) y/o en pipelines seguros.

## Principios
- Separación de responsabilidades: frontend nunca debe contener llaves privadas o secretos.
- Versionar sólo archivos `*.env.example` (plantillas). Nunca subir `.env` reales.
- Rotar secretos sensibles al menos cada 90 días o tras incidentes.
- Usar diferentes valores por entorno: `development`, `staging`, `production`.

## Backend (`api/.env`)
Obligatorias:
- `DATABASE_URL` -> Cadena conexión Postgres. Ej: `postgresql://user:pass@localhost:5432/chainx`.
- `PORT` -> Puerto servidor Fastify (ej: 4000).
- `JWT_SECRET` -> Secreto firma JWT (mínimo 32 chars aleatorios).
- `COOKIE_SECRET` -> Secreto cifrado/firmado cookies (rotar distinto a JWT_SECRET).
- `AUTH_DOMAIN` -> Dominio esperado en mensajes SIWE/thirdweb (ej: `localhost:4000` en dev ó `app.mi-dominio.com`).
- `THIRDWEB_SECRET_KEY` -> Server-side secret key (desde panel thirdweb) para firmar/validar payload.

Opcionales / Avanzadas:
- `THIRDWEB_ADMIN_PRIVATE_KEY` -> Llave privada para operaciones administrativas (NO en frontend). Ideal usar un wallet dedicado multi-sig en prod.
- `ALLOWED_ORIGINS` -> Lista separada por comas para CORS.
- `LOG_LEVEL` -> pino level (`info`, `debug`, `warn`, `error`).
- `KYC_PROVIDER_API_KEY` -> Clave API proveedor KYC externo.
- `STORAGE_PROVIDER` -> `s3` | `ipfs` | `local` (planeado).
- `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` -> Requeridas si `STORAGE_PROVIDER=s3`.
- `REDIS_URL` -> Para colas BullMQ (notificaciones, jobs asíncronos futuros).

## Frontend (`client/.env`)
Públicas (se exponen al bundle, prefijar si se usa Vite):
- `VITE_THIRDWEB_CLIENT_ID` -> Client ID de thirdweb (no es secreto, pero no incluir secret key).
- `VITE_API_BASE_URL` -> Base URL de la API (ej: `http://localhost:4000`).
- `VITE_DEFAULT_CHAIN_ID` -> Cadena por defecto (ej: 84532 para Base Sepolia, 11155111 para Sepolia).

Nunca colocar aquí llaves privadas o `THIRDWEB_SECRET_KEY`.

## Web3 / Despliegue (`web3/.env`)
- `PRIVATE_KEY_DEPLOYER` -> Llave del deployer (usar cuenta fría o multi-sig; rotar tras despliegues críticos).
- `RPC_URL_<NETWORK>` -> Ej: `RPC_URL_BASE_SEPOLIA`, `RPC_URL_SEPOLIA`.
- `ETHERSCAN_API_KEY` / `BASESCAN_API_KEY` -> Para verificación de contratos.
- `REPORT_GAS` -> `true|false` para informes gas Hardhat.

## Ejemplos de Archivos
Ver: `api/.env.example`, `client/.env.example`, `web3/.env.example`.

## Buenas Prácticas de Seguridad
1. Usar gestores de secretos (Vault, SSM, Doppler) en producción; no archivos .env planos.
2. Rechazar requests con dominio SIWE diferente a `AUTH_DOMAIN`.
3. Implementar rotación de refresh tokens (ya soportado) y revocación en logout global.
4. Añadir cabeceras seguridad (CSP, HSTS, X-Frame-Options) vía plugin Fastify Helmet (pendiente).
5. En producción forzar HTTPS y sameSite=strict + secure cookies.
6. Limitar orígenes CORS y métodos permitidos.
7. Validar tamaños de archivo KYC y escanear malware (pipeline futuro).

## Flujos Relacionados
- `thirdweb auth`: usa `THIRDWEB_SECRET_KEY` exclusivamente en backend para `createAuth`. El frontend sólo consume `VITE_THIRDWEB_CLIENT_ID` al inicializar el SDK.
- Dividendos: futuros endpoints usarán snapshot ID + cálculo pro-rata off-chain/oráculo; no requieren nuevas variables salvo endpoints RPC adicionales.

## Matriz Resumen
| Variable | Ubicación | Secreta | Descripción |
|----------|-----------|---------|-------------|
| DATABASE_URL | api | Sí | Conexión Postgres |
| JWT_SECRET | api | Sí | Firma JWT acceso |
| COOKIE_SECRET | api | Sí | Firma/cifrado cookies refresh |
| AUTH_DOMAIN | api | No (sensible) | Validación dominio SIWE |
| THIRDWEB_SECRET_KEY | api | Sí | Auth server thirdweb |
| THIRDWEB_ADMIN_PRIVATE_KEY | api | Sí | Operaciones admin (opcional) |
| VITE_THIRDWEB_CLIENT_ID | client | No | Inicializar SDK thirdweb |
| VITE_API_BASE_URL | client | No | Endpoint API backend |
| PRIVATE_KEY_DEPLOYER | web3 | Sí | Deploy contratos |
| RPC_URL_* | web3 | Potencial | URLs RPC personalizadas |

## Checklist Pre-Deploy
- [ ] Variables obligatorias presentes en backend.
- [ ] Ninguna secret key expuesta en `client/.env`.
- [ ] Scripts hardhat usan variable deployer aislada.
- [ ] CORS restringido.
- [ ] Cookies con `secure` + `sameSite=strict` en prod.
- [ ] Logs en nivel `info` (no debug) en prod.

## Próximos Pasos
- Añadir script `pnpm run env:doctor` (o npm) para validar presencia de variables críticas.
- Integrar gestor de secretos (Vault / AWS Parameter Store) en pipeline CI/CD.
