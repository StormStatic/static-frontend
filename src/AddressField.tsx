"use client";

import { useEffect } from "react";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import toast from "react-hot-toast";

interface AddressFieldProps {
  chain: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export default function AddressField({
  chain,
  value,
  onChange,
  placeholder,
}: AddressFieldProps) {
  const { address: polygonAddress, isConnected: polygonConnected } =
    useWeb3ModalAccount();
  const { open: openWeb3Modal } = useWeb3Modal();
  const { publicKey } = useWallet();
  const { setVisible: setSolanaWalletVisible } = useWalletModal();

  const isConnected =
    (chain === "Polygon" && polygonConnected) ||
    (chain === "Solana" && !!publicKey);

  // Auto-fill address when Polygon wallet is connected
  useEffect(() => {
    if (chain === "Polygon" && polygonConnected && polygonAddress) {
      onChange(polygonAddress);
    }
  }, [chain, polygonConnected, polygonAddress, onChange]);

  // Auto-fill address when Solana wallet is connected
  useEffect(() => {
    if (chain === "Solana" && publicKey) {
      onChange(publicKey.toString());
    }
  }, [chain, publicKey, onChange]);

  const handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    if (chain === "Polygon") {
      openWeb3Modal();
    } else if (chain === "Solana") {
      setSolanaWalletVisible(true);
    } else {
      toast("Paste your Tron address — wallet autofill coming soon", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-semibold text-stone-500">
          Receive to
        </label>
        {isConnected ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Wallet connected
          </span>
        ) : (
          <a
            href="#"
            className="text-xs font-semibold text-orange-600 hover:text-orange-500 flex items-center gap-1 transition-colors"
            onClick={handleConnect}
          >
            ⌁ Connect wallet to autofill
          </a>
        )}
      </div>
      <input
        className="w-full px-3.5 py-3.5 rounded-xl border border-cream-300 bg-white text-xs font-mono text-stone-900 outline-none focus:border-orange-400 transition-colors placeholder-stone-400"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
