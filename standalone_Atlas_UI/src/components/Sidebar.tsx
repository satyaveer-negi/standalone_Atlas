// src/components/Sidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const getIcon = (name: string) => {
  switch (name) {
    case "Dashboard":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      );
    case "Workspaces":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "Projects":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    case "Tasks":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "Files":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      );
    case "Audit Logs":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "Admin Center":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    case "Billing":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "Atlas 3D":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      );
  }
};

function Sidebar({ isOpen, toggle, isCollapsed = false, toggleCollapse }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isAdmin, isDeveloper, isHR, isSuperuser, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("access");
    queryClient.removeQueries({ queryKey: ["me"] });
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menu = isSuperuser
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Atlas 3D", path: "/atlas" },
        { name: "Admin Center", path: "/users" },
        { name: "Billing", path: "/billing" },
      ]
    : isAdmin
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Projects", path: "/projects" },
        { name: "Tasks", path: "/tasks" },
        { name: "Files", path: "/files" },
        { name: "Atlas 3D", path: "/atlas" },
        { name: "Audit Logs", path: "/audit" },
        { name: "Admin Center", path: "/users" },
      ]
    : isHR
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Admin Center", path: "/users" },
      ]
    : [
        { name: "Dashboard", path: "/dashboard" },
        ...((user?.role !== "DEVELOPER" && user?.role !== "TESTER")
          ? [{ name: "Workspaces", path: "/workspaces" }]
          : []),
        { name: "Projects", path: "/projects" },
        { name: "Tasks", path: "/tasks" },
        { name: "Files", path: "/files" },
        { name: "Atlas 3D", path: "/atlas" },
      ];

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="app-modal-backdrop fixed inset-0 lg:hidden z-40 transition-opacity"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full
          app-modal-panel p-5
          z-50 border-r border-[var(--color-border)]
          transform transition-all duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Logo and Collapse Toggle */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              navigate("/dashboard");
              if (isOpen) toggle();
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg app-button-primary shrink-0">
              E
            </div>
            {!isCollapsed && (
              <h2 className="text-xl font-bold tracking-tight group-hover:text-[var(--color-primary)] transition-all duration-300">
                ERP System
              </h2>
            )}
          </div>
          {toggleCollapse && (
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition-all shadow-sm cursor-pointer"
            >
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Menu - scrollable */}
        <nav className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <ul className="space-y-1.5">
            {menu.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    if (isOpen) toggle();
                  }}
                  title={isCollapsed ? item.name : undefined}
                  className={`
                    px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                    flex items-center gap-3 font-medium
                    ${isCollapsed ? "justify-center" : "justify-between"}
                    ${
                      isActive
                        ? "app-button-primary text-white shadow-md"
                        : "app-text-muted hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0">{getIcon(item.name)}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {isActive && !isCollapsed && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile / User Settings Footer */}
        {user && (
          <div className="relative mt-auto pt-4 border-t border-[var(--color-border)] shrink-0" ref={userMenuRef}>
            {/* Popover Menu */}
            {userMenuOpen && (
              <div
                className={`
                  absolute bottom-full mb-3 left-0
                  w-64 app-modal-panel border border-[var(--color-border)]
                  rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-[var(--color-text)]
                `}
              >
                {/* Header info */}
                <div className="pb-3 mb-3 border-b border-[var(--color-border)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white font-black text-sm flex items-center justify-center shrink-0 shadow shadow-[var(--color-primary-soft)]">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-[var(--color-text)]">{user.username}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">{user.email}</p>
                    <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--color-primary-soft)] text-[var(--color-primary)] mt-1">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    Appearance Theme
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-xs font-semibold">
                    <button
                      onClick={() => setTheme("light")}
                      className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        theme === "light"
                          ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-bold border border-[var(--color-border)]"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      <span>☀️</span>
                      <span className="text-[10px]">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        theme === "dark"
                          ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-bold border border-[var(--color-border)]"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      <span>🌙</span>
                      <span className="text-[10px]">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        theme === "system"
                          ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-bold border border-[var(--color-border)]"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      <span>💻</span>
                      <span className="text-[10px]">System</span>
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--color-danger)] bg-[var(--color-danger-soft)]/20 hover:bg-[var(--color-danger)] hover:text-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>Log Out</span>
                  <span>➔</span>
                </button>
              </div>
            )}

            {/* Bottom Left Clickable Trigger */}
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 hover:bg-[var(--color-surface-muted)] transition-all cursor-pointer text-left"
              title="User Settings & Theme"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--color-text)] truncate">{user.username}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate capitalize">{user.role.toLowerCase()}</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <span className="text-xs text-[var(--color-text-muted)] font-bold">⚙️</span>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;

