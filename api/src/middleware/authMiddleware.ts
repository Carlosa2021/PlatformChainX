import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../auth/authService.js';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    wallet: string;
    roles: string[];
  };
}

export function authenticate(required = true) {
  return async (req: AuthenticatedRequest, reply: FastifyReply) => {
    const auth = req.headers.authorization;
    if (!auth) {
      if (required)
        return reply
          .status(401)
          .send({ error: 'Missing Authorization header' });
      return;
    }
    const token = auth.replace('Bearer ', '');
    const payload = AuthService.verifyToken(token);
    if (!payload) {
      if (required) return reply.status(401).send({ error: 'Invalid token' });
      return;
    }
    req.user = { userId: payload.sub, wallet: payload.w, roles: payload.r };
  };
}

export function requireRole(roles: string[]) {
  return async (req: AuthenticatedRequest, reply: FastifyReply) => {
    if (!req.user) return reply.status(401).send({ error: 'Unauthenticated' });
    const has = req.user.roles.some((r) => roles.includes(r));
    if (!has) return reply.status(403).send({ error: 'Forbidden' });
  };
}
