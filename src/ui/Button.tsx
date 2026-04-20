import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base = "px-6 py-4 rounded-field text-sm font-semibold transition-colors w-full";
  const variants = {
    primary: disabled
      ? "bg-border text-muted cursor-not-allowed"
      : "bg-walnut text-surface active:bg-ink cursor-pointer",
    secondary:
      "border border-ink text-ink bg-transparent active:bg-inset cursor-pointer",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
