# static-frontend

React frontend for Static Exchange — a cross-chain swap UI that connects Solana wallets (via `@solana/wallet-adapter`) and EVM wallets on Polygon (via `@web3modal/ethers`) and talks to a GraphQL backend through Apollo Client.

## Tech stack

- React 18 + TypeScript (Create React App / `react-scripts`)
- Tailwind CSS
- Apollo Client + GraphQL
- `@solana/web3.js` + Solana wallet adapter
- `ethers` v6 + WalletConnect's Web3Modal
- WebLN for Lightning interactions

## Prerequisites

- Node.js 16+
- A package manager: `bun`, `yarn`, or `npm` (lockfiles for all three are present in the repo)
- A WalletConnect Cloud project ID (see https://cloud.walletconnect.com)

## Setup

Install dependencies:

```bash
bun install
# or: yarn install
# or: npm install
```

Create a `.env` file in the project root with at least:

```
REACT_APP_WALLET_CONNECT_PROJECT_ID=<your WalletConnect project id>
```

Additional environment variables are documented at:
https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4

## Scripts

The following scripts are defined in `package.json`:

| Command | Description |
| --- | --- |
| `npm start` | Run the app in development mode at http://localhost:3000 |
| `npm run build` | Build the production bundle into `build/` |
| `npm test` | Run the test suite in watch mode |
| `npm run eject` | Eject from Create React App (one-way operation) |

Substitute `bun run` or `yarn` for `npm run` as preferred.

## Project structure

```
src/
  App.tsx              Root component: Apollo + Web3Modal setup
  Chain.tsx            Chain selector
  Connect.tsx          Wallet connection UI
  Swap.tsx             Swap flow
  Order.tsx            Order display
  SolAddress.tsx       Solana address handling
  PolygonAddress.tsx   Polygon address handling
  Loading.tsx          Loading state
  constants.ts         Shared constants
```
