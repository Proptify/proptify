'use client';
import { Keypair, Networks, TransactionBuilder } from 'stellar-sdk';

export class StellarClient {
  private rpcUrl: string;
  private horizonUrl: string;
  private networkPassphrase: string;

  constructor(
    rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
    horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org'
  ) {
    this.rpcUrl = rpcUrl;
    this.horizonUrl = horizonUrl;
    this.networkPassphrase = Networks.TESTNET_NETWORK_PASSPHRASE;
  }

  /**
   * Check if Freighter wallet is installed
   */
  isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && (window as any).freighter !== undefined;
  }

  /**
   * Connect to Freighter wallet and get public key
   */
  async connectWallet(): Promise<string> {
    if (!this.isWalletAvailable()) {
      throw new Error('Freighter wallet not installed. Visit https://freighter.app');
    }

    try {
      const publicKey = await (window as any).freighter.getPublicKey();
      if (!publicKey) {
        throw new Error('No public key returned from wallet');
      }
      return publicKey;
    } catch (err) {
      throw new Error(`Wallet connection failed: ${err}`);
    }
  }

  /**
   * Sign a transaction with wallet
   */
  async signTransaction(xdr: string): Promise<string> {
    if (!this.isWalletAvailable()) {
      throw new Error('Freighter wallet not available');
    }

    try {
      const signed = await (window as any).freighter.signTransaction(
        xdr,
        this.networkPassphrase
      );
      return signed;
    } catch (err) {
      throw new Error(`Transaction signing failed: ${err}`);
    }
  }

  /**
   * Submit a signed transaction to the network
   */
  async submitTransaction(xdr: string): Promise<any> {
    try {
      const response = await fetch(`${this.horizonUrl}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `tx=${encodeURIComponent(xdr)}`,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Transaction submission failed');
      }

      return await response.json();
    } catch (err) {
      throw new Error(`Submit transaction failed: ${err}`);
    }
  }
}

export const stellarClient = new StellarClient();
