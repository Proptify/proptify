use soroban_sdk::{testutils::Address as _, Address, Env, String};

use crate::{storage, PropertyMetadata, PropertyToken};

fn sample_metadata(env: &Env) -> PropertyMetadata {
    PropertyMetadata {
        property_id: String::from_str(env, "LAGOS-IKY-001"),
        title_number: String::from_str(env, "TN-2026-0001"),
        location: String::from_str(env, "Ikoyi, Lagos"),
        country_code: String::from_str(env, "NG"),
        valuation_usd: 25_000_000,
        ipfs_document_hash: String::from_str(env, "bafybeigdyrzt"),
        created_at: 1_777_000_000,
    }
}

#[test]
fn persistent_property_helpers_roundtrip() {
    let env = Env::default();
    let contract_id = env.register(PropertyToken, ());
    let admin = Address::generate(&env);
    let compliance = Address::generate(&env);
    let property_id = String::from_str(&env, "LAGOS-IKY-001");
    let metadata = sample_metadata(&env);

    env.as_contract(&contract_id, || {
        assert_eq!(storage::read_admin(&env), None);
        assert_eq!(storage::read_property_id(&env), None);
        assert_eq!(storage::read_total_supply(&env), 0);
        assert_eq!(storage::read_property_metadata(&env), None);
        assert_eq!(storage::read_compliance_contract(&env), None);

        storage::write_admin(&env, &admin);
        storage::write_property_id(&env, &property_id);
        storage::write_total_supply(&env, 1_000_000);
        storage::write_property_metadata(&env, &metadata);
        storage::write_compliance_contract(&env, &compliance);

        assert_eq!(storage::read_admin(&env), Some(admin));
        assert_eq!(storage::read_property_id(&env), Some(property_id));
        assert_eq!(storage::read_total_supply(&env), 1_000_000);
        assert_eq!(storage::read_property_metadata(&env), Some(metadata));
        assert_eq!(storage::read_compliance_contract(&env), Some(compliance));
    });
}

#[test]
fn balance_helpers_default_to_zero_and_roundtrip() {
    let env = Env::default();
    let contract_id = env.register(PropertyToken, ());
    let holder = Address::generate(&env);

    env.as_contract(&contract_id, || {
        assert_eq!(storage::read_balance(&env, &holder), 0);
        storage::write_balance(&env, &holder, 42_000);
        assert_eq!(storage::read_balance(&env, &holder), 42_000);
    });
}

#[test]
fn allowance_helpers_are_scoped_by_owner_and_spender() {
    let env = Env::default();
    let contract_id = env.register(PropertyToken, ());
    let owner = Address::generate(&env);
    let spender = Address::generate(&env);
    let other_spender = Address::generate(&env);

    env.as_contract(&contract_id, || {
        assert_eq!(storage::read_allowance(&env, &owner, &spender), 0);
        assert_eq!(storage::read_allowance(&env, &owner, &other_spender), 0);

        storage::write_allowance(&env, &owner, &spender, 7_500);

        assert_eq!(storage::read_allowance(&env, &owner, &spender), 7_500);
        assert_eq!(storage::read_allowance(&env, &owner, &other_spender), 0);
    });
}

#[test]
fn whitelist_helper_defaults_false_and_roundtrips() {
    let env = Env::default();
    let contract_id = env.register(PropertyToken, ());
    let account = Address::generate(&env);

    env.as_contract(&contract_id, || {
        assert!(!storage::read_whitelist(&env, &account));
        storage::write_whitelist(&env, &account, true);
        assert!(storage::read_whitelist(&env, &account));
        storage::write_whitelist(&env, &account, false);
        assert!(!storage::read_whitelist(&env, &account));
    });
}

#[test]
fn storage_layout_version_is_exposed() {
    assert_eq!(PropertyToken::storage_layout_version(), 1);
}
