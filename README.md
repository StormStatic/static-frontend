# static-frontend

React frontend for the Static cross-chain swap app. Users sell stablecoins (XSGD on Polygon, USDC on Solana, USDT on Tron) and receive payment over the Lightning Network, using a hash-locked invoice to bind the on-chain transfer to the off-chain payment.

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and styled with [Tailwind CSS](https://tailwindcss.com/).

## How it works

1. The client generates a random preimage and computes its SHA-256 `paymentHash`.
2. It submits a sell-order GraphQL mutation (`CreatePolygonSellOrder` / `CreateSolanaSellOrder` / `CreateTronSellOrder`) to the Static backend along with the destination address and token amount.
3. The backend returns a Lightning invoice locked to the same `paymentHash`. Paying that invoice reveals the preimage, which lets the on-chain escrow be settled.

## Stack

- React 18 + TypeScript
- Apollo Client for GraphQL
- `@web3modal/ethers` (Polygon) and `@solana/wallet-adapter-*` (Solana)
- `react-hot-toast`, `react-icons`, `qrcode.react`, `webln`
- Tailwind CSS

## Layout

- `src/App.tsx` — Web3Modal + Apollo setup, app shell.
- `src/Chain.tsx` — chain selector (Polygon / Solana / Tron).
- `src/Connect.tsx` — Solana wallet adapter provider wrapper.
- `src/Swap.tsx` — swap form: amount, destination address, order creation.
- `src/Order.tsx` — shows the Lightning invoice and order status.
- `src/constants.ts` — GraphQL mutations and chain options.

## Environment

Create a `.env` file in the project root. See the team Notion page for required values:

https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31

At minimum, the app reads:

- `REACT_APP_WALLET_CONNECT_PROJECT_ID` — WalletConnect Cloud project ID (get one at https://cloud.walletconnect.com).

The GraphQL endpoint is currently hard-coded in `src/App.tsx`.

## Scripts

```bash
# Install dependencies
bun install        # or: yarn / npm install

# Start the dev server on http://localhost:3000
npm start

# Build for production into ./build
npm run build

# Run tests
npm test
```
