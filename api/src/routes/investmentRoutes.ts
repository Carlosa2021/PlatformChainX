import { FastifyInstance } from 'fastify';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  authenticate,
  requireRole,
  AuthenticatedRequest,
} from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export async function investmentRoutes(app: FastifyInstance) {
  const investSchema = z.object({
    campaignId: z.string().cuid(),
    amountUsd: z.string().regex(/^\d+(\.\d+)?$/), // decimal como string
    tokenAmount: z.string().regex(/^\d+(\.\d+)?$/),
    txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
    walletAddress: z
      .string()
      .regex(/^0x[0-9a-fA-F]{40}$/)
      .optional(), // puede derivarse del usuario
  });

  // Listar inversiones por campaña
  app.get('/investments', {
    preHandler: [authenticate(false)],
    handler: async (req, reply) => {
      const campaignId = (req.query as any)?.campaignId as string | undefined;
      if (!campaignId)
        return reply.status(400).send({ error: 'campaignId requerido' });
      const items = await prisma.investment.findMany({
        where: { campaignId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return { items };
    },
  });

  // Crear inversión
  app.post('/investments', {
    preHandler: [
      authenticate(true),
      requireRole(['INVESTOR', 'ADMIN_TENANT', 'ADMIN_GLOBAL', 'ISSUER']),
    ],
    handler: async (req: AuthenticatedRequest, reply) => {
      const parsed = investSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply
          .status(400)
          .send({ error: 'Payload inválido', issues: parsed.error.issues });
      }
      const { campaignId, amountUsd, tokenAmount, txHash } = parsed.data;
      const walletAddr = (
        parsed.data.walletAddress || req.user!.wallet
      ).toLowerCase();

      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { tokenStats: true },
      });
      if (!campaign)
        return reply.status(404).send({ error: 'Campaña no encontrada' });
      if (campaign.status === 'CLOSED' || campaign.status === 'ARCHIVED') {
        return reply
          .status(400)
          .send({ error: 'Campaña cerrada para inversión' });
      }
      // Validaciones de límites económicos antes de abrir la transacción
      try {
        const amountDec = new Prisma.Decimal(amountUsd);
        const tokenDec = new Prisma.Decimal(tokenAmount);
        if (amountDec.lte(0) || tokenDec.lte(0)) {
          return reply
            .status(400)
            .send({ error: 'Los montos deben ser mayores que 0' });
        }

        const newTotalRaised = new Prisma.Decimal(campaign.totalRaised).add(
          amountDec,
        );
        if (newTotalRaised.gt(new Prisma.Decimal(campaign.hardCap))) {
          return reply.status(400).send({
            error: 'Excede el hardCap de la campaña',
            details: {
              hardCap: campaign.hardCap.toString(),
              intentoTotal: newTotalRaised.toString(),
            },
          });
        }
        if (campaign.tokenStats) {
          const newSold = new Prisma.Decimal(
            campaign.tokenStats.soldSupply,
          ).add(tokenDec);
          if (newSold.gt(new Prisma.Decimal(campaign.tokenStats.totalSupply))) {
            return reply.status(400).send({
              error: 'Excede el totalSupply del token de la campaña',
              details: {
                totalSupply: campaign.tokenStats.totalSupply.toString(),
                intentoSoldSupply: newSold.toString(),
              },
            });
          }
        }
      } catch (e: any) {
        return reply.status(400).send({
          error: 'Error validando límites de campaña',
          details: e.message,
        });
      }

      try {
        const result = await prisma.$transaction(async (tx) => {
          const existingTx = await tx.investment.findFirst({
            where: { txHash },
          });
          if (existingTx) throw new Error('txHash ya registrado');

          const investment = await tx.investment.create({
            data: {
              campaignId,
              userId: req.user!.userId,
              walletAddress: walletAddr,
              txHash,
              amountUsd,
              tokenAmount,
            },
          });

          // Actualizar métricas campaña (incremental)
          const priorUserInvestment = await tx.investment.findFirst({
            where: {
              campaignId,
              userId: req.user!.userId,
              NOT: { id: investment.id },
            },
          });

          await tx.campaign.update({
            where: { id: campaignId },
            data: {
              totalRaised: new Prisma.Decimal(campaign.totalRaised)
                .add(new Prisma.Decimal(amountUsd))
                .toString(),
              totalInvestors: priorUserInvestment
                ? campaign.totalInvestors
                : campaign.totalInvestors + 1,
              tokenStats: campaign.tokenStats
                ? {
                    update: {
                      soldSupply: new Prisma.Decimal(
                        campaign.tokenStats.soldSupply,
                      )
                        .add(new Prisma.Decimal(tokenAmount))
                        .toString(),
                      holdersCount: priorUserInvestment
                        ? campaign.tokenStats.holdersCount
                        : campaign.tokenStats.holdersCount + 1,
                    },
                  }
                : undefined,
            },
          });

          return investment;
        });
        return { investment: result };
      } catch (e: any) {
        return reply
          .status(400)
          .send({ error: e.message || 'Error creando inversión' });
      }
    },
  });
}
