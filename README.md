# static-frontend

Web client for Static Exchange — a multi-chain swap interface supporting Polygon, Solana, and Tron.

## Stack

- React 18 + TypeScript (Create React App)
- Tailwind CSS
- Apollo Client (GraphQL)
- `ethers` v6 with `@web3modal/ethers` for Polygon
- `@solana/wallet-adapter-*` (Backpack) for Solana
- TronWeb for Tron

## Prerequisites

- Node.js 18+ and a package manager (npm, yarn, or bun)
- A WalletConnect Cloud project ID

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```
REACT_APP_WALLET_CONNECT_PROJECT_ID=<your-walletconnect-project-id>
```

The GraphQL endpoint is configured in `src/App.tsx`. Point it at your local API server during development if needed.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the dev server at http://localhost:3000 |
| `npm run build` | Produce a production build in `build/` |
| `npm test` | Run the Jest test runner |

## Project layout

```
src/
  App.tsx              Apollo + Web3Modal setup, top-level routing
  Chain.tsx            Source/destination chain selector
  Connect.tsx          Wallet connection (Polygon, Solana, Tron)
  Swap.tsx             Swap form
  Order.tsx            Order tracking and status
  PolygonAddress.tsx   Polygon address display
  SolAddress.tsx       Solana address display
  Loading.tsx          Loading indicator
  constants.ts         GraphQL queries and mutations
```

## Contributing

1. Branch from `main`.
2. Keep changes scoped; open a PR with a short description of intent.
3. Verify `npm run build` succeeds before requesting review.
