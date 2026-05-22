# Static Exchange

A decentralized cross-chain swap application that enables atomic swaps between Bitcoin Lightning Network payments and stablecoins on multiple blockchains.

## How It Works

1. Select a destination blockchain (Polygon, Solana, or TRON)
2. Connect your wallet or enter a destination address
3. Specify the token amount to receive
4. Pay the generated Lightning Network invoice
5. Receive stablecoins on your chosen blockchain

Swaps are secured using Hash Time Locked Contracts (HTLCs) with cryptographic preimage/payment-hash locking.

## Supported Chains

| Chain | Token | Token Address |
|-------|-------|---------------|
| Polygon | XSGD | `0xdc3326e71d45186f113a2f448984ca0e8d201995` |
| Solana | USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| TRON | USDT | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` |

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: ethers.js (Polygon), @solana/web3.js (Solana), WebLN (Lightning)
- **Wallets**: Web3Modal (EVM), Solana Wallet Adapter (Backpack, Coinbase, Ledger, Solflare)
- **API**: GraphQL via Apollo Client

## Getting Started

### Prerequisites

- Node.js (or Bun)
- A WalletConnect project ID

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file with:

```
REACT_APP_WALLET_CONNECT_PROJECT_ID=<your-walletconnect-project-id>
```

### Development

```bash
npm start
```

### Production Build

```bash
npm run build
```
