import React, { useState } from 'react';
import { FaHourglassHalf } from 'react-icons/fa';
import TokenPurchaseModal from './TokenPurchaseModal';

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageValid, setIsImageValid] = useState(true);

  const placeholderImage =
    'https://via.placeholder.com/400x300?text=Sin+imagen';

  const featuredToken = {
    name: 'NYK-1',
    image: isImageValid
      ? 'https://ipfs.io/ipfs/QmYbh6JDdZLZ43aFWygAhnouFxzPRiyFRxz8iALgFi87yz' // Imagen real
      : '', // No se renderiza si falla
    tokenValueInEUR: 1,
    priceFeed: '0x73366Fe0AA0Ded304479862808e02506FE556a98',
    whitepaperLink: 'https://link-to-whitepaper.com',
    agreementLink: 'https://link-to-agreement.com',
  };

  const preloadImage = () => {
    const img = new Image();
    img.src = featuredToken.image;
    img.onload = () => setIsImageValid(true);
    img.onerror = () => {
      console.warn('🚫 Imagen del token no cargó correctamente.');
      setIsImageValid(false);
    };
  };

  const handleOpenModal = () => {
    preloadImage();
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-10 px-8 rounded-2xl mb-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 text-center md:text-left">
        <FaHourglassHalf className="w-12 h-12 text-white" />
        <div>
          <h2 className="text-3xl font-bold leading-tight mb-1">
            ¡Invierte desde hoy!
          </h2>
          <p className="text-lg font-medium opacity-90">
            Tenemos inmuebles disponibles listos para ti
          </p>
        </div>
      </div>

      <button
        onClick={handleOpenModal}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-3 rounded-full shadow-md transition-all duration-300"
      >
        Invertir ahora
      </button>

      <TokenPurchaseModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        campaignId={0}
        tokenInfo={featuredToken}
      />
    </div>
  );
};

export default Banner;
