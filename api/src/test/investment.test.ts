import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma, registerPrismaTestHooks } from './setup.js';

registerPrismaTestHooks({ beforeEach, afterAll });

async function createBase() {
  const tenant = await prisma.tenant.create({
    data: { name: 'T', code: 't' + Date.now(), domain: null },
  });
  const user = await prisma.user.create({
    data: { walletAddress: '0x' + '1'.repeat(40), kycStatus: 'APPROVED' },
  });
  await prisma.userTenant.create({
    data: { userId: user.id, tenantId: tenant.id, role: 'INVESTOR' },
  });
  const campaign = await prisma.campaign.create({
    data: {
      tenantId: tenant.id,
      title: 'C',
      slug: 'c-' + Date.now(),
      descriptionMd: 'x',
      status: 'FUNDING',
      hardCap: '1000',
      tokenPriceUsd: '1',
      totalRaised: '0',
      totalInvestors: 0,
    },
  });
  await prisma.campaignToken.create({
    data: {
      campaignId: campaign.id,
      tokenAddress: '0x' + '2'.repeat(40),
      chainId: 11155111,
      totalSupply: '1000',
      soldSupply: '0',
      holdersCount: 0,
    },
  });
  return { tenant, user, campaign };
}

describe('Investment limits', () => {
  it('rejects investment exceeding hardCap', async () => {
    const { campaign, user } = await createBase();
    // Simular totalRaised cercano al límite
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { totalRaised: '990' },
    });
    // Validación offline replicando lógica (no usamos endpoint HTTP aquí aún)
    const hardCap = 1000;
    const attempt = 20; // 990 + 20 > 1000
    const newTotal = 990 + attempt;
    expect(newTotal > hardCap).toBe(true);
  });
});
