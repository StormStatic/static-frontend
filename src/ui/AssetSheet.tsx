import { ChainOptions } from "../constants";

const OPTIONS: { chain: ChainOptions; token: string; network: string; logo: string; chainLogo: string }[] = [
  { chain: ChainOptions.Polygon, token: "XSGD",  network: "Polygon",  logo: "./xsgd.png", chainLogo: "./matic.png" },
  { chain: ChainOptions.Solana,  token: "USDC",  network: "Solana",   logo: "./usdc.png", chainLogo: "./sol.png" },
  { chain: ChainOptions.Tron,    token: "USDT",  network: "Tron",     logo: "./usdt.png", chainLogo: "./tron.png" },
];

interface AssetSheetProps {
  open: boolean;
  selected: ChainOptions;
  onSelect: (c: ChainOptions) => void;
  onClose: () => void;
}

export default function AssetSheet({ open, selected, onSelect, onClose }: AssetSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-t-card p-6 animate-slide-up">
        <p className="text-sm font-semibold text-ink mb-4">Select asset</p>
        <div className="flex flex-col gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.chain}
              onClick={() => { onSelect(opt.chain); onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-field transition-colors ${
                selected === opt.chain ? "bg-inset" : "hover:bg-inset/50"
              }`}
            >
              <div className="relative w-10 h-10">
                <img className="w-10 h-10 rounded-full" alt={opt.token} src={opt.logo} />
                <img
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-surface"
                  alt={opt.network}
                  src={opt.chainLogo}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-ink">{opt.token}</p>
                <p className="text-xs text-muted">{opt.network}</p>
              </div>
              {selected === opt.chain && (
                <span className="ml-auto text-success text-lg">&#10003;</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
