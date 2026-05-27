# static-frontend

React + TypeScript frontend for the Static cross-chain swap app. Users sell stablecoins (XSGD on Polygon, USDC on Solana, USDT on Tron) and receive payment over the Lightning Network, using a hash-locked invoice to bind the on-chain transfer to the off-chain payment.

Bootstrapped with Create React App and styled with Tailwind CSS.

## Setup

```bash
bun install
npm start    # dev server on http://localhost:3000
npm run build
npm test
```

Create a `.env` with `REACT_APP_WALLET_CONNECT_PROJECT_ID` (from https://cloud.walletconnect.com). The GraphQL endpoint is hard-coded in `src/App.tsx`.
