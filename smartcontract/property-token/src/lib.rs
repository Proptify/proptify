#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, String};

/// Token metadata stored in contract data
#[contracttype]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
    pub admin: Address,
}

/// Token state
#[contracttype]
pub struct TokenState {
    pub total_supply: i128,
    pub metadata: TokenMetadata,
}

/// Property metadata associated with token
#[contracttype]
pub struct PropertyMetadata {
    pub property_id: String,
    pub location: String,
    pub apy: u32,
}

const BALANCE_KEY: &str = "balance";
const ALLOWANCE_KEY: &str = "allow";
const STATE_KEY: &str = "state";
const PROPERTY_KEY: &str = "property";

#[contract]
pub struct PropertyToken;

#[contractimpl]
impl PropertyToken {
    /// Initialize token with metadata
    /// Returns error if already initialized
    pub fn init(
        env: Env,
        admin: Address,
        name: String,
        symbol: String,
        decimals: u32,
        total_supply: i128,
        property_id: String,
        location: String,
        apy: u32,
    ) -> Result<(), Symbol> {
        // Check if already initialized
        if env.storage().persistent().has(&Symbol::new(&env, STATE_KEY)) {
            return Err(Symbol::new(&env, "already_initialized"));
        }

        // Validate inputs
        if total_supply <= 0 {
            return Err(Symbol::new(&env, "invalid_supply"));
        }
        if decimals > 18 {
            return Err(Symbol::new(&env, "invalid_decimals"));
        }

        // Store token metadata
        let metadata = TokenMetadata {
            name,
            symbol,
            decimals,
            admin: admin.clone(),
        };

        let state = TokenState {
            total_supply,
            metadata,
        };

        env.storage()
            .persistent()
            .set(&Symbol::new(&env, STATE_KEY), &state);

        // Store property metadata
        let property = PropertyMetadata {
            property_id,
            location,
            apy,
        };

        env.storage()
            .persistent()
            .set(&Symbol::new(&env, PROPERTY_KEY), &property);

        // Mint initial supply to admin
        let balance_key = Self::balance_key(&env, &admin);
        env.storage()
            .persistent()
            .set(&balance_key, &total_supply);

        Ok(())
    }

    /// Get token name
    pub fn name(env: Env) -> String {
        let state: TokenState = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, STATE_KEY))
            .unwrap()
            .unwrap();
        state.metadata.name
    }

    /// Get token symbol
    pub fn symbol(env: Env) -> String {
        let state: TokenState = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, STATE_KEY))
            .unwrap()
            .unwrap();
        state.metadata.symbol
    }

    /// Get token decimals
    pub fn decimals(env: Env) -> u32 {
        let state: TokenState = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, STATE_KEY))
            .unwrap()
            .unwrap();
        state.metadata.decimals
    }

    /// Get total token supply
    pub fn total_supply(env: Env) -> i128 {
        let state: TokenState = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, STATE_KEY))
            .unwrap()
            .unwrap();
        state.total_supply
    }

    /// Get balance of an account
    pub fn balance_of(env: Env, account: Address) -> i128 {
        let key = Self::balance_key(&env, &account);
        env.storage()
            .persistent()
            .get::<_, i128>(&key)
            .unwrap_or(Ok(0))
            .unwrap_or(0)
    }

    /// Transfer tokens from caller to recipient
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<bool, Symbol> {
        from.require_auth();

        if amount <= 0 {
            return Err(Symbol::new(&env, "invalid_amount"));
        }

        let from_balance = Self::balance_of(env.clone(), from.clone());
        if from_balance < amount {
            return Err(Symbol::new(&env, "insufficient_balance"));
        }

        // Deduct from sender
        let from_key = Self::balance_key(&env, &from);
        env.storage()
            .persistent()
            .set(&from_key, &(from_balance - amount));

        // Add to recipient
        let to_balance = Self::balance_of(env.clone(), to.clone());
        let to_key = Self::balance_key(&env, &to);
        env.storage()
            .persistent()
            .set(&to_key, &(to_balance + amount));

        Ok(true)
    }

    /// Approve spender to transfer tokens on behalf of owner
    pub fn approve(env: Env, owner: Address, spender: Address, amount: i128) -> Result<bool, Symbol> {
        owner.require_auth();

        if amount < 0 {
            return Err(Symbol::new(&env, "invalid_amount"));
        }

        let key = Self::allowance_key(&env, &owner, &spender);
        env.storage().persistent().set(&key, &amount);

        Ok(true)
    }

    /// Get allowance of spender from owner
    pub fn allowance(env: Env, owner: Address, spender: Address) -> i128 {
        let key = Self::allowance_key(&env, &owner, &spender);
        env.storage()
            .persistent()
            .get::<_, i128>(&key)
            .unwrap_or(Ok(0))
            .unwrap_or(0)
    }

    /// Transfer tokens on behalf of owner (requires approval)
    pub fn transfer_from(
        env: Env,
        spender: Address,
        from: Address,
        to: Address,
        amount: i128,
    ) -> Result<bool, Symbol> {
        spender.require_auth();

        if amount <= 0 {
            return Err(Symbol::new(&env, "invalid_amount"));
        }

        // Check allowance
        let allowance = Self::allowance(env.clone(), from.clone(), spender.clone());
        if allowance < amount {
            return Err(Symbol::new(&env, "insufficient_allowance"));
        }

        // Perform transfer
        Self::transfer(env.clone(), from.clone(), to, amount)?;

        // Decrease allowance
        let key = Self::allowance_key(&env, &from, &spender);
        env.storage()
            .persistent()
            .set(&key, &(allowance - amount));

        Ok(true)
    }

    /// Mint tokens (admin only)
    pub fn mint(env: Env, to: Address, amount: i128) -> Result<bool, Symbol> {
        // Verify admin
        let state: TokenState = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, STATE_KEY))
            .unwrap()
            .unwrap();

        state.metadata.admin.require_auth();

        if amount <= 0 {
            return Err(Symbol::new(&env, "invalid_amount"));
        }

        // Add to recipient
        let balance = Self::balance_of(env.clone(), to.clone());
        let key = Self::balance_key(&env, &to);
        env.storage()
            .persistent()
            .set(&key, &(balance + amount));

        // Increase total supply
        let mut new_state = state;
        new_state.total_supply += amount;
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, STATE_KEY), &new_state);

        Ok(true)
    }

    /// Burn tokens (admin only)
    pub fn burn(env: Env, from: Address, amount: i128) -> Result<bool, Symbol> {
        // Verify admin
        let state: TokenState = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, STATE_KEY))
            .unwrap()
            .unwrap();

        state.metadata.admin.require_auth();

        if amount <= 0 {
            return Err(Symbol::new(&env, "invalid_amount"));
        }

        let balance = Self::balance_of(env.clone(), from.clone());
        if balance < amount {
            return Err(Symbol::new(&env, "insufficient_balance"));
        }

        // Deduct from account
        let key = Self::balance_key(&env, &from);
        env.storage()
            .persistent()
            .set(&key, &(balance - amount));

        // Decrease total supply
        let mut new_state = state;
        new_state.total_supply -= amount;
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, STATE_KEY), &new_state);

        Ok(true)
    }

    /// Get property metadata
    pub fn property(env: Env) -> PropertyMetadata {
        env.storage()
            .persistent()
            .get(&Symbol::new(&env, PROPERTY_KEY))
            .unwrap()
            .unwrap()
    }
}

