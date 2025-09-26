import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../src/components/ThemeContext';
import FundCard from './FundCard';
import { loader } from '../assets';

const DisplayCampaigns = ({ title, isLoading, campaigns = [] }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div className="w-full">
      <h1
        className="text-2xl font-bold text-left mb-4 tracking-tight"
        style={{ color: theme.colors.primaryText }}
      >
        {title}
      </h1>

      <div className="flex flex-wrap gap-6 mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-40">
            <img
              src={loader}
              alt="Cargando..."
              className="w-24 h-24 animate-spin opacity-70"
            />
          </div>
        ) : campaigns.length === 0 ? (
          <p
            className="text-center text-gray-400 text-sm italic w-full mt-4"
            style={{ color: theme.colors.descriptionText }}
          >
            No hay campañas disponibles por ahora.
          </p>
        ) : (
          campaigns.map((campaign, index) => (
            <div
              key={campaign.pId || campaign.tokenContract || index}
              className="animate-fade-in"
            >
              <FundCard
                {...campaign}
                handleClick={() => navigate(`/campaigndetails/${campaign.id}`)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
