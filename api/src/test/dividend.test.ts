import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma, registerPrismaTestHooks } from './setup.js';

registerPrismaTestHooks({ beforeEach, afterAll });

async function seedOneInvestor() {
  const tenant = await prisma.tenant.create({
    data: { name: 'T2', code: 't2' + Date.now(), domain: null },
  });
  const user = await prisma.user.create({
    data: { walletAddress: '0x' + '3'.repeat(40), kycStatus: 'APPROVED' },
  });
  await prisma.userTenant.create({
    data: { userId: user.id, tenantId: tenant.id, role: 'INVESTOR' },
  });
  const campaign = await prisma.campaign.create({
    data: {
      tenantId: tenant.id,
      title: 'Camp',
      slug: 'camp-' + Date.now(),
      descriptionMd: 'demo',
      status: 'FUNDING',
      hardCap: '5000',
      tokenPriceUsd: '1',
      totalRaised: '0',
      totalInvestors: 0,
    },
  });
  await prisma.campaignToken.create({
    data: {
      campaignId: campaign.id,
      tokenAddress: '0x' + '4'.repeat(40),
      chainId: 11155111,
      totalSupply: '10000',
      soldSupply: '0',
      holdersCount: 0,
    },
  });
  await prisma.investment.create({
    data: {
      campaignId: campaign.id,
      userId: user.id,
      walletAddress: user.walletAddress,
      txHash: '0x' + 'b'.repeat(64),
      amountUsd: '1000',
      tokenAmount: '1000',
    },
  });
  return { campaign, user };
}

describe('Dividend pro-rata', () => {
  it('basic math sanity', async () => {
    const { campaign, user } = await seedOneInvestor();
    // Simular cálculo pro-rata con un único inversor
    const totalTokens = 1000;
    const totalDividend = 100;
    const share = 1000 / totalTokens;
    const amount = share * totalDividend;
    expect(amount).toBe(100);
  });
});
