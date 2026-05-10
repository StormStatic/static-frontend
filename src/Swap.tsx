"use client";

import {
  CREATE_POLYGON_SELL_ORDER,
  CREATE_SOLANA_SELL_ORDER,
  CREATE_TRON_SELL_ORDER,
  ASSETS,
  AssetConfig,
} from "./constants";
import { Wallet, getBytesCopy, sha256 } from "ethers";
import Decimal from "decimal.js";
import TokenPicker from "./Chain";
import AddressField from "./AddressField";
import Loading from "./Loading";
import Order from "./Order";
import { useMutation } from "@apollo/client";
import { useState, useCallback } from "react";

// Mock exchange rate — replace with live rate query when available
const MOCK_RATE = 42735;

export default function Swap() {
  const MIN_AMOUNT = "0.01";

  const [selectedAsset, setSelectedAsset] = useState<AssetConfig>(ASSETS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [amount, setAmount] = useState("100");
  const [destAddress, setDestAddress] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [preimage] = useState<string>(() => Wallet.createRandom().privateKey);
  const [paymentHash] = useState<string>(() =>
    sha256(getBytesCopy(preimage))
  );

  const [createPolygon, polygonResult] = useMutation(CREATE_POLYGON_SELL_ORDER);
  const [createSolana, solanaResult] = useMutation(CREATE_SOLANA_SELL_ORDER);
  const [createTron, tronResult] = useMutation(CREATE_TRON_SELL_ORDER);

  const { createOrder, data, loading } = (() => {
    switch (selectedAsset.key) {
      case "usdc":
        return { createOrder: createSolana, data: solanaResult.data, loading: solanaResult.loading };
      case "xsgd":
        return { createOrder: createPolygon, data: polygonResult.data, loading: polygonResult.loading };
      case "usdt":
        return { createOrder: createTron, data: tronResult.data, loading: tronResult.loading };
      default:
        return { createOrder: createSolana, data: solanaResult.data, loading: solanaResult.loading };
    }
  })();

  const accessor = (): string => {
    switch (selectedAsset.key) {
      case "usdc":
        return "CreateSolanaSellOrder";
      case "xsgd":
        return "CreatePolygonSellOrder";
      case "usdt":
        return "CreateTronSellOrder";
      default:
        return "CreateSolanaSellOrder";
    }
  };

  const orderId: string | undefined = data?.[accessor()]?.id;
  const hasOrder = !!orderId && orderId.length > 1;

  const handleAssetSelect = useCallback((asset: AssetConfig) => {
    setSelectedAsset(asset);
    setDestAddress("");
    setPickerOpen(false);
  }, []);

  const btcAmount = (): string => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return "—";
    return (n / MOCK_RATE).toFixed(5) + " BTC";
  };

  const canCreateOrder = (): boolean => {
    if (!amount || amount.length < 1) return false;
    try {
      const amountDec = new Decimal(amount);
      const minDec = new Decimal(MIN_AMOUNT);
      return !!destAddress && destAddress.length > 1 && !amountDec.lessThan(minDec);
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!canCreateOrder()) return;
    createOrder({
      variables: {
        destAddress,
        paymentHash,
        tokenAmount: parseFloat(amount),
      },
    });
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: "#FDF8F1" }}>
        {/* Subtle background radial gradients */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.06), transparent 40%), radial-gradient(circle at 80% 70%, rgba(234,88,12,0.05), transparent 45%)",
          }}
        />

        {/* Header */}
        <header className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-stone-900">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-[9px] text-white text-base shadow-btn"
              style={{ background: "linear-gradient(90deg,#F97316,#EA580C)" }}
            >
              ⚡
            </div>
            Static
          </div>
          <nav className="flex gap-4 sm:gap-6 text-sm text-stone-500 font-medium">
            <a href="#" className="hover:text-orange-600 transition-colors">
              Swap
            </a>
            <a href="#" className="hover:text-orange-600 transition-colors">
              History
            </a>
            <a href="#" className="hover:text-orange-600 transition-colors">
              Docs
            </a>
          </nav>
        </header>

        {/* Main */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          {/* Tagline */}
          <div className="text-center mb-7">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 mb-1.5">
              Lightning in.{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#F97316,#EA580C)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Stablecoin out.
              </span>
            </h1>
            <p className="text-stone-500 text-sm">
              Atomic swaps from BTC over Lightning to USDC, XSGD, USDT.
            </p>
          </div>

          {/* Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-cream-300 shadow-card p-5 sm:p-7">
            {/* Mobile accordion toggle — pre-submit only */}
            {!hasOrder && (
              <button
                className="sm:hidden w-full flex items-center justify-between px-3.5 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sm font-semibold text-stone-700 mb-4 transition-colors"
                onClick={() => setSummaryOpen((v) => !v)}
                aria-expanded={summaryOpen}
              >
                <span>Order details</span>
                <span
                  className={`text-stone-500 text-xs transition-transform duration-200 ${
                    summaryOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* LEFT: Form */}
              <section aria-label="Swap form">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3.5">
                  Swap
                </p>

                {/* You receive */}
                <p className="text-xs font-semibold text-stone-500 mb-1.5">
                  You receive
                </p>
                <div className="bg-cream-100 border border-cream-300 rounded-[18px] px-4 py-3.5 mb-3 focus-within:border-orange-400 focus-within:bg-white transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      className="bg-transparent text-3xl font-bold text-stone-900 outline-none w-full placeholder-stone-300 tracking-tight"
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      aria-label="Amount to receive"
                      disabled={hasOrder}
                    />
                    <button
                      className="flex items-center gap-2 bg-white border border-cream-300 rounded-full px-3 py-1.5 text-sm font-semibold text-stone-900 hover:border-orange-400 hover:bg-orange-50 transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                      onClick={() => setPickerOpen(true)}
                      aria-haspopup="dialog"
                      disabled={hasOrder}
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ background: selectedAsset.iconBg }}
                      >
                        {selectedAsset.iconText}
                      </span>
                      {selectedAsset.token}&nbsp;·&nbsp;{selectedAsset.chain}
                      <span className="text-stone-400 text-xs">▾</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-400 mt-1.5">
                    on {selectedAsset.chain}
                  </p>
                </div>

                {/* Arrow divider */}
                <div className="flex justify-center -my-1.5 relative z-10">
                  <div className="w-8 h-8 bg-white border-2 border-cream-300 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                    ↓
                  </div>
                </div>

                {/* You pay */}
                <div className="bg-orange-50 border border-orange-200 rounded-[18px] px-4 py-3.5 mb-3.5 mt-3">
                  <p className="text-xs font-semibold text-orange-900 flex items-center gap-1 mb-1">
                    ⚡ You pay over Lightning
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-stone-900 tracking-tight">
                      {btcAmount()}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white border border-orange-200 rounded-full px-2.5 py-1 text-xs font-bold text-orange-900">
                      ⚡ Lightning
                    </span>
                  </div>
                </div>

                {/* Address field — faded once order exists */}
                <div className={hasOrder ? "opacity-50 pointer-events-none" : ""}>
                  <AddressField
                    chain={selectedAsset.chain}
                    value={destAddress}
                    onChange={setDestAddress}
                    placeholder={selectedAsset.addrPlaceholder}
                  />
                </div>

                {/* CTA / loading state */}
                {hasOrder ? null : loading ? (
                  <div className="flex justify-center py-2">
                    <Loading />
                  </div>
                ) : (
                  <button
                    className="w-full text-white rounded-xl py-4 text-sm font-bold tracking-wide transition-all"
                    style={{
                      background: canCreateOrder()
                        ? "linear-gradient(90deg,#F97316,#EA580C)"
                        : "#D6D3D1",
                      boxShadow: canCreateOrder()
                        ? "0 4px 14px rgba(249,115,22,0.35)"
                        : "none",
                      cursor: canCreateOrder() ? "pointer" : "not-allowed",
                    }}
                    onClick={handleSubmit}
                    disabled={!canCreateOrder()}
                  >
                    Create swap order
                  </button>
                )}
              </section>

              {/* RIGHT: Order preview (pre-submit) or Order tracking (post-submit) */}
              <aside
                className={`${
                  hasOrder || summaryOpen ? "block" : "hidden sm:block"
                }`}
                aria-label="Order details"
              >
                {hasOrder ? (
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3.5">
                      Order tracking
                    </p>
                    <Order
                      orderId={orderId}
                      preimage={preimage}
                      assetName={selectedAsset.token}
                      chainName={selectedAsset.chain}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3.5">
                      Order preview
                    </p>
                    <div className="bg-cream-100 border border-cream-300 rounded-[18px] p-5">
                      <SummaryRow
                        label={
                          <>
                            Rate{" "}
                            <InfoTip title="Live mid-market rate" />
                          </>
                        }
                        value={`1 BTC = ${MOCK_RATE.toLocaleString()} ${selectedAsset.token}`}
                      />
                      <SummaryRow
                        label="Network fee"
                        value="~ 0.000012 BTC"
                        borderTop
                      />
                      <SummaryRow
                        label="Service fee"
                        value="0.30%"
                        borderTop
                      />
                      <SummaryRow
                        label="Route"
                        borderTop
                        value={
                          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-900 border border-orange-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                            ⚡ BTC-LN → {selectedAsset.chain}
                          </span>
                        }
                      />
                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-cream-300">
                        <span className="font-bold text-sm text-stone-900">
                          You'll pay
                        </span>
                        <span className="font-bold text-base text-orange-900">
                          {btcAmount()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>

          <p className="text-center text-xs text-stone-400 mt-5">
            Non-custodial atomic swap · No KYC ·{" "}
            <a href="#" className="text-orange-600 font-semibold">
              How it works
            </a>
          </p>
        </main>
      </div>

      {/* Token picker modal */}
      <TokenPicker
        open={pickerOpen}
        selected={selectedAsset.key}
        onSelect={handleAssetSelect}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}

function SummaryRow({
  label,
  value,
  borderTop = false,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  borderTop?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-2 text-sm ${
        borderTop ? "border-t border-cream-300" : ""
      }`}
    >
      <span className="text-stone-500 flex items-center">{label}</span>
      <span className="font-semibold text-stone-900 flex items-center">
        {value}
      </span>
    </div>
  );
}

function InfoTip({ title }: { title: string }) {
  return (
    <span
      className="w-3.5 h-3.5 rounded-full bg-cream-300 text-stone-500 text-[10px] flex items-center justify-center font-bold cursor-help ml-1"
      title={title}
    >
      i
    </span>
  );
}
