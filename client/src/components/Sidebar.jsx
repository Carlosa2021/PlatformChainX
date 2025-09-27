import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/SimpleContext';
import { ThemeContext } from '../../src/components/ThemeContext';
import { logo, sun, moon } from '../assets';
import { navlinks } from '../constants';

const Sidebar = () => {
  // Demo mode - no wallet hooks for now
  const wallet = null;
  const disconnect = () => console.log('Demo: Disconnect');
  const account = null;
  const navigate = useNavigate();
  const { address } = useStateContext();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isActive, setIsActive] = useState('dashboard');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const ownerAddress =
      '0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca'.toLowerCase();
    if (address && typeof address === 'string') {
      setIsOwner(address.toLowerCase() === ownerAddress);
    }
  }, [address]);

  return (
    <div
      className={`sidebar-container min-h-screen flex flex-col justify-between ${
        theme.type === 'dark' ? 'bg-[#1f1f2c]' : 'bg-white border-r'
      }`}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center py-8 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="Logo" className="w-12 h-12" />
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 px-4 py-2 mt-8">
        <ul className="space-y-2">
          {navlinks.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => {
                  if (link.name === 'logout') {
                    if (wallet) disconnect(wallet);
                    navigate('/');
                  } else {
                    setIsActive(link.name);
                    navigate(link.link);
                  }
                }}
                className={`flex items-center px-4 py-3 rounded-lg w-full transition duration-150 group ${
                  isActive === link.name
                    ? 'bg-[#3a3f51] border-l-4 border-orange-500'
                    : 'hover:bg-[#4a4f62]/80'
                }`}
                style={{
                  color:
                    isActive === link.name
                      ? '#FF751A'
                      : theme.colors.primaryText,
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={link.imgUrl}
                    alt={link.name}
                    className="w-6 h-6 opacity-80 group-hover:opacity-100"
                  />
                  <span className="text-sm font-medium">{link.name}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modo Oscuro / Claro */}
      <div className="border-t border-gray-700 py-4 px-4">
        <button
          onClick={toggleTheme}
          className="flex items-center w-full px-4 py-3 rounded-lg text-left transition hover:bg-[#4a4f62]"
        >
          <img
            src={theme.type === 'dark' ? sun : moon}
            alt="Theme toggle"
            className="w-6 h-6 mr-3"
          />
          <span className="text-sm font-medium">
            {theme.type === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
