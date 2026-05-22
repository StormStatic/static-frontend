import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface rounded-card shadow-sm p-6">
      {children}
    </div>
  );
}
