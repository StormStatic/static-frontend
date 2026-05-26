# static-frontend

React web client for the Static Exchange — a non-custodial swap UI that lets
users sell stablecoins on Polygon, Solana, or Tron and receive payout over
Lightning. It pairs with the [`static-escrow`](https://github.com/StormStatic/static-escrow)
Anchor program on Solana and a GraphQL backend that brokers the off-chain
Lightning leg.

## Prerequisites

- Node.js 18+ and a package manager (Bun, Yarn, or npm — a `bun.lock`,
  `yarn.lock`, and `package-lock.json` are all checked in).
- A WalletConnect Cloud project ID (sign up at
  https://cloud.walletconnect.com).
- Access to a running Static GraphQL backend (defaults to
  `https://dev-static-api.ap.ngrok.io`).
- A browser wallet for the chains you want to test:
  - Polygon: MetaMask or any WalletConnect-compatible wallet
  - Solana: Phantom, Backpack, or another supported adapter
  - Tron: TronLink

## Installation

```bash
git clone https://github.com/StormStatic/static-frontend.git
cd static-frontend
bun install   # or: yarn install / npm install
```

## Environment

Create a `.env` file in the project root with at least:

```
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

The full set of environment variables is documented in Notion:
https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31

## Usage

Start the dev server:

```bash
bun start   # or: yarn start / npm start
```

The app is served at http://localhost:3000.

Other scripts:

| Command       | Description                                |
| ------------- | ------------------------------------------ |
| `bun start`   | Run the Create React App dev server        |
| `bun run build` | Produce an optimized production build    |
| `bun test`    | Run the Jest / React Testing Library suite |

## Project layout

```
src/
  App.tsx           # Apollo + Web3Modal providers, app shell
  Chain.tsx         # Chain selector (Polygon / Solana / Tron)
  Connect.tsx       # Solana wallet adapter wrapper
  Swap.tsx          # Swap form and order submission
  Order.tsx         # Order status / Lightning invoice display
  PolygonAddress.tsx, SolAddress.tsx  # Per-chain address inputs
  Loading.tsx       # Shared loading state
  constants.ts      # GraphQL mutations and chain enums
public/             # Static assets (chain logos, favicon, manifest)
```

## Tech stack

- React 18 + TypeScript (Create React App)
- Tailwind CSS for styling
- Apollo Client for GraphQL
- `@solana/wallet-adapter-*` for Solana wallets
- `@web3modal/ethers` + `ethers` v6 for Polygon / EVM wallets
- `webln` for Lightning invoice payments
