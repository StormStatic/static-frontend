import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

import Chain from "./Chain";
import { Toaster } from "react-hot-toast";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string;

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

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [polygon],
  projectId,
});

const HOST = "https://dev-static-api.ap.ngrok.io";
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
