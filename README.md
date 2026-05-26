# static-frontend

Web UI for Static Exchange — lightning-fast swaps to Solana, Polygon, and Tron.

Built with Create React App, TypeScript, and Tailwind CSS. Integrates Solana wallet adapters, WalletConnect/Web3Modal for Polygon, and WebLN for Lightning payments. Talks to the Static GraphQL API via Apollo Client.

## Prerequisites

- Node.js 18+ (or Bun)
- A `.env` file with the required variables (see [Environment](#environment))

## Setup

```sh
bun install     # or: npm install / yarn install
```

## Environment

Create a `.env` file in the project root. The env template is documented in Notion:

https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4

At minimum, set:

- `REACT_APP_WALLET_CONNECT_PROJECT_ID` — WalletConnect Cloud project ID (https://cloud.walletconnect.com)

## Scripts

- `bun start` — run the dev server at http://localhost:3000
- `bun run build` — production build to `build/`
- `bun test` — run the test suite

## Project layout

```
src/
  App.tsx           Apollo + Web3Modal providers
  Chain.tsx         chain picker (Solana / Polygon / Tron)
  Swap.tsx          swap flow + order creation
  Order.tsx         order status, WebLN invoice payment
  Connect.tsx       wallet connection helpers
  constants.ts      GraphQL operations and chain options
```

## Related

- [`static-escrow`](https://github.com/StormStatic/static-escrow) — Anchor program backing Solana swaps
