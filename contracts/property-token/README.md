# Property Token Contract

The property-token contract represents fractional ownership of a single real
estate asset. This initial implementation establishes the storage layout used by
future initialization, balance, transfer, allowance, mint, burn, and compliance
logic.

## Storage Layout

Persistent storage is used for canonical property-level data that must survive
state archival because every deployed contract instance maps to one real estate
asset:

| Key | Value |
| --- | --- |
| `ADMIN` | `Address` |
| `PROP_ID` | `String` |
| `TOTAL_SUP` | `i128` |
| `META` | `PropertyMetadata` |
| `COMPLY` | `Address` |

Instance storage is used for token accounting and whitelist records. These keys
are core contract-instance state and cheaper to access for frequently touched
balances and allowances:

| Key | Value |
| --- | --- |
| `(BALANCE, holder)` | `i128` |
| `(ALLOWANCE, owner, spender)` | `i128` |
| `(WLIST, account)` | `bool` |

All storage access goes through `src/storage.rs`; business logic should not use
raw string keys or direct storage calls for these values.
