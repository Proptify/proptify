'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  getChallenge: (publicKey: string) =>
    apiFetch('/api/auth/challenge', {
      method: 'POST',
      body: JSON.stringify({ publicKey }),
    }),

  verify: (challenge: string, signature: string) =>
    apiFetch('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ challenge, signature }),
    }),
};

// Properties APIs
export const propertiesAPI = {
  list: () => apiFetch('/api/properties'),

  get: (id: string) => apiFetch(`/api/properties/${id}`),

  getHolders: (id: string) => apiFetch(`/api/properties/${id}/holders`),

  create: (data: any, token: string) =>
    apiFetch('/api/properties', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
};

// Health check
export const healthCheck = () => apiFetch('/health');
