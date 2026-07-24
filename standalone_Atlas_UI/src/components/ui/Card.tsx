// src/components/ui/Card.tsx

import type { ReactNode } from "react";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`
      bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm
      p-4 md:p-6 hover:shadow-md transition-shadow duration-300
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export default Card;
