use soroban_sdk::{contracttype, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PropertyMetadata {
    pub property_id: String,
    pub title_number: String,
    pub location: String,
    pub country_code: String,
    pub valuation_usd: i128,
    pub ipfs_document_hash: String,
    pub created_at: u64,
}
