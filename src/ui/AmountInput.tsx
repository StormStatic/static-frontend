import { ReactNode } from "react";

interface AmountInputProps {
  value: string;
  onChange: (v: string) => void;
  pill: ReactNode;
}

export default function AmountInput({ value, onChange, pill }: AmountInputProps) {
  return (
    <div className="bg-inset rounded-field px-4 py-4">
      <p className="text-xs text-muted mb-1">You receive</p>
      <div className="flex items-center justify-between gap-3">
        <input
          className="text-3xl font-semibold bg-transparent text-ink placeholder-border outline-none w-full min-w-0"
          placeholder="0.00"
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {pill}
      </div>
    </div>
  );
}
