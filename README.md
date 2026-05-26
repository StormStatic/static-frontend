# static-frontend

React web client for the Static platform, providing the user-facing flows for connecting wallets, viewing orders, and completing on-chain payments.

## Overview

`static-frontend` is a [Create React App](https://create-react-app.dev/) project written in TypeScript. It talks to the Static GraphQL API via Apollo Client and connects to Solana, Polygon/EVM, Tron, and Lightning networks through their respective wallet adapters. Routing is handled in `src/App.tsx`, with screens for connecting (`Connect.tsx`), placing orders (`Order.tsx`), and chain-specific address rendering.

## Prerequisites

- Node.js 18+ (matches `react-scripts` 5 expectations)
- [Bun](https://bun.sh/), Yarn, or npm — pick one and stick to its lockfile
- An `.env` file with the values described in the [Static frontend Notion page](https://www.notion.so/Static-frontend-env-9e7224d8da0d4979857e04b8bf7f1f31?pvs=4)

## Getting Started

```bash
# Install dependencies
bun install        # or: yarn install / npm install

# Populate environment variables
cp .env.example .env   # then fill in values from the Notion page above

# Run the dev server (http://localhost:3000)
bun run start      # or: yarn start / npm start
```

## Project Structure

```
static-frontend/
├── public/               # Static assets and the CRA HTML template
├── src/
│   ├── App.tsx           # Route configuration
│   ├── Connect.tsx       # Wallet connection screen
│   ├── Order.tsx         # Order detail / payment flow
│   ├── Chain.tsx         # Chain selector
│   ├── PolygonAddress.tsx / SolAddress.tsx
│   ├── Swap.tsx          # Cross-chain swap UI
│   ├── constants.ts      # Shared constants
│   └── index.tsx         # CRA entry point
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Scripts

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `start`          | Run the development server with hot reload.              |
| `build`          | Produce a production build in `build/`.                  |
| `test`           | Run the Jest test suite via `react-scripts test`.        |
| `eject`          | Eject from CRA (one-way operation — avoid).              |

## Contributing

1. Branch from `main` (`git checkout -b your-name/short-topic`).
2. Run `bun run start` to verify the change in a browser.
3. Run `bun run build` before opening a PR — the production build catches type and lint errors that `start` may not.
4. Open a pull request against `main` describing the change and any environment additions.

## Contact

- Issues: [GitHub Issues](https://github.com/StormStatic/static-frontend/issues)
- Pull requests: [StormStatic/static-frontend](https://github.com/StormStatic/static-frontend)
