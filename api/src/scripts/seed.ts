import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('> Iniciando seed');

  // Tenant por defecto
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Default Tenant',
        code: 'default',
        domain: null,
        primaryColor: '#FF751A',
        secondaryColor: '#1c1c24',
        logoUrl: null,
      },
    });
    console.log('  + Tenant creado:', tenant.id);
  } else {
    console.log('  = Tenant existente:', tenant.id);
  }

  // Usuario demo (wallet fija de ejemplo)
  const demoWallet = '0x1111111111111111111111111111111111111111';
  let user = await prisma.user.findUnique({
    where: { walletAddress: demoWallet },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: demoWallet,
        displayName: 'Demo Investor',
        kycStatus: 'APPROVED',
      },
    });
    console.log('  + User demo creado:', user.id);
  } else {
    console.log('  = User demo existente:', user.id);
  }

  // Asignar rol INVESTOR al tenant si no existe
  const investorRole = await prisma.userTenant.findFirst({
    where: { userId: user.id, tenantId: tenant.id, role: 'INVESTOR' },
  });
  if (!investorRole) {
    await prisma.userTenant.create({
      data: { userId: user.id, tenantId: tenant.id, role: 'INVESTOR' },
    });
    console.log('  + Rol INVESTOR asignado');
  }

  // Campaña demo
  const slug = 'demo-campaign';
  let campaign = await prisma.campaign.findUnique({ where: { slug } });
  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        tenantId: tenant.id,
        title: 'Demo Real Estate Asset',
        slug,
        descriptionMd: '# Demo Asset\nEdificio de ejemplo para la demo.',
        status: 'FUNDING',
        hardCap: '100000',
        tokenPriceUsd: '1',
        softCap: '50000',
        totalRaised: '0',
        totalInvestors: 0,
      },
    });
    console.log('  + Campaña demo creada:', campaign.id);
  } else {
    console.log('  = Campaña demo existente:', campaign.id);
  }

  // Token stats si no existen
  let tokenStats = await prisma.campaignToken.findUnique({
    where: { campaignId: campaign.id },
  });
  if (!tokenStats) {
    tokenStats = await prisma.campaignToken.create({
      data: {
        campaignId: campaign.id,
        tokenAddress: '0x2222222222222222222222222222222222222222',
        chainId: 11155111, // Sepolia
        totalSupply: '100000',
        soldSupply: '0',
        holdersCount: 0,
      },
    });
    console.log('  + Token stats creados');
  }

  // Inversión de ejemplo
  const existingInv = await prisma.investment.findFirst({
    where: { campaignId: campaign.id, userId: user.id },
  });
  if (!existingInv) {
    await prisma.investment.create({
      data: {
        campaignId: campaign.id,
        userId: user.id,
        walletAddress: demoWallet,
        txHash:
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        amountUsd: '1000',
        tokenAmount: '1000',
      },
    });
    console.log('  + Inversión demo creada');
  }

  // Dividendo de ejemplo (si no hay)
  const existingDividend = await prisma.dividend.findFirst({
    where: { campaignId: campaign.id },
  });
  if (!existingDividend) {
    const div = await prisma.dividend.create({
      data: {
        campaignId: campaign.id,
        periodLabel: 'Q1-2025',
        totalAmount: '100',
        txHash: null,
      },
    });
    // claim proporcional (solo un inversor)
    await prisma.dividendClaim.create({
      data: {
        dividendId: div.id,
        userId: user.id,
        amount: '100',
        claimed: false,
      },
    });
    console.log('  + Dividendo demo creado con claim');
  }

  console.log('> Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
