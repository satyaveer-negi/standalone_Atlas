import { useState } from "react";
import { ProjectAdapter } from "../../../adapters/ProjectAdapter";
import { SemanticSearchEngine } from "../engine/SemanticSearchEngine";
import { TraversalEngine } from "../engine/TraversalEngine";
import { PerspectiveEngine, PREDEFINED_PERSPECTIVES } from "../engine/PerspectiveEngine";
import { NavigationHistoryStore } from "../engine/NavigationHistoryStore";

export function ExploreDashboard({ onClose }: { onClose: () => void }) {
  const semGraph = ProjectAdapter.buildSemanticGraphFromERP();
  const searchEngine = new SemanticSearchEngine();
  const traversalEngine = new TraversalEngine();
  const perspectiveEngine = new PerspectiveEngine();
  const historyStore = new NavigationHistoryStore();

  const [query, setQuery] = useState("Tasks");
  const [sourceId, setSourceId] = useState("file-tasks-tsx");
  const [targetId, setTargetId] = useState("postgresql-db");

  const searchResult = searchEngine.search(query, semGraph);
  const pathResult = traversalEngine.findShortestPath(sourceId, targetId, semGraph);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧭</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS EXPLORE — CODEBASE COMPREHENSION & NAVIGATION
              </h2>
              <p className="text-[10px] text-slate-400">
                Multi-Signal Semantic Search, Shortest Path Finder & Architectural Perspectives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Workspace 1: Multi-Signal Semantic Search Bar */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-cyan-300">🔍 SEMANTIC SEARCH:</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, ViewSets, DB models..."
              className="flex-1 bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Found {searchResult.visitedEntities.length} matching software entities</span>
            <span>Execution: {searchResult.metadata.executionTimeMs}ms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {searchResult.visitedEntities.slice(0, 3).map((e) => (
              <div key={e.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white block">{e.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  {e.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace 2: Shortest Path Finder & Declarative Perspectives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Shortest Path Finder */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              🛣️ SHORTEST PATH FINDER
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 text-[10px]">SOURCE:</span>
                <input
                  type="text"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-cyan-200 text-[11px]"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 text-[10px]">TARGET:</span>
                <input
                  type="text"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-cyan-200 text-[11px]"
                />
              </div>

              <div className="p-2 rounded bg-slate-950 border border-cyan-500/20 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">PATH TRAVERSAL</span>
                <p className="text-cyan-300 font-mono text-[10px]">
                  {pathResult.highlightedPathEntityIds.join(" ➔ ")}
                </p>
              </div>
            </div>
          </div>

          {/* Declarative Architectural Perspectives */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider">
              👓 ARCHITECTURAL PERSPECTIVES
            </h3>
            <div className="space-y-2">
              {PREDEFINED_PERSPECTIVES.map((persp) => (
                <div
                  key={persp.id}
                  onClick={() => perspectiveEngine.applyPerspective(persp, semGraph)}
                  className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer space-y-1"
                >
                  <span className="text-xs font-bold text-white block">{persp.name}</span>
                  <p className="text-[10px] text-slate-400">{persp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
