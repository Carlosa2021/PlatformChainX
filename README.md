# ChainX Protocol 🚀
## *La Primera Plataforma de Tokenización con IA que se Paga Sola*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Thirdweb](https://img.shields.io/badge/Powered%20by-Thirdweb%20SDK5-purple)](https://thirdweb.com)
[![AI Powered](https://img.shields.io/badge/AI-Powered-blue)](https://github.com/Carlosa2021/PlatformChainX)
[![Chains](https://img.shields.io/badge/Chains-2500+-green)](https://chainlist.org)

---

## 🎯 **Visión Revolucionaria**

**Democratizar la tokenización de activos** mediante inteligencia artificial, permitiendo que cualquier persona o empresa tokenice activos en **5 minutos** instead de semanas, con una plataforma que **se paga sola**.

### 🤖 **¿Qué nos hace únicos?**

#### **IA Nativa Integrada**
- Tokenización automática con análisis de mercado en tiempo real
- Smart contracts generados y auditados por IA
- Compliance automático (MiCA/KYC/AML)
- Auto-yield farming que recupera tu inversión

#### **Infraestructura Enterprise**
- **2,500+ blockchains** soportadas (vs 10 de competencia)
- Account Abstraction para UX sin fricciones
- Cross-chain arbitrage automático
- Gas sponsorship inteligente

#### **Modelo de Negocio Disruptivo**
- Fees desde **0.3%** (vs 2-5% competencia)
- Revenue sharing con partners
- **ROI garantizado**: La plataforma genera más de lo que cuesta

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
