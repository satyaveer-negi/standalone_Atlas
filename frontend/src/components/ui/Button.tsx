import type { ReactNode, ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
}

function Button({ children, variant = "primary", className = "", ...props }: Props) {
  const baseStyles = "px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none text-center inline-flex items-center justify-center gap-2";
  
  let variantStyles = "";
  if (variant === "primary") {
    variantStyles = "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-md shadow-[var(--color-primary-soft)]";
  } else if (variant === "secondary") {
    variantStyles = "bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border)] border border-[var(--color-border)]";
  } else if (variant === "outline") {
    variantStyles = "border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]";
  } else if (variant === "danger") {
    variantStyles = "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/25";
  }

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
