const { expect } = require('chai');
const { ethers } = require('hardhat');

/**
 * Escenario principal:
 * 1. Deploy MockUSDC, TokenChainX (mint inicial al owner) y CampaignRegistry + PlataformaChainX.
 * 2. Owner transfiere parte de los tokens de la campaña al contrato plataforma (simulando inventario para vender) y whitelistea inversores.
 * 3. Compra inicial de tokens por Alice y Bob (cada uno recibe tokens desde el contrato plataforma).
 * 4. Se crea snapshot declarando dividendo.
 * 5. Después del snapshot Alice transfiere tokens a Bob.
 * 6. Ambos reclaman dividendos: las cantidades deben reflejar el balance al snapshot, no después de la transferencia.
 */

describe('Dividend snapshot behavior', function () {
  let owner, alice, bob;
  let usdc, token, registry, platform;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    // Deploy Mock USDC
    const USDC = await ethers.getContractFactory('MockUSDC');
    usdc = await USDC.deploy();

    // Mint USDC to investors
    await usdc.mint(alice.address, 1_000);
    await usdc.mint(bob.address, 1_000);

    // Deploy TokenChainX (initial supply 0, maxSupply 1000000)
    const Token = await ethers.getContractFactory('TokenChainX');
    token = await Token.deploy(
      'RealEstate',
      'REA',
      10_000, // initial supply directly minted to owner
      1_000_000,
      usdc.address,
    );

    // Whitelist plataforma owner & investors directly in token
    await token.addToWhiteList(owner.address, 'Own', 'Er', 'ID0', 'ES');
    await token.addToWhiteList(alice.address, 'Alice', 'Investor', 'ID1', 'ES');
    await token.addToWhiteList(bob.address, 'Bob', 'Investor', 'ID2', 'ES');

    // (Ya se mintearon 10_000 al owner en el constructor)

    // Deploy Registry
    const Registry = await ethers.getContractFactory('CampaignRegistry');
    registry = await Registry.deploy();

    // Deploy PlataformaChainX
    const Platform = await ethers.getContractFactory('PlataformaChainX');

    // Mock price feed
    const MockPrice = await ethers.getContractFactory('MockPriceFeed');
    const priceFeed = await MockPrice.deploy(100, 2); // 1.00 EUR/USD => 1 EUR = 1 USDC

    platform = await Platform.deploy(
      registry.address,
      usdc.address,
      priceFeed.address,
    );

    // Autorizar a la plataforma para crear snapshots en el token
    await token.setPlatform(platform.address);

    // Transfer ownership del token al owner ya es por constructor, solo necesitamos mover inventario al contrato plataforma
    // Primero whitelist del contrato plataforma para poder recibir tokens
    await token.addToWhiteList(platform.address, 'Plat', 'Form', 'IDP', 'ES');

    // Transferir inventario al contrato plataforma (para venta)
    await token.transfer(platform.address, 5_000);

    // Crear campaña
    const createTx = await platform.createCampaign(
      'Edificio A',
      'Descripcion',
      'Valencia',
      4_000, // target en tokens
      Math.floor(Date.now() / 1000) + 30 * 24 * 3600, // deadline 30 días
      ['img'],
      token.address,
      ['doc'],
      ['titulo'],
      'video',
      'tokenInfo',
      Math.floor(Date.now() / 1000),
      1, // tokenValueInEUR
      5, // monthlyYieldPercent
    );
    const receipt = await createTx.wait();
    // campaignId = 0

    // Aprobar USDC y comprar tokens (Alice 1000 USDC, Bob 1000 USDC) -> tokenValueInEUR =1 => convertEurToUsdc ~100 (mock) => tokensToBuy = usdc/tokenValueInUSDC
    // Simplificamos: configuremos price feed 1 EUR = 1 USDC para evitar escalas complicadas: redeploy price feed con price=100 (2 dec => 1). Para eso podríamos ajustar arriba.
    // Para mantener coherencia: priceFeed = 100 (con 2 dec) => priceInUSDC = 1. tokensToBuy = USDCAmount / 1.

    await usdc.connect(alice).approve(platform.address, 1_000);
    await platform.connect(alice).buyTokens(0, 1_000); // Alice ahora 1000 tokens

    await usdc.connect(bob).approve(platform.address, 1_000);
    await platform.connect(bob).buyTokens(0, 1_000); // Bob ahora 1000 tokens

    // Declarar dividendo 2000 USDC
    await usdc.mint(owner.address, 2_000);
    await usdc.connect(owner).transfer(platform.address, 2_000);
    const declareTx = await platform.declareDividend(0, 2_000); // snapshot interno en token
    await declareTx.wait();

    // Transferencia post-snapshot: Alice -> Bob 500 tokens (no debe afectar dividendos)
    await token.connect(alice).transfer(bob.address, 500);
  });

  it('should compute claims based on snapshot, ignoring post-snapshot transfers', async () => {
    // Balances USDC antes de claims
    const aliceBefore = await usdc.balanceOf(alice.address); // 0 tras gastar
    const bobBefore = await usdc.balanceOf(bob.address); // 0 tras gastar
    expect(aliceBefore).to.equal(0);
    expect(bobBefore).to.equal(0);

    // Claim de Alice
    await expect(platform.connect(alice).claimDividend(0))
      .to.emit(platform, 'DividendClaimed')
      .withArgs(0, alice.address, 200); // 2000 total * (1000/10000 supply)

    // Claim de Bob
    await expect(platform.connect(bob).claimDividend(0))
      .to.emit(platform, 'DividendClaimed')
      .withArgs(0, bob.address, 200);

    // Verificar balances tras claim
    expect(await usdc.balanceOf(alice.address)).to.equal(200);
    expect(await usdc.balanceOf(bob.address)).to.equal(200);

    // Transferencia posterior al snapshot (hecha en beforeEach) no afectó reparto
    // Bob terminó con más tokens (1500) pero su dividendo fue calculado sobre 1000 (snapshot antes de la transferencia).
    expect(await token.balanceOf(bob.address)).to.equal(1500);
    expect(await token.balanceOf(alice.address)).to.equal(500);
  });

  it('should revert on double claim', async () => {
    await platform.connect(alice).claimDividend(0);
    await expect(platform.connect(alice).claimDividend(0)).to.be.revertedWith(
      'Ya reclamado',
    );
  });
});
