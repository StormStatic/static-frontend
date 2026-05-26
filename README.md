# static-frontend

Web frontend for Static — a cross-chain swap UI that connects Solana, Polygon (EVM), Tron, and Lightning. Built with Create React App, TypeScript, Tailwind CSS, and an Apollo GraphQL client talking to the Static backend.

## Stack

- React 18 + TypeScript (Create React App / `react-scripts` 5)
- Tailwind CSS
- Apollo Client (`@apollo/client`) for GraphQL
- Solana wallet adapter (`@solana/wallet-adapter-*`, Backpack)
- Ethers v6 + `@web3modal/ethers` (WalletConnect) for Polygon
- `webln` for Lightning, `qrcode.react` for invoice display

See `package.json` for the full dependency list.

## Setup

```bash
bun install   # or: yarn install / npm install
```

### Environment

A `.env` file in the repo root is required. The keys come from the team Notion page:
https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4

Variables consumed by the app must be prefixed with `REACT_APP_` (CRA convention). Currently used:

- `REACT_APP_WALLET_CONNECT_PROJECT_ID` — WalletConnect Cloud project ID for Web3Modal (`src/App.tsx`).

## Development

```bash
bun start         # runs `react-scripts start` on http://localhost:3000
bun test          # runs `react-scripts test` (Jest, watch mode)
bun run build     # production build into ./build
```

The GraphQL endpoint is configured in `src/App.tsx` (`HOST` constant). Point it at a local backend by switching the commented `HOST` value.

## Layout

```
src/
  App.tsx          # Apollo + Web3Modal bootstrap
  Chain.tsx        # chain picker
  Connect.tsx      # wallet connect flow
  Swap.tsx         # swap UI
  Order.tsx        # order lifecycle
  PolygonAddress.tsx, SolAddress.tsx
  constants.ts
public/            # CRA static assets (chain/token logos)
```

## Related

- `static-escrow` — Anchor (Solana) escrow program used by the swap flow.
