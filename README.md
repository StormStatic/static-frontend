# Static Exchange Frontend

A React-based crypto exchange frontend that enables atomic swaps between on-chain tokens (on Polygon, Solana, and Tron) and Bitcoin via the Lightning Network. Uses Web3Modal for EVM wallet connections, Solana Wallet Adapter for Solana wallets, Apollo GraphQL for backend communication, and an HTLC-based escrow mechanism to facilitate trustless swaps.

## Features

- **Multi-chain support** — swap tokens on Polygon (XSGD), Solana (USDC), and Tron (USDT)
- **Wallet connect** — EVM wallets via Web3Modal (WalletConnect), Solana wallets via Backpack, Coinbase, Ledger, and Solflare
- **Lightning Network payments** — pay via Lightning invoice (QR code displayed, WebLN auto-pay if browser extension present)
- **Atomic swaps** — HTLC-based escrow ensures trustless token release
- **Order tracking** — real-time order status polling with transaction links to Polygonscan / Solscan
- **Clipboard support** — copies Lightning invoices via Capacitor Clipboard API

## Prerequisites

- Node.js (v16 or later recommended)
- Yarn

## Installation

```bash
yarn install
```

## Environment Setup

Create a `.env` file in the project root with the following variable:

```env
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

Get the project ID from WalletConnect Cloud. The full list of required env vars is documented in Notion:
https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4

## Running Locally

```bash
yarn start
```

Opens the app at [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
yarn build
```

Outputs a production-ready build to the `build/` directory. Deploy the contents of `build/` to any static hosting provider (e.g. S3, Netlify, Vercel, Cloudflare Pages).

## Component Structure

```
src/
├── App.tsx           # Root component — sets up Web3Modal, Apollo client, and providers
├── Chain.tsx         # Chain selector (Polygon / Solana / Tron) and top-level routing
├── Connect.tsx       # Solana wallet providers (ConnectionProvider, WalletProvider)
├── Swap.tsx          # Swap form — token amount input, destination address, order creation
├── Order.tsx         # Order status display — polls GraphQL, shows Lightning QR, tx links
├── PolygonAddress.tsx# Polygon destination address input (reads connected EVM wallet)
├── SolAddress.tsx    # Solana destination address input (reads connected Solana wallet)
├── Loading.tsx       # Loading spinner component
└── constants.ts      # Chain enum and GraphQL mutation definitions
```

### Swap flow

1. User selects a chain and connects their wallet (Polygon/Solana) or enters an address (Tron).
2. User enters the token amount and destination address, then clicks **Create Order**.
3. The app calls the GraphQL backend to create a sell order (XSGD/USDC/USDT → Lightning BTC).
4. A Lightning invoice is returned and displayed as a QR code. If a WebLN-compatible browser extension is detected, payment is attempted automatically.
5. Once Lightning payment is confirmed, the backend deploys an on-chain escrow contract and locks the tokens.
6. The frontend submits the HTLC preimage to the backend, which releases the tokens to the destination address.
7. Order status updates are shown in real time until the order reaches `ReleasedFund` or `Expired`.
