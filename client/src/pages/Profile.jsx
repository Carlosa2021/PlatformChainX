import { useState, useEffect, useContext } from 'react';
import {
  AccountProvider,
  AccountAvatar,
  AccountName,
  AccountAddress,
} from 'thirdweb/react';
import { DisplayCampaigns, Loader } from '../components';
import { useStateContext } from '../context';
import Footer from '../components/Footer';
import { ThemeContext } from '../components/ThemeContext';
import { api } from '../api/http';
import { useAuth } from '../context/AuthProvider.jsx';
import client from '../client';

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [tokensPurchased, setTokensPurchased] = useState('0');
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [kycInfo, setKycInfo] = useState(null);

  const {
    address,
    TokenChainXContract,
    contract,
    campaigns: allCampaigns,
    usdcBalance,
    usdcContract,
  } = useStateContext();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        setTokensPurchased('12');
        setIsWhitelisted(true);
        // De momento mostramos todas las campañas desde el contexto
        setCampaigns(allCampaigns || []);
      } catch (error) {
        console.error('❌ Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchData();
    }
  }, [address, allCampaigns]);

  async function handleRequestKyc() {
    if (!isAuthenticated) {
      alert('Primero inicia sesión');
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post('/kyc/request', {});
      setKycStatus('DOCS_REQUIRED');
      setKycInfo(res);
    } catch (e) {
      console.error('❌ Error solicitando KYC:', e);
      alert('No se pudo iniciar el proceso KYC');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: theme.colors.primaryBackground }}
    >
      <div className="flex-grow px-4 sm:px-0">
        <section
          className="rounded-2xl w-full sm:w-[620px] mx-auto shadow-xl mt-12 p-6 sm:p-10 transition-all duration-300"
          style={{ backgroundColor: theme.colors.cardBackground }}
        >
          {isLoading && <Loader />}
          <h2
            className="text-center font-bold text-2xl mb-6"
            style={{ color: theme.colors.primaryText }}
          >
            Tu Perfil
          </h2>
          {client ? (
            <AccountProvider address={address} client={client}>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <AccountAvatar className="w-24 h-24 rounded-full border-4 border-[#FF751A] shadow-xl" />
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <AccountName
                    fallbackComponent={<AccountAddress />}
                    className="text-xl font-bold"
                    style={{ color: theme.colors.primaryText }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: theme.colors.highlightBackground }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: theme.colors.secondaryText }}
                  >
                    Saldo en USDC
                  </p>
                  <span
                    className="text-lg font-bold"
                    style={{ color: theme.colors.primaryText }}
                  >
                    {usdcBalance || 0}
                  </span>
                </div>
                <div
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: theme.colors.highlightBackground }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: theme.colors.secondaryText }}
                  >
                    Tokens comprados
                  </p>
                  <span
                    className="text-lg font-bold"
                    style={{ color: theme.colors.primaryText }}
                  >
                    {tokensPurchased}
                  </span>
                </div>
                <div
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: theme.colors.highlightBackground }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: theme.colors.secondaryText }}
                  >
                    Whitelist
                  </p>
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: isWhitelisted ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {isWhitelisted ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>

              {/* Bloque KYC simple */}
              <div
                className="mt-6 p-4 rounded-lg"
                style={{ backgroundColor: theme.colors.highlightBackground }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: theme.colors.secondaryText }}
                    >
                      Estado KYC
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: theme.colors.primaryText }}
                    >
                      {kycStatus}
                    </p>
                    {kycInfo?.sessionId && (
                      <p
                        className="text-xs opacity-80"
                        style={{ color: theme.colors.secondaryText }}
                      >
                        Sesión: {kycInfo.sessionId}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleRequestKyc}
                    disabled={!isAuthenticated || kycStatus !== 'PENDING'}
                    className={`px-4 py-2 rounded-md text-sm font-semibold ${
                      !isAuthenticated || kycStatus !== 'PENDING'
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-[#FF751A] hover:opacity-90'
                    }`}
                    style={{ color: '#fff' }}
                  >
                    {kycStatus === 'PENDING' ? 'Iniciar KYC' : 'KYC iniciado'}
                  </button>
                </div>
              </div>
            </AccountProvider>
          ) : (
            <div className="mb-6 text-center text-sm opacity-80">
              Configura VITE_THIRDWEB_CLIENT_ID para ver info de la cuenta.
            </div>
          )}
        </section>

        <div className="mt-12 px-4 sm:px-10">
          <DisplayCampaigns
            title="Tus Campañas"
            isLoading={isLoading}
            campaigns={campaigns}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
