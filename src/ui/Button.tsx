import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={
        disabled
          ? "w-full py-4 rounded-pill text-muted bg-border cursor-not-allowed font-semibold text-sm"
          : "w-full py-4 rounded-pill text-surface bg-walnut font-semibold text-sm active:bg-ink transition-colors"
      }
      {...props}
    >
      {children}
    </button>
  );
}
