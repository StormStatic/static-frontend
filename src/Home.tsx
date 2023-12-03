"use client"; // This is a client component

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Wallet, getBytesCopy, sha256 } from "ethers";

import Decimal from "decimal.js";
import Order from "./Order";
import { requestProvider } from "webln";
import Loading from "./Loading";

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

export default function Home() {
  const AMOUNT_READABLE = "0.01"; // Set this

  const [destAddress, setDestAddress] = useState("");
  const [preimage, setPreimage] = useState<Uint8Array>(
    getBytesCopy(Wallet.createRandom().privateKey)
  );
  const [paymentHash, setPaymentHash] = useState<string>(sha256(preimage));
  const [amount, setAmount] = useState(AMOUNT_READABLE);
  const [createSellOrder, { data, loading, error }] =
    useMutation(CREATE_SELL_ORDER);

  console.log("preimage: " + preimage);
  console.log("paymentHash " + paymentHash);
  const orderId = data === undefined ? "" : data.CreateSellOrder.id;
  console.log("orderId: " + orderId);

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
              className="indent-2 mx-8 mb-4 border-2"
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
        ) : orderId ? (
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
                createSellOrder({
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
        {orderId.length > 1 ? (
          <Order orderId={orderId} preimage={preimage}></Order>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
