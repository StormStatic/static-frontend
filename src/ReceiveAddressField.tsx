"use client";

import { ChainOptions } from "./constants";
import { Clipboard } from "@capacitor/clipboard";
import { useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

interface Props {
  chain: ChainOptions;
  destAddress: string;
  setDestAddress: (v: string) => void;
}

function PolygonAutoFill({ setDestAddress }: { setDestAddress: (v: string) => void }) {
  const { address } = useWeb3ModalAccount();
  useEffect(() => {
    if (address) setDestAddress(address);
  }, [address, setDestAddress]);
  return null;
}

function SolanaAutoFill({ setDestAddress }: { setDestAddress: (v: string) => void }) {
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

export default function ReceiveAddressField({ chain, destAddress, setDestAddress }: Props) {
  const handlePaste = async () => {
    try {
      const { value } = await Clipboard.read();
      if (value) {
        setDestAddress(value);
        toast.success("Pasted!", { duration: 1500 });
      }
    } catch {
      toast.error("Unable to read clipboard");
    }
  };

  const placeholder = chain === ChainOptions.Tron ? "T..." : "0x...";

  return (
    <div className="bg-inset rounded-field px-4 py-4">
      <p className="text-xs text-muted mb-1">Receive to</p>
      <div className="flex items-center gap-2">
        <input
          className="text-sm bg-transparent text-ink placeholder-border outline-none w-full min-w-0"
          type="text"
          placeholder={placeholder}
          value={destAddress}
          onChange={(e) => setDestAddress(e.target.value)}
        />
        <button
          onClick={handlePaste}
          className="text-xs text-muted hover:text-ink px-2 py-1 rounded-pill border border-border transition-colors shrink-0"
        >
          Paste
        </button>
      </div>
      {chain === ChainOptions.Polygon && <PolygonAutoFill setDestAddress={setDestAddress} />}
      {chain === ChainOptions.Solana && <SolanaAutoFill setDestAddress={setDestAddress} />}
    </div>
  );
}
