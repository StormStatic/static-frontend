import { ChainOptions } from "./constants";
import Connect from "./Connect";
import Swap from "./Swap";
import { useState } from "react";

function Chain() {
  const [chain, setChain] = useState(ChainOptions.Polygon);
  const buttonColor = (test: ChainOptions) => {
    if (chain === test) {
      return "bg-blue-300";
    }
  };
  const swapEl = () => {
    switch (chain) {
      case ChainOptions.Polygon:
        return <Swap key={"1"} chain={ChainOptions.Polygon}></Swap>;
      case ChainOptions.Solana:
        return (
          <Connect chain={ChainOptions.Solana}>
            <Swap key={"2"} chain={ChainOptions.Solana}></Swap>
          </Connect>
        );
      case ChainOptions.Tron:
        return <Swap key={"3"} chain={ChainOptions.Tron}></Swap>;
    }
  };
  const chainButton = (
    chainOpt: ChainOptions,
    imgsrc: string,
    text: string
  ) => {
    return (
      <button
        className={`border-1 rounded-xl px-4 py-1 ${buttonColor(chainOpt)}`}
        onClick={() => setChain(chainOpt)}
      >
        <div className="flex gap-2 items-center justify-center">
          <img className="w-5 h-5" src={imgsrc} alt="logo"></img>
          <p>{text}</p>
        </div>
      </button>
    );
  };
  return (
    <>
      <div className="m-4 flex justify-center">
        {chainButton(ChainOptions.Polygon, "./matic.png", "Polygon")}
        {chainButton(ChainOptions.Solana, "./sol.png", "Solana")}
        {chainButton(ChainOptions.Tron, "./sol.png", "Tron")}
      </div>
      <div>{swapEl()}</div>
    </>
  );
}

export default Chain;
