# Contributing to Proptify

Thank you for your interest in contributing to Proptify. This document covers everything you need to know to make a meaningful contribution — from picking your first issue to getting your pull request merged.

Proptify is a community-first project. 

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How the Project is Organised](#how-the-project-is-organised)
3. [Types of Contributions](#types-of-contributions)
4. [Finding an Issue to Work On](#finding-an-issue-to-work-on)
5. [Claiming an Issue](#claiming-an-issue)
6. [Setting Up Your Development Environment](#setting-up-your-development-environment)
7. [Branch Naming Convention](#branch-naming-convention)
8. [Commit Message Convention](#commit-message-convention)
9. [Pull Request Process](#pull-request-process)
10. [Code Style Guidelines](#code-style-guidelines)
11. [Testing Requirements](#testing-requirements)
12. [Smart Contract Contribution Guide](#smart-contract-contribution-guide)
13. [Frontend Contribution Guide](#frontend-contribution-guide)
14. [Backend Contribution Guide](#backend-contribution-guide)
15. [SDK Contribution Guide](#sdk-contribution-guide)
16. [Documentation Contribution Guide](#documentation-contribution-guide)
17. [Bounty Program](#bounty-program)
18. [Review Process](#review-process)
19. [Getting Help](#getting-help)

---

## Code of Conduct

Proptify is committed to providing a welcoming, inclusive, and harassment-free environment for all contributors, regardless of background, experience level, gender, nationality, or any other characteristic.

**Expected behaviour:**
- Be respectful and constructive in all interactions
- Welcome newcomers and help them get started
- Accept feedback graciously and give it constructively
- Prioritise the project's mission over personal preferences

**Unacceptable behaviour:**
- Harassment, personal attacks, or discriminatory language
- Dismissing or belittling contributions from others
- Spamming issues or pull requests

Violations can be reported to `conduct@proptify.dev`. Maintainers reserve the right to remove contributors who violate this code.

---

## How the Project is Organised

Proptify is a monorepo with four workspaces. Each workspace has its own maintainers, test suite, and CI pipeline, but they share a common contribution workflow.

| Workspace | Language | Maintainer Label |
|-----------|----------|-----------------|
| `contracts/` | Rust (Soroban) | `area: contracts` |
| `backend/` | TypeScript (Node.js) | `area: backend` |
| `frontend/` | TypeScript (Next.js) | `area: frontend` |
| `sdk/` | TypeScript | `area: sdk` |
| `docs/` | Markdown / MDX | `area: docs` |

Each contract is in its own subdirectory (`contracts/property-token`, `contracts/rent-distributor`, etc.) with its own `Cargo.toml`. This is intentional — it prevents merge conflicts between contributors working on different contracts and enforces separation of concerns. **Do not move contract code between directories without opening a discussion first.**

---

## Types of Contributions

We welcome contributions in the following areas:

### Code
- Implementing a new feature from an open issue
- Fixing a bug
- Writing or improving tests
- Refactoring for clarity or performance (requires discussion first)
- Improving error messages or logging

### Smart Contracts (Rust/Soroban)
- Implementing contract logic
- Writing contract tests using the Soroban test framework
- Adding compliance modules for new jurisdictions
- Security improvements and gas optimisations

### Frontend (Next.js / Tailwind)
- Building new pages or UI components
- Improving accessibility (a11y)
- Adding internationalisation (i18n) strings for new languages
- Fixing responsive layout issues
- Writing Playwright end-to-end tests

### Backend (Node.js / TypeScript)
- Adding new API endpoints
- Improving Stellar/Soroban contract interaction services
- Writing Jest unit and integration tests
- Adding new compliance validation logic

### SDK
- Implementing contract bindings for new contracts
- Improving TypeScript types
- Writing usage examples
- Improving SDK documentation

### Documentation
- Fixing inaccuracies in existing docs
- Writing tutorials for specific use cases
- Translating docs to French, Swahili, Hausa, Yoruba, Igbo, Bahasa Indonesia
- Improving developer setup guides

### Design
- Improving UI/UX for existing pages
- Creating design mockups for planned features (Figma preferred)
- Improving the design system (colours, typography, spacing)

---

## Finding an Issue to Work On

All work in Proptify is tracked as GitHub Issues. Before writing any code, find or create an issue for the work you want to do.

### Issue labels

| Label | Meaning |
|-------|---------|
| `good first issue` | Suitable for first-time contributors. Well-scoped and documented. |
| `help wanted` | Maintainers want community help on this. No prior context needed. |
| `bounty` | Has a monetary reward attached. See the issue body for the amount. |
| `area: contracts` | Work is inside `contracts/` |
| `area: frontend` | Work is inside `frontend/` |
| `area: backend` | Work is inside `backend/` |
| `area: sdk` | Work is inside `sdk/` |
| `area: docs` | Documentation work |
| `priority: high` | Blocking other work. Pick these up first. |
| `priority: low` | Nice to have but not urgent. |
| `status: in progress` | Someone is already working on this. |
| `status: needs review` | PR is open, waiting for maintainer review. |
| `type: bug` | Something is broken. |
| `type: feature` | New functionality. |
| `type: chore` | Maintenance, refactoring, tooling. |
| `type: security` | Security-related. Handle with extra care. |
| `jurisdiction: Nigeria` | Related to Nigeria compliance module. |
| `jurisdiction: Ghana` | Related to Ghana compliance module. |
| `jurisdiction: Kenya` | Related to Kenya compliance module. |

---

## Claiming an Issue

1. Find an issue you want to work on.
2. Leave a comment: **"I'd like to work on this."** Include a brief sentence on your approach if the issue is complex.
3. Wait for a maintainer to assign it to you. This usually takes 24–48 hours.
4. Once assigned, you have **7 days** to open a draft PR. If you can't complete the work in that time, comment on the issue and we'll work with you. Unresponsive claims after 7 days will be reassigned.
5. Do not open a PR for an issue that is not assigned to you. This leads to duplicate work.

**For `good first issue` items only:** you may open a PR directly without waiting for assignment, as these are well-defined and low-risk.

---

## Setting Up Your Development Environment

See [README.md](README.md#getting-started) for the full setup guide. The quick version:

```bash
git clone https://github.com/proptify/proptify.git
cd proptify
pnpm install
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
docker compose up -d
pnpm --filter backend db:migrate
pnpm contracts:build
pnpm contracts:deploy:local
pnpm dev
```

If you run into any issues during setup, search [existing discussions](https://github.com/proptify/proptify/discussions) before opening a new one.

---

## Branch Naming Convention

All branches must follow this pattern:

```
<type>/<issue-number>-<short-description>
```

Examples:

```
feat/42-property-token-transfer-restriction
fix/87-rent-distributor-rounding-error
chore/103-update-soroban-sdk-version
docs/156-nigeria-compliance-tutorial
test/201-co-ownership-dao-voting-tests
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance, tooling, dependencies
- `docs` — documentation only
- `test` — adding or fixing tests
- `refactor` — code restructuring, no behaviour change
- `security` — security fix (coordinate with maintainers before making public)

Never commit directly to `main` or `develop`. All changes go through pull requests.

---

## Commit Message Convention

Proptify follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is enforced by a commit-msg hook.

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Examples:**

```
feat(property-token): add transfer restriction hook for KYC compliance

Implements the `check_transfer_allowed` function that calls the compliance
contract before allowing a token transfer. Returns an error if the recipient
is not whitelisted.

Closes #42
```

```
fix(rent-distributor): correct integer division rounding in distribution calc

The previous implementation truncated fractional XLM amounts, causing
tiny amounts to be locked in the contract indefinitely. Now uses
ceiling division for the final recipient to ensure full distribution.

Fixes #87
```

```
docs(nigeria-compliance): add tutorial for deploying Nigeria KYC module
```

**Scopes** match workspace or contract name: `property-token`, `rent-distributor`, `installment-sale`, `title-registry`, `co-ownership-dao`, `compliance`, `oracle`, `escrow`, `frontend`, `backend`, `sdk`, `docs`, `ci`.

---

## Pull Request Process

### Before opening a PR

- [ ] Your branch is up to date with `develop`
- [ ] All tests pass locally (`pnpm test`)
- [ ] You've added tests for new code
- [ ] You've updated relevant documentation
- [ ] Your code follows the style guidelines
- [ ] The PR addresses exactly one issue

### Opening the PR

1. Push your branch to your fork.
2. Open a PR against the `develop` branch (not `main`).
3. Fill in the PR template completely. Do not delete sections.
4. Link the issue: `Closes #<issue-number>` in the PR body.
5. Mark the PR as **Draft** if it's not ready for review yet.
6. Request a review from the relevant maintainer (listed in `CODEOWNERS`).

### PR template

When you open a PR, the following template will be pre-filled:

```markdown
## What does this PR do?
<!-- One or two sentences describing the change -->

## Related issue
Closes #

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor
- [ ] Test
- [ ] Chore

## How has this been tested?
<!-- Describe the tests you ran -->

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have added tests for my changes
- [ ] All tests pass locally
- [ ] I have updated the documentation
- [ ] I have not introduced any breaking changes (or documented them)
```

### After opening the PR

- Respond to review comments within 48 hours. If you need more time, say so.
- Do not force-push to a PR branch after review has started. Add new commits instead.
- Squash your commits before the final merge (maintainers will do this if you forget).

---

## Code Style Guidelines

### Rust (smart contracts)

- Follow standard Rust formatting: `cargo fmt` before every commit
- Run `cargo clippy` and resolve all warnings before opening a PR
- Use descriptive variable names. Smart contract code is audited — clarity is security.
- Every public function must have a doc comment (`///`)
- Avoid `unwrap()` in contract code. Use proper error types.
- All contract errors must be defined in the contract's `error.rs` file

### TypeScript (frontend / backend / sdk)

- Formatting enforced by Prettier (runs automatically on commit)
- Linting enforced by ESLint (runs in CI)
- Use `const` over `let` wherever possible
- No `any` types. Use proper TypeScript types or generics.
- Async functions must handle errors explicitly — no unhandled promise rejections
- All API responses must be typed

### React / Next.js

- Use functional components only. No class components.
- Use the App Router (`app/` directory). No Pages Router.
- Server Components by default. Add `"use client"` only when necessary.
- No inline styles. Use Tailwind classes.
- Components must be accessible: proper ARIA labels, keyboard navigation, focus management
- Every component that accepts props must have a TypeScript interface for those props

### CSS / Tailwind

- Use Tailwind utility classes. Do not write custom CSS unless absolutely necessary.
- Group Tailwind classes in this order: layout → spacing → sizing → typography → colours → borders → effects
- Use `cn()` helper for conditional class names

---

## Testing Requirements

PRs will not be merged without tests. Here are the minimums per area:

### Contracts (Rust)
- Every public contract function must have at least one passing test
- Happy path test + at least one error path test per function
- Tests must use the Soroban test environment (`soroban_sdk::testutils`)
- Integration tests that simulate multi-contract interactions are required for cross-contract calls

### Backend (TypeScript)
- Unit tests for all service functions
- Integration tests for all API routes (using a test database)
- Minimum 80% code coverage on new files

### Frontend (TypeScript / React)
- Unit tests for all utility functions in `lib/`
- Component tests for all new components (using React Testing Library)
- End-to-end tests (Playwright) for any new user flow involving wallet interaction or contract calls

### SDK (TypeScript)
- Unit tests for every exported function
- Integration tests that call contracts on a local testnet

---

## Smart Contract Contribution Guide

Each contract lives in its own directory under `contracts/`. Here is the anatomy of a contract directory:

```
contracts/property-token/
├── Cargo.toml          # Contract manifest. Do not change the package name.
├── src/
│   ├── lib.rs          # Contract entry point. Public functions only.
│   ├── storage.rs      # All storage read/write operations.
│   ├── events.rs       # All event definitions and publish calls.
│   ├── error.rs        # All error enum variants.
│   ├── types.rs        # All custom types and structs.
│   └── test.rs         # All tests.
└── README.md           # Contract-specific docs (interface, storage layout, events).
```

**Rules:**
- Never put business logic in `lib.rs`. It is only the interface. Logic goes in submodules.
- All storage keys must be defined as constants in `storage.rs`. No magic strings.
- All events must be defined in `events.rs` before being published.
- All errors must be in `error.rs`. The error enum must implement `ContractError`.
- Cross-contract calls must go through a `client.rs` file (see `rent-distributor` for an example).

**Adding a new jurisdiction compliance module:**

1. Open `contracts/compliance/src/jurisdictions/`
2. Copy `nigeria.rs` as a template
3. Implement the `JurisdictionModule` trait
4. Register the new jurisdiction in `lib.rs`
5. Add tests covering KYC rules specific to that jurisdiction
6. Update `contracts/compliance/README.md`

---

## Frontend Contribution Guide

The frontend uses Next.js 14 with the App Router, Tailwind CSS, and shadcn/ui components.

### Directory structure

```
frontend/src/
├── app/                        # Pages (App Router)
│   ├── (dashboard)/            # Authenticated routes
│   │   ├── properties/         # Property listing and detail
│   │   ├── portfolio/          # User's owned tokens
│   │   └── governance/         # DAO voting
│   ├── (auth)/                 # Unauthenticated routes
│   │   └── connect/            # Wallet connect flow
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # shadcn/ui base components (do not modify)
│   ├── property/               # Property-specific components
│   ├── wallet/                 # Wallet connection components
│   └── shared/                 # General reusable components
├── hooks/
│   ├── useWallet.ts            # Wallet state and connection
│   ├── useProperty.ts          # Property data fetching
│   └── useContract.ts          # Direct contract interaction
├── lib/
│   ├── api.ts                  # Backend API client (typed)
│   ├── stellar.ts              # Stellar SDK helpers
│   └── utils.ts                # General utilities
└── types/
    └── index.ts                # Shared TypeScript types
```

### Adding a new page

1. Create a new directory under `app/(dashboard)/` or `app/(auth)/`
2. Add a `page.tsx` file (Server Component by default)
3. Add a `loading.tsx` for the loading state
4. Add an `error.tsx` for the error boundary
5. Link to it from the sidebar in `components/shared/Sidebar.tsx`
6. Add Playwright tests in `frontend/tests/e2e/`

### Wallet integration

Use the `useWallet` hook for all wallet operations. Do not call Freighter or xBull APIs directly from components.

```typescript
import { useWallet } from '@/hooks/useWallet'

export function MyComponent() {
  const { address, isConnected, connect, signTransaction } = useWallet()
  // ...
}
```

---

## Backend Contribution Guide

The backend is a Node.js / Express REST API written in TypeScript.

### Directory structure

```
backend/src/
├── routes/
│   ├── properties.ts       # GET/POST /api/properties
│   ├── transactions.ts     # GET /api/transactions
│   ├── users.ts            # GET/PUT /api/users
│   └── governance.ts       # GET/POST /api/governance
├── services/
│   ├── propertyService.ts  # Business logic for properties
│   ├── contractService.ts  # Soroban contract interactions
│   ├── stellarService.ts   # Stellar network helpers
│   └── storageService.ts   # IPFS document storage
├── middleware/
│   ├── auth.ts             # SEP-10 JWT verification
│   ├── validate.ts         # Request body validation (Zod)
│   └── errorHandler.ts     # Centralised error handling
└── utils/
    ├── logger.ts
    └── stellar.ts
```

### Adding a new API endpoint

1. Add the route handler in the appropriate file under `routes/`
2. Add the business logic in the corresponding file under `services/`
3. Add request validation schema using Zod in `middleware/validate.ts`
4. Write integration tests in `backend/src/__tests__/routes/`
5. Document the endpoint in `docs/api.md`

---

## SDK Contribution Guide

The SDK (`sdk/`) is a TypeScript package published to npm as `@proptify/sdk`. It provides typed bindings to all Proptify contracts and a high-level API that abstracts Stellar/Soroban details.

All SDK changes must be backward-compatible. Breaking changes require a major version bump and must be discussed in a GitHub Discussion before implementation.

---

## Documentation Contribution Guide

Docs live in `docs/` and are written in Markdown. They are deployed to `docs.proptify.dev`.

### Translation

We prioritise the following languages:
1. French (covers West Africa broadly)
2. Swahili (East Africa)
3. Hausa (Northern Nigeria, Niger, Chad)
4. Yoruba (Southwest Nigeria)
5. Igbo (Southeast Nigeria)
6. Bahasa Indonesia

To add a translation, create a subfolder: `docs/i18n/<language-code>/` and mirror the English file structure. Link to it in `docs/i18n/README.md`.

---

## Review Process

Pull requests are reviewed by maintainers within **3–5 business days**. High priority issues may be reviewed faster.

A PR needs:
- 1 approving review from a maintainer for small changes
- 2 approving reviews for changes to contracts or auth logic
- A security review (flagged with `type: security`) must be reviewed by the security maintainer

Maintainers may request changes. Please address all comments before re-requesting review. If you disagree with a review comment, explain your reasoning — we welcome discussion.

---

## Getting Help

- **Discord** — fastest way to get help: [discord.gg/proptify](https://discord.gg/proptify)
- **GitHub Discussions** — for longer technical questions: [Discussions](https://github.com/proptify/proptify/discussions)
- **Office hours** — maintainers hold open voice calls every Wednesday at 17:00 WAT (West Africa Time) on Discord

If you are stuck on your development setup for more than 30 minutes, please ask in Discord rather than struggling alone. We want to fix setup friction.

---

*Thank you for contributing to Proptify. Every issue fixed, every line of code written, and every doc improved is a step toward financial infrastructure that works for everyone.*