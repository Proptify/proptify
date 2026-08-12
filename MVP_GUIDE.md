# Proptify MVP Implementation Guide

## Overview

This branch contains a **fully functional MVP** with:
- ✅ **Smart Contract**: property-token (init, transfer, approve, mint, burn)
- ✅ **Backend API**: Express + PostgreSQL + Stellar SDK
- ✅ **Frontend**: Next.js 14 with Freighter wallet integration
- ✅ **Database**: Properties, users, portfolio tracking
- ✅ **Authentication**: SEP-10 wallet signing

## Quick Start (5 minutes)

### Prerequisites

```bash
# Install global dependencies
node --version  # v20+
npm install -g pnpm
npm install -g soroban-cli  # For contract deployment

# Install Postgres locally (for database)
# macOS: brew install postgresql@15
# Ubuntu: sudo apt-get install postgresql
# Windows: https://www.postgresql.org/download/windows/
```

### 1. Clone & Install

```bash
git clone https://github.com/Proptify/proptify.git
cd proptify
git checkout feat/mvp-implementation

# Install all dependencies
pnpm install
```

### 2. Set up PostgreSQL Database

```bash
# Start PostgreSQL (if not running)
postgres -D /usr/local/var/postgres  # macOS
sudo service postgresql start        # Linux

# Create database and user
psql postgres -c "CREATE USER proptify WITH PASSWORD 'proptify';"
psql postgres -c "CREATE DATABASE proptify OWNER proptify;"

# Verify connection
psql -U proptify -d proptify -c "SELECT NOW();"
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env

# Edit .env and add your Stellar testnet keypair
# Generate one with: soroban keys generate admin --network testnet
# Fund it with: soroban keys fund admin --network testnet
```

**Key environment variables:**
```env
ADMIN_SECRET_KEY=S...  # Your testnet keypair secret
ADMIN_PUBLIC_KEY=G...  # Your testnet public key
DATABASE_URL=postgresql://proptify:proptify@localhost:5432/proptify
STELLAR_NETWORK=testnet
```

### 4. Start Backend

```bash
# Terminal 1: Backend API
cd backend
pnpm install
pnpm dev

# Should output:
# ✓ Stellar config loaded for testnet
# ✓ Database connected
# 🚀 Server running on http://localhost:3001
```

### 5. Configure Frontend

```bash
cd frontend
cp .env.example frontend/.env.local

# .env.local should have:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

### 6. Start Frontend

```bash
# Terminal 2: Frontend
cd frontend
pnpm install
pnpm dev

# Open http://localhost:3000
```

### 7. Test Health Check

```bash
# Terminal 3: Verify backend is running
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "ok",
#   "network": "testnet",
#   "contracts": { "propertyToken": "NOT_SET", ... }
# }
```

## Deploy Smart Contract

### Build Contract

```bash
cd smartcontract/property-token
cargo build --target wasm32-unknown-unknown --release
```

### Deploy to Testnet

```bash
# Generate keypair
soroban keys generate admin --network testnet
soroban keys fund admin --network testnet

# Deploy
soroban contract deploy \
  --network testnet \
  --source admin \
  --wasm smartcontract/property-token/target/wasm32-unknown-unknown/release/property_token.wasm

# Copy the contract ID (starts with C) and add to backend/.env
CONTRACT_PROPERTY_TOKEN=C...
```

### Initialize Token

```bash
soroban contract invoke \
  --network testnet \
  --source admin \
  --id CBSXVCHVRXN2HCHEV6WYNHAWK6DYCU72LAAVTP5JJLWA2YYKCV6DXV \
  -- init \
  --admin GBRPYHIL2CI3WHZSRXUBK6OUN7ZYJIL7YGXN5ABJLAKQL3NNZKBTFX4 \
  --name "Lekki Phase 1 Apts" \
  --symbol "LEKKI1" \
  --decimals 8 \
  --total_supply 1000000000 \
  --property_id "prop_1" \
  --location "Lagos, Nigeria" \
  --apy 850
