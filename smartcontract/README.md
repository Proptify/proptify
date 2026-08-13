# Proptify Smart Contracts

This directory contains the Soroban smart contracts for the Proptify real estate tokenization platform.

## Contracts

### property-token
Core ERC-20 like token contract for fractional property ownership.

**Functions:**
- `init()` - Initialize token with metadata
- `transfer()` - Transfer tokens
- `approve()` - Approve spender
- `transfer_from()` - Transfer on behalf
- `mint()` - Mint tokens (admin)
- `burn()` - Burn tokens (admin)
- `balance_of()` - Get account balance
- `allowance()` - Get approved amount

## Build

```bash
cd property-token
cargo build --target wasm32-unknown-unknown --release
```

## Test

```bash
cd property-token
cargo test
```

## Deploy

```bash
# Generate deployer keypair
soroban keys generate deployer --network testnet
soroban keys fund deployer --network testnet

# Deploy contract
soroban contract deploy \
  --network testnet \
  --source deployer \
  --wasm smartcontract/property-token/target/wasm32-unknown-unknown/release/property_token.wasm
```

## Invoke

```bash
# Initialize token
soroban contract invoke \
  --network testnet \
  --source deployer \
  --id <CONTRACT_ID> \
  -- init \
  --admin <ADMIN_ADDRESS> \
  --name "Lekki Phase 1 Apts" \
  --symbol "LEKKI1" \
  --decimals 8 \
  --total_supply 1000000000 \
  --property_id "prop_1" \
  --location "Lagos, Nigeria" \
  --apy 850
```
