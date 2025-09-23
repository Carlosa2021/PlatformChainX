# Plataforma ChainX (Monorepo)

Tokenización inmobiliaria y financiación colectiva regulada (enfoque MiCA/KYC/AML) con arquitectura híbrida on-chain / off-chain.

## Visión
Permitir la creación y gestión de campañas tokenizadas para activos inmobiliarios, distribuyendo dividendos (rentas / retornos) a inversores proporcionalmente a sus participaciones, con cumplimiento regulatorio, multi-tenant marca blanca y auditoría completa.

## Estructura del repositorio
```
SDSK_V5/
  api/        -> Backend Fastify + Prisma + Auth (thirdweb + JWT) + KYC + RBAC
  client/     -> Frontend React (Vite) + thirdweb React SDK + UI campañas / inversión
  web3/       -> Contratos Solidity (Hardhat) + scripts de despliegue/artifacts
  README.md   -> Este documento
  ENVIRONMENT.md -> Guía detallada de variables de entorno y seguridad
  .gitignore  -> Exclusiones monorepo
```

### api/
- Fastify (TypeScript/ESM) con rutas: auth, kyc, campaigns, tenants (seed) y próximas: investments, dividends.
- Autenticación: flujo `thirdweb auth` (payload + firma + verificación) -> provisión de usuario -> emisión de JWT (access + refresh rotativo httpOnly).
- KYC/AML: endpoints para carga de documentos, control de estado y webhook proveedor externo.
- Multi-tenant: separación lógica mediante tabla `tenants` y asociación `userTenant` (roles por tenant + roles globales).
- Auditoría: tablas `auditLog`, `kycStatusHistory`, `dividends`, `dividendClaims` (en progreso futuras rutas).

### client/
- React + Vite + TailwindCSS.
- SDK thirdweb v5: `ConnectButton` + hooks de cuenta + login explícito (botón Login) que dispara el flujo auth.
- Contexto `AuthProvider` mantiene estado (wallet conectada ≠ usuario autenticado) y gestiona tokens JWT.
- Próximos módulos: Dashboard KPIs, UI de dividendos, gestión whitelist, i18n, theming dinámico per-tenant.

### web3/
- Hardhat config + contratos:
  - `PlataformaChainX.sol`: Control central (campañas, roles on-chain mínimos, referencia token campaña).
  - `CampaignRegistry.sol` (o similar): Registro campañas y metadatos.
  - `TokenChainX.sol`: ERC20Snapshot extensible (dividendos pro-rata) + restricciones transferencia (whitelist / pausas / compliance).
  - `MockPriceFeed.sol`: Oráculo simulado para pruebas (Chainlink compatible) si se requiere pricing.
- Futuros añadidos: Eventos `DividendDeclared` / `DividendClaimed`, mapping documento hash, integración oráculos oficiales, mecanismo compliance (ej. transfer rules estilo ERC-1404).

## Flujo de Autenticación (Resumen)
1. Usuario conecta wallet (no crea sesión todavía).
2. Frontend solicita `/auth/payload` al backend.
3. Backend genera payload SIWE EIP-4361 vía thirdweb y valida `domain`.
4. Frontend firma (`signLoginPayload`) con la wallet activa.
5. Envío a `/auth/verify` -> backend:
   - Verifica firma con thirdweb auth.
   - Crea/actualiza usuario + wallet en base de datos.
   - Emite `accessToken` (JWT corto) y `refreshToken` (httpOnly cookie).
6. Frontend guarda `accessToken` en memoria (o almacenamiento seguro) y añade a headers.
7. Renovación silenciosa: ante 401 el wrapper intenta `/auth/refresh`.

## Modelo de Datos (Prisma) - Principales Tablas
- `User`, `Wallet`, `Tenant`, `UserTenantRole`
- `Campaign`, `Investment`, `Dividend`, `DividendClaim`
- `KycFile`, `KycStatusHistory`
- `Document` (hashing / referencia off-chain)
- `Notification`, `AuditLog`

## Roadmap (alto nivel)
1. Fundaciones (DB, Auth, KYC, Campañas) [EN CURSO]
2. Endpoints Investments + Dividendos (declaración y claim) + hashing documentos
3. UI avanzada Dashboard + métricas + gráficos
4. Theming multi-tenant + marca blanca + i18n
5. Notificaciones (Web Push / Email) + colas
6. Optimización performance, monitorización, hardening seguridad

## Scripts (por carpeta)
### api
- `npm run dev` -> Inicia servidor Fastify (tsx)
- `npx prisma migrate dev` -> Migraciones locales
- `npx prisma studio` -> Explorador datos

### client
- `npm run dev` -> Vite dev server
- `npm run build` -> Compilación producción

### web3
- `npx hardhat compile`
- `npx hardhat test`
- `npx hardhat run scripts/deploy.ts --network <network>` (ejemplo futuro)

## Variables de Entorno
Ver `ENVIRONMENT.md` para lista completa y clasificación por ámbito (backend, frontend, despliegue contratos).

## Seguridad / Compliance
- Separación estricta de secretos: claves thirdweb server vs client id.
- JWT httpOnly + rotación refresh tokens (mitigación XSS / replay).
- PII minimizada: datos KYC sólo metadatos indispensables; ficheros en storage externo cifrado (pendiente integración).
- Auditoría estados KYC y dividendos.
- Transferencias token restringidas a whitelist (plan) + snapshots para dividendos consistentes.

## Contribución (futuro)
- Estándar commit: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- PR checklist: lint, build, tests Hardhat + unit tests backend.

## Licencia
Ver `client/LICENCE.md` ó definir licencia en raíz (pendiente unificación).

## Estado Actual
- Auth thirdweb + JWT funcionando.
- Rutas KYC, campañas iniciales y seed tenant operativas.
- Falta: endpoints investments/dividends, documentación i18n, theming, notificaciones.

---
Para detalles pormenorizados de configuración, usos de variables y buenas prácticas, abre `ENVIRONMENT.md`.
