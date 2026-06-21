"use client";

import {
  CREATE_POLYGON_SELL_ORDER,
  CREATE_SOLANA_SELL_ORDER,
  CREATE_TRON_SELL_ORDER,
  ChainOptions,
} from "./constants";
import { Wallet, getBytesCopy, sha256 } from "ethers";

import AmountInput from "./ui/AmountInput";
import AssetPill from "./ui/AssetPill";
import AssetSheet from "./ui/AssetSheet";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Decimal from "decimal.js";
import Loading from "./Loading";
import Order from "./Order";
import ReceiveAddressField from "./ReceiveAddressField";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useMutation } from "@apollo/client";
import { useState } from "react";

export default function Swap() {
  const MIN_AMOUNT = "0.01";
  const [destAddress, setDestAddress] = useState("");
  const [chain, setChain] = useState(ChainOptions.Solana);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [preimage] = useState<string>(Wallet.createRandom().privateKey);
  const [paymentHash] = useState<string>(sha256(getBytesCopy(preimage)));
  const [amount, setAmount] = useState(MIN_AMOUNT);

  const gql = (): any => {
    switch (chain) {
      case ChainOptions.Polygon:
        return CREATE_POLYGON_SELL_ORDER;
      case ChainOptions.Solana:
        return CREATE_SOLANA_SELL_ORDER;
      case ChainOptions.Tron:
        return CREATE_TRON_SELL_ORDER;
    }
  };
  const [createOrder, { data, loading }] = useMutation(gql());

  const accessor = (): string => {
    switch (chain) {
      case ChainOptions.Polygon:
        return "CreatePolygonSellOrder";
      case ChainOptions.Solana:
        return "CreateSolanaSellOrder";
      case ChainOptions.Tron:
        return "CreateTronSellOrder";
    }
  };

  const assetName = () => {
    switch (chain) {
      case ChainOptions.Polygon:
        return "XSGD";
      case ChainOptions.Solana:
        return "USDC";
      case ChainOptions.Tron:
        return "USDT";
    }
  };

  const chainName = () => {
    switch (chain) {
      case ChainOptions.Polygon:
        return "Polygon";
      case ChainOptions.Solana:
        return "Solana";
      case ChainOptions.Tron:
        return "Tron";
    }
  };

  const connectButton = () => {
    switch (chain) {
      case ChainOptions.Polygon:
        return <w3m-button />;
      case ChainOptions.Solana:
        return <WalletMultiButton />;
      case ChainOptions.Tron:
        return null;
    }
  };

  const canCreateOrder = () => {
    if (amount.length < 1) return false;
    const amountInDecimal = new Decimal(amount);
    const minAmountInDecimal = new Decimal(MIN_AMOUNT);
    return (
      destAddress &&
      destAddress.length > 1 &&
      !amountInDecimal.lessThan(minAmountInDecimal)
    );
  };

  const handleChainSelect = (newChain: ChainOptions) => {
    if (newChain !== chain) {
      setDestAddress("");
    }
    setChain(newChain);
  };

  return (
    <div className="flex flex-col items-center px-5">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-sm font-semibold text-ink">Swap</h1>
          {connectButton()}
        </div>

        <Card>
          <div className="flex flex-col gap-5">
            <AmountInput
              value={amount}
              onChange={setAmount}
              pill={
                <AssetPill
                  chain={chain}
                  onClick={() => setSheetOpen(true)}
                />
              }
            />

            <div className="flex items-center gap-3 px-4 py-3 bg-inset rounded-field">
              <div className="w-8 h-8 rounded-full bg-walnut flex items-center justify-center shrink-0">
                <span className="text-surface text-sm">&#9889;</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-muted">Pay with</span>
                <span className="text-sm font-semibold text-ink">Lightning BTC</span>
              </div>
            </div>

            <ReceiveAddressField
              chain={chain}
              destAddress={destAddress}
              setDestAddress={setDestAddress}
            />

            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted">Pay via</span>
                <span className="text-ink">Lightning Network</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Est. settlement</span>
                <span className="text-ink">~ 30 seconds</span>
              </div>
            </div>

            {data?.[accessor()]?.id ? (
              <Order
                orderId={data[accessor()].id}
                preimage={preimage}
                assetName={assetName()}
                chainName={chainName()}
              />
            ) : loading ? (
              <div className="flex justify-center py-4">
                <Loading />
              </div>
            ) : (
              <Button
                disabled={!canCreateOrder()}
                onClick={() => {
                  if (canCreateOrder()) {
                    createOrder({
                      variables: {
                        destAddress,
                        paymentHash,
                        tokenAmount: parseFloat(amount),
                      },
                    });
                  }
                }}
              >
                Create order
              </Button>
            )}
          </div>
        </Card>
      </div>

      <AssetSheet
        open={sheetOpen}
        selected={chain}
        onSelect={handleChainSelect}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
