/*
  SPDX-License-Identifier: Hybrid-Apache-2.0
  Copyright 2024 Carlos Bernal

  Licensed under the Hybrid Apache License, Version 2.0 (the "License");
  You may not use this file except in compliance with the License.
  See https://chainx.ch for details.

  File: TokenBuyModal.tsx
  Description: Componente para compra de tokens ERC20 en frontend.
*/

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ethers, BigNumber } from 'ethers';

import {
  getLatestPrice,
  usdcAbi,
  usdcAddress,
  plataformaChainxAddress,
  PlataformaChainXABI,
} from '../utils';

import { useStateContext } from '../context/index.jsx';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1c1c24',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '25px',
    width: '92%',
    maxWidth: '420px',
    maxHeight: '95vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.7)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
  },
};

Modal.setAppElement('#root');

const TokenPurchaseModal = ({
  isOpen,
  onRequestClose,
  campaignId,
  tokenInfo,
}) => {
  const [usdcAmount, setUsdcAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [price, setPrice] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWhitepaperChecked, setIsWhitepaperChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [tokenCostInUSDC, setTokenCostInUSDC] = useState(null);

  const { provider, address, handleTokenPurchase, signer } = useStateContext();

  useEffect(() => {
    if (provider && isOpen && address && signer) {
      if (typeof campaignId !== 'number' || isNaN(campaignId)) return;
      fetchUsdcBalance();
      fetchAvailableTokens(campaignId);
      if (tokenInfo.priceFeed) fetchPrice(tokenInfo.priceFeed);
    }
  }, [provider, isOpen, address, signer, campaignId, tokenInfo.priceFeed]);

  const fetchPrice = async (priceFeedAddress) => {
    try {
      const fetchedPrice = await getLatestPrice(priceFeedAddress, provider);
      const priceAsNumber = parseFloat(
        ethers.utils.formatUnits(fetchedPrice, 8),
      );
      setPrice(priceAsNumber);

      const tokenValueInEUR = parseFloat(tokenInfo.tokenValueInEUR || 1);
      const costInUSDC = tokenValueInEUR * priceAsNumber;
      setTokenCostInUSDC(costInUSDC);
    } catch (error) {
      console.error('Error fetching latest price: ', error);
    }
  };

  const fetchUsdcBalance = async () => {
    try {
      const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
      const balance = await usdcContract.balanceOf(address);
      const formattedBalance = ethers.utils.formatUnits(balance, 6);
      setUsdcBalance(formattedBalance);
    } catch (error) {
      console.error('Error fetching USDC balance: ', error);
    }
  };

  const fetchAvailableTokens = async (campaignId) => {
    try {
      if (typeof campaignId !== 'number' || isNaN(campaignId)) return;
      const crowdfundingContract = new ethers.Contract(
        plataformaChainxAddress,
        PlataformaChainXABI,
        signer,
      );
      const tokenBalance = await crowdfundingContract.getAvailableTokens(
        BigNumber.from(campaignId),
      );
      setTokenBalance(tokenBalance.toString());
    } catch (error) {
      console.error('Error fetching available tokens: ', error);
      setTokenBalance('0');
    }
  };

  const calculateTokens = (amount) => {
    if (price && tokenInfo.tokenValueInEUR) {
      const tokenValueInEUR = parseFloat(tokenInfo.tokenValueInEUR);
      const tokens = Math.floor(amount / (tokenValueInEUR * price));
      const adjustedUsdcAmount = tokens * tokenValueInEUR * price;
      setTokenAmount(tokens);
      setUsdcAmount(adjustedUsdcAmount.toFixed(6));
    }
  };

  const handleUsdcChange = (e) => {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount) && amount >= 0) {
      calculateTokens(amount);
    } else {
      setTokenAmount('0');
      setUsdcAmount('0');
    }
  };

  const handlePercentageClick = (percentage) => {
    const amount = ((usdcBalance * percentage) / 100).toFixed(2);
    calculateTokens(amount);
  };

  const handleInvest = async () => {
    try {
      if (typeof campaignId !== 'number' || isNaN(campaignId)) return;
      setIsLoading(true);
      await handleTokenPurchase(BigNumber.from(campaignId), usdcAmount);
      onRequestClose();
    } catch (error) {
      console.error('Error purchasing tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const root = document.getElementById('root');
    if (isOpen) {
      root.setAttribute('inert', 'true');
      setTimeout(() => {
        const el = document.querySelector(
          '.ReactModal__Content button, .ReactModal__Content input',
        );
        if (el) el.focus();
      }, 100);
    } else {
      root.removeAttribute('inert');
    }
    return () => root.removeAttribute('inert');
  }, [isOpen]);

  const hasSufficientBalance = tokenCostInUSDC
    ? parseFloat(usdcBalance) >= tokenCostInUSDC
    : false;
  const isButtonDisabled =
    !isWhitepaperChecked ||
    !isAgreementChecked ||
    !hasSufficientBalance ||
    isLoading ||
    parseFloat(usdcAmount) <= 0;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Purchase Tokens"
    >
      <button
        onClick={onRequestClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ✖
      </button>
      <h2
        style={{
          marginBottom: '15px',
          fontSize: '20px',
          fontWeight: '600',
          textAlign: 'center',
          color: '#FFA500',
          letterSpacing: '0.5px',
        }}
      >
        Token: <span style={{ color: '#00FFFF' }}>{tokenInfo.name}</span>
      </h2>
      <p
        style={{
          fontSize: '18px',
          fontWeight: '500',
          textAlign: 'center',
          marginBottom: '15px',
          color: '#00FF00',
        }}
      >
        Precio:
        <span style={{ color: 'white' }}>
          {' '}
          {Number(tokenInfo.tokenValueInEUR)} EUR ≈{' '}
          {price
            ? `${(Number(tokenInfo.tokenValueInEUR) * Number(price)).toFixed(
                4,
              )} USDC`
            : '...'}{' '}
        </span>
      </p>
      <img
        src={tokenInfo.image}
        alt={tokenInfo.name}
        style={{
          width: '100%',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0px 0px 15px rgba(255, 165, 0, 0.5)',
        }}
      />
      <p style={{ marginBottom: '15px' }}>Saldo en USDC: {usdcBalance}</p>
      <input
        type="number"
        placeholder="Cantidad en USDC"
        value={usdcAmount}
        onChange={handleUsdcChange}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '10px',
          backgroundColor: '#2c2c36',
          color: 'white',
          border: '1px solid #555',
        }}
      />
      <input
        type="text"
        placeholder={`Tokens disponibles: ${tokenBalance}`}
        value={tokenAmount}
        readOnly
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '20px',
          backgroundColor: '#2c2c36',
          color: 'white',
          border: '1px solid #555',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        {[25, 50, 75, 100].map((p) => (
          <button
            key={p}
            onClick={() => handlePercentageClick(p)}
            style={{
              flex: '1',
              margin: '0 5px',
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: '#ff751a',
              color: 'white',
              fontWeight: '600',
              border: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {p}%
          </button>
        ))}
      </div>
      <div style={{ marginBottom: '10px', fontSize: '14px' }}>
        <input
          type="checkbox"
          id="whitepaper"
          checked={isWhitepaperChecked}
          onChange={(e) => setIsWhitepaperChecked(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        <label htmlFor="whitepaper">
          Confirmo que he leído el{' '}
          <a
            href={tokenInfo.whitepaperLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            whitepaper
          </a>
        </label>
      </div>
      <div style={{ marginBottom: '20px', fontSize: '14px' }}>
        <input
          type="checkbox"
          id="agreement"
          checked={isAgreementChecked}
          onChange={(e) => setIsAgreementChecked(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        <label htmlFor="agreement">
          Confirmo que he leído y acepto el{' '}
          <a
            href={tokenInfo.agreementLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            acuerdo de suscripción
          </a>
        </label>
      </div>
      <button
        onClick={handleInvest}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: isButtonDisabled ? '#555' : '#ff751a',
          color: 'white',
          fontWeight: '600',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          border: 'none',
        }}
        disabled={isButtonDisabled}
      >
        {isLoading ? 'Comprando...' : 'Comprar'}
      </button>
    </Modal>
  );
};

export default TokenPurchaseModal;
