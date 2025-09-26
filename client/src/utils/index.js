import { ethers } from 'ethers';
import AggregatorV3InterfaceABI from '../context/aggregatorV3InterfaceABI.json';
import usdcAbi from '../context/usdcAbi.json';
import PlataformaChainXABI from '../context/PlataformaChainXABI.json';
import { usdcAddress, plataformaChainxAddress } from '../contractConstants';

export const daysLeft = (deadline) => {
  if (!deadline) return 0;
  // Normaliza deadline a Number si es BigInt o string
  let d = deadline;
  if (typeof d === 'bigint') d = Number(d);
  else if (typeof d === 'string') d = Number(d);
  if (isNaN(d)) return 0;
  // Detalle: si parece estar en segundos, lo convertimos a ms
  if (d < 10000000000) d = d * 1000; // Epoch en segundos a ms
  const difference = d - Date.now();
  let remainingDays = difference / (1000 * 3600 * 24);
  if (remainingDays < 0) remainingDays = 0;
  return Math.round(remainingDays);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  if (!goal || isNaN(goal) || goal === 0) return 0;
  const percentage = Math.round((raisedAmount * 100) / goal);
  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new window.Image();
  img.src = url;
  if (img.complete) callback(true);
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const getLatestPrice = async (aggregatorAddress, provider) => {
  const priceFeed = new ethers.Contract(
    aggregatorAddress,
    AggregatorV3InterfaceABI,
    provider,
  );
  const roundData = await priceFeed.latestRoundData();
  return roundData.answer;
};

export { usdcAbi, PlataformaChainXABI, usdcAddress, plataformaChainxAddress };
