#!/usr/bin/env bash

# Setup script for Proptify MVP
# This script initializes the project for development

set -e

echo "🚀 Proptify MVP Setup"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm not found. Install with: npm install -g pnpm"
  exit 1
fi

if ! command -v psql &> /dev/null; then
  echo "⚠️  PostgreSQL not found. Install from https://www.postgresql.org/download"
  echo "   macOS: brew install postgresql@15"
  echo "   Ubuntu: sudo apt-get install postgresql"
  exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1️⃣  Set up database:"
echo "   psql postgres -c \"CREATE USER proptify WITH PASSWORD 'proptify';\""
echo "   psql postgres -c \"CREATE DATABASE proptify OWNER proptify;\""
echo ""
echo "2️⃣  Generate Stellar testnet keypair:"
echo "   soroban keys generate admin --network testnet"
echo "   soroban keys fund admin --network testnet"
echo ""
echo "3️⃣  Configure backend/.env:"
echo "   cd backend"
echo "   cp .env.example .env"
echo "   # Add ADMIN_SECRET_KEY and ADMIN_PUBLIC_KEY from step 2"
echo ""
echo "4️⃣  Start backend:"
echo "   cd backend && pnpm dev"
echo ""
echo "5️⃣  Start frontend (in new terminal):"
echo "   cd frontend && pnpm dev"
echo ""
echo "6️⃣  Open app at http://localhost:3000"
echo ""
echo "🎉 Happy coding!"
