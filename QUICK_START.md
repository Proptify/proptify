# Quick Start for MVP (npm)

Get Proptify running in **15 minutes** with npm only.

## 1. Prerequisites

```bash
# Check versions
node --version   # v20+
npm --version    # 10+
postgres --version  # 12+
soroban --version  # 21+
```

## 2. Clone & Setup

```bash
git clone https://github.com/Proptify/proptify.git
cd proptify
git checkout feat/mvp-implementation
```

## 3. Database

```bash
# Create Postgres user & database
psql postgres -c "CREATE USER proptify WITH PASSWORD 'proptify';"
psql postgres -c "CREATE DATABASE proptify OWNER proptify;"
```

## 4. Install Dependencies

```bash
# Install root, backend, and frontend packages
npm run install-all
```

## 5. Backend Configuration

```bash
# Generate Stellar testnet keypair
soroban keys generate admin --network testnet
soroban keys fund admin --network testnet

# Get the keys
soroban keys show admin --network testnet

# Configure backend
cd backend
cp .env.example .env
# Edit .env and add:
#   ADMIN_SECRET_KEY=S...
#   ADMIN_PUBLIC_KEY=G...
```

## 6. Start Services

```bash
# Terminal 1: Start backend
cd backend
npm install
npm run dev

# Terminal 2: Start frontend (in new terminal)
cd frontend
npm install
npm run dev

# Terminal 3: Test (in new terminal)
curl http://localhost:3001/health
```

## 7. Open App

Go to **http://localhost:3000**
- Click "Connect Wallet"
- Sign with Freighter
- See properties

## 8. Deploy Contract (Optional)

```bash
cd smartcontract/property-token
cargo build --target wasm32-unknown-unknown --release

soroban contract deploy \
  --network testnet \
  --source admin \
  --wasm target/wasm32-unknown-unknown/release/property_token.wasm
```

**Done!** 🎉
