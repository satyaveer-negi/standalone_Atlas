// src/components/ui/Skeleton.tsx

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-surface-muted)] border border-[var(--color-border)]/50 rounded ${className}`} />;
}

export default Skeleton;
