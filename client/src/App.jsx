import React, { useContext } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { ThemeContext } from './components/ThemeContext';
import { Sidebar, Navbar } from './components';
import {
  CampaignDetails,
  CreateCampaign,
  Home,
  Profile,
  Payment,
} from './pages';
import WithdrawTokens from './pages/Withdraw';
import PremiumLanding from './pages/PremiumLanding';

const App = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const primaryBackground = theme?.colors?.primaryBackground || '#000000';
  const primaryText = theme?.colors?.primaryText || '#ffffff';

  // Show landing page for root route
  if (location.pathname === '/' || location.pathname === '/landing') {
    return <PremiumLanding />;
  }

  // Traditional app layout for other routes
  const styles = {
    appContainer: 'relative sm:-8 p-4 min-h-screen flex flex-row',
    sidebarContainer: 'sm:flex hidden mr-10 relative',
    mainContent: 'flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5',
  };

  return (
    <div
      className={styles.appContainer}
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: primaryText 
      }}
    >
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>

      <div className={styles.mainContent}>
        <Navbar />
        <Routes>
          <Route path="/" element={<PremiumLanding />} />
          <Route path="/landing" element={<PremiumLanding />} />
          <Route path="/app" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/withdraw" element={<WithdrawTokens />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaigndetails/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
