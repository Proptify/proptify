'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WalletConnect } from '../../components/WalletConnect';
import { useStellarWallet } from '../../hooks/useStellarWallet';

export default function AuthPage() {
  const router = useRouter();
  const { isConnected, token } = useStellarWallet();

  useEffect(() => {
    if (isConnected && token) {
      router.push('/properties');
    }
  }, [isConnected, token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <WalletConnect />
      </div>
    </div>
  );
}
