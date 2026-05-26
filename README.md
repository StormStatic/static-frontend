# static-frontend

React frontend for Static Exchange — a non-custodial swap UI that lets users
sell stablecoins (XSGD on Polygon, USDC on Solana, USDT on Tron) and receive
payouts over the Bitcoin Lightning Network.

The UI creates a sell order against the Static GraphQL API using a locally
generated preimage / payment hash, then drives the on-chain escrow flow for
the selected chain.

## Stack

- React 18 + TypeScript (Create React App / `react-scripts`)
- Tailwind CSS
- Apollo Client for the Static GraphQL API
- Wallet adapters:
  - `@web3modal/ethers` for Polygon
  - `@solana/wallet-adapter-*` for Solana
- `webln` for Lightning invoice payments

## Getting started

Install dependencies and start the dev server:

```sh
bun install   # or: npm install / yarn
bun start     # or: npm start / yarn start
```

The app runs on http://localhost:3000.

## Environment

Create a `.env` file at the repo root. The required variables are documented
in Notion:

https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4

At minimum you will need:

- `REACT_APP_WALLET_CONNECT_PROJECT_ID` — WalletConnect Cloud project id used
  to initialize Web3Modal for Polygon.

The GraphQL endpoint currently points at `https://dev-static-api.ap.ngrok.io`
(see `src/App.tsx`); change `HOST` there to target a different backend.

## Scripts

- `bun start` — run the dev server
- `bun run build` — production build into `build/`
- `bun test` — run the CRA test runner

## Project layout

```
src/
  App.tsx              Apollo + Web3Modal bootstrap
  Chain.tsx            Chain selector (Polygon / Solana / Tron)
  Swap.tsx             Sell-order creation and swap flow
  Connect.tsx          Solana wallet connection wrapper
  Order.tsx            Active order / Lightning invoice display
  PolygonAddress.tsx   Polygon wallet address + send helpers
  SolAddress.tsx       Solana wallet address + send helpers
  Loading.tsx          Loading indicator
  constants.ts         GraphQL mutations and chain/token constants
```
