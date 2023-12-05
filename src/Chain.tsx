import { ChainOptions } from "./constants";
import Swap from "./Swap";
import { useState } from "react";

function Chain() {
  const [chain, setChain] = useState(ChainOptions.Polygon);
  const buttonColor = (test: ChainOptions) => {
    if (chain === test) {
      return "bg-blue-300";
    }
  };
  return (
    <>
      <div className="m-4 flex justify-center">
        <button
          className={`border-1 rounded-xl px-4 py-1 ${buttonColor(
            ChainOptions.Solana
          )}`}
          onClick={() => setChain(ChainOptions.Solana)}
        >
          <div className="flex gap-2 items-center justify-center">
            <img className="w-5 h-5" src="./sol.png" alt="solana logo"></img>
            <p>Solana</p>
          </div>
        </button>

        <button
          className={`border-1 rounded-xl px-4 py-1 ${buttonColor(
            ChainOptions.Polygon
          )}`}
          onClick={() => setChain(ChainOptions.Polygon)}
        >
          <div className="flex gap-2 items-center justify-center">
            <img className="w-5 h-5" src="./matic.png" alt="matic logo"></img>
            <p>Polygon</p>
          </div>
        </button>
      </div>
      <div>
        {chain === ChainOptions.Polygon ? (
          <Swap key={"1"} chain={ChainOptions.Polygon}></Swap>
        ) : (
          <Swap key={"2"} chain={ChainOptions.Solana}></Swap>
        )}
      </div>
    </>
  );
}

export default Chain;
