import { createThirdwebClient } from 'thirdweb';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
if (!clientId) {
  console.warn('⚠️  Falta VITE_THIRDWEB_CLIENT_ID en client/.env');
}

const client = createThirdwebClient({
  clientId,
});

export default client;
