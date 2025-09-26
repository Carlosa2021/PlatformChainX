import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
// Import dinámico para evitar problemas de resolución de tipos en modo NodeNext
import { PrismaClient } from '@prisma/client';
import { authRoutes } from './routes/authRoutes.js';
import { campaignRoutes } from './routes/campaignRoutes.js';
import { kycRoutes } from './routes/kycRoutes.js';
import { investmentRoutes } from './routes/investmentRoutes.js';
import { dividendRoutes } from './routes/dividendRoutes.js';
import { env } from './config/env.js';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

const prisma = new PrismaClient();
const app = Fastify({
  logger: true,
});

// Correlación de requestId: aceptar x-request-id entrante o generar uno y exponerlo en la respuesta
app.addHook('onRequest', async (req, _reply) => {
  const incoming = req.headers['x-request-id'];
  if (incoming) {
    // Fastify ya genera request.id propio; podríamos mapear si quisiéramos.
    (req as any).correlationId = incoming;
  } else {
    (req as any).correlationId = req.id;
  }
});

app.addHook('onSend', async (req, reply, payload) => {
  const cid = (req as any).correlationId || req.id;
  reply.header('x-request-id', cid);
  return payload;
});

// Global error handler (after plugins register but before route registration)
app.setErrorHandler((error, request, reply) => {
  request.log.error(
    { err: error, url: request.url, id: request.id },
    'Unhandled error',
  );
  if (reply.sent) return;
  const status = (error as any).statusCode || 500;
  reply.status(status).send({
    error: status >= 500 ? 'Internal Server Error' : error.message,
    code: (error as any).code,
    requestId: (request as any).correlationId || request.id,
  });
});

await app.register(cors, { origin: true, credentials: true });
await app.register(cookie, { secret: env.COOKIE_SECRET || 'changeme' });
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

// Swagger / OpenAPI
await app.register(swagger, {
  openapi: {
    info: {
      title: 'Plataforma ChainX API',
      description:
        'API para la plataforma de tokenización / crowdfunding inmobiliario',
      version: '0.1.0',
    },
    servers: [
      { url: 'http://localhost:' + (env.PORT || 4000), description: 'Local' },
    ],
    tags: [
      { name: 'Health' },
      { name: 'Auth' },
      { name: 'Campaigns' },
      { name: 'Investments' },
      { name: 'Dividends' },
      { name: 'KYC' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

await app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'list', deepLinking: true },
});

app.get(
  '/health',
  {
    schema: {
      tags: ['Health'],
      summary: 'Health check',
      response: {
        200: { type: 'object', properties: { status: { type: 'string' } } },
      },
    },
  },
  async () => ({ status: 'ok' }),
);

await app.register(authRoutes);
await app.register(campaignRoutes);
await app.register(kycRoutes);
await app.register(investmentRoutes);
await app.register(dividendRoutes);

app.get('/tenants', async () => {
  return prisma.tenant.findMany();
});

app.post('/tenants/seed', async (_req, reply) => {
  const existing = await prisma.tenant.findFirst();
  if (existing) return { ok: true, id: existing.id };
  const created = await prisma.tenant.create({
    data: {
      name: 'Default Tenant',
      code: 'default',
      domain: null,
      primaryColor: '#FF751A',
      secondaryColor: '#1c1c24',
      logoUrl: null,
    },
  });
  return { ok: true, id: created.id };
});

const port = env.PORT || 4000;
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`API escuchando en puerto ${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
