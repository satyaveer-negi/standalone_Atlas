// src/components/ui/Breadcrumbs.tsx

import { useNavigate } from "react-router-dom";

interface Item {
  label: string;
  path?: string;
}

interface Props {
  items: Item[];
}

function Breadcrumbs({ items }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 text-sm flex flex-wrap items-center gap-2 font-medium text-[var(--color-text-muted)]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Clickable or Secondary Item */}
            {!isLast && item.path ? (
              <span
                onClick={() => navigate(item.path!)}
                className="
                  cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-primary)] 
                  transition-colors duration-200
                "
              >
                {item.label}
              </span>
            ) : (
              /* Active/Last Item */
              <span className="text-[var(--color-text)] font-semibold">{item.label}</span>
            )}

            {/* Separator - Subtle chevron or slash */}
            {!isLast && (
              <span className="text-[var(--color-border-strong)] font-normal select-none">/</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