```

## Create Sample Property (via API)

```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lekki Phase 1 Apartments",
    "location": "Lagos, Nigeria",
    "description": "Modern residential complex with 200 units",
    "property_type": "Residential",
    "total_tokens": 1000000000,
    "price_per_token": 0.50,
    "apy": 8.4,
    "contract_id": "CBSXVCHVRXN2HCHEV6WYNHAWK6DYCU72LAAVTP5JJLWA2YYKCV6DXV"
  }'
```

## Test User Flow

1. **Open frontend** → http://localhost:3000
2. **Click "Connect Wallet"** → Freighter wallet popup
3. **Sign in** → Creates user in database
4. **View properties** → http://localhost:3000/properties
5. **See properties** → Fetched from PostgreSQL

## Project Structure

```
proptify/
├── backend/
│   ├── src/
│   │   ├── main.ts              # Express entry point
│   │   ├── config/stellar.ts    # Stellar SDK config
│   │   ├── routes/              # API endpoints
│   │   │   ├── health.ts
│   │   │   ├── properties.ts
│   │   │   └── auth.ts
│   │   ├── services/            # Business logic (WIP)
│   │   ├── db/db.ts             # PostgreSQL pool + migrations
│   │   └── utils/logger.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── globals.css
│   │   │   ├── auth/page.tsx    # Login page
│   │   │   └── properties/page.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx       # Nav + wallet button
│   │   │   ├── PropertyCard.tsx # Property list item
│   │   │   └── WalletConnect.tsx
│   │   ├── hooks/useStellarWallet.ts
│   │   ├── lib/
│   │   │   ├── stellar.ts       # Freighter integration
│   │   │   └── api.ts           # API client
│   │   └── types/index.ts
│   ├── package.json
│   └── tailwind.config.ts
│
├── smartcontract/
│   ├── property-token/
│   │   ├── src/lib.rs           # Core contract
│   │   └── Cargo.toml
│   ├── deploy.sh
│   └── README.md
```

## What's Implemented ✅

### Smart Contract
- [x] Token initialization
- [x] Balance tracking
- [x] Transfer function
- [x] Allowance/approve
- [x] Admin mint/burn
- [x] Property metadata

### Backend
- [x] Express server with CORS
- [x] Stellar SDK integration
- [x] PostgreSQL connection + auto-migrations
- [x] Health check endpoint
- [x] Properties CRUD
- [x] SEP-10 auth challenge/verify
- [x] User management
- [x] Portfolio tracking schema

### Frontend
- [x] Next.js 14 setup
- [x] Freighter wallet integration
- [x] SEP-10 login flow
- [x] Property listing page
- [x] API client hooks
- [x] Responsive design with Tailwind
- [x] Header with wallet connect

## What's NOT Yet (Phase 2)

- [ ] Rent distribution contract
- [ ] Installment sale contract
- [ ] Token purchase flow (frontend)
- [ ] Portfolio management page
- [ ] Real contract invocations
- [ ] KYC/compliance module
- [ ] Advanced analytics

## Common Issues

### "Database connection failed"
```bash
# Check Postgres is running
psql -U proptify -d proptify -c "SELECT NOW();"

# Restart if needed
sudo service postgresql restart
```

### "Admin keypair not found"
```bash
soroban keys generate admin --network testnet
soroban keys fund admin --network testnet
# Copy to backend/.env
```

### "Freighter not detected"
- Install Freighter: https://freighter.app
- Must be on http://localhost:3000 (not https)

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

## Next Steps

1. **Implement token purchase** → Wire contract calls to frontend
2. **Add rent distributor contract** → Monthly payments
3. **Build portfolio dashboard** → User holdings
4. **Add KYC flow** → Compliance checks
5. **Deploy to production** → Heroku/Vercel

## Support

- **Discord**: https://discord.gg/proptify
- **Docs**: https://docs.proptify.dev
- **GitHub Issues**: https://github.com/Proptify/proptify/issues
