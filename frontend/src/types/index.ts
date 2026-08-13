export interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  property_type: string;
  total_tokens: number;
  price_per_token: number;
  contract_id: string;
  admin_address: string;
  apy: number;
  funded_percentage: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  stellar_address: string;
  kyc_status: string;
  created_at: string;
}

export interface TokenHolder {
  stellar_address: string;
  token_balance: number;
}

export interface HealthStatus {
  status: string;
  environment: string;
  network: string;
  contracts: Record<string, string>;
}
