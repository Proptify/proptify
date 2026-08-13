#!/usr/bin/env bash

# Build and deploy Proptify smart contracts
# Usage: ./deploy.sh [local|testnet|mainnet]

set -e

NETWORK=${1:-testnet}

echo "🏗️  Building contracts for $NETWORK..."

# Build property-token
echo "📦 Building property-token..."
cd smartcontract/property-token
soroban contract build
cd ../..

echo "✅ Build complete!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy contracts: soroban contract deploy --network $NETWORK --source admin"
echo "2. Save contract IDs to backend/.env"
echo ""
echo "Example commands:"
echo "  soroban contract deploy --network $NETWORK --source admin --wasm smartcontract/property-token/target/wasm32-unknown-unknown/release/property_token.wasm"
