# static-frontend

React + TypeScript frontend for the Static cross-chain swap app. Users sell stablecoins and receive payment over the Lightning Network, using a hash-locked invoice to bind the on-chain transfer to the off-chain payment.

| Chain   | Token | Address                                          |
| ------- | ----- | ------------------------------------------------ |
| Polygon | XSGD  | `0xdc3326e71d45186f113a2f448984ca0e8d201995`     |
| Solana  | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`   |
| Tron    | USDT  | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`             |

Polygon uses WalletConnect (via `@web3modal/ethers`) and Solana uses `@solana/wallet-adapter`. Tron is currently address-paste only — the user types a destination address; there is no Tron wallet integration in the UI.

Bootstrapped with Create React App and styled with Tailwind CSS.

## Setup

```bash
bun install
bun start    # dev server on http://localhost:3000
bun run build
bun test
```

Create a `.env` with `REACT_APP_WALLET_CONNECT_PROJECT_ID` (from https://cloud.walletconnect.com).

The GraphQL endpoint is set via the `HOST` constant in `src/App.tsx` (defaults to `https://dev-static-api.ap.ngrok.io`); edit it there to point at a different backend.
