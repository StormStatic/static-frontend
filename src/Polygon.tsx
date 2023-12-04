import { Wallet, getBytesCopy, sha256 } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

import Decimal from "decimal.js";
import Loading from "./Loading";
import Order from "./Order";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

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

const CREATE_SELL_ORDER = gql`
  mutation CreatePolygonSellOrder(
    $destAddress: String!
    $paymentHash: String!
    $tokenAmount: Float!
  ) {
    CreatePolygonSellOrder(
      destAddress: $destAddress
      paymentHash: $paymentHash
      tokenAddress: "0xdc3326e71d45186f113a2f448984ca0e8d201995" # XSGD
      tokenAmount: $tokenAmount
    ) {
      id
      status
      paymentHash
      tokenAddress
      tokenAmount
      destAddress
      metadata
    }
  }
`;

export default function Polygon() {
  const AMOUNT_READABLE = "0.01"; // Set this

  const [destAddress, setDestAddress] = useState("");
  const [preimage] = useState<string>(Wallet.createRandom().privateKey);
  const [paymentHash] = useState<string>(sha256(getBytesCopy(preimage)));
  const [amount, setAmount] = useState(AMOUNT_READABLE);
  const [createPolygonSellOrder, { data, loading }] =
    useMutation(CREATE_SELL_ORDER);
  const { address } = useWeb3ModalAccount();

  console.log("preimage: " + preimage);
  console.log("paymentHash " + paymentHash);

  useEffect(() => {
    setDestAddress(address as string);
  }, [address]);

  return (
    <>
      <div className="m-4 flex justify-end">
        <w3m-button />
      </div>
      <div className="flex min-h-screen flex-col items-center gap-4 p-10 m-4">
        <div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-2xl mx-8 my-4 mb-12">
              Swap BTC (Lightning) to XSGD (Polygon)
            </p>
            <p>XSGD Amount</p>
            <input
              className="mx-8 mb-4 border-2"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p>Destination Address (on Polygon)</p>
            <input
              className="mx-8 mb-4 border-2"
              type="text"
              value={destAddress}
              onChange={(e) => {
                setDestAddress(e.target.value);
              }}
            />
          </div>
        </div>
        {paymentHash.length < 1 ? (
          <></>
        ) : data?.CreatePolygonSellOrder.id ? (
          <></>
        ) : loading ? (
          <Loading />
        ) : (
          <button
            className="border-2 p-4 border-gray-800 rounded-full active:border-blue-400"
            onClick={() => {
              const amountInDecimal = new Decimal(amount);
              const minAmountInDecimal = new Decimal(AMOUNT_READABLE);
              if (
                destAddress.length > 1 &&
                !amountInDecimal.lessThan(minAmountInDecimal)
              ) {
                createPolygonSellOrder({
                  variables: {
                    destAddress,
                    paymentHash,
                    tokenAmount: parseFloat(amount) * 1000000,
                  },
                });
              }
            }}
          >
            Create Order
          </button>
        )}
        {data?.CreatePolygonSellOrder.id.length > 1 ? (
          <Order
            orderId={data?.CreatePolygonSellOrder.id}
            preimage={preimage}
            assetName="XSGD"
            chainName="Polygon"
          ></Order>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
