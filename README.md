# Static Exchange

A React-based cryptocurrency swap application that facilitates exchanging Bitcoin (via Lightning Network) for stablecoins across multiple blockchain networks.

## Features

- **Multi-chain support** -- Swap to Polygon (XSGD), Solana (USDC), or Tron (USDT)
- **Lightning Network payments** -- Pay invoices via WebLN-compatible wallets or QR code
- **Wallet integration** -- Connect via Web3Modal (Polygon), Solana wallet adapters (Backpack, Coinbase, Ledger, Solflare), or manual address entry (Tron)
- **Atomic swaps** -- Preimage-based hash time-locked contract (HTLC) pattern for trustless exchange
- **Real-time order tracking** -- Live status updates from creation through fund release

## Tech Stack

- React 18, TypeScript, Tailwind CSS
- Apollo Client (GraphQL)
- ethers.js / @solana/web3.js / WebLN
- QR code generation (qrcode.react)

## Getting Started

### Prerequisites

- Node.js 16+
- npm, yarn, or bun

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root. See the [environment variable reference](https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4) for required values.

### Development

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm build
```

## Supported Chains and Tokens

| Chain   | Token | Contract Address                             |
| ------- | ----- | -------------------------------------------- |
| Polygon | XSGD  | `0xdc3326e71d45186f113a2f448984ca0e8d201995` |
| Solana  | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| Tron    | USDT  | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`        |
