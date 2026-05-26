# static-frontend

Web frontend for Static — a wallet-connected exchange UI that bridges between
EVM chains (Polygon) and Solana, backed by the Static GraphQL API.

The app is built with [Create React App](https://create-react-app.dev/) and
TypeScript. Chain interactions go through:

- `@web3modal/ethers` + WalletConnect for EVM wallets
- `@solana/wallet-adapter-*` for Solana wallets
- `@apollo/client` against the Static GraphQL backend

Styling is handled with Tailwind CSS.

## Project layout

```
src/
  App.tsx              # Apollo + Web3Modal bootstrap
  Chain.tsx            # chain selection / routing
  Connect.tsx          # wallet connect UI
  Swap.tsx             # swap flow
  Order.tsx            # order details
  PolygonAddress.tsx   # EVM address helpers
  SolAddress.tsx       # Solana address helpers
  Loading.tsx
  constants.ts
  index.tsx
  index.css
public/                # CRA static assets
tailwind.config.js
tsconfig.json
```

## Environment

Configuration is provided via a `.env` file at the repo root. Values that the
app reads from `process.env` include:

- `REACT_APP_WALLET_CONNECT_PROJECT_ID` — WalletConnect Cloud project id

env file
https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4

## Install

This project has lockfiles for both Bun and npm. Use whichever you prefer; the
team uses Bun day-to-day.

```sh
bun install
# or
npm install
```

## Usage

```sh
# start the dev server at http://localhost:3000
bun start            # or: npm start

# production build into ./build
bun run build        # or: npm run build

# run the CRA test runner
bun test             # or: npm test
```

These map directly to the `react-scripts` commands defined in
[`package.json`](./package.json).
