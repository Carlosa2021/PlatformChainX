import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';

// Pages
import LandingPageNew from './pages/LandingPageNew';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ProfessionalTokenization from './pages/ProfessionalTokenization';
import InvestorManagement from './pages/InvestorManagement';
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Withdraw from './pages/Withdraw';

// Components
import { Sidebar, Navbar } from './components';

// Context
import { StateContextProvider } from './context/SimpleContext';

// CSS
import './styles.css';
import './index.css';

// Create Thirdweb client (demo mode for now)
const client = createThirdwebClient({ 
  clientId: 'demo' // We'll use demo mode for now
});

const App = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [showPlatform, setShowPlatform] = useState(false);

  // Si no está logueado, mostrar landing
  if (!showPlatform && !activeUser) {
    return (
      <div className="min-h-screen">
        <LandingPageNew 
          onEnterPlatform={() => setShowPlatform(true)}
          onLogin={(user) => setActiveUser(user)}
        />
      </div>
    );
  }

  // Plataforma principal con providers
  return (
    <ThirdwebProvider client={client}>
      <StateContextProvider>
        <Router>
          <div className="relative sm:p-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
            <div className="sm:flex hidden mr-10 relative">
              <Sidebar />
            </div>

            <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
              <Navbar />
              
              <Routes>
                <Route path="/" element={<ProfessionalDashboard />} />
                <Route path="/dashboard" element={<ProfessionalDashboard />} />
                <Route path="/tokenize" element={<ProfessionalTokenization />} />
                <Route path="/investors" element={<InvestorManagement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/campaign-details/:id" element={<CampaignDetails />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Botón para volver al landing */}
            <button
              onClick={() => {
                setShowPlatform(false);
                setActiveUser(null);
              }}
              className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors z-50"
            >
              ← Landing
            </button>
          </div>
        </Router>
      </StateContextProvider>
    </ThirdwebProvider>
  );
};

export default App;