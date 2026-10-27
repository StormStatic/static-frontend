import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

import Chain from "./Chain";
import { Toaster } from "react-hot-toast";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId =
  (process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string) ||
  "deadbeefdeadbeefdeadbeefdeadbeef";

// 2. Set chains
const polygon = {
  chainId: 137,
  name: "Polygon",
  currency: "MATIC",
  explorerUrl: "https://polygonscan.com",
  rpcUrl: "https://rpc-mainnet.maticvigil.com",
};

// 3. Create modal
const metadata = {
  name: "Static Exchange",
  description: "",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

try {
  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [polygon],
    projectId,
  });
} catch (e) {
  // Without a valid WalletConnect project id, Web3Modal would otherwise
  // throw at import time and crash the whole app, including chains that
  // don't need a wallet connection.
  console.warn("Web3Modal failed to initialize; wallet connect is unavailable.", e);
}

const HOST =
  process.env.REACT_APP_STATIC_API_HOST || "https://dev-static-api.ap.ngrok.io";
// const HOST = "http://localhost:8911";
const STATIC_GRAPHQL_URI = `${HOST}/graphql`;
const c = new ApolloClient({
  uri: STATIC_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div className="App">
      <ApolloProvider client={c}>
        <Toaster />
        <Chain />
      </ApolloProvider>
    </div>
  );
}

export default App;