// Helper functions
impl PropertyToken {
    fn balance_key(env: &Env, account: &Address) -> Symbol {
        let mut key = String::new(env);
        key.append(&String::from_str(env, BALANCE_KEY));
        key.append(&account.to_string());
        Symbol::new(env, key.as_str())
    }

    fn allowance_key(env: &Env, owner: &Address, spender: &Address) -> Symbol {
        let mut key = String::new(env);
        key.append(&String::from_str(env, ALLOWANCE_KEY));
        key.append(&owner.to_string());
        key.append(&spender.to_string());
        Symbol::new(env, key.as_str())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as TestAddress;
    use soroban_sdk::testutils::Env as TestEnv;

    #[test]
    fn test_init_and_balance() {
        let env = TestEnv::default();
        let admin = TestAddress::random(&env);
        let supply = 1_000_000_000i128;

        PropertyToken::init(
            env.clone(),
            admin.clone(),
            String::from_str(&env, "Property Token"),
            String::from_str(&env, "PROP"),
            8,
            supply,
            String::from_str(&env, "prop_1"),
            String::from_str(&env, "Lagos, Nigeria"),
            850,
        )
        .unwrap();

        assert_eq!(PropertyToken::balance_of(env.clone(), admin.clone()), supply);
        assert_eq!(PropertyToken::total_supply(env), supply);
    }

    #[test]
    fn test_transfer() {
        let env = TestEnv::default();
        let admin = TestAddress::random(&env);
        let user = TestAddress::random(&env);
        let supply = 1_000_000_000i128;

        PropertyToken::init(
            env.clone(),
            admin.clone(),
            String::from_str(&env, "Property Token"),
            String::from_str(&env, "PROP"),
            8,
            supply,
            String::from_str(&env, "prop_1"),
            String::from_str(&env, "Lagos, Nigeria"),
            850,
        )
        .unwrap();

        let amount = 100_000_000i128;
        PropertyToken::transfer(env.clone(), admin.clone(), user.clone(), amount).unwrap();

        assert_eq!(PropertyToken::balance_of(env.clone(), user), amount);
        assert_eq!(
            PropertyToken::balance_of(env, admin),
            supply - amount
        );
    }
}
