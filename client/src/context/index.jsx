import { createContext, useContext, useState, useEffect } from 'react';
import { useMemo } from 'react';

import {
  useActiveAccount,
  useConnect,
  useSendTransaction,
  useReadContract,
} from 'thirdweb/react';
import {
  getContract,
  prepareContractCall,
  readContract,
  createThirdwebClient,
} from 'thirdweb';
import { polygon } from 'thirdweb/chains';
import { ethers } from 'ethers';
import usdcAbi from '../context/usdcAbi.json';
import aggregatorV3InterfaceABI from '../context/aggregatorV3InterfaceABI.json';
import TokenChainXABIData from '../context/TokenChainXABI.json';
import PlataformaChainXABI from '../context/PlataformaChainXABI.json';

const TokenChainXABI = TokenChainXABIData.abi;
const StateContext = createContext();

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

const contract = getContract({
  client,
  address: '0x78D69Fb6f757bCCE89381018125Cea307513ABf5',
  abi: PlataformaChainXABI,
  chain: polygon,
});
const TokenChainXContract = getContract({
  client,
  address: '0x879CaF6c12D2fD533ee4A9a75B68159d270dfBD5',
  abi: TokenChainXABI,
  chain: polygon,
});

const usdcContractAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const priceFeedAddress = '0x73366Fe0AA0Ded304479862808e02506FE556a98';

export const StateContextProvider = ({ children }) => {
  const addressObj = useActiveAccount();
  const address = addressObj?.address || '';
  const connect = useConnect();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [usdcContract, setUsdcContract] = useState(null);
  const [priceFeed, setPriceFeed] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const _signer = _provider.getSigner();
      const _usdcContract = new ethers.Contract(
        usdcContractAddress,
        usdcAbi,
        _signer,
      );
      const _priceFeed = new ethers.Contract(
        priceFeedAddress,
        aggregatorV3InterfaceABI,
        _provider,
      );
      setProvider(_provider);
      setSigner(_signer);
      setUsdcContract(_usdcContract);
      setPriceFeed(_priceFeed);
    }
  }, []);

  useEffect(() => {
    const fetchUsdcBalance = async () => {
      if (address && usdcContract) {
        try {
          const balance = await usdcContract.balanceOf(address);
          setUsdcBalance(ethers.utils.formatUnits(balance, 6));
        } catch {
          setUsdcBalance(0);
        }
      }
    };
    fetchUsdcBalance();
  }, [address, usdcContract]);

  const getLatestPrice = async () => {
    if (!priceFeed) return null;
    try {
      const priceData = await priceFeed.latestRoundData();
      return priceData.answer;
    } catch {
      return null;
    }
  };

  const { mutateAsync: createCampaign } = useSendTransaction();

  const publishCampaign = async (form) => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: 'createCampaign',
        params: [
          form.title,
          form.description,
          form.location,
          form.target,
          Math.floor(new Date(form.deadline).getTime() / 1000),
          form.images,
          form.tokenContract,
          Array.isArray(form.documents)
            ? form.documents
            : form.documents.split(','),
          Array.isArray(form.documentTitles)
            ? form.documentTitles
            : form.documentTitles.split(','),
          form.video,
          form.tokenInfo,
          Math.floor(Date.now() / 1000),
          form.tokenValueInEUR,
          form.monthlyYieldPercent ?? 1,
        ],
      });
      return await createCampaign(transaction);
    } catch (error) {
      throw error;
    }
  };

  const approveUSDC = async (amount) => {
    try {
      const amountToApprove = ethers.utils.parseUnits(amount.toString(), 6);
      const tx = await usdcContract.approve(contract.address, amountToApprove);
      await tx.wait();
      return true;
    } catch {
      return false;
    }
  };

  const {
    data: rawCampaigns,
    isLoading: isLoadingCampaigns,
    error: campaignError,
  } = useReadContract({
    contract,
    method: 'getCampaigns',
    params: [],
  });

  const campaigns = useMemo(() => {
    if (!rawCampaigns || !Array.isArray(rawCampaigns)) return [];
    return rawCampaigns.map((c, i) => ({ ...c, id: i }));
  }, [rawCampaigns]);

  const { mutateAsync: buyTokens } = useSendTransaction();

  const handleTokenPurchase = async (pId, usdcAmount) => {
    if (!contract) return;
    try {
      const approvalSuccess = await approveUSDC(usdcAmount.toString());
      if (!approvalSuccess) return;
      const transaction = prepareContractCall({
        contract,
        method: 'buyTokens',
        params: [pId, ethers.utils.parseUnits(usdcAmount.toString(), 6)],
      });
      return await buyTokens(transaction);
    } catch (error) {
      throw error;
    }
  };

  const getDonatorsCampaigns = async (pId) => {
    try {
      console.log('🔍 Llamando a getDonatorsCampaigns con ID:', pId);

      const result = await readContract({
        contract,
        method:
          'function getDonatorsCampaigns(uint256 _id) view returns (address[], uint256[])',
        params: [pId],
      });

      console.log('📦 Resultado directo de getDonatorsCampaigns:', result);

      if (!Array.isArray(result) || result.length !== 2) {
        console.warn('⚠️ Formato inesperado de los datos:', result);
        return [];
      }

      const [donators, amounts] = result;

      if (
        !Array.isArray(donators) ||
        !Array.isArray(amounts) ||
        donators.length !== amounts.length
      ) {
        console.warn('⚠️ Datos inconsistentes:', { donators, amounts });
        return [];
      }

      const combinedData = donators.map((donator, i) => ({
        donator,
        tokensBought: Number(amounts[i]),
      }));
      console.log('✅ Datos combinados:', combinedData);
      return combinedData;
    } catch (error) {
      console.error('❌ Error al leer getDonatorsCampaigns:', error);
      return [];
    }
  };

  const getAvailableTokens = async (campaignId) => {
    if (!contract) return '0';
    try {
      const tokenBalance = await contract.call('getAvailableTokens', [
        campaignId,
      ]);
      return tokenBalance?.toString() || '0';
    } catch {
      return '0';
    }
  };

  const createToken = async (tokenData) => {
    try {
      const tokenFactory = new ethers.ContractFactory(TokenChainXABI, signer);
      const token = await tokenFactory.deploy(
        tokenData.tokenName,
        tokenData.tokenSymbol,
        ethers.utils.parseUnits(tokenData.initialSupply, 0),
        ethers.utils.parseUnits(tokenData.maxSupply, 0),
        usdcContractAddress,
      );
      await token.deployed();
      return token.address;
    } catch (error) {
      throw error;
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        usdcBalance,
        getLatestPrice,
        contract,
        TokenChainXContract,
        connect,
        createCampaign: publishCampaign,
        createToken,
        approveUSDC,
        campaigns,
        isLoading: isLoadingCampaigns,
        error: campaignError,
        handleTokenPurchase,
        getAvailableTokens,
        getDonatorsCampaigns,
        provider,
        signer,
        usdcContract,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
