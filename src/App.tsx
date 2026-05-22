import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import Swap from "./Swap";
import { Toaster } from "react-hot-toast";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string;

const polygon = {
  chainId: 137,
  name: "Polygon",
  currency: "MATIC",
  explorerUrl: "https://polygonscan.com",
  rpcUrl: "https://rpc-mainnet.maticvigil.com",
};

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
const STATIC_GRAPHQL_URI = `${HOST}/graphql`;
const apolloClient = new ApolloClient({
  uri: STATIC_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

const network = WalletAdapterNetwork.Mainnet;

function App() {
  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ApolloProvider client={apolloClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Toaster />
            <Swap />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ApolloProvider>
  );
}

export default App;
