"use client"; // This is a client component

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function SolAddress({ destAddress, setDestAddress }: any) {
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      setDestAddress(publicKey.toString());
    } else {
      setDestAddress("");
    }
  }, [publicKey, setDestAddress]);

  return (
    <>
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
    </>
  );
}
