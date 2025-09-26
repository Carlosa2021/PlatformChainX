// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./TokenChainX.sol";
import "./CampaignRegistry.sol";

contract PlataformaChainX is Pausable, Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    CampaignRegistry public immutable campaignRegistry;
    uint256 public numberOfCampaigns;
    AggregatorV3Interface internal priceFeed;

    enum CampaignState {
        Active,
        Completed,
        Expired
    }

    struct Campaign {
        TokenChainX tokenContract;
        address owner;
        string title;
        string description;
        string location;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string[] images;
        address[] donators;
        uint256[] donations;
        CampaignState state;
        string[] documents;
        string[] documentTitles;
        string video;
        string tokenInfo;
        uint256 startDate;
        uint256 tokenValueInEUR;
        uint256 monthlyYieldPercent;
        // Dividend snapshot & amount declarado (en USDC) para última ronda
        uint256 lastSnapshotId;
        uint256 lastDividendDeclared; // total en USDC declarado para reparto
        uint256 lastDividendTimestamp;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => uint256) public lastDividendPaid;
    mapping(uint256 => mapping(address => bool)) public hasInvested;

    event CampaignCreated(uint256 campaignId, address tokenContract);
    event TokensPurchased(
        uint256 campaignId,
        address buyer,
        uint256 usdcSpent,
        uint256 tokensReceived
    );
    event CampaignGoalReached(uint256 campaignId);
    event CampaignClosed(uint256 campaignId);
    event USDCWithdrawn(uint256 amount, address to);
    event CampaignExpired(uint256 campaignId);
    event CampaignStateChanged(uint256 campaignId, CampaignState newState);
    event DividendDeclared(
        uint256 indexed campaignId,
        uint256 snapshotId,
        uint256 totalAmount
    );
    event DividendClaimed(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount
    );
    event DocumentHashRegistered(
        uint256 indexed campaignId,
        bytes32 docHash,
        string title
    );

    constructor(
        address _campaignRegistryAddress,
        address _usdcAddress,
        address _priceFeed
    ) {
        usdc = IERC20(_usdcAddress);
        campaignRegistry = CampaignRegistry(_campaignRegistryAddress);
        priceFeed = AggregatorV3Interface(_priceFeed);
        transferOwnership(msg.sender);
    }

    function renounceOwnership() public pure override {
        revert("renounceOwnership is disabled for compliance");
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _target,
        uint256 _deadline,
        string[] memory _images,
        address _tokenContract,
        string[] memory _documents,
        string[] memory _documentTitles,
        string memory _video,
        string memory _tokenInfo,
        uint256 _startDate,
        uint256 _tokenValueInEUR,
        uint256 _monthlyYieldPercent
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(_images.length > 0, "Debe haber al menos una imagen");
        require(
            _deadline > block.timestamp,
            "La fecha limite debe estar en el futuro"
        );
        require(_target > 0, "El objetivo debe ser mayor que cero");
        require(bytes(_title).length > 0, "El titulo no puede estar vacio");
        require(
            bytes(_description).length > 0,
            "La descripcion no puede estar vacia"
        );
        require(
            bytes(_location).length > 0,
            "La ubicacion no puede estar vacia"
        );
        require(_documents.length > 0, "Debe haber al menos un documento");
        require(
            _documentTitles.length == _documents.length,
            "Cada documento debe tener un titulo correspondiente"
        );
        require(
            _monthlyYieldPercent > 0 && _monthlyYieldPercent <= 100,
            "Yield mensual fuera de rango"
        );

        uint256 campaignId = numberOfCampaigns;
        Campaign storage campaign = campaigns[campaignId];
        campaign.tokenContract = TokenChainX(_tokenContract);
        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.location = _location;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.images = _images;
        campaign.state = CampaignState.Active;
        campaign.documents = _documents;
        campaign.documentTitles = _documentTitles;
        campaign.video = _video;
        campaign.tokenInfo = _tokenInfo;
        campaign.startDate = _startDate;
        campaign.tokenValueInEUR = _tokenValueInEUR;
        campaign.monthlyYieldPercent = _monthlyYieldPercent;
        lastDividendPaid[campaignId] = 0; // legacy, mantenido para compatibilidad
        campaign.lastSnapshotId = 0;
        campaign.lastDividendDeclared = 0;
        campaign.lastDividendTimestamp = 0;

        campaignRegistry.registerCampaign(address(this), _tokenContract);
        emit CampaignCreated(campaignId, _tokenContract);
        numberOfCampaigns++;
        return campaignId;
    }

    function buyTokens(
        uint256 _id,
        uint256 _usdcAmount
    ) external whenNotPaused nonReentrant {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.state == CampaignState.Active,
            "Campaign is not active"
        );
        require(block.timestamp <= campaign.deadline, "Campaign expirada");

        TokenChainX token = campaign.tokenContract;
        require(
            msg.sender == campaign.owner ||
                msg.sender == owner() ||
                token.isAddressWhitelisted(msg.sender),
            "Solo whitelist o owner pueden invertir"
        );

        uint256 availableTokens = token.balanceOf(address(this));
        require(availableTokens > 0, "Contrato no tiene tokens disponibles");

        uint256 tokenValueInUSDC = _convertEurToUsdc(campaign.tokenValueInEUR);
        uint256 tokensToBuy = _usdcAmount / tokenValueInUSDC;
        require(tokensToBuy > 0, "Monto de USDC insuficiente");
        require(
            availableTokens >= tokensToBuy,
            "No hay suficientes tokens disponibles"
        );

        usdc.transferFrom(msg.sender, address(this), _usdcAmount);
        campaign.amountCollected += tokensToBuy;

        if (!hasInvested[_id][msg.sender]) {
            campaign.donators.push(msg.sender);
            campaign.donations.push(tokensToBuy);
            hasInvested[_id][msg.sender] = true;
        } else {
            for (uint256 i = 0; i < campaign.donators.length; i++) {
                if (campaign.donators[i] == msg.sender) {
                    campaign.donations[i] += tokensToBuy;
                    break;
                }
            }
        }

        token.transfer(msg.sender, tokensToBuy);
        emit TokensPurchased(_id, msg.sender, _usdcAmount, tokensToBuy);

        if (campaign.amountCollected >= campaign.target) {
            campaign.state = CampaignState.Completed;
            emit CampaignGoalReached(_id);
            emit CampaignStateChanged(_id, CampaignState.Completed);
        }
    }

    // --- Dividendos (declaración + claim) ---
    mapping(uint256 => mapping(address => bool)) public dividendClaimed; // campaignId => investor => claimed

    /**
     * @notice Declara un dividendo y toma un snapshot de balances del token asociado.
     * @dev Usa ERC20Snapshot del TokenChainX para congelar balances y supply.
     *      Enfocado a distribución proporcional a la posición al momento de la declaración.
     * @param campaignId ID de la campaña.
     * @param totalAmountUSDC Monto total a distribuir en USDC.
     */
    function declareDividend(
        uint256 campaignId,
        uint256 totalAmountUSDC
    ) external onlyOwner whenNotPaused nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.amountCollected > 0, "Campaign sin fondos");
        require(
            block.timestamp >= campaign.lastDividendTimestamp + 25 days,
            "Frecuencia mensual"
        );
        require(totalAmountUSDC > 0, "Monto=0");
        require(
            usdc.balanceOf(address(this)) >= totalAmountUSDC,
            "USDC insuficiente"
        );

        // Snapshot en el token para congelar balances
        uint256 snapshotId = campaign.tokenContract.createSnapshot();
        campaign.lastSnapshotId = snapshotId;
        campaign.lastDividendDeclared = totalAmountUSDC;
        campaign.lastDividendTimestamp = block.timestamp;

        emit DividendDeclared(campaignId, snapshotId, totalAmountUSDC);
    }

    /**
     * @notice Reclama la parte proporcional del último dividendo declarado.
     * @dev Usa balanceOfAt / totalSupplyAt para cálculo pro-rata.
     */
    function claimDividend(
        uint256 campaignId
    ) external nonReentrant whenNotPaused {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.lastSnapshotId != 0, "No hay dividendos");
        require(!dividendClaimed[campaignId][msg.sender], "Ya reclamado");
        require(
            campaign.tokenContract.isAddressWhitelisted(msg.sender),
            "No whitelisted"
        );
        uint256 snapshotId = campaign.lastSnapshotId; // snapshot capturado al declarar
        // Usar balances y supply congelados en el snapshot para distribución justa
        uint256 balanceAtSnapshot = campaign.tokenContract.balanceOfAt(
            msg.sender,
            snapshotId
        );
        uint256 totalSupplyAt = campaign.tokenContract.totalSupplyAt(
            snapshotId
        );
        require(totalSupplyAt > 0, "Supply 0");

        // Pro-rata: amount = declared * balance(snapshot) / supply(snapshot)
        uint256 amount = (campaign.lastDividendDeclared * balanceAtSnapshot) /
            totalSupplyAt;
        require(amount > 0, "Nada que reclamar");

        dividendClaimed[campaignId][msg.sender] = true;
        usdc.transfer(msg.sender, amount);
        emit DividendClaimed(campaignId, msg.sender, amount);
    }

    // --- Documento Hash (registro adicional de confianza) ---
    mapping(uint256 => mapping(bytes32 => bool)) public documentHashExists;

    function registerDocumentHash(
        uint256 campaignId,
        bytes32 docHash,
        string calldata title
    ) external onlyOwner whenNotPaused {
        require(!documentHashExists[campaignId][docHash], "Hash ya registrado");
        documentHashExists[campaignId][docHash] = true;
        emit DocumentHashRegistered(campaignId, docHash, title);
    }

    function _convertEurToUsdc(
        uint256 eurAmount
    ) internal view returns (uint256) {
        (, int price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        uint256 priceInUSDC = uint256(price) / 10 ** 2;
        return eurAmount * priceInUSDC;
    }

    function withdrawUSDC() external onlyOwner whenNotPaused nonReentrant {
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "No hay USDC para retirar");
        usdc.transfer(owner(), balance);
        emit USDCWithdrawn(balance, owner());
    }

    function getTotalUSDCCollected() external view returns (uint256) {
        uint256 totalUSDC = 0;
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            totalUSDC += campaigns[i].amountCollected;
        }
        return totalUSDC;
    }

    function getDonatorsCampaigns(
        uint256 _id
    ) external view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    function getCampaignLocation(
        uint256 _id
    ) external view returns (string memory) {
        require(_id < numberOfCampaigns, "Campaign no encontrada");
        return campaigns[_id].location;
    }

    function checkCampaignExpiration(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        if (
            block.timestamp > campaign.deadline &&
            campaign.state == CampaignState.Active
        ) {
            campaign.state = CampaignState.Expired;
            emit CampaignExpired(_id);
            emit CampaignStateChanged(_id, CampaignState.Expired);
        }
    }

    function balanceOf(address tokenAddress) external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    function getAvailableTokens(uint256 _id) public view returns (uint256) {
        Campaign storage campaign = campaigns[_id];
        return campaign.tokenContract.balanceOf(address(this));
    }
}
