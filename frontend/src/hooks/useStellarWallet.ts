'use client';
import { useState, useCallback, useEffect } from 'react';
import { stellarClient } from '../lib/stellar';
import { authAPI } from '../lib/api';

interface WalletState {
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export const useStellarWallet = () => {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    isConnected: false,
    isLoading: false,
    error: null,
    token: null,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('proptify_auth');
    if (saved) {
      try {
        const { publicKey, token } = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          publicKey,
          isConnected: true,
          token,
        }));
      } catch (e) {
        localStorage.removeItem('proptify_auth');
      }
    }
  }, []);

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const publicKey = await stellarClient.connectWallet();
      setState(prev => ({
        ...prev,
        publicKey,
        isConnected: true,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message,
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async () => {
    if (!state.publicKey) {
      setState(prev => ({
        ...prev,
        error: 'No wallet connected',
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Get challenge
      const challengeResponse: any = await authAPI.getChallenge(state.publicKey);
      const challengeXdr = challengeResponse.challenge;

      // Sign challenge
      const signedXdr = await stellarClient.signTransaction(challengeXdr);

      // Verify and get token
      const verifyResponse: any = await authAPI.verify(challengeXdr, signedXdr);
      const token = verifyResponse.token;

      // Save to localStorage
      localStorage.setItem(
        'proptify_auth',
        JSON.stringify({ publicKey: state.publicKey, token })
      );

      setState(prev => ({
        ...prev,
        token,
        isConnected: true,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message,
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.publicKey]);

  const logout = useCallback(() => {
    localStorage.removeItem('proptify_auth');
    setState({
      publicKey: null,
      isConnected: false,
      isLoading: false,
      error: null,
      token: null,
    });
  }, []);

  return {
    ...state,
    connect,
    login,
    logout,
  };
};
