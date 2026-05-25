use soroban_sdk::{symbol_short, Address, Env, String, Symbol};

use crate::PropertyMetadata;

// Persistent storage survives state archival and holds canonical property-level
// records for the deployed property-token instance.
pub const ADMIN: Symbol = symbol_short!("ADMIN");
pub const PROPERTY_ID: Symbol = symbol_short!("PROP_ID");
pub const TOTAL_SUPPLY: Symbol = symbol_short!("TOTAL_SUP");
pub const PROPERTY_METADATA: Symbol = symbol_short!("META");
pub const COMPLIANCE_CONTRACT: Symbol = symbol_short!("COMPLY");

// Instance storage is cheaper for frequently accessed token-accounting state.
pub const BALANCE: Symbol = symbol_short!("BALANCE");
pub const ALLOWANCE: Symbol = symbol_short!("ALLOWANCE");
pub const WHITELIST: Symbol = symbol_short!("WLIST");

fn balance_key(account: &Address) -> (Symbol, Address) {
    (BALANCE, account.clone())
}

fn allowance_key(owner: &Address, spender: &Address) -> (Symbol, Address, Address) {
    (ALLOWANCE, owner.clone(), spender.clone())
}

fn whitelist_key(account: &Address) -> (Symbol, Address) {
    (WHITELIST, account.clone())
}

pub fn read_admin(env: &Env) -> Option<Address> {
    env.storage().persistent().get(&ADMIN)
}

pub fn write_admin(env: &Env, admin: &Address) {
    env.storage().persistent().set(&ADMIN, admin);
}

pub fn read_property_id(env: &Env) -> Option<String> {
    env.storage().persistent().get(&PROPERTY_ID)
}

pub fn write_property_id(env: &Env, property_id: &String) {
    env.storage().persistent().set(&PROPERTY_ID, property_id);
}

pub fn read_total_supply(env: &Env) -> i128 {
    env.storage().persistent().get(&TOTAL_SUPPLY).unwrap_or(0)
}

pub fn write_total_supply(env: &Env, total_supply: i128) {
    env.storage().persistent().set(&TOTAL_SUPPLY, &total_supply);
}

pub fn read_property_metadata(env: &Env) -> Option<PropertyMetadata> {
    env.storage().persistent().get(&PROPERTY_METADATA)
}

pub fn write_property_metadata(env: &Env, metadata: &PropertyMetadata) {
    env.storage().persistent().set(&PROPERTY_METADATA, metadata);
}

pub fn read_compliance_contract(env: &Env) -> Option<Address> {
    env.storage().persistent().get(&COMPLIANCE_CONTRACT)
}

pub fn write_compliance_contract(env: &Env, compliance_contract: &Address) {
    env.storage()
        .persistent()
        .set(&COMPLIANCE_CONTRACT, compliance_contract);
}

pub fn read_balance(env: &Env, account: &Address) -> i128 {
    env.storage()
        .instance()
        .get(&balance_key(account))
        .unwrap_or(0)
}

pub fn write_balance(env: &Env, account: &Address, balance: i128) {
    env.storage()
        .instance()
        .set(&balance_key(account), &balance);
}

pub fn read_allowance(env: &Env, owner: &Address, spender: &Address) -> i128 {
    env.storage()
        .instance()
        .get(&allowance_key(owner, spender))
        .unwrap_or(0)
}

pub fn write_allowance(env: &Env, owner: &Address, spender: &Address, allowance: i128) {
    env.storage()
        .instance()
        .set(&allowance_key(owner, spender), &allowance);
}

pub fn read_whitelist(env: &Env, account: &Address) -> bool {
    env.storage()
        .instance()
        .get(&whitelist_key(account))
        .unwrap_or(false)
}

pub fn write_whitelist(env: &Env, account: &Address, whitelisted: bool) {
    env.storage()
        .instance()
        .set(&whitelist_key(account), &whitelisted);
}
