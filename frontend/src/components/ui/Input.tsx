// src/components/ui/Input.tsx

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ type = "text", className = "", ...props }: Props) {
  return (
    <input
      type={type}
      {...props}
      className={`
        w-full px-4 py-2 md:py-2.5
        rounded-xl
        border border-[var(--color-border)]
        bg-[var(--color-surface)] text-[var(--color-text)]
        placeholder-[var(--color-text-muted)]/60
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
        transition-all duration-200 text-sm
        ${className}
      `}
    />
  );
}

export default Input;
