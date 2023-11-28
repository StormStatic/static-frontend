"use client"; // This is a client component

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { FormEvent, useState } from "react";
import { RequestInvoiceResponse, requestProvider } from "webln";
import { Wallet, getBytesCopy, hexlify, sha256 } from "ethers";

import Decimal from "decimal.js";

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
  const HOST = "https://dev-static-api.ap.ngrok.io";
  // const HOST = "http://localhost:8911";
  const STATIC_GRAPHQL_URI = `${HOST}/graphql`;
  const STATIC_PREIMAGE_URI = `${HOST}/preimage`;
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
  const [isPolling, setIsPolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const { loading, error, data } = await c.query({
      query: GET_SELL_ORDER,
      variables: { id: orderId },
      pollInterval: 5000, // query once every 5sec
    });

    setOrder(data.sellOrder);

    if (data.sellOrder.metadata.invoice) {
      setInvoice(data.sellOrder.metadata.invoice);
    }

    if (data.sellOrder.status === "DeployedContract") {
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
    <div className="flex min-h-screen flex-col items-center gap-4 p-10 m-4">
      <div>
        <div className="flex flex-col">
          <p>Amount</p>
          <input
            className="mx-8 mb-4 border-2"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p>Destination Address</p>
          <input
            className="mx-8 mb-4 border-2"
            type="text"
            value={destAddress}
            onChange={(e) => setDestAddress(e.target.value)}
          />
        </div>

        <p>{"OrderId: " + orderId}</p>

        <p className="break-all">{"paymentHash: " + paymentHash}</p>
        <div className="border-2 p-4 border-red-400">
          <p className="break-all">{"preimage: " + preimage}</p>
          <p className="text-red-500">
            Warning: Preimage is only stored here in memory, refreshing the page
            will lose it
          </p>
        </div>
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
      {paymentHash.length < 1 ? (
        <></>
      ) : orderId ? (
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
            {invoice ? (
              <>
                <p className="font-bold">Invoice To Pay</p>
                <p className="break-all mb-4">{invoice}</p>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            {order ? (
              <>
                <div className="text-xl break-all my-4">
                  <p>{"Status: " + order.status}</p>
                  <p>{order.metadata.failureReason}</p>
                </div>
                {order.metadata.escrowAddress ? (
                  <>
                    <div className="flex text-md">
                      <p>{"Lock Contract: " + order.metadata.escrowAddress}</p>
                      <a
                        className="text-blue underline ml-4"
                        href={`https://polygonscan.com/address/${order.metadata.escrowAddress}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        polygonscan
                      </a>
                    </div>
                    <div className="flex text-md">
                      <p>{"Deposit Txn: " + order.metadata.depositTx}</p>
                      <a
                        className="text-blue underline ml-4"
                        href={`https://polygonscan.com/tx/${order.metadata.depositTx}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        polygonscan
                      </a>
                    </div>
                    <div className="flex text-md">
                      <p>{"Release Txn: " + order.metadata.transactionHash}</p>
                      <a
                        className="text-blue underline ml-4"
                        href={`https://polygonscan.com/tx/${order.metadata.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        polygonscan
                      </a>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <p className="text-xs break-all my-4">
                  {JSON.stringify(order)}
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
          {!isPolling ? (
            <button
              className="border-2 p-4 border-gray-800 rounded-full"
              onClick={() => {
                setIsPolling(true);
                queryOrder();
              }}
            >
              Tap Me to Start Polling
            </button>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
