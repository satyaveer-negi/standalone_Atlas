// src/components/ui/Badge.tsx

interface Props {
  label: string;
  type: "status" | "priority";
}

function Badge({ label, type }: Props) {
  const getColor = () => {
    if (type === "status") {
      switch (label) {
        case "TODO":
          return "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border border-[var(--color-border)]";
        case "IN_PROGRESS":
          return "bg-blue-500/15 text-blue-500 border border-blue-500/20";
        case "DONE":
          return "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20";
      }
    }

    if (type === "priority") {
      switch (label) {
        case "LOW":
          return "bg-sky-500/15 text-sky-500 border border-sky-500/20";
        case "MEDIUM":
          return "bg-amber-500/15 text-amber-500 border border-amber-500/20";
        case "HIGH":
          return "bg-rose-500/15 text-rose-500 border border-rose-500/20";
      }
    }
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs rounded-full font-semibold tracking-wide ${getColor()}`}
    >
      {label}
    </span>
  );
}

export default Badge;
