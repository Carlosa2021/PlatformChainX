import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

// Prisma expone los enums tanto como tipo (KycStatus) como objeto runtime a través de Prisma.KycStatus
// Usamos valores literales derivados del schema para mantener tipado sin depender del namespace Prisma.* (que puede no resolverse en tiempo de build con NodeNext)
const KycStatusEnum = {
  PENDING: 'PENDING',
  DOCS_REQUIRED: 'DOCS_REQUIRED',
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVOKED: 'REVOKED',
} as const;
type KycStatus = keyof typeof KycStatusEnum;

const prisma = new PrismaClient();

const transitionAllowed: Record<KycStatus, KycStatus[]> = {
  PENDING: ['DOCS_REQUIRED', 'REVIEW', 'APPROVED', 'REJECTED'],
  DOCS_REQUIRED: ['REVIEW', 'APPROVED', 'REJECTED'],
  REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: ['REVOKED'],
  REJECTED: ['REVIEW'],
  REVOKED: [],
};

async function changeStatus(userId: string, to: KycStatus, reason?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const from = user.kycStatus;
  const fromTyped = from as KycStatus;
  if (!transitionAllowed[fromTyped].includes(to)) {
    throw new Error(`Transition ${from} -> ${to} no permitida`);
  }
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { kycStatus: to, kycUpdatedAt: new Date() },
    });
    await tx.kycStatusHistory.create({
      data: { userId, fromStatus: from, toStatus: to, reason },
    });
    await tx.auditLog.create({
      data: {
        userId,
        action: 'KYC_STATUS_CHANGE',
        entity: 'User',
        entityId: userId,
        meta: { from, to, reason },
      },
    });
  });
}

export async function kycRoutes(app: FastifyInstance) {
  // Solicitar sesión KYC (simulación)
  app.post(
    '/kyc/request',
    { preHandler: [authenticate(true)] },
    async (req: any, reply) => {
      const userId = req.user!.userId;
      // Simulamos crear sessionId externo
      const sessionId = `prov_${userId}_${Date.now()}`;
      await prisma.user.update({
        where: { id: userId },
        data: {
          kycProviderSessionId: sessionId,
          kycStatus: 'DOCS_REQUIRED',
          kycUpdatedAt: new Date(),
        },
      });
      await prisma.kycStatusHistory.create({
        data: {
          userId,
          fromStatus: 'PENDING',
          toStatus: 'DOCS_REQUIRED',
          reason: 'session created',
        },
      });
      return { sessionId };
    },
  );

  // Subir metadatos de archivo KYC (solo referencia, no almacenamos PII real aquí)
  const fileSchema = z.object({
    type: z.string(),
    storageKey: z.string(),
    sha256: z.string().length(64),
  });
  app.post(
    '/kyc/files',
    { preHandler: [authenticate(true)] },
    async (req: any, reply) => {
      const parse = fileSchema.safeParse(req.body);
      if (!parse.success)
        return reply
          .status(400)
          .send({ error: 'Payload inválido', issues: parse.error.issues });
      const userId = req.user!.userId;
      const { type, storageKey, sha256 } = parse.data;
      await prisma.kycFile.create({
        data: { userId, type, storageKey, hashSha256: sha256 },
      });
      return { ok: true };
    },
  );

  // Webhook del proveedor externo
  const webhookSchema = z.object({
    provider: z.string(),
    sessionId: z.string(),
    status: z.nativeEnum(KycStatusEnum),
    reason: z.string().optional(),
  });
  app.post('/kyc/webhook', async (req, reply) => {
    const parsed = webhookSchema.safeParse(req.body);
    if (!parsed.success)
      return reply
        .status(400)
        .send({ error: 'Bad webhook', issues: parsed.error.issues });
    const { sessionId, status, reason } = parsed.data;
    const user = await prisma.user.findFirst({
      where: { kycProviderSessionId: sessionId },
    });
    if (!user) return reply.status(404).send({ error: 'Session not found' });
    try {
      await changeStatus(user.id, status, reason as string | undefined);
      return { ok: true };
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  });

  // Admin: listar pendientes / en revisión
  app.get(
    '/admin/kyc/pending',
    {
      preHandler: [
        authenticate(true),
        requireRole(['ADMIN_GLOBAL', 'ADMIN_TENANT']),
      ],
    },
    async (_req, _reply) => {
      const users = await prisma.user.findMany({
        where: { kycStatus: { in: ['PENDING', 'DOCS_REQUIRED', 'REVIEW'] } },
        take: 100,
        orderBy: { createdAt: 'asc' },
      });
      return { users };
    },
  );

  // Admin override manual
  const overrideSchema = z.object({
    status: z.nativeEnum(KycStatusEnum),
    reason: z.string().optional(),
  });
  app.post(
    '/admin/kyc/:userId/override',
    { preHandler: [authenticate(true), requireRole(['ADMIN_GLOBAL'])] },
    async (req: any, reply) => {
      const { userId } = req.params as { userId: string };
      const parsed = overrideSchema.safeParse(req.body);
      if (!parsed.success)
        return reply
          .status(400)
          .send({ error: 'Invalid payload', issues: parsed.error.issues });
      try {
        await changeStatus(
          userId,
          parsed.data.status,
          parsed.data.reason as string | undefined,
        );
        return { ok: true };
      } catch (e: any) {
        return reply.status(400).send({ error: e.message });
      }
    },
  );
}
