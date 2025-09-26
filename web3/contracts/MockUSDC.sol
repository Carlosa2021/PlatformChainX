// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @dev Sencillo token ERC20 con decimales = 0 para simplificar aritmética en pruebas
 *      (evita desajustes con el cálculo integer-only de buyTokens / dividendos en el contrato plataforma).
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 0; // simplificado para que 1 unidad = 1 "USDC" en pruebas
    }
}
