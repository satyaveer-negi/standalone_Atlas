import { useState } from "react";
import { useAtlasStore } from "../../store/atlasStore";

export interface Mission {
  id: string;
  title: string;
  icon: string;
  category: "DEBUG" | "UNDERSTAND" | "TEST" | "SECURITY";
  description: string;
  targetNodeId: string;
  steps: string[];
}

export const MISSIONS: Mission[] = [
  {
    id: "m-auth",
    title: "Understand Authentication Flow",
    icon: "🚀",
    category: "UNDERSTAND",
    description: "Guided tour through Login UI, JWT Token Issue, Auth Middleware, and PostgreSQL DB User table.",
    targetNodeId: "sys-frontend",
    steps: [
      "1. Fly to Login UI Modal component",
      "2. Trace JWT Request to Django Auth Viewset",
      "3. Inspect PostgreSQL User table query",
      "4. Verify Access Token issue response",
    ],
  },
  {
    id: "m-bug",
    title: "Fix Task Filtering Bug",
    icon: "🛠️",
    category: "DEBUG",
    description: "Highlights developer role-scoping filter in Tasks.tsx and views.py TaskViewSet.",
    targetNodeId: "file-tasks-tsx",
    steps: [
      "1. Inspect Tasks.tsx line 8 loadTasks() filter",
      "2. Highlight Django views.py get_queryset() viewset",
      "3. Run automated Jest test runner",
    ],
  },
  {
    id: "m-test",
    title: "Increase Test Coverage",
    icon: "🧪",
    category: "TEST",
    description: "Identifies components with <90% test coverage and generates unit test stubs.",
    targetNodeId: "mod-tasks-ui",
    steps: [
      "1. Filter nodes with test coverage < 90%",
      "2. Open IDE Inspector Test Generator",
      "3. Auto-generate Vitest / Jest test suite",
    ],
  },
  {
    id: "m-security",
    title: "Security Audit",
    icon: "🔒",
    category: "SECURITY",
    description: "Scans exposed REST viewsets, unauthenticated endpoints, and CORS permissions.",
    targetNodeId: "sys-backend",
    steps: [
      "1. Check IsAuthenticated permission classes",
      "2. Inspect JWT Token expiration configuration",
      "3. Verify role-based access control (RBAC)",
    ],
  },
];

interface Props {
  onStartSimulation: (flowId: string) => void;
}

export function MissionControlPalette({ onStartSimulation }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  const enterPortal = useAtlasStore((state) => state.enterPortal);
  const setActiveInspectorTab = useAtlasStore((state) => state.setActiveInspectorTab);

  const handleStartMission = (mission: Mission) => {
    setActiveMission(mission);
    setIsOpen(false);

    // Fly camera to mission target
    enterPortal({
      id: mission.targetNodeId,
      name: mission.title,
      level: 1,
      position: mission.targetNodeId === "sys-frontend" ? [-10.5, 0.5, 6] : [14, 0.5, 0],
    });

    if (mission.id === "m-auth") {
      onStartSimulation("auth_flow");
    } else if (mission.id === "m-bug") {
      onStartSimulation("task_create");
      setActiveInspectorTab("code");
    }
  };

  return (
    <>
      {/* HUD Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 text-xs font-mono font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
      >
        <span>🎯 MISSION MODE</span>
      </button>

      {/* Active Mission HUD Banner */}
      {activeMission && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-cyan-500/40 rounded-2xl px-4 py-2 font-mono text-xs shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fadeIn">
          <span className="text-sm">{activeMission.icon}</span>
          <div>
            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">
              ACTIVE MISSION: {activeMission.category}
            </span>
            <span className="text-white font-bold">{activeMission.title}</span>
          </div>
          <button
            onClick={() => setActiveMission(null)}
            className="text-[10px] text-slate-400 hover:text-cyan-300 font-bold ml-2 cursor-pointer"
          >
            Abort [X]
          </button>
        </div>
      )}

      {/* Mission Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-sm font-black text-cyan-300 tracking-widest flex items-center gap-2">
                <span>🎯</span> SELECT ENGINEERING MISSION
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-cyan-300 font-bold cursor-pointer"
              >
                ESC [X]
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MISSIONS.map((mission) => (
                <div
                  key={mission.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2 flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{mission.icon}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        {mission.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-black text-white group-hover:text-cyan-300">
                      {mission.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {mission.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartMission(mission)}
                    className="w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs transition-all cursor-pointer mt-2"
                  >
                    Launch Mission &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
