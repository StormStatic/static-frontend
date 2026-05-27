# static-frontend

React + TypeScript frontend for the Static cross-chain swap app. Users sell stablecoins and receive payment over the Lightning Network, using a hash-locked invoice to bind the on-chain transfer to the off-chain payment.

| Chain   | Token | Address                                          |
| ------- | ----- | ------------------------------------------------ |
| Polygon | XSGD  | `0xdc3326e71d45186f113a2f448984ca0e8d201995`     |
| Solana  | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`   |
| Tron    | USDT  | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`             |

Bootstrapped with Create React App (`react-scripts`) and styled with Tailwind CSS. Polygon swaps go through WalletConnect / Web3Modal (ethers v6); Solana swaps use the Solana wallet adapter; Tron swaps fall back to a manual address entry.

## Setup

```bash
bun install
bun start         # dev server on http://localhost:3000
bun run build     # production build to ./build
bun test          # react-scripts test runner
```

`npm`/`yarn` work the same way — pick one and stick to it. Lockfiles for all three are checked in.

## Configuration

Create a `.env` at the repo root with:

- `REACT_APP_WALLET_CONNECT_PROJECT_ID` — obtain from https://cloud.walletconnect.com (required for the Polygon flow).

The API host is hard-coded as `HOST` in both [`src/App.tsx`](./src/App.tsx) (the Apollo GraphQL endpoint) and [`src/Order.tsx`](./src/Order.tsx) (the `/preimage` polling endpoint). Both currently point at a development ngrok URL (`https://dev-static-api.ap.ngrok.io`); update both before deploying.

## Source layout

```
src/
├── index.tsx              # CRA entry point
├── App.tsx                # Apollo + Web3Modal setup, GraphQL host
├── Chain.tsx              # Chain picker (Polygon / Solana / Tron)
├── Connect.tsx            # Solana wallet-adapter context
├── Swap.tsx               # Core swap flow + Lightning invoice handling
├── Order.tsx              # Order status + payment hash display
├── Loading.tsx            # Shared spinner
├── PolygonAddress.tsx     # Polygon (EVM) address input
├── SolAddress.tsx         # Solana address input
└── constants.ts           # Chain enum + GraphQL mutations and token addresses
```
