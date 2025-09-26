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

let client = null;
if (!clientId) {
  console.error('❌ ERROR: VITE_THIRDWEB_CLIENT_ID no está definido.');
} else {
  client = createThirdwebClient({ clientId });
}

const rootElement = document.getElementById('root');
Modal.setAppElement(rootElement);

ReactDOM.createRoot(rootElement).render(
  client ? (
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
    </ThirdwebProvider>
  ) : (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Falta configuración de Thirdweb</h1>
      <p>
        Define la variable <code>VITE_THIRDWEB_CLIENT_ID</code> en{' '}
        <code>client/.env</code>.
      </p>
      <ol>
        <li>
          Duplica <code>client/.env.example</code> a <code>client/.env</code>.
        </li>
        <li>
          Reemplaza el valor de <code>VITE_THIRDWEB_CLIENT_ID</code> por tu
          Client ID público de Thirdweb.
        </li>
        <li>Reinicia el servidor de desarrollo o vuelve a compilar.</li>
      </ol>
    </div>
  ),
);
