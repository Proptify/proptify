# Install dependencies for all workspaces
echo "📦 Installing backend dependencies..."
cd backend && pnpm install && cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && pnpm install && cd ..

echo "✅ All dependencies installed!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL: psql postgres -c \"CREATE USER proptify WITH PASSWORD 'proptify';\""
echo "2. Create database: psql postgres -c \"CREATE DATABASE proptify OWNER proptify;\""
echo "3. Configure backend/.env with Stellar testnet keypair"
echo "4. Start backend: cd backend && pnpm dev"
echo "5. Start frontend: cd frontend && pnpm dev"
