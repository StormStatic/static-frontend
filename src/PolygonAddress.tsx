"use client"; // This is a client component

import { useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function PolygonAddress({ destAddress, setDestAddress }: any) {
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    setDestAddress(address as string);
  }, [address, setDestAddress]);

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
