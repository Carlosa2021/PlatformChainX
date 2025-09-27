import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../src/components/ThemeContext';
import { useStateContext } from '../context/SimpleContext';
import { logo, menu } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { address, usdcBalance } = useStateContext();
  const { isAuthenticated, loginSiwe, logout, walletAddress } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  const { theme: themeContext } = useContext(ThemeContext);
  const theme = {
    ...themeContext,
    colors: {
      ...themeContext.colors,
      primaryButtonBg: '#FF751A',
    },
  };

  const customDarkTheme = darkTheme({
    fontFamily: 'Inter, sans-serif',
    colors: {
      modalBg: '#000000',
      accentText: '#FF751A',
    },
  });

  const customLightTheme = lightTheme({
    fontFamily: 'Inter, sans-serif',
    colors: {
      modalBg: '#ffffff',
      accentText: '#FF751A',
    },
  });

  useEffect(() => {
    const ownerAddress =
      '0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca'.toLowerCase();
    if (address && typeof address === 'string') {
      setIsOwner(address.toLowerCase() === ownerAddress);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      setIsConnected(true);
    }
  }, [address]);

  // Ping simple al backend para mostrar estado
  useEffect(() => {
    let cancelled = false;
    async function ping() {
      try {
        const r = await fetch(`${API_BASE}/health`, { credentials: 'include' });
        if (!cancelled) setApiOnline(r.ok);
      } catch (_) {
        if (!cancelled) setApiOnline(false);
      }
    }
    ping();
    const id = setInterval(ping, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-end mb-8 gap-6 px-4">
      {/* Desktop View */}
      <div className="sm:flex hidden flex-row justify-end gap-4 items-center">
        {address && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className="bg-[#2c2f32] py-2 px-4 rounded-full text-white text-sm border border-[#444]">
                {parseFloat(usdcBalance).toFixed(4)} USDC
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          {!apiOnline && (
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-md">
              API offline
            </span>
          )}
          <ConnectButton
            client={client}
            theme={isDarkMode ? customDarkTheme : customLightTheme}
            style={{
              backgroundColor: '#FF751A',
              color: 'white',
              padding: '10px 16px',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          >
            {isOwner ? 'Create Campaign' : isConnected ? 'Wallet' : 'Connect'}
          </ConnectButton>
          {isConnected && !isAuthenticated && (
            <button
              onClick={loginSiwe}
              disabled={!apiOnline}
              className="bg-[#2c2f32] text-white px-4 py-2 rounded-md text-sm hover:bg-[#3a3d42]"
            >
              Login
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden flex justify-between items-center relative w-full px-2">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[30px] h-[30px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 z-20 bg-[#1c1c24] shadow-xl rounded-b-xl transition-all duration-500 ${
            toggleDrawer
              ? 'translate-y-0 opacity-100'
              : '-translate-y-[120%] opacity-0'
          }`}
        >
          <ul className="flex flex-col py-4 px-6 space-y-2">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                  isActive === link.name ? 'bg-[#3a3a43]' : 'hover:bg-[#2a2d38]'
                }`}
                onClick={(e) => {
                  if (
                    link.name === 'Profile' ||
                    link.name === 'Dashboard' ||
                    isOwner
                  ) {
                    setIsActive(link.name);
                    setToggleDrawer(false);
                    navigate(link.link);
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[22px] h-[22px] object-contain mr-3 ${
                    isActive === link.name ? 'grayscale-0' : 'grayscale'
                  }`}
                />
                <p
                  className={`text-sm font-semibold ${
                    isActive === link.name ? 'text-[#FF751A]' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="px-6 pb-4">
            <ConnectButton
              client={client}
              theme={theme}
              style={{
                backgroundColor: '#FF751A',
                color: 'white',
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
              onConnect={async () => {
                if (!isConnected && window.ethereum) {
                  try {
                    await window.ethereum.request({
                      method: 'eth_requestAccounts',
                    });
                    setIsConnected(true);
                  } catch (error) {
                    console.error('Error connecting:', error);
                  }
                }
              }}
            >
              {isOwner
                ? 'Create Campaign'
                : isConnected
                ? 'Connected'
                : 'Connect'}
            </ConnectButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
