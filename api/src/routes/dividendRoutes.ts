import { FastifyInstance } from 'fastify';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  authenticate,
  requireRole,
  AuthenticatedRequest,
} from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export async function dividendRoutes(app: FastifyInstance) {
  const declareSchema = z.object({
    campaignId: z.string().cuid(),
    periodLabel: z.string().min(2),
    totalAmount: z.string().regex(/^\d+(\.\d+)?$/),
    txHash: z
      .string()
      .regex(/^0x[0-9a-fA-F]{64}$/)
      .optional(),
  });

  // Declarar dividendo
  app.post('/dividends/declare', {
    preHandler: [
      authenticate(true),
      requireRole(['ADMIN_GLOBAL', 'ADMIN_TENANT', 'ISSUER']),
    ],
    handler: async (req: AuthenticatedRequest, reply) => {
      const parsed = declareSchema.safeParse(req.body);
      if (!parsed.success)
        return reply
          .status(400)
          .send({ error: 'Payload inválido', issues: parsed.error.issues });
      const { campaignId, periodLabel, totalAmount, txHash } = parsed.data;
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { investments: true },
      });
      if (!campaign)
        return reply.status(404).send({ error: 'Campaña no encontrada' });
      if (!campaign.investments.length)
        return reply
          .status(400)
          .send({ error: 'Sin inversiones para distribuir' });

      // Validación: no declarar dividendos superiores a lo recaudado acumulado
      try {
        const totalRaisedDec = new Prisma.Decimal(campaign.totalRaised);
        const totalAmountDec = new Prisma.Decimal(totalAmount);
        if (totalAmountDec.lte(0)) {
          return reply.status(400).send({ error: 'totalAmount debe ser > 0' });
        }
        if (totalAmountDec.gt(totalRaisedDec)) {
          return reply.status(400).send({
            error: 'Dividendo excede lo recaudado',
            details: {
              totalRaised: totalRaisedDec.toString(),
              intentoDividend: totalAmountDec.toString(),
            },
          });
        }
      } catch (e: any) {
        return reply.status(400).send({
          error: 'Error validando monto de dividendo',
          details: e.message,
        });
      }

      try {
        const dividend = await prisma.$transaction(async (tx) => {
          // Crear dividendo
          const div = await tx.dividend.create({
            data: {
              campaignId,
              periodLabel,
              totalAmount,
              txHash: txHash || null,
            },
          });

          // Agregar claims proporcionalmente
          // Calcular total de tokens invertidos (iterativo para evitar problemas de tipado con reduce + Prisma.Decimal)
          let totalTokens = new Prisma.Decimal(0);
          for (const inv of campaign.investments) {
            totalTokens = totalTokens.add(new Prisma.Decimal(inv.tokenAmount));
          }
          if (totalTokens.isZero())
            throw new Error('Total de tokens invertidos es 0');
          const totalDividend = new Prisma.Decimal(totalAmount);
          const claimsData = campaign.investments.map(
            (inv: (typeof campaign.investments)[number]) => {
              const share = new Prisma.Decimal(inv.tokenAmount).div(
                totalTokens,
              );
              const amount = share.mul(totalDividend);
              return {
                dividendId: div.id,
                userId: inv.userId,
                amount: amount.toFixed(),
              };
            },
          );
          await tx.dividendClaim.createMany({ data: claimsData });

          // Actualizar estado campaña a DIVIDENDS_DECLARED (si no cerrado)
          if (campaign.status !== 'CLOSED' && campaign.status !== 'ARCHIVED') {
            await tx.campaign.update({
              where: { id: campaignId },
              data: { status: 'DIVIDENDS_DECLARED' },
            });
          }
          return div;
        });
        return { dividend };
      } catch (e: any) {
        return reply
          .status(400)
          .send({ error: e.message || 'Error declarando dividendo' });
      }
    },
  });

  // Listar dividendos por campaña (incluyendo estado de claim del usuario si autenticado)
  app.get('/dividends/:campaignId', {
    preHandler: [authenticate(false)],
    handler: async (req: AuthenticatedRequest, reply) => {
      const { campaignId } = req.params as any;
      const dividends = await prisma.dividend.findMany({
        where: { campaignId },
        orderBy: { declaredAt: 'desc' },
        include: req.user
          ? { claims: { where: { userId: req.user.userId } } }
          : undefined,
      });
      return { dividends };
    },
  });

  // Reclamar dividendo
  const claimSchema = z.object({
    txHash: z
      .string()
      .regex(/^0x[0-9a-fA-F]{64}$/)
      .optional(),
  });
  app.post('/dividends/:dividendId/claim', {
    preHandler: [
      authenticate(true),
      requireRole(['INVESTOR', 'ADMIN_TENANT', 'ADMIN_GLOBAL', 'ISSUER']),
    ],
    handler: async (req: AuthenticatedRequest, reply) => {
      const { dividendId } = req.params as any;
      const parsed = claimSchema.safeParse(req.body || {});
      if (!parsed.success)
        return reply.status(400).send({ error: 'Payload inválido' });
      const claim = await prisma.dividendClaim.findFirst({
        where: { dividendId, userId: req.user!.userId },
      });
      if (!claim)
        return reply.status(404).send({ error: 'Claim no encontrado' });
      if (claim.claimed)
        return reply.status(400).send({ error: 'Ya reclamado' });
      const updated = await prisma.dividendClaim.update({
        where: { id: claim.id },
        data: {
          claimed: true,
          claimedAt: new Date(),
          txHash: parsed.data.txHash || null,
        },
      });
      return { claim: updated };
    },
  });
}
