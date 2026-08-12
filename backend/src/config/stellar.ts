import { Keypair, Networks, Server } from 'stellar-sdk';
import { logger } from '../utils/logger.js';

let adminKeypair: Keypair | null = null;
let server: Server | null = null;
let rpcServer: string = '';

export const initStellarConfig = async () => {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  const rpcUrl = process.env.STELLAR_RPC_URL;
  const horizonUrl = process.env.STELLAR_HORIZON_URL;

  if (!secretKey) {
    throw new Error('ADMIN_SECRET_KEY not set in .env');
  }
  if (!rpcUrl) {
    throw new Error('STELLAR_RPC_URL not set in .env');
  }
  if (!horizonUrl) {
    throw new Error('STELLAR_HORIZON_URL not set in .env');
  }

  adminKeypair = Keypair.fromSecret(secretKey);
  server = new Server(horizonUrl);
  rpcServer = rpcUrl;

  logger.info(`✓ Stellar config loaded for ${process.env.STELLAR_NETWORK}`);
  logger.info(`✓ Admin account: ${adminKeypair.publicKey()}`);
};

export const getAdminKeypair = (): Keypair => {
  if (!adminKeypair) throw new Error('Stellar config not initialized');
  return adminKeypair;
};

export const getServer = (): Server => {
  if (!server) throw new Error('Stellar config not initialized');
  return server;
};

export const getRpcUrl = (): string => {
  if (!rpcServer) throw new Error('Stellar config not initialized');
  return rpcServer;
};

export const getNetworkPassphrase = (): string => {
  const network = process.env.STELLAR_NETWORK || 'testnet';
  if (network === 'mainnet') return Networks.PUBLIC_NETWORK_PASSPHRASE;
  if (network === 'testnet') return Networks.TESTNET_NETWORK_PASSPHRASE;
  return process.env.STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET_NETWORK_PASSPHRASE;
};
