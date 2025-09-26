'use client';

import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { ThemeContext } from '../components/ThemeContext';
import {
  CountBox,
  CustomButton,
  Loader,
  HorizontalMenu,
  TokenPurchaseModal,
  Map,
} from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { tokenIcon, metamaskIcon, calendarIcon, pdfIcon } from '../assets';
import { priceFeedAddress } from '../contractConstants';

const shortenAddress = (address, digits = 4) => {
  if (!address) return '';
  return `${address.substring(0, digits + 2)}...${address.substring(
    address.length - digits,
  )}`;
};

const CampaignDetails = () => {
  const { theme } = useContext(ThemeContext);
  const {
    campaigns,
    getDonatorsCampaigns,
    address,
    provider,
    isLoading: isLoadingCampaigns,
    claimDividend,
    checkDividendClaimed,
  } = useStateContext();

  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const campaignId = Number(id);

  const [campaign, setCampaign] = useState(undefined);
  const [donators, setDonators] = useState([]);
  const [selectedTab, setSelectedTab] = useState('description');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasClaimedDividend, setHasClaimedDividend] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (isLoadingCampaigns) return;
    if (state?.title && state?.description) {
      setCampaign(state);
      return;
    }
    const found = campaigns?.find((x) => x.id === campaignId);
    if (found) {
      setCampaign(found);
    } else {
      navigate('/');
    }
  }, [campaigns, campaignId, isLoadingCampaigns, state, navigate]);

  useEffect(() => {
    if (!campaign || !campaign.donators || !campaign.donations) return;
    const combined = campaign.donators.map((donator, i) => ({
      donator,
      tokensBought: Number(campaign.donations[i]),
    }));
    setDonators(combined);
  }, [campaign]);

  useEffect(() => {
    if (!campaign?.tokenContract || !provider) return;
    const fetchSymbol = async () => {
      try {
        const tokenContract = new ethers.Contract(
          campaign.tokenContract,
          ['function symbol() view returns (string)'],
          provider,
        );
        const symbol = await tokenContract.symbol();
        setTokenSymbol(symbol);
      } catch (error) {
        console.error('Error fetching token symbol:', error);
        setTokenSymbol('');
      }
    };
    fetchSymbol();
  }, [campaign?.tokenContract, provider]);

  // Check if dividend already claimed (simplificado: último snapshot)
  useEffect(() => {
    const run = async () => {
      if (address && campaign) {
        const claimed = await checkDividendClaimed(campaignId, address);
        setHasClaimedDividend(claimed);
      }
    };
    run();
  }, [address, campaign, campaignId, checkDividendClaimed]);

  const handleClaimDividend = async () => {
    setClaimLoading(true);
    setClaimError('');
    setClaimSuccess(false);
    try {
      await claimDividend(campaignId);
      setClaimSuccess(true);
      setHasClaimedDividend(true);
    } catch (err) {
      setClaimError(err?.message || 'Error al reclamar dividendo');
    } finally {
      setClaimLoading(false);
    }
  };

  const totalUniqueInvestors = useMemo(() => {
    if (!Array.isArray(donators) || donators.length === 0) return 0;
    const uniqueAddresses = donators
      .map((d) => d?.donator?.toLowerCase?.())
      .filter((addr, index, arr) => addr && arr.indexOf(addr) === index);
    return uniqueAddresses.length;
  }, [donators]);

  const addTokenToMetaMask = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: campaign.tokenContract,
            symbol: tokenSymbol || 'TOKEN',
            decimals: 0,
          },
        },
      });
    } catch (error) {
      console.error('Error al añadir token a MetaMask:', error);
    }
  };

  const startDateFormatted = campaign?.startDate
    ? new Date(Number(campaign.startDate) * 1000).toLocaleDateString()
    : 'No disponible';

  if (
    isLoadingCampaigns ||
    !Array.isArray(campaigns) ||
    campaigns.length === 0 ||
    campaign === undefined
  ) {
    return <Loader />;
  }

  return (
    <div className="p-4 text-gray-800 dark:text-white">
      <div className="w-full flex md:flex-row flex-col mt-10 gap-8">
        <div className="flex-1 flex-col">
          <div className="relative rounded-[25px] overflow-hidden shadow-lg glass-card">
            <img
              src={campaign?.images?.[0]}
              alt="Imagen de campaña"
              className="w-full h-[500px] object-cover brightness-90"
            />
          </div>
          <div className="relative w-full h-6 bg-white/10 mt-4 rounded-full glass-bar">
            <div
              className="absolute h-full bg-gradient-to-r from-[#ff9a00] to-[#ff0000] rounded-full transition-all duration-700"
              style={{
                width:
                  calculateBarPercentage(
                    Number(campaign.target),
                    Number(campaign.amountCollected),
                  ) + '%',
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[160px] w-full flex-wrap justify-between gap-4">
          <CountBox
            title="Días Restantes"
            value={daysLeft(campaign.deadline)}
          />
          <CountBox
            title={`Recaudo de ${Number(campaign.target)} tokens`}
            value={Number(campaign.amountCollected)}
          />
          <CountBox title="Total Inversores" value={totalUniqueInvestors} />
        </div>
      </div>

      <HorizontalMenu
        tabs={[
          { key: 'description', label: 'Descripción' },
          { key: 'location', label: 'Localización' },
          { key: 'token', label: 'Datos del token' },
          { key: 'documents', label: 'Documentos' },
        ]}
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />

      <div className="mt-7 transition-all">
        {selectedTab === 'description' && (
          <p className="text-lg text-gray-500 dark:text-blue-400 font-bold mb-6">
            {campaign.description}
          </p>
        )}
        {selectedTab === 'location' && (
          <div className="map-container-glass">
            <Map />
          </div>
        )}
        {selectedTab === 'token' && (
          <div className="glass-card px-8 py-6 rounded-3xl shadow-lg flex flex-col gap-5 bg-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-[#ff751a] drop-shadow">
              Datos del token
            </h3>
            <div className="flex items-center gap-3">
              <img src={tokenIcon} alt="Token" className="w-6 h-6" />
              <a
                href={`https://polygonscan.com/token/${campaign.tokenContract}`}
                className="text-lg font-semibold text-blue-700 dark:text-white hover:text-orange-400 transition-colors underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tokenSymbol || 'Cargando...'}
              </a>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={addTokenToMetaMask}
            >
              <img src={metamaskIcon} alt="MetaMask" className="w-6 h-6" />
              <span className="text-blue-700 dark:text-white hover:text-orange-400 cursor-pointer">
                Añadir a MetaMask
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img src={calendarIcon} alt="Fecha" className="w-6 h-6" />
              <span className="text-blue-700 dark:text-white">
                Inicio: {startDateFormatted}
              </span>
            </div>
          </div>
        )}
        {selectedTab === 'documents' && (
          <div className="space-y-2">
            {campaign.documents?.map((doc, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src={pdfIcon} alt="PDF Icon" className="w-5 h-5" />
                <a
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-300 underline"
                >
                  {campaign.documentTitles?.[i] || `Documento ${i + 1}`}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h4 className="text-lg text-gray-500 dark:text-blue-400 font-bold mb-16">
          Inversores recientes
        </h4>
        <div className="flex flex-col gap-3 bg-black/10 dark:bg-white/10 p-4 rounded-xl max-h-[120px] overflow-y-auto custom-scrollbar">
          {donators.length > 0 ? (
            donators.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-white">
                  {i + 1}. {shortenAddress(item.donator)}
                </span>
                <span className="text-gray-500 dark:text-white">
                  {item.tokensBought} tokens
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm opacity-70">
              Aún no hay inversores. ¡Sé el primero!
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-10 mb-10">
        <CustomButton
          btnType="button"
          title={<span className="text-base font-semibold">Invertir</span>}
          styles={`w-[240px] py-3 rounded-xl transition-all duration-300 ${
            daysLeft(campaign.deadline) <= 0 ||
            Number(campaign.amountCollected) >= Number(campaign.target)
              ? 'bg-gray-500 opacity-60 cursor-not-allowed'
              : 'bg-[#ff751a] hover:bg-[#ff8c42] hover:shadow-lg'
          }`}
          handleClick={() => setIsModalOpen(true)}
          disabled={
            daysLeft(campaign.deadline) <= 0 ||
            Number(campaign.amountCollected) >= Number(campaign.target)
          }
        />
      </div>

      {/* Dividend Claim Section */}
      <div className="mt-4 mb-12 flex flex-col items-center gap-4">
        <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300">
          Dividendos
        </h4>
        {hasClaimedDividend ? (
          <p className="text-green-600 dark:text-green-400 text-sm">
            Ya has reclamado el dividendo más reciente.
          </p>
        ) : (
          <CustomButton
            btnType="button"
            title={
              claimLoading ? (
                <span className="text-sm">Reclamando...</span>
              ) : (
                <span className="text-sm font-semibold">
                  Reclamar dividendo
                </span>
              )
            }
            styles={`w-[220px] py-2 rounded-lg text-sm ${
              claimLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            handleClick={handleClaimDividend}
            disabled={claimLoading || hasClaimedDividend}
          />
        )}
        {claimError && (
          <p className="text-red-600 text-xs max-w-md text-center">
            {claimError}
          </p>
        )}
        {claimSuccess && !claimError && (
          <p className="text-emerald-600 text-xs">
            Dividendo reclamado correctamente.
          </p>
        )}
      </div>

      <TokenPurchaseModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        campaignId={campaignId}
        tokenInfo={{
          name: tokenSymbol || 'Loading...',
          image: campaign?.images?.[0],
          priceFeed: campaign.priceFeed || priceFeedAddress,
          tokenValueInEUR: campaign.tokenValueInEUR ?? 1,
          whitepaperLink: 'https://link-to-whitepaper.com',
          agreementLink: 'https://link-to-agreement.com',
        }}
        provider={provider}
        address={address}
      />

      <Footer />
    </div>
  );
};

export default CampaignDetails;
