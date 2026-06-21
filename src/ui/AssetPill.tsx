import { ChainOptions } from "../constants";
import { FaAngleDown } from "react-icons/fa";

const ASSET_CONFIG: Record<ChainOptions, { token: string; tokenLogo: string; chainLogo: string }> = {
  [ChainOptions.Polygon]: { token: "XSGD",  tokenLogo: "./xsgd.png", chainLogo: "./matic.png" },
  [ChainOptions.Solana]:  { token: "USDC",  tokenLogo: "./usdc.png", chainLogo: "./sol.png" },
  [ChainOptions.Tron]:    { token: "USDT",  tokenLogo: "./usdt.png", chainLogo: "./tron.png" },
};

interface AssetPillProps {
  chain: ChainOptions;
  onClick: () => void;
}

export default function AssetPill({ chain, onClick }: AssetPillProps) {
  const cfg = ASSET_CONFIG[chain];
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-surface border border-border rounded-pill px-3 py-1.5 hover:shadow transition-shadow"
    >
      <div className="relative w-8 h-8">
        <img className="w-8 h-8 rounded-full" alt={cfg.token} src={cfg.tokenLogo} />
        <img
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border border-surface"
          alt="chain"
          src={cfg.chainLogo}
        />
      </div>
      <span className="text-sm font-semibold text-ink">{cfg.token}</span>
      <FaAngleDown className="w-3 h-3 text-muted" />
    </button>
  );
}
