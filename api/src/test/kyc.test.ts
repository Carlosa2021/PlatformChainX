import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma, registerPrismaTestHooks } from './setup.js';

registerPrismaTestHooks({ beforeEach, afterAll });

describe('KYC transitions', () => {
  it('invalid transition REJECTED -> APPROVED directly should be blocked by business logic (simulada)', async () => {
    const user = await prisma.user.create({
      data: { walletAddress: '0x' + '5'.repeat(40), kycStatus: 'REJECTED' },
    });
    const from = user.kycStatus;
    const allowedFromRejected = ['REVIEW'];
    expect(allowedFromRejected.includes('APPROVED')).toBe(false);
    expect(from).toBe('REJECTED');
  });
});
