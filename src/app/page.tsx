"use client"; // This is a client component

import { randomBytes } from "crypto";
import Decimal from "decimal.js";
import { hexlify } from "ethers";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { RequestInvoiceResponse, requestProvider } from "webln";

export default function Home() {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [paymentHash, setPaymentHash] = useState("");

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const swapSatsToToken = async (ev: FormEvent) => {
    ev.preventDefault();
    setError(undefined);

    const amountInDecimal = new Decimal(amount);
    if (amountInDecimal.lessThanOrEqualTo(0)) {
      return;
    }

    setIsLoading(true);
    try {
      // Users must support webln
      const webln = await requestProvider();

      // Get users to sign a preimage. This is not the preimage after users have paid
      const hexPreimage = hexlify(randomBytes(32));
      const sig = await webln.signMessage(hexPreimage);

      const paymentHash = sig.signature;
      setPaymentHash(paymentHash);

      const paymentRequest = await _createSellTokenOrder(
        destAddress,
        paymentHash,
        amount
      );

      const sendPaymentResponse = await webln.sendPayment(paymentRequest);

      const isSuccess = await _sendPreimageToSwap(sendPaymentResponse.preimage);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>

        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>
      </div>
    </main>
  );
}

async function _createSellTokenOrder(
  destAddress: string,
  paymentHash: string,
  tokenAmount: string
) {
  return "mockedPaymentRequest";
}

async function _sendPreimageToSwap(preimage: string) {
  return true;
}
