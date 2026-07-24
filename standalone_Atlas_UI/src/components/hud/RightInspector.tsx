import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtlasStore } from "../../store/atlasStore";
import type { InspectorTab } from "../../store/atlasStore";
import { ProjectAdapter } from "../../adapters/ProjectAdapter";
import { GraphQueryEngine } from "../../engine/scene/GraphQueryEngine";

const semanticGraph = ProjectAdapter.buildSemanticGraphFromERP();
const queryEngine = new GraphQueryEngine(semanticGraph);

const INSPECTOR_TABS: { id: InspectorTab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "code", label: "Source Code", icon: "💻" },
  { id: "metrics", label: "Metrics", icon: "📈" },
  { id: "dependencies", label: "Deps", icon: "🔀" },
  { id: "history", label: "History", icon: "📜" },
  { id: "ai", label: "AI Architect", icon: "🤖" },
  { id: "git", label: "Git", icon: "🌳" },
  { id: "commands", label: "Actions", icon: "⚡" },
];

const CODE_SNIPPETS: Record<string, string[]> = {
  "Tasks.tsx": [
    "// src/features/tasks/pages/Tasks.tsx",
    "export default function Tasks() {",
    "  const { user } = useAuth();",
    "  const isDeveloper = user?.role === 'DEVELOPER';",
    "  const [filters, setFilters] = useState<TaskFilters>({});",
    "",
    "  const loadTasks = async () => {",
    "    const params = { ...filters };",
    "    if (isDeveloper) params.assigned_to = user.id;",
    "    const res = await API.get('tasks/', { params });",
    "    setTasks(res.data);",
    "  };",
    "  return <TaskRibbonsView tasks={tasks} />;",
    "}",
  ],
  "views.py": [
    "# backend/task_manager/views.py",
    "class TaskViewSet(viewsets.ModelViewSet):",
    "    serializer_class = TaskSerializer",
    "    permission_classes = [permissions.IsAuthenticated]",
    "",
    "    def get_queryset(self):",
    "        user = self.request.user",
    "        if user.role in ['DEVELOPER', 'TESTER']:",
    "            return Task.objects.filter(assigned_to=user)",
    "        return Task.objects.all()",
    "",
    "    def perform_create(self, serializer):",
    "        serializer.save(created_by=self.request.user)",
  ],
};

