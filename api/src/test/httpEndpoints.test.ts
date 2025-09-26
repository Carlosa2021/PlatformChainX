import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma, registerPrismaTestHooks } from './setup.js';
import { buildTestApp } from './testApp.js';
import { AuthService } from '../auth/authService.js';
// Decimal estricto no necesario aquí: usamos Number para assert de suma y proporciones.

registerPrismaTestHooks({ beforeEach, afterAll });

async function createCampaignWithToken() {
  const tenant = await prisma.tenant.create({
    data: { name: 'Tenant', code: 't' + Date.now(), domain: null },
  });
  const campaign = await prisma.campaign.create({
    data: {
      tenantId: tenant.id,
      title: 'Asset',
      slug: 'asset-' + Date.now(),
      descriptionMd: 'demo',
      status: 'FUNDING',
      hardCap: '10000',
      tokenPriceUsd: '1',
      totalRaised: '0',
      totalInvestors: 0,
    },
  });
  await prisma.campaignToken.create({
    data: {
      campaignId: campaign.id,
      tokenAddress: '0x' + '9'.repeat(40),
      chainId: 11155111,
      totalSupply: '10000',
      soldSupply: '0',
      holdersCount: 0,
    },
  });
  return { tenant, campaign };
}

async function createUserWithRole(
  wallet: string,
  role: string,
  tenantId: string,
) {
  const user = await prisma.user.create({
    data: { walletAddress: wallet, kycStatus: 'APPROVED' },
  });
  await prisma.userTenant.create({
    data: { userId: user.id, tenantId, role },
  });
  const token = AuthService.issueToken({
    sub: user.id,
    w: wallet,
    r: [role],
  });
  return { user, token };
}

describe('HTTP Investments & Dividends', () => {
  it('creates investments and declares dividend pro-rata multi investor', async () => {
    const { campaign } = await createCampaignWithToken();
    const app = await buildTestApp();

    const { user: u1, token: t1 } = await createUserWithRole(
      '0x' + '1'.repeat(40),
      'INVESTOR',
      campaign.tenantId,
    );
    const { user: u2, token: t2 } = await createUserWithRole(
      '0x' + '2'.repeat(40),
      'INVESTOR',
      campaign.tenantId,
    );
    // Admin / issuer para declarar dividendos
    const { token: adminToken } = await createUserWithRole(
      '0x' + '3'.repeat(40),
      'ISSUER',
      campaign.tenantId,
    );

    // Crear dos inversiones
    const invest = async (
      tok: string,
      amount: string,
      tokens: string,
      txHash: string,
    ) => {
      const res = await app.inject({
        method: 'POST',
        url: '/investments',
        headers: { Authorization: `Bearer ${tok}` },
        payload: {
          campaignId: campaign.id,
          amountUsd: amount,
          tokenAmount: tokens,
          txHash,
        },
      });
      expect(res.statusCode).toBe(200);
    };

    await invest(t1, '1000', '1000', '0x' + 'a'.repeat(64));
    await invest(t2, '3000', '3000', '0x' + 'b'.repeat(64));

    // Declarar dividendo total 400 (esperado reparto 25% / 75%)
    const declare = await app.inject({
      method: 'POST',
      url: '/dividends/declare',
      headers: { Authorization: `Bearer ${adminToken}` },
      payload: {
        campaignId: campaign.id,
        periodLabel: 'Q2-2025',
        totalAmount: '400',
      },
    });
    expect(declare.statusCode).toBe(200);
    const dividendId = (declare.json() as any).dividend.id;

    const claims = await prisma.dividendClaim.findMany({
      where: { dividendId },
    });
    expect(claims).toHaveLength(2);
    const sum = claims.reduce(
      (acc: number, c: (typeof claims)[number]) => acc + Number(c.amount),
      0,
    );
    expect(sum.toFixed(0)).toBe('400');
    // Ordenar por monto y validar proporciones aproximadas
    const sorted = claims.sort(
      (a: (typeof claims)[number], b: (typeof claims)[number]) =>
        a.amount < b.amount ? -1 : 1,
    );
    const a1 = Number(sorted[0].amount); // u1 25%
    const a2 = Number(sorted[1].amount); // u2 75%
    expect((a1 * 3).toFixed(0)).toBe(a2.toFixed(0));
  });
});
