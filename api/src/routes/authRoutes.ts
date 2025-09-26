import { FastifyInstance } from 'fastify';
import { AuthService } from '../auth/authService.js';
import { z } from 'zod';
import { SiweMessage } from 'siwe';
import { thirdwebAuth, getAuthDomain } from '../thirdweb/thirdwebAuth.js';

// In-memory nonce store (reemplazar por Redis si escalamos horizontal)
const nonceCache = new Map<string, string>();

export async function authRoutes(app: FastifyInstance) {
  // --- Thirdweb Auth (nuevo) ---
  app.get('/auth/payload', async (req, reply) => {
    const address = (req.query as any)?.address as string | undefined;
    if (!address) return reply.status(400).send({ error: 'address requerida' });
    try {
      const payload = await thirdwebAuth.generatePayload({ address });
      return payload; // contiene domain, address, statement, uri, version, chainId, nonce, issuedAt, expirationTime
    } catch (e: any) {
      return reply
        .status(500)
        .send({ error: 'No se pudo generar payload', details: e.message });
    }
  });

  const verifySchema = z.object({
    payload: z.any(),
    signature: z.string().regex(/^0x[0-9a-fA-F]+$/),
  });

  app.post('/auth/verify', async (req, reply) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success)
      return reply.status(400).send({ error: 'Payload inválido' });
    const { payload, signature } = parsed.data;
    try {
      // Verificación thirdweb (SIWE bajo el capó)
      const verified = await thirdwebAuth.verifyPayload({ payload, signature });
      if (!verified.valid)
        return reply.status(401).send({ error: 'Firma inválida' });
      // Dominio consistente
      if (payload.domain !== getAuthDomain()) {
        return reply.status(400).send({ error: 'Dominio no coincide' });
      }
      const wallet = payload.address.toLowerCase();
      const user = await AuthService.ensureUser(wallet);
      const roles = await AuthService.getUserRoles(user.id);
      const access = AuthService.signAccessToken({
        sub: user.id,
        w: wallet,
        r: roles,
      });
      const refresh = AuthService.signRefreshToken({
        sub: user.id,
        w: wallet,
        r: roles,
      });
      reply.setCookie('refresh_token', refresh, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
        maxAge: 60 * 60 * 24 * 30,
      });
      return { accessToken: access, user: { id: user.id, wallet } };
    } catch (e: any) {
      return reply
        .status(400)
        .send({ error: 'Verificación fallida', details: e.message });
    }
  });

  // --- Fin Thirdweb Auth ---

  // (LEGACY) SIWE manual - deprecado, mantener temporalmente para backward compat
  // Obtener nonce para SIWE
  app.get('/auth/nonce', async () => {
    const nonce = AuthService.generateNonce();
    // Guardar temporalmente con clave = nonce y valor = timestamp
    nonceCache.set(nonce, Date.now().toString());
    return { nonce };
  });

  const siweSchema = z.object({
    message: z.string(),
    signature: z.string(),
  });

  app.post('/auth/siwe', async (req, reply) => {
    // DEPRECATED
    const parsed = siweSchema.safeParse(req.body);
    if (!parsed.success)
      return reply.status(400).send({ error: 'Bad payload' });

    const { message, signature } = parsed.data;
    let siwe: SiweMessage;
    try {
      siwe = new SiweMessage(message);
      const { data: fields } = await siwe.verify({ signature });
      if (!nonceCache.has(fields.nonce)) {
        return reply.status(400).send({ error: 'Nonce inválido/expirado' });
      }
      nonceCache.delete(fields.nonce);
      const wallet = fields.address.toLowerCase();
      const user = await AuthService.ensureUser(wallet);
      const roles = await AuthService.getUserRoles(user.id);
      const access = AuthService.signAccessToken({
        sub: user.id,
        w: wallet,
        r: roles,
      });
      const refresh = AuthService.signRefreshToken({
        sub: user.id,
        w: wallet,
        r: roles,
      });

      reply.setCookie('refresh_token', refresh, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 60 * 60 * 24 * 30,
      });

      return { accessToken: access, user: { id: user.id, wallet } };
    } catch (e: any) {
      return reply
        .status(400)
        .send({ error: 'SIWE inválido', details: e?.message });
    }
  });

  app.post('/auth/refresh', async (req, reply) => {
    const token = (req.cookies as any)?.refresh_token;
    if (!token) return reply.status(401).send({ error: 'No refresh token' });
    const payload = AuthService.verifyToken(token);
    if (!payload) return reply.status(401).send({ error: 'Invalid token' });
    const roles = await AuthService.getUserRoles(payload.sub);
    const access = AuthService.signAccessToken({
      sub: payload.sub,
      w: payload.w,
      r: roles,
    });
    return { accessToken: access };
  });

  app.get('/me', async (req, reply) => {
    const auth = req.headers.authorization;
    if (!auth) return reply.status(401).send({ error: 'No auth header' });
    const token = auth.replace('Bearer ', '');
    const payload = AuthService.verifyToken(token);
    if (!payload) return reply.status(401).send({ error: 'Invalid token' });
    return { userId: payload.sub, wallet: payload.w, roles: payload.r };
  });

  app.post('/auth/logout', async (_req, reply) => {
    reply.setCookie('refresh_token', '', { path: '/', maxAge: 0 });
    return { ok: true };
  });
}
