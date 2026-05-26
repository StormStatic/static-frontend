# Static Exchange Frontend

A React + TypeScript frontend for Static Exchange — a service that enables Lightning Network swaps into stablecoins on Solana, Polygon, and Tron.

Users pay a Lightning invoice and receive the equivalent in:

- **Solana** — USDC
- **Polygon** — XSGD
- **Tron** — USDT

## Tech Stack

- React 18 + TypeScript (Create React App)
- Apollo Client for GraphQL
- Tailwind CSS for styling
- `@solana/wallet-adapter-*` for Solana wallet connections
- `@web3modal/ethers` for EVM (Polygon) wallet connections
- `webln` for Lightning Network browser integration

## Prerequisites

- Node.js 16+
- A package manager: `npm`, `yarn`, or `bun`
- A [WalletConnect Cloud](https://cloud.walletconnect.com) project ID

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following variable:

   ```
   REACT_APP_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

   Obtain a project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com).

## Running Locally

Start the development server:

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

By default the frontend points at the hosted dev GraphQL API defined in `src/App.tsx`. To point at a locally running backend, edit the `HOST` constant in `src/App.tsx`.

## Available Scripts

- `npm start` — run the dev server with hot reload
- `npm run build` — build the production bundle into `build/`
- `npm test` — run the test suite in watch mode

## Project Structure

```
src/
  App.tsx              # Apollo + Web3Modal setup, app shell
  Chain.tsx            # Chain (Solana / Polygon / Tron) selection
  Connect.tsx          # Wallet connection flow
  Swap.tsx             # Swap UI
  Order.tsx            # Order status / payment view
  PolygonAddress.tsx   # Polygon recipient address handling
  SolAddress.tsx       # Solana recipient address handling
  Loading.tsx          # Loading state component
  constants.ts         # GraphQL mutations and chain enum
public/                # Static assets (icons, manifest, chain logos)
```
