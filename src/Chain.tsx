import { useState } from "react";
import { ASSETS, AssetConfig } from "./constants";

interface TokenPickerProps {
  open: boolean;
  selected: string;
  onSelect: (asset: AssetConfig) => void;
  onClose: () => void;
}

export default function TokenPicker({
  open,
  selected,
  onSelect,
  onClose,
}: TokenPickerProps) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = ASSETS.filter(
    (a) =>
      a.token.toLowerCase().includes(search.toLowerCase()) ||
      a.chain.toLowerCase().includes(search.toLowerCase()) ||
      a.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(28,25,23,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="token-picker-title"
    >
      <div className="w-full sm:max-w-sm bg-white sm:rounded-2xl rounded-t-2xl p-5 shadow-modal border border-cream-300">
        <div className="flex justify-between items-center mb-3.5">
          <span
            id="token-picker-title"
            className="font-bold text-base text-stone-900"
          >
            Select asset
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-cream-100 text-stone-500 text-xl leading-none hover:bg-cream-200 transition-colors"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <input
          className="w-full px-3.5 py-3 rounded-xl border border-cream-300 bg-cream-100 text-sm mb-3.5 outline-none focus:border-orange-400 focus:bg-white transition-colors"
          type="text"
          placeholder="Search asset or chain"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 px-1">
          Available on Static
        </p>

        {filtered.map((asset) => (
          <button
            key={asset.key}
            className={`flex items-center gap-3 w-full p-3.5 border rounded-xl mb-2 last:mb-0 text-left transition-all ${
              selected === asset.key
                ? "border-orange-500 bg-orange-50"
                : "border-cream-300 hover:border-orange-400 hover:bg-orange-50"
            }`}
            onClick={() => {
              onSelect(asset);
              setSearch("");
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: asset.iconBg }}
            >
              {asset.iconText}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-bold text-sm text-stone-900">{asset.token}</p>
              <p className="text-xs text-stone-500 mt-0.5">
                {asset.fullName} · {asset.chain}
              </p>
            </div>
            <span
              className={`text-orange-600 text-lg font-bold transition-opacity ${
                selected === asset.key ? "opacity-100" : "opacity-0"
              }`}
            >
              ✓
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
