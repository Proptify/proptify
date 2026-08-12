'use client';
import React from 'react';
import { useStellarWallet } from '../hooks/useStellarWallet';

export const WalletConnect: React.FC = () => {
  const { publicKey, isConnected, isLoading, error, connect, login } = useStellarWallet();

  const handleConnect = async () => {
    await connect();
  };

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-6">Sign in with Freighter to start investing in real estate</p>

      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition"
        >
          {isLoading ? 'Connecting...' : '🔗 Connect Freighter Wallet'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-black/50 rounded p-3 border border-amber-500/30">
            <p className="text-xs text-gray-400">Connected Address</p>
            <p className="text-sm font-mono text-amber-500 break-all">{publicKey}</p>
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition"
          >
            {isLoading ? 'Signing in...' : '✓ Sign In & Continue'}
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        Don't have Freighter? <a href="https://freighter.app" target="_blank" className="text-amber-500 hover:underline">Install it here</a>
      </p>
    </div>
  );
};
