// src/components/ui/ActionBadge.tsx

type Action = "CREATE" | "UPDATE" | "DELETE";

interface Props {
  action: Action;
}

// ✅ define styles separately (safe for strict TS config)
const styles = {
  CREATE: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  UPDATE: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  DELETE: "bg-red-500/10 text-red-500 border border-red-500/20",
} as const;

function ActionBadge({ action }: Props) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${styles[action]}`}>
      {action}
    </span>
  );
}

export default ActionBadge;
