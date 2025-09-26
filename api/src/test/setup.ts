import { PrismaClient } from '@prisma/client';

// Única instancia reutilizable en tests
export const prisma = new PrismaClient();

// Factoría de hooks para usarse dentro de cada archivo de test sin requerir tipos globales durante build
export function registerPrismaTestHooks(v: {
  beforeEach: (fn: () => any) => void;
  afterAll: (fn: () => any) => void;
}) {
  v.beforeEach(async () => {
    await prisma.dividendClaim.deleteMany();
    await prisma.dividend.deleteMany();
    await prisma.investment.deleteMany();
    await prisma.campaignToken.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.userTenant.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  });
  v.afterAll(async () => {
    await prisma.$disconnect();
  });
}
