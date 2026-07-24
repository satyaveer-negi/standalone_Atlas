import { useState, useEffect } from "react";
import { useAtlasStore } from "../../store/atlasStore";

interface ArtifactOption {
  id: string;
  name: string;
  category: string;
  level: number;
  position: [number, number, number];
  path: string;
}

const DEMO_SEARCH_NODES: ArtifactOption[] = [
  {
    id: "file-tasks-tsx",
    name: "Tasks.tsx",
    category: "File",
    level: 4,
    position: [-2.2, -1, 3.5],
    path: "frontend/src/features/tasks/pages/Tasks.tsx",
  },
  {
    id: "file-backend-views-py",
    name: "views.py",
    category: "File",
    level: 4,
    position: [12.2, -1, -5.5],
    path: "backend/task_manager/views.py",
  },
  {
    id: "mod-tasks-ui",
    name: "Task Registry Module",
    category: "Module",
    level: 2,
    position: [-10.5, 0.5, 6],
    path: "frontend/src/features/tasks",
  },
  {
    id: "sys-backend",
    name: "Django REST API Core",
    category: "System",
    level: 1,
    position: [14, 0.5, 0],
    path: "backend/core",
  },
  {
    id: "func-load-tasks",
    name: "loadTasks()",
    category: "Function",
    level: 5,
    position: [-2.5, -0.7, 4.2],
    path: "frontend/src/features/tasks/pages/Tasks.tsx",
  },
  {
    id: "file-kanban-tsx",
    name: "Kanban.tsx",
    category: "File",
    level: 4,
    position: [-3.8, -1.2, 2.1],
    path: "frontend/src/features/tasks/pages/Kanban.tsx",
  },
];

export function SearchCommandPalette() {
  const isSearchOpen = useAtlasStore((state) => state.isSearchOpen);
  const setSearchOpen = useAtlasStore((state) => state.setSearchOpen);
  const enterPortal = useAtlasStore((state) => state.enterPortal);

  const [query, setQuery] = useState("");

  // Keyboard hotkey: Ctrl + K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);

  if (!isSearchOpen) return null;

  const results = DEMO_SEARCH_NODES.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.path.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: ArtifactOption) => {
    enterPortal({
      id: item.id,
      name: item.name,
      level: item.level,
      position: item.position,
    });
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-slate-950/90 shadow-2xl p-4 space-y-3">
        {/* Search Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <span className="text-xs font-black text-cyan-300 tracking-widest flex items-center gap-2">
            <span>🔍</span> SPATIAL COMMAND SEARCH
          </span>
          <button
            onClick={() => setSearchOpen(false)}
            className="text-[10px] text-slate-400 hover:text-cyan-300 cursor-pointer"
          >
            ESC [X]
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          autoFocus
          placeholder="Type filename, module, function (e.g. Tasks.tsx, views.py)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-200 text-xs font-mono placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400"
        />

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full text-left p-3 rounded-xl bg-slate-900/50 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-white group-hover:text-cyan-300">
                  {item.name}
                </span>
                <p className="text-[10px] text-slate-400 font-normal">{item.path}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  {item.category}
                </span>
                <span className="text-[10px] text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                  Fly &rarr;
                </span>
              </div>
            </button>
          ))}

          {results.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-500">
              No matching artifacts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
