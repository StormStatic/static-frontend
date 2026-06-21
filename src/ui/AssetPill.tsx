import { FaAngleDown } from "react-icons/fa";
import { ChainOptions } from "../constants";

interface AssetPillProps {
  chain: ChainOptions;
  onClick: () => void;
}

const ASSET_CONFIG: Record<ChainOptions, { logo: string; symbol: string; chainName: string; alt: string }> = {
  [ChainOptions.Polygon]: { logo: "./xsgd.png", symbol: "XSGD", chainName: "Polygon", alt: "xsgd logo" },
  [ChainOptions.Solana]: { logo: "./usdc.png", symbol: "USDC", chainName: "Solana", alt: "usdc logo" },
  [ChainOptions.Tron]: { logo: "./usdt.png", symbol: "USDT", chainName: "Tron", alt: "usdt logo" },
};

export default function AssetPill({ chain, onClick }: AssetPillProps) {
  const config = ASSET_CONFIG[chain];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 bg-surface border border-border rounded-pill pl-1.5 pr-3 py-1.5 shadow-sm hover:shadow transition-shadow cursor-pointer shrink-0"
    >
      <div className="relative">
        <img className="w-7 h-7 rounded-full" alt={config.alt} src={config.logo} />
        <img
          className="w-3.5 h-3.5 rounded-full absolute -bottom-0.5 -right-0.5 border border-surface"
          alt={`${config.chainName} logo`}
          src={`./${config.chainName.toLowerCase() === "polygon" ? "matic" : config.chainName.toLowerCase()}.png`}
        />
      </div>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-sm font-semibold text-ink">{config.symbol}</span>
        <span className="text-xs text-muted">{config.chainName}</span>
      </div>
      <FaAngleDown className="w-3 h-3 text-muted" />
    </button>
  );
}
