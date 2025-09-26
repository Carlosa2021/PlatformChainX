import { createThirdwebClient } from 'thirdweb';
import { createAuth } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { env } from '../config/env.js';

const secretKey = env.THIRDWEB_SECRET_KEY;
const adminPk = env.THIRDWEB_ADMIN_PRIVATE_KEY;
const domain = env.AUTH_DOMAIN || 'localhost:4000';

const client = createThirdwebClient({ secretKey });
const adminAccount = adminPk
  ? privateKeyToAccount({ client, privateKey: adminPk })
  : undefined;

export const thirdwebAuth = createAuth({ domain, client, adminAccount });
export const getAuthDomain = () => domain;
