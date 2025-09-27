// Wrapper HTTP genérico con manejo de tokens y refresh
// Soporta ambos nombres por retrocompatibilidad: VITE_API_BASE_URL (preferido) y VITE_API_BASE
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? 'https://api.plataforma.chainx.ch' : 'http://localhost:4000');

let accessToken = null; // en memoria
let refreshInFlight = null;

export function setAccessToken(token) {
  accessToken = token;
}

async function refreshToken() {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('Refresh failed');
        const data = await r.json();
        accessToken = data.accessToken;
        return accessToken;
      })
      .catch((e) => {
        accessToken = null;
        throw e;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  try {
    const resp = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Si estamos en desarrollo y el API no está disponible, usar datos mock
    if (!resp.ok && !import.meta.env.PROD && resp.status === 0) {
      console.warn('API no disponible, usando datos mock');
      return getMockData(path);
    }

    if (resp.status === 401) {
      // intentar refresh una vez
      try {
        await refreshToken();
        return apiFetch(path, { ...options, _retry: true });
      } catch {
        throw new Error('UNAUTHORIZED');
      }
    }

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || `Error HTTP ${resp.status}`);
    }

    const ct = resp.headers.get('content-type');
    if (ct && ct.includes('application/json')) return resp.json();
    return resp.text();
  } catch (error) {
    // En desarrollo, si hay error de conexión, usar mock data
    if (!import.meta.env.PROD && error.message.includes('Failed to fetch')) {
      console.warn('Error de conexión, usando datos mock');
      return getMockData(path);
    }
    throw error;
  }
}

// Datos mock para desarrollo
function getMockData(path) {
  const mockResponses = {
    '/health': { status: 'ok', environment: 'development-mock' },
    '/auth/user': { user: null },
    '/campaigns': [],
    '/investments': [],
    '/kyc/status': { status: 'pending' }
  };
  
  return Promise.resolve(mockResponses[path] || { message: 'Mock response' });
}

export const api = {
  get: (p) => apiFetch(p, { method: 'GET' }),
  post: (p, body) =>
    apiFetch(p, { method: 'POST', body: JSON.stringify(body) }),
  put: (p, body) => apiFetch(p, { method: 'PUT', body: JSON.stringify(body) }),
  del: (p) => apiFetch(p, { method: 'DELETE' }),
};
