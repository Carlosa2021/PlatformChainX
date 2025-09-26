// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenChainX
 * @dev Security Token EUR-based, indivisible (decimals = 0), compliance MiCA.
 */
/**
 * @dev Extiende ERC20 con:
 *  - Snapshot para cálculos pro-rata de dividendos.
 *  - Lista blanca con datos mínimos (no almacenar PII innecesaria idealmente: mover fuera on-chain si se desea).
 *  - Restricciones de transferencia estilo ERC-1404 simplificadas.
 */
contract TokenChainX is ERC20, ERC20Snapshot, Pausable, Ownable {
    address public immutable usdc;
    // Plataforma autorizada para crear snapshots (además del owner)
    address public platform;

    struct WhitelistEntry {
        bool isWhitelisted;
        string firstName;
        string lastName;
        string id;
        string residence;
    }

    mapping(address => WhitelistEntry) private _whiteList;
    mapping(address => uint256) private whitelistIndex; // índice para swap & pop
    address[] public whiteListedAddresses;

    // --- Transfer restrictions ---
    // Códigos: 0 = OK, 1 = sender no whitelisted, 2 = recipient no whitelisted, 3 = pausado
    event TransferRestricted(
        uint8 code,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    uint256 public maxSupply;
    uint256 public totalMinted;

    event AddedToWhiteList(address indexed account);
    event RemovedFromWhiteList(address indexed account);
    event UpdatedWhiteList(
        address indexed account,
        string firstName,
        string lastName,
        string id,
        string residence
    );
    event USDCWithdrawn(address indexed owner, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event TokensBurned(address indexed from, uint256 amount);
    event SnapshotCreated(uint256 indexed snapshotId);
    event BatchWhiteListAdded(address[] accounts);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint256 _maxSupply,
        address _usdc
    ) ERC20(_name, _symbol) {
        require(_usdc != address(0), "USDC address cannot be zero");
        _mint(msg.sender, _initialSupply);
        usdc = _usdc;
        maxSupply = _maxSupply;
        totalMinted = _initialSupply;
        transferOwnership(msg.sender);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    // --- Snapshot para dividendos ---
    function setPlatform(address _platform) external onlyOwner {
        require(_platform != address(0), "Platform zero");
        platform = _platform;
    }

    function createSnapshot() external returns (uint256) {
        require(msg.sender == owner() || msg.sender == platform, "Not auth");
        uint256 id = _snapshot();
        emit SnapshotCreated(id);
        return id;
    }

    function renounceOwnership() public pure override {
        revert("renounceOwnership is disabled for MiCA compliance");
    }

    function addToWhiteList(
        address account,
        string memory firstName,
        string memory lastName,
        string memory id,
        string memory residence
    ) external onlyOwner {
        require(account != address(0), "Cannot whitelist zero address");
        require(!_whiteList[account].isWhitelisted, "Already whitelisted");

        _whiteList[account] = WhitelistEntry(
            true,
            firstName,
            lastName,
            id,
            residence
        );
        whitelistIndex[account] = whiteListedAddresses.length;
        whiteListedAddresses.push(account);

        emit AddedToWhiteList(account);
    }

    function batchAddToWhitelist(
        address[] calldata accounts,
        string[] calldata firstNames,
        string[] calldata lastNames,
        string[] calldata ids,
        string[] calldata residences
    ) external onlyOwner {
        require(
            accounts.length == firstNames.length &&
                accounts.length == lastNames.length &&
                accounts.length == ids.length &&
                accounts.length == residences.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < accounts.length; i++) {
            if (
                accounts[i] != address(0) &&
                !_whiteList[accounts[i]].isWhitelisted
            ) {
                _whiteList[accounts[i]] = WhitelistEntry(
                    true,
                    firstNames[i],
                    lastNames[i],
                    ids[i],
                    residences[i]
                );
                whitelistIndex[accounts[i]] = whiteListedAddresses.length;
                whiteListedAddresses.push(accounts[i]);
                emit AddedToWhiteList(accounts[i]);
            }
        }

        emit BatchWhiteListAdded(accounts);
    }

    function removeFromWhiteList(address account) external onlyOwner {
        require(account != address(0), "Zero address");
        require(_whiteList[account].isWhitelisted, "Not whitelisted");

        _whiteList[account].isWhitelisted = false;

        uint256 index = whitelistIndex[account];
        uint256 lastIndex = whiteListedAddresses.length - 1;
        address lastAddress = whiteListedAddresses[lastIndex];

        whiteListedAddresses[index] = lastAddress;
        whitelistIndex[lastAddress] = index;

        whiteListedAddresses.pop();
        delete whitelistIndex[account];

        emit RemovedFromWhiteList(account);
    }

    function updateWhiteList(
        address account,
        string memory firstName,
        string memory lastName,
        string memory id,
        string memory residence
    ) external onlyOwner {
        require(account != address(0), "Zero address");
        require(_whiteList[account].isWhitelisted, "Not whitelisted");

        _whiteList[account].firstName = firstName;
        _whiteList[account].lastName = lastName;
        _whiteList[account].id = id;
        _whiteList[account].residence = residence;

        emit UpdatedWhiteList(account, firstName, lastName, id, residence);
    }

    function isAddressWhitelisted(
        address account
    ) external view returns (bool) {
        return _whiteList[account].isWhitelisted;
    }

    function getWhiteListedAddresses()
        external
        view
        returns (address[] memory)
    {
        return whiteListedAddresses;
    }

    function getWhitelistCount() external view returns (uint256) {
        return whiteListedAddresses.length;
    }

    function getWhitelistDetails(
        address account
    )
        external
        view
        returns (string memory, string memory, string memory, string memory)
    {
        require(
            msg.sender == account || msg.sender == owner(),
            "Not authorized"
        );
        require(_whiteList[account].isWhitelisted, "Not whitelisted");

        WhitelistEntry storage entry = _whiteList[account];
        return (entry.firstName, entry.lastName, entry.id, entry.residence);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Zero address");
        require(_whiteList[to].isWhitelisted, "Recipient not whitelisted");
        require(totalMinted + amount <= maxSupply, "Exceeds max supply");

        _mint(to, amount);
        totalMinted += amount;

        emit TokensMinted(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        require(from != address(0), "Zero address");

        _burn(from, amount);
        totalMinted -= amount;

        emit TokensBurned(from, amount);
    }

    function updateMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= totalMinted, "newMaxSupply < total minted");

        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    function withdrawUSDC(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount = 0");

        uint256 contractBalance = IERC20(usdc).balanceOf(address(this));
        require(contractBalance >= amount, "Not enough USDC");

        IERC20(usdc).transfer(owner(), amount);
        emit USDCWithdrawn(owner(), amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // --- ERC-1404 like helpers ---
    function detectTransferRestriction(
        address from,
        address to,
        uint256 /*amount*/
    ) public view returns (uint8) {
        if (paused()) return 3;
        if (
            from != address(0) &&
            from != owner() &&
            !_whiteList[from].isWhitelisted
        ) return 1; // salida (owner siempre permitido)
        if (to != address(0) && !_whiteList[to].isWhitelisted && to != owner())
            return 2; // entrada
        return 0;
    }

    function messageForTransferRestriction(
        uint8 code
    ) public pure returns (string memory) {
        if (code == 0) return "NO_RESTRICTION";
        if (code == 1) return "SENDER_NOT_WHITELISTED";
        if (code == 2) return "RECIPIENT_NOT_WHITELISTED";
        if (code == 3) return "PAUSED";
        return "UNKNOWN";
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) whenNotPaused {
        uint8 code = detectTransferRestriction(from, to, amount);
        if (code != 0) {
            emit TransferRestricted(code, from, to, amount);
            revert(messageForTransferRestriction(code));
        }
        super._beforeTokenTransfer(from, to, amount);
    }
}
