import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { api, setAccessToken } from '../api/http';
import { useActiveAccount, useConnect } from 'thirdweb/react';
import { signLoginPayload } from 'thirdweb/auth';

const AuthContext = createContext(null);

// Eliminamos buildSiweMessage: reemplazado por flujo thirdweb

export const AuthProvider = ({ children }) => {
  const account = useActiveAccount();
  const connect = useConnect();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchMe = useCallback(async () => {
    try {
      const data = await api.get('/me');
      setUser(data.user || null);
    } catch (e) {
      setUser(null); // no autenticado
    }
  }, []);

  // Al montar, intentar refresh implícito (/me hará refresh si token válido + cookie refresh)
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchMe();
      setLoading(false);
    })();
  }, [fetchMe]);

  const loginSiwe = useCallback(async () => {
    if (!account?.address) throw new Error('Conecta la wallet primero');
    setAuthError(null);
    try {
      // 1. Pedir payload al backend thirdweb
      const payload = await api.get(`/auth/payload?address=${account.address}`);
      // 2. Firmar payload (si es social / passkey handled por ConnectButton internamente)
      const signature = await signLoginPayload({ payload, account });
      // 3. Verificar en backend
      const res = await api.post('/auth/verify', { payload, signature });
      setAccessToken(res.accessToken);
      await fetchMe();
      return true;
    } catch (e) {
      console.error('Error login thirdweb', e);
      setAuthError(e.message);
      return false;
    }
  }, [account, fetchMe]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {}
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    walletAddress: account?.address || null,
    connectWallet: connect,
    loginSiwe,
    logout,
    refreshUser: fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