export default function RightInspector() {
  const navigate = useNavigate();
  const selectedNodeId = useAtlasStore((state) => state.selectedNodeId);
  const setSelectedNode = useAtlasStore((state) => state.setSelectedNode);
  const activeInspectorTab = useAtlasStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useAtlasStore((state) => state.setActiveInspectorTab);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [aiModalText, setAiModalText] = useState<string | null>(null);

  const activeSnippet =
    selectedNodeId && CODE_SNIPPETS[selectedNodeId]
      ? CODE_SNIPPETS[selectedNodeId]
      : [
          `// ${selectedNodeId || "Artifact"} Source Code`,
          `import React from "react";`,
          `export function ${selectedNodeId?.replace(/[^a-zA-Z0-9]/g, "") || "Artifact"}() {`,
          `  // Live telemetry stream bound to Atlas 3D Digital Twin`,
          `  return <div className="atlas-node">Realtime Active</div>;`,
          `}`,
        ];

  const handleExplainAI = () => {
    setAiModalText(
      `🤖 AI ARCHITECT EXPLANATION FOR ${selectedNodeId}:\n\n` +
        `• Complexity Score: 72/100 (Medium-High)\n` +
        `• Primary Role: Encapsulates role-scoped filtering logic for developers and admins.\n` +
        `• Refactor Suggestion: Extract query params construction into a custom useTaskParams hook to decouple render execution.`
    );
  };

  const handleGenerateTests = () => {
    setAiModalText(
      `🧪 GENERATING UNIT TESTS FOR ${selectedNodeId}:\n\n` +
        `describe("${selectedNodeId}", () => {\n` +
        `  it("should correctly scope tasks for DEVELOPER role", async () => {\n` +
        `    const { result } = renderHook(() => useTasks());\n` +
        `    expect(result.current.filters.assigned_to).toBe(user.id);\n` +
        `  });\n` +
        `});`
    );
  };

  if (isCollapsed) {
    return (
      <div className="pointer-events-auto p-2 flex justify-end font-mono">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-xl bg-slate-950/85 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-lg hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>&larr;</span>
          <span>💻 Inspector</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 sm:w-96 h-full pointer-events-auto p-4 flex flex-col gap-3 font-mono">
      {/* AI Explanation Drawer Modal */}
      {aiModalText && (
        <div className="rounded-2xl border border-cyan-500/40 bg-slate-950/95 backdrop-blur-xl p-4 shadow-2xl text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="font-bold text-cyan-300">🤖 AI ARCHITECT RESPONSE</span>
            <button
              onClick={() => setAiModalText(null)}
              className="text-slate-400 hover:text-cyan-300 font-bold cursor-pointer"
            >
              [X]
            </button>
          </div>
          <pre className="text-[11px] text-cyan-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto custom-scrollbar p-2 bg-slate-900/60 rounded-xl">
            {aiModalText}
          </pre>
        </div>
      )}

      {/* Main IDE Inspector Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-xl p-4 shadow-2xl flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-3">
            <span className="text-xs font-black text-cyan-300 tracking-widest flex items-center gap-1.5">
              <span>💻</span> IDE INSPECTOR
            </span>
            <div className="flex items-center gap-2">
              {selectedNodeId && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[10px] text-cyan-500 hover:text-cyan-300 font-bold cursor-pointer"
                >
                  Clear [X]
                </button>
              )}
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-[10px] text-slate-400 hover:text-cyan-300 font-bold px-1 cursor-pointer"
              >
                [-]
              </button>
            </div>
          </div>

          {/* VSCode-like Tabs Navigation */}
          {selectedNodeId && (
            <div className="flex items-center gap-1 overflow-x-auto border-b border-cyan-500/20 pb-2 mb-3 custom-scrollbar">
              {INSPECTOR_TABS.map((tab) => {
                const isActive = activeInspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveInspectorTab(tab.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 shadow-xs font-black"
                        : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {selectedNodeId ? (
              <div className="space-y-3 animate-fadeIn">
                {/* Selected Title Badge */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30">
                  <span className="text-[9px] font-bold text-cyan-500/80 uppercase tracking-widest block">
                    TARGET ARTIFACT
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5 break-words">
                    {selectedNodeId}
                  </h3>
                </div>

                {/* Tab: CODE VIEWER */}
                {activeInspectorTab === "code" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-cyan-400 font-bold">LIVE SOURCE PREVIEW</span>
                      <span className="text-slate-500">UTF-8 • TSX/PY</span>
                    </div>
                    <div className="rounded-xl bg-slate-950 border border-cyan-500/20 p-2.5 max-h-56 overflow-y-auto text-[11px] space-y-0.5 custom-scrollbar">
                      {activeSnippet.map((line, idx) => (
                        <div key={idx} className="flex gap-3 text-slate-300">
                          <span className="text-slate-600 select-none w-4 text-right shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: OVERVIEW */}
                {activeInspectorTab === "overview" && (
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[9px] text-slate-400">CATEGORY</span>
                        <p className="text-cyan-300 font-bold mt-0.5">Component / View</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[9px] text-slate-400">HEALTH</span>
                        <p className="text-emerald-400 font-bold mt-0.5">ACTIVE ✅</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-[10px] text-slate-300 space-y-1">
                      <span className="text-slate-400 block">SYSTEM PATH:</span>
                      <code className="text-cyan-300 break-all block">
                        frontend/src/features/tasks/pages/{selectedNodeId}
                      </code>
                    </div>
                  </div>
                )}

                {/* Tab: METRICS */}
                {activeInspectorTab === "metrics" && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cyclomatic Complexity:</span>
                        <span className="text-cyan-300 font-bold">72 / 100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full"
                          style={{ width: "72%" }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[9px] text-slate-400">LINES OF CODE</span>
                        <p className="text-white font-bold mt-0.5">482 LOC</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="text-[9px] text-slate-400">TEST COVERAGE</span>
                        <p className="text-emerald-400 font-bold mt-0.5">88.4%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: DEPENDENCIES */}
                {activeInspectorTab === "dependencies" && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                      <span className="text-[9px] text-cyan-400 font-bold uppercase">
                        INBOUND IMPORTS (4)
                      </span>
                      <div className="text-[10px] text-slate-300 space-y-1 pl-2 border-l border-cyan-500/30">
                        <p>• App.tsx &rarr; Lazy Route</p>
                        <p>• Sidebar.tsx &rarr; Navigation Link</p>
                        <p>• TaskCommentModal.tsx &rarr; Attachment Panel</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                      <span className="text-[9px] text-purple-400 font-bold uppercase">
                        OUTBOUND DEPENDENCIES (8)
                      </span>
                      <div className="text-[10px] text-slate-300 space-y-1 pl-2 border-l border-purple-500/30">
                        <p>• tasks.ts &rarr; API Service</p>
                        <p>• useTaskSocket.ts &rarr; WebSocket Hook</p>
                        <p>• useAuth.ts &rarr; Role Context</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: HISTORY */}
                {activeInspectorTab === "history" && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                      <span className="text-[9px] text-cyan-400 font-bold">RECENT COMMITS</span>
                      <div className="text-[10px] text-slate-300 space-y-1.5">
                        <div>
                          <p className="font-bold text-white">Refactor compact developer toolbar</p>
                          <span className="text-[9px] text-slate-500">15 mins ago • Antigravity AI</span>
                        </div>
                        <div>
                          <p className="font-bold text-white">Add ribbon view mode selector</p>
                          <span className="text-[9px] text-slate-500">1 hour ago • Lead Frontend Dev</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: AI ARCHITECT */}
                {activeInspectorTab === "ai" && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
                      <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block">
                        💡 AI ARCHITECT RECOMMENDATION
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        This component handles role-scoped state filtering directly in the render loop. Extract filtering logic into custom hook to reduce re-renders.
                      </p>
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-200">
                        <strong className="block text-cyan-300 mb-0.5">Circular Coupling Risk:</strong>
                        Low risk detected. Decoupled from direct REST viewsets.
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: GIT */}
                {activeInspectorTab === "git" && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Branch:</span>
                        <span className="text-emerald-400 font-bold">main / improvements</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Commit Hash:</span>
                        <code className="text-cyan-300 font-bold">#64b68f3</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status:</span>
                        <span className="text-cyan-300 font-bold">PUSHED TO ORIGIN ✅</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: ACTIONS */}
                {activeInspectorTab === "commands" && (
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={handleExplainAI}
                      className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>⚡ Explain with AI</span>
                    </button>
                    <button
                      onClick={handleGenerateTests}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>🧪 Generate Tests</span>
                    </button>
                    <button
                      onClick={() => navigate(`/tasks`)}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>🔧 Inspect Associated Tasks</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center space-y-2">
                <span className="text-3xl opacity-60">🎯</span>
                <p className="text-xs text-slate-300 font-bold">
                  No Artifact Selected
                </p>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  Zoom or click any Reactor, Crystal, Hex Station, or Holographic Plate in the 3D scene to inspect IDE telemetry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}