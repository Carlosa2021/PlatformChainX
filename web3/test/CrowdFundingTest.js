const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding Contract", function () {
  let CrowdFunding, crowdFunding, MockUSDC, usdc, owner, addr1, addr2;
  let MockCampaignRegistry, campaignRegistry;
  let MockPriceFeed, priceFeed;

  // Esta función se ejecuta antes de cada prueba
  beforeEach(async function () {
    // Desplegar el contrato MockUSDC
    MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();

    // Desplegar el contrato MockCampaignRegistry (simulación)
    MockCampaignRegistry = await ethers.getContractFactory(
      "MockCampaignRegistry"
    );
    campaignRegistry = await MockCampaignRegistry.deploy();

    // Desplegar el contrato MockPriceFeed (simulación)
    MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    priceFeed = await MockPriceFeed.deploy();

    // Desplegar el contrato CrowdFunding con los 3 parámetros esperados
    CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy(
      campaignRegistry.address,
      usdc.address,
      priceFeed.address
    );

    // Obtener las cuentas de prueba
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  it("Debería permitir a un usuario comprar tokens con USDC", async function () {
    // Transferir USDC a addr1 para que tenga saldo suficiente primero
    await usdc.transfer(addr1.address, ethers.utils.parseUnits("100", 6));

    // Verificar que addr1 ha recibido los USDC
    const usdcBalanceBefore = await usdc.balanceOf(addr1.address);
    expect(usdcBalanceBefore).to.equal(ethers.utils.parseUnits("100", 6));

    // Aprobar la cantidad de USDC que será gastada por addr1
    await usdc
      .connect(addr1)
      .approve(crowdFunding.address, ethers.utils.parseUnits("100", 6));

    // Crear una campaña en CrowdFunding
    await crowdFunding.createCampaign(
      "Nueva Campaña",
      "Descripción de la campaña",
      ethers.utils.parseUnits("100", 6), // Objetivo de 100 tokens
      Math.floor(Date.now() / 1000) + 86400, // Deadline de 24 horas
      "https://imageurl.com", // URL de la imagen
      usdc.address, // Dirección del contrato de tokens (USDC)
      [],
      [],
      "https://video.com",
      "Información del token",
      Math.floor(Date.now() / 1000), // Fecha de inicio
      1 // Valor del token en EUR
    );

    // Comprar tokens con addr1 usando 50 USDC
    await crowdFunding
      .connect(addr1)
      .buyTokens(0, ethers.utils.parseUnits("50", 6));

    // Verificar que el balance de addr1 ha disminuido en USDC (ha gastado tokens)
    const usdcBalance = await usdc.balanceOf(addr1.address);
    expect(usdcBalance).to.be.below(ethers.utils.parseUnits("100", 6));
  });
});
