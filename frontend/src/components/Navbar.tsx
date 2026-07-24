import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "../features/workspaces/api/workspaces";
import { useActiveWorkspace } from "../hooks/useActiveWorkspace";

import NotificationBell from "../features/notifications/components/NotificationBell";

interface Props {
  toggleSidebar: () => void;
}

function Navbar({ toggleSidebar }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeWorkspaceId, setActiveWorkspaceId } = useActiveWorkspace();
  const [globalSearch, setGlobalSearch] = useState("");

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  // Dynamic route title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/users")) return "Admin Center";
    if (path.startsWith("/workspaces")) return "Workspaces";
    if (path.startsWith("/projects")) return "Projects";
    if (path.startsWith("/tasks")) return "Tasks";
    if (path.startsWith("/files")) return "Files";
    if (path.startsWith("/audit")) return "Audit Logs";
    if (path.startsWith("/billing")) return "Billing";
    return "ERP Platform";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur-md flex items-center justify-between px-3 md:px-6 transition-all duration-300 gap-3 sm:gap-6">
      {/* LEFT: Mobile Toggle, Active Workspace Chip & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 min-w-0">
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition-colors active:scale-95 cursor-pointer shrink-0"
          aria-label="Toggle Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Page Title */}
        <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-[var(--color-text)] truncate">
          {getPageTitle()}
        </h1>

        {/* Workspace Selector Chip (Google Stitch Style) */}
        {workspaces.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
            <select
              value={activeWorkspaceId || ""}
              onChange={(e) => setActiveWorkspaceId(e.target.value ? String(e.target.value) : null)}
              className="bg-transparent text-[var(--color-text)] font-extrabold text-[11px] focus:outline-none cursor-pointer max-w-[130px] truncate"
            >
              <option value="">All Workspaces</option>
              {workspaces.map((ws: any) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* CENTER: GOOGLE STITCH GLOBAL SEARCH BAR */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
        <div className="relative flex items-center">
          <svg
            className="absolute left-3.5 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search tasks, projects, or team members..."
            className="w-full pl-9 pr-12 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)]/60 text-xs font-semibold text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface)] transition-all"
          />
          <kbd className="absolute right-3 hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* RIGHT: ONLY BELL ICON */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center justify-center p-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:border-[var(--color-primary)]/40 transition-all">
          <NotificationBell />
        </div>
      </div>
    </div>
  );
}

export default Navbar;


