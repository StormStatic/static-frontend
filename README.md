# Static Exchange Frontend

A React-based frontend for swapping between Lightning Network (Bitcoin) and stablecoins across multiple chains. Users pay a Lightning invoice and receive the equivalent stablecoin on their wallet on the chosen chain.

## Supported chains

- **Polygon** — XSGD (`0xdc3326e71d45186f113a2f448984ca0e8d201995`), connected via WalletConnect / Web3Modal
- **Solana** — USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`), connected via Solana wallet adapter
- **Tron** — USDT (`TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`), address entered manually

## Tech stack

- React 18 + TypeScript, bootstrapped with Create React App (`react-scripts`)
- Tailwind CSS for styling
- Apollo Client for GraphQL against the Static backend
- `@web3modal/ethers` for EVM wallet connection, `@solana/wallet-adapter-*` for Solana

## Prerequisites

- Node.js 16+ and a package manager (npm, yarn, or bun — `bun.lock`, `yarn.lock`, and `package-lock.json` are all checked in)
- A WalletConnect Cloud project ID — create one at https://cloud.walletconnect.com

## Environment variables

Create a `.env` file in the project root with:

```
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

All Create React App env vars must be prefixed with `REACT_APP_` to be exposed to the client bundle.

## Backend

The GraphQL endpoint is currently hardcoded in `src/App.tsx` as `https://dev-static-api.ap.ngrok.io/graphql`. To point at a local backend, swap the `HOST` constant to `http://localhost:8911`.

## Scripts

```sh
npm install      # install dependencies
npm start        # run the dev server at http://localhost:3000
npm test         # run the test runner in watch mode
npm run build    # build the production bundle to ./build
```

## Project structure

```
src/
  App.tsx              # Apollo + Web3Modal setup, app root
  Chain.tsx            # chain selector (Polygon / Solana / Tron)
  Swap.tsx             # main swap form
  Connect.tsx          # wallet connect wrapper
  Order.tsx            # order/invoice display
  PolygonAddress.tsx   # Polygon recipient address input
  SolAddress.tsx       # Solana recipient address input
  Loading.tsx
  constants.ts         # chain enum, GraphQL mutations
```

## Deployment

`npm run build` produces a static bundle in `./build` that can be served from any static host (Vercel, Netlify, S3 + CloudFront, etc.). Make sure `REACT_APP_WALLET_CONNECT_PROJECT_ID` is set in the host's build-time environment.
