"use client"; // This is a client component

import {
  CREATE_POLYGON_SELL_ORDER,
  CREATE_SOLANA_SELL_ORDER,
} from "./constants";
import { Wallet, getBytesCopy, sha256 } from "ethers";
import { useEffect, useState } from "react";

import { ChainOptions } from "./constants";
import Decimal from "decimal.js";
import { FaAngleDown } from "react-icons/fa";
import Order from "./Order";
import { useMutation } from "@apollo/client";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export interface SwapParams {
  chain: ChainOptions;
}

export default function Swap({ chain }: SwapParams) {
  const MIN_AMOUNT = "0.01";
  const [destAddress, setDestAddress] = useState("");
  const [preimage] = useState<string>(Wallet.createRandom().privateKey);
  const [paymentHash] = useState<string>(sha256(getBytesCopy(preimage)));
  const [amount, setAmount] = useState(MIN_AMOUNT);

  const gql =
    chain === ChainOptions.Polygon
      ? CREATE_POLYGON_SELL_ORDER
      : CREATE_SOLANA_SELL_ORDER;
  const [createOrder, { data }] = useMutation(gql);

  const accessor =
    chain === ChainOptions.Polygon
      ? "CreatePolygonSellOrder"
      : "CreateSolanaSellOrder";

  const { address } = useWeb3ModalAccount();
  useEffect(() => {
    if (chain === ChainOptions.Polygon) {
      setDestAddress(address as string);
    }
  }, [address, chain]);

  const canCreateOrder = () => {
    const amountInDecimal = new Decimal(amount);
    const minAmountInDecimal = new Decimal(MIN_AMOUNT);
    return (
      destAddress &&
      destAddress.length > 1 &&
      !amountInDecimal.lessThan(minAmountInDecimal)
    );
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          <div className="flex flex-col border-2 rounded-3xl shadow-lg p-4">
            <div className="flex justify-end mb-3">
              {chain === ChainOptions.Polygon ? <w3m-button /> : <></>}
            </div>

            <div className="bg-gray-100 rounded-3xl mb-2">
              <div className="flex items-center justify-between mx-4">
                <div className="mb-8 mt-6">
                  <p className="text-gray-500">You buy</p>
                  <input
                    className="text-3xl bg-transparent placeholder-gray-300 w-20"
                    placeholder="0.00"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-center rounded-full border-2 px-1 py-1 bg-gray-50 shadow-sm gap-2">
                  {chain === ChainOptions.Polygon ? (
                    <>
                      <img
                        className="w-8 h-8"
                        alt="xsgd logo"
                        src="./xsgd.png"
                      />
                      <p className="text-sm">XSGD</p>
                    </>
                  ) : (
                    <>
                      <img
                        className="w-8 h-8"
                        alt="usdc logo"
                        src="./usdc.png"
                      />
                      <p className="text-sm">USDC</p>
                    </>
                  )}
                  <FaAngleDown className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-3xl mb-2">
              <div className="flex items-center justify-between mx-4">
                <div className="mb-8 mt-6">
                  <p className="text-gray-500">You pay</p>
                  <input
                    className="text-3xl bg-transparent placeholder-gray-300 w-20"
                    placeholder="0.00"
                    type="number"
                    value={amount}
                    disabled={true}
                  />
                </div>
                <div className="flex items-center justify-center rounded-full border-2 px-1 pr-2 py-1 bg-gray-50 shadow-sm gap-2">
                  <img className="w-8 h-8" alt="xsgd logo" src="./ln.png" />
                  <p className="text-sm">BTC(Lightning)</p>
                  <FaAngleDown className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-3xl mb-4">
              <div className="flex flex-col my-10 mx-4">
                <p className="text-gray-500">Receive to:</p>
                <input
                  className="text-2xl bg-transparent placeholder-gray-300 flex-grow"
                  type="text"
                  placeholder="0x..."
                  value={destAddress}
                  onChange={(e) => {
                    setDestAddress(e.target.value);
                  }}
                />
              </div>
            </div>
            {paymentHash.length < 1 ? (
              <></>
            ) : data?.[accessor]?.id ? (
              <></>
            ) : (
              <button
                className={
                  canCreateOrder()
                    ? "p-4 rounded-full text-gray-100 bg-blue-500 shadow-sm"
                    : "border-2 p-4 border-gray-200 rounded-full text-gray-300"
                }
                onClick={() => {
                  if (canCreateOrder()) {
                    createOrder({
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
            {data?.[accessor]?.id.length > 1 ? (
              <Order
                orderId={data?.[accessor]?.id}
                preimage={preimage}
                assetName={chain === ChainOptions.Polygon ? "XSGD" : "USDC"}
                chainName={
                  chain === ChainOptions.Polygon ? "Polygon" : "Solana"
                }
              ></Order>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
