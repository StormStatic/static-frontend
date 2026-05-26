# Static Exchange Frontend

A React + TypeScript single-page app that lets users sell stablecoins across multiple chains and receive payouts via the Bitcoin Lightning Network.

Supported chains and tokens:

- **Polygon** — XSGD
- **Solana** — USDC
- **Tron** — USDT

The app collects a destination Lightning invoice from the user, creates a sell order against the Static GraphQL API, and walks the user through paying the on-chain token amount from their connected wallet.

## Tech stack

- React 18 + TypeScript, bootstrapped with Create React App (`react-scripts`)
- Tailwind CSS for styling
- Apollo Client for GraphQL
- Wallet integrations:
  - `@web3modal/ethers` for Polygon / EVM
  - `@solana/wallet-adapter-*` for Solana
  - `webln` for Lightning
- `ethers`, `@solana/web3.js`, and `decimal.js` for transaction building and amount math

## Prerequisites

- Node.js 18+ (Create React App 5 / `react-scripts` 5)
- A package manager — npm, yarn, or bun (lockfiles for all three are checked in)
- A WalletConnect Cloud project ID — sign up at https://cloud.walletconnect.com

## Setup

1. Install dependencies:

   ```bash
   npm install
   # or: yarn install
   # or: bun install
   ```

2. Create a `.env` file in the project root and populate it with the values from the
   [Static frontend env Notion page](https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4):

   ```
   REACT_APP_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

   Note: variables exposed to the browser must be prefixed with `REACT_APP_` (CRA convention).

## Available scripts

- `npm start` — start the dev server at http://localhost:3000
- `npm run build` — produce a production build under `build/`
- `npm test` — run the test suite via `react-scripts test`

## Project structure

```
src/
  App.tsx              Apollo + Web3Modal providers, app shell
  Chain.tsx            Chain selector (Polygon / Solana / Tron)
  Connect.tsx          Solana wallet adapter wrapper
  Swap.tsx             Order creation flow (amount, dest address, paymentHash)
  Order.tsx            Renders an active order and payment status
  PolygonAddress.tsx   Polygon wallet connection and address display
  SolAddress.tsx       Solana wallet connection and address display
  Loading.tsx          Loading state component
  constants.ts         Chain enum and GraphQL mutations
```

The GraphQL endpoint is configured in `src/App.tsx` (`HOST` constant).
