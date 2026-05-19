# Proptify

> Open-source real estate infrastructure for emerging markets, built on Stellar and Soroban.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban-purple)](https://stellar.org/soroban)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Contributors](https://img.shields.io/github/contributors/proptify/proptify)](https://github.com/proptify/proptify/graphs/contributors)

---

## What is Proptify?

Proptify is an open-source suite of Soroban smart contracts, a REST API backend, and a Next.js frontend that together form the infrastructure layer for real estate tokenization in emerging markets.

It is **not** a platform. It is the **plumbing** that platforms, cooperatives, fintech startups, NGOs, and real estate developers build on top of.

**The problem it solves:**

In markets like Nigeria, Ghana, Kenya, Indonesia, and across Southeast Asia, property ownership is the primary vehicle for wealth building. Yet the infrastructure for transparent, trustless, and inclusive property ownership is almost entirely absent:

- Land registries are opaque, paper-based, and frequently corrupt
- Mortgage access for low and middle-income earners is near zero
- Diaspora communities wanting to co-invest back home with family have no safe tooling
- Informal installment purchases ("paying bit by bit") have no enforceable on-chain mechanism
- Cooperative property ownership (family land, group investments) has no transparent ledger

Proptify solves all of the above with open-source, composable, auditable smart contracts on Stellar.

**Who uses Proptify?**

| User | How they use it |
|------|----------------|
| Real estate developers | Issue fractional property tokens to raise capital from retail investors |
| Family groups | Co-own property with transparent on-chain shares and automatic rent splits |
| Diaspora investors | Buy fractional shares of property back home in USDC |
| Cooperative societies | Pool savings to purchase and manage property together |
| Fintech startups | Build property investment products on top of Proptify contracts |
| NGOs | Issue transparent land rights to beneficiaries in underserved communities |
| Local governments | Run a tamper-proof title registry without expensive legacy systems |

---

## Architecture Overview

Proptify is organised as a monorepo with four distinct workspaces:

```
proptify/
├── contracts/                  # Soroban smart contracts (Rust)
│   ├── property-token/         # Fractional ownership token (SEP-compliant)
│   ├── rent-distributor/       # Automatic rent collection and distribution
│   ├── installment-sale/       # Milestone-based installment purchase contracts
│   ├── title-registry/         # Immutable on-chain property title registry
│   ├── co-ownership-dao/       # Governance and voting for co-owners
│   ├── compliance/             # KYC/AML hooks and jurisdiction rules
│   ├── oracle/                 # Price feeds and external data (Reflector integration)
│   └── escrow/                 # General-purpose escrow for property transactions
│
├── backend/                    # Node.js / Express REST API
│   └── src/
│       ├── routes/             # API route handlers
│       ├── services/           # Business logic and contract interaction
│       ├── middleware/         # Auth, validation, error handling
│       └── utils/              # Helpers, Stellar SDK wrappers
│
├── frontend/                   # Next.js 14 + Tailwind CSS
│   └── src/
│       ├── app/                # App router pages
│       ├── components/         # Reusable UI components
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # API clients, contract bindings
│       └── types/              # Shared TypeScript types
│
├── sdk/                        # JavaScript/TypeScript SDK (published to npm)
│   └── src/
│
├── docs/                       # Documentation (deployed to docs.proptify.dev)
├── scripts/                    # Deployment, migration, and utility scripts
└── .github/                    # CI/CD workflows and issue templates
```

---

## Smart Contracts

Each contract is isolated in its own directory with its own `Cargo.toml`. This separation prevents merge conflicts and enforces single responsibility.

| Contract | Description | Status |
|----------|-------------|--------|
| `property-token` | Issues and manages fractional property tokens. Implements a custom token standard with compliance hooks (whitelist, transfer restrictions, KYC checks). | 🚧 In Progress |
| `rent-distributor` | Accepts rent payments in XLM or USDC, calculates each token holder's share, and distributes automatically. Handles grace periods and late fees. | 🚧 In Progress |
| `installment-sale` | A buyer and seller agree on a price and payment schedule. The buyer pays installments on-chain; ownership transfers automatically at final payment. Default triggers a liquidation process. | 📋 Planned |
| `title-registry` | An immutable registry of property metadata and ownership history. Supports government-issued title deeds as verifiable credentials. | 📋 Planned |
| `co-ownership-dao` | Co-owners vote on property decisions: maintenance approvals, sale proposals, rent changes. Voting weight is proportional to token holdings. | 📋 Planned |
| `compliance` | Jurisdiction-specific KYC/AML rules. Pluggable per-country compliance modules. Nigeria, Ghana, and Kenya included first. | 📋 Planned |
| `oracle` | Integrates with Reflector for XLM/USD price feeds and property valuation data. | 📋 Planned |
| `escrow` | Holds funds during property transactions until conditions are met. Used by installment-sale and co-ownership-dao. | 📋 Planned |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart contracts | Rust, Soroban SDK |
| Blockchain | Stellar (Mainnet + Testnet) |
| Backend | Node.js, Express, TypeScript |
| Frontend | Next.js 14, Tailwind CSS, shadcn/ui |
| Wallet integration | Freighter, xBull, WalletConnect |
| Stablecoin | USDC on Stellar, XLM |
| Oracle | Reflector Network |
| Auth | Stellar Web Auth (SEP-10) |
| Storage | PostgreSQL (off-chain metadata), IPFS (documents) |
| Testing (contracts) | Soroban test framework, cargo test |
| Testing (frontend/backend) | Jest, Playwright |
| CI/CD | GitHub Actions |
| Package manager | pnpm (workspaces) |

---

## Getting Started

### Prerequisites

Make sure you have the following installed before proceeding:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20.x | [nodejs.org](https://nodejs.org) |
| pnpm | ≥ 9.x | `npm install -g pnpm` |
| Rust | stable (≥ 1.79) | [rustup.rs](https://rustup.rs) |
| Soroban CLI | ≥ 21.x | `cargo install --locked soroban-cli` |
| Docker | ≥ 24.x | [docker.com](https://docker.com) |
| Git | ≥ 2.40 | [git-scm.com](https://git-scm.com) |

### 1. Clone the repository

```bash
git clone https://github.com/proptify/proptify.git
cd proptify
```

### 2. Install all dependencies

```bash
pnpm install
```

This installs dependencies for all workspaces (frontend, backend, sdk) in one command.

### 3. Set up environment variables

Copy the example environment files for each workspace:

```bash
# Root
cp .env.example .env

# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

Open each `.env` file and fill in the required values. See [Environment Variables](#environment-variables) below for a full reference.

### 4. Start local services with Docker

Proptify uses Docker Compose to run PostgreSQL and a local Stellar/Soroban node for development:

```bash
docker compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Stellar Quickstart (local testnet) on `localhost:8000`

Wait for the Stellar node to be ready (usually 30–60 seconds):

```bash
docker compose logs -f stellar
# Look for: "Stellar Core is ready"
```

### 5. Run database migrations

```bash
pnpm --filter backend db:migrate
```

### 6. Deploy contracts to local testnet

```bash
# Build all contracts
pnpm contracts:build

# Deploy to local Stellar testnet
pnpm contracts:deploy:local
```

This will output contract IDs. They are automatically written to `contracts/.contract-ids.local.json`, which the backend reads at startup.

### 7. Start the development servers

In separate terminals (or use a tool like `tmux`):

```bash
# Terminal 1: Backend API (http://localhost:3001)
pnpm --filter backend dev

# Terminal 2: Frontend (http://localhost:3000)
pnpm --filter frontend dev
```

Or run both at once:

```bash
pnpm dev
```

### 8. Verify everything is running

```bash
# Check backend health
curl http://localhost:3001/health

# Expected response:
# { "status": "ok", "network": "local", "contracts": { "propertyToken": "C...", ... } }
```

Open your browser at `http://localhost:3000` to see the frontend.

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Stellar Network
STELLAR_NETWORK=testnet              # local | testnet | mainnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Admin keypair (generate with: soroban keys generate admin)
ADMIN_SECRET_KEY=S...

# Contract IDs (auto-populated after deploy, or set manually for testnet)
CONTRACT_PROPERTY_TOKEN=C...
CONTRACT_RENT_DISTRIBUTOR=C...
CONTRACT_INSTALLMENT_SALE=C...
CONTRACT_TITLE_REGISTRY=C...
CONTRACT_CO_OWNERSHIP_DAO=C...
CONTRACT_COMPLIANCE=C...
CONTRACT_ORACLE=C...
CONTRACT_ESCROW=C...

# Database
DATABASE_URL=postgresql://proptify:proptify@localhost:5432/proptify

# IPFS (for storing property documents)
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_API_KEY=
IPFS_API_SECRET=

# Auth
JWT_SECRET=your-secret-here
SESSION_SECRET=your-session-secret-here

# Server
PORT=3001
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

---

## Running Tests

### Smart contract tests

```bash
# Run tests for all contracts
pnpm contracts:test

# Run tests for a specific contract
cd contracts/property-token
cargo test

# Run tests with output
cargo test -- --nocapture
```

### Backend tests

```bash
pnpm --filter backend test

# Watch mode
pnpm --filter backend test:watch

# Coverage
pnpm --filter backend test:coverage
```

### Frontend tests

```bash
# Unit tests (Jest)
pnpm --filter frontend test

# End-to-end tests (Playwright)
pnpm --filter frontend test:e2e
```

---

## Deploying to Stellar Testnet

```bash
# Generate a testnet keypair and fund it
soroban keys generate deployer --network testnet
soroban keys fund deployer --network testnet

# Build contracts
pnpm contracts:build

# Deploy all contracts to testnet
STELLAR_NETWORK=testnet pnpm contracts:deploy

# Contract IDs are written to contracts/.contract-ids.testnet.json
```

---

## Project Roadmap

### Phase 1 — Foundation (Q3 2025)
- [x] Monorepo setup
- [ ] `property-token` contract — core implementation
- [ ] `title-registry` contract — core implementation
- [ ] `compliance` contract — Nigeria module
- [ ] Backend REST API — properties CRUD, wallet auth
- [ ] Frontend — property listing page, wallet connect

### Phase 2 — Transactions (Q4 2025)
- [ ] `rent-distributor` contract
- [ ] `installment-sale` contract
- [ ] `escrow` contract
- [ ] Backend — payment processing, transaction history
- [ ] Frontend — property detail page, buy/invest flow

### Phase 3 — Governance & Scale (Q1 2026)
- [ ] `co-ownership-dao` contract
- [ ] `oracle` contract
- [ ] SDK published to npm
- [ ] Ghana and Kenya compliance modules
- [ ] Mobile-responsive UI improvements
- [ ] Docs site

### Phase 4 — Ecosystem (Q2 2026)
- [ ] Flutter SDK (mobile)
- [ ] Indonesia, South Africa compliance modules
- [ ] Third-party developer portal
- [ ] Audit by a Soroban security firm

---

## Contributing

We welcome contributions from everyone. Proptify is built by the community, for the community.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

If you're looking for where to start, check [issues labelled `good first issue`](https://github.com/proptify/proptify/issues?q=is%3Aissue+label%3A%22good+first+issue%22).

---

## Community

- **Discord:** [discord.gg/proptify](https://discord.gg/proptify)
- **Twitter/X:** [@proptify](https://twitter.com/proptify)
- **Discussions:** [GitHub Discussions](https://github.com/proptify/proptify/discussions)

---

## License

MIT — see [LICENSE](LICENSE).

Proptify is free software. You can use it, fork it, deploy it, and build commercial products on top of it. The only requirement is that the core infrastructure remains open source under MIT.