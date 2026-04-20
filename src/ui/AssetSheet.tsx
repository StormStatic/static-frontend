import { ChainOptions } from "../constants";

interface AssetOption {
  chain: ChainOptions;
  symbol: string;
  chainName: string;
  logo: string;
  chainLogo: string;
  alt: string;
}

const ASSETS: AssetOption[] = [
  {
    chain: ChainOptions.Polygon,
    symbol: "XSGD",
    chainName: "Polygon",
    logo: "./xsgd.png",
    chainLogo: "./matic.png",
    alt: "xsgd logo",
  },
  {
    chain: ChainOptions.Solana,
    symbol: "USDC",
    chainName: "Solana",
    logo: "./usdc.png",
    chainLogo: "./sol.png",
    alt: "usdc logo",
  },
  {
    chain: ChainOptions.Tron,
    symbol: "USDT",
    chainName: "Tron",
    logo: "./usdt.png",
    chainLogo: "./tron.png",
    alt: "usdt logo",
  },
];

interface AssetSheetProps {
  open: boolean;
  selected: ChainOptions;
  onSelect: (chain: ChainOptions) => void;
  onClose: () => void;
}

export default function AssetSheet({ open, selected, onSelect, onClose }: AssetSheetProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/30 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-card z-50 p-6 pb-8 animate-slide-up">
        <div className="w-10 h-1 bg-border rounded-pill mx-auto mb-5" />
        <h3 className="text-sm font-semibold text-ink mb-4">Select asset</h3>
        <div className="flex flex-col gap-2">
          {ASSETS.map((asset) => {
            const isSelected = asset.chain === selected;
            return (
              <button
                key={asset.chain}
                type="button"
                onClick={() => {
                  onSelect(asset.chain);
                  onClose();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-field transition-colors w-full text-left ${
                  isSelected ? "bg-inset" : "hover:bg-inset"
                }`}
              >
                <div className="relative shrink-0">
                  <img className="w-9 h-9 rounded-full" alt={asset.alt} src={asset.logo} />
                  <img
                    className="w-4 h-4 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-surface"
                    alt={`${asset.chainName} logo`}
                    src={asset.chainLogo}
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-ink">{asset.symbol}</span>
                  <span className="text-xs text-muted">{asset.chainName}</span>
                </div>
                {isSelected && (
                  <span className="ml-auto text-success font-semibold text-sm">&#10003;</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
