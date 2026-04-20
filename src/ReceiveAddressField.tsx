"use client";

import { ChainOptions } from "./constants";
import { useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useWallet } from "@solana/wallet-adapter-react";

interface ReceiveAddressFieldProps {
  chain: ChainOptions;
  destAddress: string;
  setDestAddress: (addr: string) => void;
}

function PolygonAutoFill({ setDestAddress }: { setDestAddress: (addr: string) => void }) {
  const { address } = useWeb3ModalAccount();
  useEffect(() => {
    setDestAddress(address as string);
  }, [address, setDestAddress]);
  return null;
}

function SolanaAutoFill({ setDestAddress }: { setDestAddress: (addr: string) => void }) {
  const { publicKey } = useWallet();
  useEffect(() => {
    if (publicKey) {
      setDestAddress(publicKey.toString());
    } else {
      setDestAddress("");
    }
  }, [publicKey, setDestAddress]);
  return null;
}

export default function ReceiveAddressField({
  chain,
  destAddress,
  setDestAddress,
}: ReceiveAddressFieldProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDestAddress(text);
    } catch {
      // Clipboard API not available
    }
  };

  const placeholder = chain === ChainOptions.Tron ? "T..." : "0x...";

  return (
    <div>
      {chain === ChainOptions.Polygon && <PolygonAutoFill setDestAddress={setDestAddress} />}
      {chain === ChainOptions.Solana && <SolanaAutoFill setDestAddress={setDestAddress} />}
      <span className="text-xs uppercase tracking-wider text-muted">Receive to</span>
      <div className="flex items-center gap-2 bg-inset rounded-field px-4 py-3 mt-1.5">
        <input
          className="text-sm text-ink bg-transparent placeholder-muted outline-none w-full min-w-0"
          type="text"
          placeholder={placeholder}
          value={destAddress}
          onChange={(e) => setDestAddress(e.target.value)}
        />
        <button
          type="button"
          onClick={handlePaste}
          className="text-xs font-semibold text-walnut shrink-0 px-2 py-1 rounded-pill hover:bg-border/50 transition-colors"
        >
          Paste
        </button>
      </div>
    </div>
  );
}
