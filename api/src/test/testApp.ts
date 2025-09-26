import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { authRoutes } from '../routes/authRoutes.js';
import { campaignRoutes } from '../routes/campaignRoutes.js';
import { kycRoutes } from '../routes/kycRoutes.js';
import { investmentRoutes } from '../routes/investmentRoutes.js';
import { dividendRoutes } from '../routes/dividendRoutes.js';

export async function buildTestApp() {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });
  await app.register(cookie, { secret: 'test' });
  await app.register(rateLimit, { max: 1000, timeWindow: '1 minute' });
  await app.register(authRoutes);
  await app.register(campaignRoutes);
  await app.register(kycRoutes);
  await app.register(investmentRoutes);
  await app.register(dividendRoutes);
  return app;
}
