'use client';
import React from 'react';
import { useStellarWallet } from '../hooks/useStellarWallet';

export const Header: React.FC = () => {
  const { publicKey, isConnected, isLoading, error, connect, logout } = useStellarWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-amber-900/20 bg-black/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xl font-bold text-white">Proptify</span>
        </div>

        <nav className="hidden md:flex gap-8">
          <a href="#" className="text-sm text-gray-400 hover:text-amber-500 transition">
            Properties
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-amber-500 transition">
            Portfolio
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-amber-500 transition">
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {error && <span className="text-red-500 text-sm">{error}</span>}
          {isConnected && publicKey ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {publicKey.substring(0, 6)}...{publicKey.substring(-6)}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-black bg-amber-500 rounded-lg hover:bg-amber-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-black bg-amber-500 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
