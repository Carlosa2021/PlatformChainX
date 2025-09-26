// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CampaignRegistry
 * @dev Registro institucional de campañas para PlataformaChainX/tokenización.
 * - Relación 1:1 entre plataforma y token.
 * - Prohibe renounceOwnership.
 * - Provee consulta pública.
 */
contract CampaignRegistry is Pausable, Ownable {
    struct Campaign {
        address platformContract;
        address tokenContract;
    }

    Campaign[] private campaigns;
    mapping(address => bool) private isTokenRegistered;

    event CampaignRegistered(
        address indexed platformContract,
        address indexed tokenContract
    );
    event CampaignRemoved(
        address indexed platformContract,
        address indexed tokenContract
    );

    constructor() {
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

    function registerCampaign(
        address platformContract,
        address tokenContract
    ) external whenNotPaused {
        require(
            platformContract != address(0),
            "Platform contract cannot be zero address"
        );
        require(
            tokenContract != address(0),
            "Token contract cannot be zero address"
        );
        require(
            !isTokenRegistered[tokenContract],
            "This token contract is already registered"
        );

        campaigns.push(Campaign(platformContract, tokenContract));
        isTokenRegistered[tokenContract] = true;

        emit CampaignRegistered(platformContract, tokenContract);
    }

    function removeCampaign(address tokenContract) external onlyOwner {
        require(isTokenRegistered[tokenContract], "Campaign not found");

        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].tokenContract == tokenContract) {
                emit CampaignRemoved(
                    campaigns[i].platformContract,
                    campaigns[i].tokenContract
                );
                campaigns[i] = campaigns[campaigns.length - 1];
                campaigns.pop();
                isTokenRegistered[tokenContract] = false;
                break;
            }
        }
    }

    function isCampaignRegistered(
        address tokenContract
    ) external view returns (bool) {
        return isTokenRegistered[tokenContract];
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function getCampaign(
        uint256 index
    ) external view returns (Campaign memory) {
        require(index < campaigns.length, "Index out of bounds");
        return campaigns[index];
    }

    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }

    /// 🔍 Nueva función: búsqueda por token (más eficiente para frontend)
    function findCampaignByToken(
        address tokenContract
    ) external view returns (address platform, bool exists) {
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].tokenContract == tokenContract) {
                return (campaigns[i].platformContract, true);
            }
        }
        return (address(0), false);
    }
}
