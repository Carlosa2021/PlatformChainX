export interface SiweMessageFields {
  domain: string;
  address: string;
  statement?: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
  expirationTime?: string;
  notBefore?: string;
  requestId?: string;
  resources?: string[];
}

export interface JwtPayloadCustom {
  sub: string; // userId
  w: string; // wallet address
  r: string[]; // roles (flattened)
  t?: string; // tenant code if single-tenant session
  iat?: number;
  exp?: number;
}
