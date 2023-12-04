import Polygon from "./Polygon";
import Solana from "./Solana";
import { useState } from "react";

enum ChainOptions {
  Polygon,
  Solana,
}
function Chain() {
  const [chain, setChain] = useState(ChainOptions.Polygon);
  const buttonColor = (test: ChainOptions) => {
    if (chain === test) {
      return "bg-blue-200";
    }
  };
  return (
    <>
      <div className="m-4 flex justify-center">
        <button
          className={`border-2 px-4 rounded-xl py-1 ${buttonColor(
            ChainOptions.Solana
          )}`}
          onClick={() => setChain(ChainOptions.Solana)}
        >
          Solana
        </button>
        <button
          className={`border-2 px-4 rounded-xl py-1 ${buttonColor(
            ChainOptions.Polygon
          )}`}
          onClick={() => setChain(ChainOptions.Polygon)}
        >
          Polygon
        </button>
      </div>
      <div>
        {chain === ChainOptions.Polygon ? (
          <Polygon></Polygon>
        ) : (
          <Solana></Solana>
        )}
      </div>
    </>
  );
}

export default Chain;
