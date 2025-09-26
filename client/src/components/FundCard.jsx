import React, { useMemo, useContext } from 'react';
import { ethers } from 'ethers';
import { ThemeContext } from '../components/ThemeContext';
import { tagType, logo } from '../assets';
import { daysLeft } from '../utils';

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  images = [],
  handleClick,
}) => {
  const { theme } = useContext(ThemeContext);
  const remainingDays = useMemo(() => daysLeft(deadline), [deadline]);

  const targetInWei = useMemo(() => {
    return target
      ? ethers.BigNumber.from(target.toString())
      : ethers.BigNumber.from('0');
  }, [target]);

  const formattedTarget = useMemo(
    () => Number(targetInWei.toString()),
    [targetInWei],
  );

  const amountCollectedInWei = useMemo(() => {
    return amountCollected
      ? ethers.BigNumber.from(amountCollected.toString())
      : ethers.BigNumber.from('0');
  }, [amountCollected]);

  const formattedAmountCollected = useMemo(
    () => Number(amountCollectedInWei.toString()),
    [amountCollectedInWei],
  );

  const mainImage =
    Array.isArray(images) && images.length > 0 ? images[0] : '/placeholder.jpg';

  const shortenAddress = (address, digits = 4) =>
    `${address?.slice(0, digits + 2)}...${address?.slice(-digits)}`;

  return (
    <div
      onClick={handleClick}
      className="bg-[#1e1e1e] text-white w-full sm:w-[288px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-[#2a2a2a]"
    >
      <div className="relative">
        <img
          src={mainImage}
          alt="Imagen campaña"
          className="w-full h-[170px] object-cover"
        />
        {(remainingDays <= 0 ||
          formattedAmountCollected >= formattedTarget) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <span className="text-2xl sm:text-3xl font-bold text-orange-500">
              Financiado
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <img src={tagType} alt="tag" className="w-4 h-4 object-contain" />
          <span>Inmobiliaria</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <p className="text-sm text-white/60 truncate">{description}</p>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <div>
            <p className="font-semibold">{formattedAmountCollected}</p>
            <p className="text-white/60 text-xs">Recaudo {formattedTarget}</p>
          </div>
          <div>
            <p className="font-semibold">{Math.max(0, remainingDays)}</p>
            <p className="text-white/60 text-xs">Días restantes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-2">
          <div className="w-8 h-8 rounded-full flex justify-center items-center bg-white/10">
            <img src={logo} alt="user" className="w-4 h-4 object-contain" />
          </div>
          <span className="text-sm text-white/70 truncate">
            by <span className="text-white">{shortenAddress(owner)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
