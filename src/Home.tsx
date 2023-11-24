"use client"; // This is a client component

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { FormEvent, useState } from "react";
import { RequestInvoiceResponse, requestProvider } from "webln";
import { Wallet, getBytesCopy, hexlify, sha256 } from "ethers";

import Decimal from "decimal.js";

// import { randomBytes } from "crypto";

const CREATE_SELL_ORDER = gql`
  mutation CreateSellOrder(
    $destAddress: String!
    $paymentHash: String!
    $tokenAmount: Float!
  ) {
    CreateSellOrder(
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

const GET_SELL_ORDER = gql`
  query GetSellOrder($id: String!) {
    sellOrder(id: $id) {
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

export default function Home() {
  const STATIC_GRAPHQL_URI = "https://dev-static-api.ap.ngrok.io/graphql";
  const STATIC_PREIMAGE_URI = "https://dev-static-api.ap.ngrok.io/preimage";
  const DEST_ADDRESS_TESTER = "0x95383D2BEFF0Df0A6DC2c8957F0066Ad8172BE53"; // Set this
  const AMOUNT_READABLE = "0.01"; // Set this

  const [destAddress, setDestAddress] = useState(DEST_ADDRESS_TESTER);
  const [paymentHash, setPaymentHash] = useState<string>("");
  const [preimage, setPreimage] = useState<string>("");
  const [amount, setAmount] = useState(AMOUNT_READABLE);
  const [orderId, setOrderId] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  // const handleAmountChange = (value: string) => {
  //   setAmount(value);
  // };

  const swapSatsToToken = async (ev: FormEvent) => {
    ev.preventDefault();
    setError(undefined);

    const amountInDecimal = new Decimal(amount);
    if (amountInDecimal.lessThanOrEqualTo(0)) {
      return;
    }

    setIsLoading(true);
    try {
      // Users must support webln
      const webln = await requestProvider();

      // Get users to sign a preimage. This is not the preimage after users have paid
      // const hexPreimage = hexlify(randomBytes(32));
      // const sig = await webln.signMessage(hexPreimage);

      // const paymentHash = sig.signature;
      // setPaymentHash(paymentHash);

      // const paymentRequest = await _createSellTokenOrder(
      //   destAddress,
      //   paymentHash,
      //   amount
      // );

      // const sendPaymentResponse = await webln.sendPayment(paymentRequest);

      // const isSuccess = await _sendPreimageToSwap(sendPaymentResponse.preimage);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHash = async () => {
    const pre = Wallet.createRandom().privateKey;
    const hash = sha256(getBytesCopy(pre));
    setPreimage(pre);
    setPaymentHash(hash);
  };

  const createSellOrder = async () => {
    const c = new ApolloClient({
      uri: STATIC_GRAPHQL_URI,
      cache: new InMemoryCache(),
    });
    const result = await c.mutate({
      mutation: CREATE_SELL_ORDER,
      variables: {
        destAddress,
        paymentHash,
        tokenAmount: parseFloat(amount) * 1000000,
      },
    });
    console.log(result);
    setOrderId(result.data.CreateSellOrder.id);
    setOrder(result.data.CreateSellOrder);
    return result;
  };

  const queryOrder = async () => {
    const c = new ApolloClient({
      uri: STATIC_GRAPHQL_URI,
      cache: new InMemoryCache(),
    });
    const result = await c.query({
      query: GET_SELL_ORDER,
      variables: { id: orderId },
    });

    setOrder(result.data.sellOrder);

    if (result.data.sellOrder.metadata.invoice) {
      setInvoice(result.data.sellOrder.metadata.invoice);
    }

    if (result.data.sellOrder.status === "DeployedContract") {
      const url =
        "https://corsproxy.io/?" + encodeURIComponent(STATIC_PREIMAGE_URI);
      const result = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { wid: orderId, preimage: preimage } }),
      });
      console.log(result);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-10">
      <div>
        <p>{"OrderId: " + orderId}</p>
        <p className="break-all">{"paymentHash: " + paymentHash}</p>
        <p className="break-all">{"preimage: " + preimage}</p>
        <p>{"destAddress: " + destAddress}</p>
        <p>{"Amount: XSGD " + amount}</p>
        <p>{error?.message}</p>
      </div>
      {paymentHash.length < 1 ? (
        <>
          <button
            className="border-2 p-4 border-gray-800 rounded-full"
            onClick={() => {
              generateHash();
            }}
          >
            Tap Me to generatePaymentHash
          </button>
        </>
      ) : (
        <></>
      )}
      {orderId ? (
        <></>
      ) : (
        <button
          className="border-2 p-4 border-gray-800 rounded-full"
          onClick={() => {
            createSellOrder();
          }}
        >
          Tap Me to createSellOrder
        </button>
      )}

      {orderId ? (
        <div>
          <div>
            {invoice ? <p className="break-all my-4">{invoice}</p> : <></>}
          </div>
          <div>
            {order ? (
              <>
                <div className="text-xl break-all my-4">
                  <p>{"Status: " + order.status}</p>
                  <p>{order.metadata.failureReason}</p>
                </div>
                <p className="text-sm break-all my-4">
                  {JSON.stringify(order)}
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
          <button
            className="border-2 p-4 border-gray-800 rounded-full"
            onClick={() => {
              queryOrder();
            }}
          >
            Tap Me to refresh queryOrder
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
