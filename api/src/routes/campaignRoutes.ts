import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export async function campaignRoutes(app: FastifyInstance) {
  const createSchema = z.object({
    title: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    descriptionMd: z.string().min(10),
    hardCap: z.string(), // decimal as string
    tokenPriceUsd: z.string(),
    roiEstimatePct: z.number().optional(),
    riskLevel: z.string().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
  });

  app.get('/campaigns', {
    preHandler: [authenticate(false)],
    handler: async (_req, _reply) => {
      const items = await prisma.campaign.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
      });
      return { items };
    },
  });

  app.post('/campaigns', {
    preHandler: [
      authenticate(true),
      requireRole(['ADMIN_GLOBAL', 'ADMIN_TENANT', 'ISSUER']),
    ],
    handler: async (req, reply) => {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply
          .status(400)
          .send({ error: 'Invalid payload', issues: parsed.error.issues });
      }
      const data = parsed.data;
      const tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        return reply.status(400).send({ error: 'No tenant configured' });
      }
      const created = await prisma.campaign.create({
        data: {
          tenantId: tenant.id,
          title: data.title,
          slug: data.slug,
          descriptionMd: data.descriptionMd,
          hardCap: data.hardCap,
          tokenPriceUsd: data.tokenPriceUsd,
          roiEstimatePct: data.roiEstimatePct ?? null,
          riskLevel: data.riskLevel ?? null,
          startsAt: data.startsAt ? new Date(data.startsAt) : null,
          endsAt: data.endsAt ? new Date(data.endsAt) : null,
        },
      });
      return { created };
    },
  });
}
