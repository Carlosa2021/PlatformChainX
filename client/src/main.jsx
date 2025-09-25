import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import Modal from 'react-modal';
import { StateContextProvider } from './context';
import App from './App';
import './index.css';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './context/AuthProvider.jsx';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

if (!clientId) {
  console.error(
    '❌ ERROR: VITE_THIRDWEB_CLIENT_ID no está definido. Revisa client/.env',
  );
}

const client = createThirdwebClient({ clientId });

const rootElement = document.getElementById('root');
Modal.setAppElement(rootElement);

ReactDOM.createRoot(rootElement).render(
  <ThirdwebProvider client={client} activeChain="polygon">
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <StateContextProvider>
            <App />
          </StateContextProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </ThirdwebProvider>,
);
