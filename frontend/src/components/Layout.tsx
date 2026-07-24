// src/components/Layout.tsx

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import type { ReactNode } from "react";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  useKeyboardShortcuts();

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("sidebar_collapsed", String(next));
  };

  /* ============================
     🔥 LOCK BODY SCROLL (MOBILE)
  ============================ */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <div className="app-shell flex min-h-screen">
      {/* ============================
         SIDEBAR
      ============================ */}
      <Sidebar
        isOpen={isOpen}
        toggle={() => setIsOpen(false)}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      {/* ============================
         MAIN CONTENT
      ============================ */}
      <div
        className={`
          flex-1 flex flex-col
          transition-all duration-300
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* ============================
           NAVBAR (STICKY)
        ============================ */}
        <div className="app-surface sticky top-0 z-30 border-b shadow-sm">
          <Navbar toggleSidebar={() => setIsOpen(true)} />
        </div>

        {/* ============================
           PAGE CONTENT
        ============================ */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
