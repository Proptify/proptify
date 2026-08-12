# Quick Start for MVP

Get Proptify running in **15 minutes**.

## 1. Prerequisites

```bash
# Check versions
node --version   # v20+
postgres --version  # 12+
soroban --version  # 21+
```

## 2. Clone & Setup

```bash
git clone https://github.com/Proptify/proptify.git
cd proptify
git checkout feat/mvp-implementation
pnpm install
```

## 3. Database

```bash
# Create Postgres user & database
psql postgres -c "CREATE USER proptify WITH PASSWORD 'proptify';"
psql postgres -c "CREATE DATABASE proptify OWNER proptify;"
```

## 4. Backend (.env)

```bash
cd backend
cp .env.example .env

# Generate and fund Stellar testnet keypair
soroban keys generate admin --network testnet
soroban keys fund admin --network testnet

# Get the keys and add to .env
soroban keys show admin --network testnet
```

## 5. Start Services

```bash
# Terminal 1: Backend
cd backend && pnpm dev

# Terminal 2: Frontend  
cd frontend && pnpm dev

# Terminal 3: Test
curl http://localhost:3001/health
```

## 6. Open App

Go to **http://localhost:3000**
- Click "Connect Wallet"
- Sign with Freighter
- See properties

## 7. Deploy Contract (Optional)

```bash
cd smartcontract/property-token
cargo build --target wasm32-unknown-unknown --release

soroban contract deploy \
  --network testnet \
  --source admin \
  --wasm target/wasm32-unknown-unknown/release/property_token.wasm
```

**Done!** 🎉
