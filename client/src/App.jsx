import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
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

const styles = {
  appContainer: 'relative sm:-8 p-4 bg-black min-h-screen flex flex-row',
  sidebarContainer: 'sm:flex hidden mr-10 relative',
  mainContent: 'flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5',
};

const App = () => {
  const { theme } = useContext(ThemeContext);

  const primaryBackground = theme?.colors?.primaryBackground || '#ffffff'; // Color de fondo del tema
  const primaryText = theme?.colors?.primaryText || '#000000'; // Color del texto del tema

  return (
    <div
      className={styles.appContainer}
      style={{ backgroundColor: primaryBackground, color: primaryText }} // 🔹 Ahora aplica correctamente los colores
    >
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>

      <div className={styles.mainContent}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/withdraw" element={<WithdrawTokens />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaigndetails/:id" element={<CampaignDetails />} />;
        </Routes>
      </div>
    </div>
  );
};

export default App;
