"use client"; // This is a client component

import { Wallet, getBytesCopy, sha256 } from "ethers";
import { gql, useMutation } from "@apollo/client";

import Decimal from "decimal.js";
import Loading from "./Loading";
import Order from "./Order";
// import { requestProvider } from "webln";
import { useState } from "react";

const CREATE_SELL_ORDER = gql`
  mutation CreateSolanaSellOrder(
    $destAddress: String!
    $paymentHash: String!
    $tokenAmount: Float!
  ) {
    CreateSolanaSellOrder(
      destAddress: $destAddress
      paymentHash: $paymentHash
      tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" # USDC
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

export default function Solana() {
  const AMOUNT_READABLE = "0.01"; // Set this

  const [destAddress, setDestAddress] = useState("");
  const [preimage] = useState<string>(Wallet.createRandom().privateKey);
  const [paymentHash] = useState<string>(sha256(getBytesCopy(preimage)));
  const [amount, setAmount] = useState(AMOUNT_READABLE);
  const [createSolanaSellOrder, { data, loading }] =
    useMutation(CREATE_SELL_ORDER);

  console.log("preimage: " + preimage);
  console.log("paymentHash " + paymentHash);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center gap-4 p-10 m-4">
        <div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-2xl mx-8 my-4 mb-12">
              Swap BTC (Lightning) to USDC (Solana)
            </p>
            <p>USDC Amount</p>
            <input
              className="mx-8 mb-4 border-2"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p>Destination Address (on Solana)</p>
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
        ) : data?.CreateSolanaSellOrder.id ? (
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
                createSolanaSellOrder({
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
        {data?.CreateSolanaSellOrder.id.length > 1 ? (
          <Order
            orderId={data?.CreateSolanaSellOrder.id}
            preimage={preimage}
            assetName="USDC"
            chainName="Solana"
          ></Order>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
