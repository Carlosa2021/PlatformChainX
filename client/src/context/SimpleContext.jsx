import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Demo data para evitar errores
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Demo functions
  const address = null;
  const contract = null;
  const connect = () => console.log('Demo: Connect wallet');
  
  const getUserCampaigns = async () => {
    return [];
  };
  
  const createCampaign = async (form) => {
    console.log('Demo: Creating campaign', form);
    return { success: true };
  };
  
  const getCampaigns = async () => {
    console.log('Demo: Getting campaigns');
    return [];
  };
  
  const donate = async (pId, amount) => {
    console.log('Demo: Donating', pId, amount);
    return { success: true };
  };
  
  const getDonations = async (pId) => {
    console.log('Demo: Getting donations for', pId);
    return [];
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        campaigns,
        loading
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);