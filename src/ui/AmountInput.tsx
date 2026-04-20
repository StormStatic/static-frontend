import { ReactNode } from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  pill: ReactNode;
}

export default function AmountInput({
  value,
  onChange,
  placeholder = "0.00",
  pill,
}: AmountInputProps) {
  return (
    <div className="bg-inset rounded-field px-4 py-5">
      <span className="text-xs uppercase tracking-wider text-muted">You receive</span>
      <div className="flex items-center justify-between mt-2 gap-3">
        <input
          className="text-5xl font-semibold bg-transparent text-ink placeholder-border outline-none w-full min-w-0"
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {pill}
      </div>
    </div>
  );
}
