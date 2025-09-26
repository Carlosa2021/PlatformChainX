import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JwtPayloadCustom } from './siweTypes.js';
import { env } from '../config/env.js';

const prisma = new PrismaClient();

export class AuthService {
  static generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  static async ensureUser(wallet: string) {
    const lower = wallet.toLowerCase();
    let user = await prisma.user.findUnique({
      where: { walletAddress: lower },
    });
    if (!user) {
      user = await prisma.user.create({ data: { walletAddress: lower } });
    }
    return user;
  }

  static signAccessToken(payload: JwtPayloadCustom): string {
    const secret = env.JWT_SECRET || 'dev-secret';
    return jwt.sign(payload, secret, { expiresIn: '15m' });
  }

  static signRefreshToken(payload: JwtPayloadCustom): string {
    const secret = env.JWT_SECRET || 'dev-secret';
    return jwt.sign(payload, secret, { expiresIn: '30d' });
  }

  static verifyToken(token: string): JwtPayloadCustom | null {
    try {
      const secret = env.JWT_SECRET || 'dev-secret';
      return jwt.verify(token, secret) as JwtPayloadCustom;
    } catch {
      return null;
    }
  }

  // Helper para tests / emisión directa sin refresh
  static issueToken(payload: JwtPayloadCustom): string {
    return this.signAccessToken(payload);
  }

  static async getUserRoles(userId: string): Promise<string[]> {
    const roles = await prisma.userTenant.findMany({ where: { userId } });
    return roles.map((r: { role: string }) => r.role);
  }
}
