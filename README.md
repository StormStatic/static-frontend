# Static Exchange

Lightning-fast cross-chain cryptocurrency swaps between stablecoins and Bitcoin via the Lightning Network.

## Overview

Static Exchange is a web application that enables users to swap tokens across Polygon, Solana, and Tron networks using Lightning Network-secured escrow (HTLC) contracts. It supports XSGD on Polygon, USDC on Solana, and USDT on Tron.

## Features

- **Cross-chain swaps** between Polygon, Solana, and Tron via Lightning Network
- **Multi-wallet support** including Web3Modal (Polygon), Backpack, Coinbase, Ledger, and Solflare (Solana)
- **QR code generation** for Lightning invoices
- **Real-time order tracking** with live status updates
- **HTLC escrow** using SHA256 preimage-based atomic swaps

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS
- Apollo Client (GraphQL)
- Ethers.js / Solana Wallet Adapter
- WebLN

## Getting Started

### Prerequisites

- Node.js (v16 or later)

### Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_WALLET_CONNECT_PROJECT_ID=<your-walletconnect-project-id>
```

See the [environment setup guide](https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4) for details.

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the app at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Project Structure

```
src/
  App.tsx              # App root, Apollo Client and Web3Modal setup
  Chain.tsx            # Chain selector (Polygon / Solana / Tron)
  Swap.tsx             # Swap form and order creation
  Order.tsx            # Order tracking and Lightning invoice display
  Connect.tsx          # Solana wallet connection provider
  PolygonAddress.tsx   # Polygon wallet integration
  SolAddress.tsx       # Solana wallet integration
  constants.ts         # GraphQL mutations and chain enums
```
