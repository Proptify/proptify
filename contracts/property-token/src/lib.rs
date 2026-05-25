#![no_std]

pub mod storage;
pub mod types;

use soroban_sdk::{contract, contractimpl};

pub use types::PropertyMetadata;

#[contract]
pub struct PropertyToken;

#[contractimpl]
impl PropertyToken {
    /// Returns the storage layout version used by this contract crate.
    pub fn storage_layout_version() -> u32 {
        1
    }
}

#[cfg(test)]
mod test;
