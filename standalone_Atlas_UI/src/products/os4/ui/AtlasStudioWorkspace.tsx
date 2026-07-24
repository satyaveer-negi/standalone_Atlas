import { useState } from "react";
import { AtlasOS4Service } from "../../services/AtlasOS4Service";

export function AtlasStudioWorkspace({ onClose }: { onClose: () => void }) {
  const [service] = useState(() => new AtlasOS4Service());
  const [activeTab, setActiveTab] = useState<"API_RUNNER" | "EVENTS" | "CAPABILITIES" | "GIT" | "MARKETPLACE">("API_RUNNER");

  const [entityName, setEntityName] = useState("Generative Aerospace Bracket");
  const [entityType, setEntityType] = useState("CAD_COMPONENT");
  const [apiLog, setApiLog] = useState("Atlas OS 4.0 Platform API Ready.");

  const handleCreateEntity = () => {
    const ent = service.api.entities.create(`ent-${Date.now()}`, entityName, entityType);
    setApiLog(`[Platform API] Created Entity: ${ent.id} (${ent.name})`);
  };

  const handleRunSimulation = () => {
    const res = service.api.simulations.run("scenario-thermal-01", { maxTempC: 45 });
    setApiLog(`[Platform API] Executed Simulation: ${res.simulationId} (Execution Time: ${res.executionTimeMs}ms)`);
  };

  const handleRegisterTwin = () => {
    const tw = service.api.twin.register(`twin-${Date.now()}`, entityName, "AEROSPACE");
    setApiLog(`[Platform API] Registered Digital Twin: ${tw.twinId} (Status: ${tw.syncStatus})`);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-6xl rounded-2xl border border-teal-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪐</span>
            <div>
              <h2 className="text-sm font-black text-teal-300 tracking-wider uppercase">
                ATLAS STUDIO IDE — ENGINEERING OPERATING SYSTEM 4.0
              </h2>
              <p className="text-[10px] text-slate-400">
                Multi-Program Engineering Platform (Programs A–F) | Architecture Baseline OS 4.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-teal-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Tab Docking Selector */}
        <div className="flex border-b border-slate-800 gap-2 text-xs">
          {[
            { id: "API_RUNNER", label: "⚡ PLATFORM API RUNNER" },
            { id: "EVENTS", label: "📜 EVENT STORE TIMELINE" },
            { id: "CAPABILITIES", label: "⚙️ CAPABILITY DISCOVERY" },
            { id: "GIT", label: "🌿 ENGINEERING GIT" },
            { id: "MARKETPLACE", label: "🧩 EXTENSION MARKETPLACE" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 border-b-2 font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-teal-400 text-teal-300 bg-teal-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "API_RUNNER" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-teal-500/30 space-y-3">
              <span className="text-xs font-bold text-teal-300 uppercase block">ENTERPRISE PLATFORM API FACADE EXECUTION</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-teal-400"
                />
                <input
                  type="text"
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-teal-400"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={handleCreateEntity}
                  className="px-3 py-1.5 rounded-lg bg-teal-500/20 border border-teal-400 text-teal-300 font-bold hover:bg-teal-500/30 cursor-pointer"
                >
                  CREATE ENTITY
                </button>
                <button
                  onClick={handleRunSimulation}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400 text-indigo-300 font-bold hover:bg-indigo-500/30 cursor-pointer"
                >
                  RUN SIMULATION
                </button>
                <button
                  onClick={handleRegisterTwin}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold hover:bg-emerald-500/30 cursor-pointer"
                >
                  REGISTER DIGITAL TWIN
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono">
              {apiLog}
            </div>
          </div>
        )}

        {activeTab === "EVENTS" && (
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <span className="font-bold text-teal-300 block">EVENT STORE SOURCED HISTORY ({service.api.events.getHistory().length}):</span>
            {service.api.events.getHistory().map((evt) => (
              <div key={evt.id} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-cyan-300">• [{evt.type}] {JSON.stringify(evt.payload)}</span>
                <span className="text-slate-500 text-[10px]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "CAPABILITIES" && (
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <span className="font-bold text-cyan-300 block">REGISTERED CAPABILITIES ({service.capabilityRegistry.getAllCapabilities().length}):</span>
            {service.capabilityRegistry.getAllCapabilities().map((cap, i) => (
              <div key={i} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="font-bold text-white">ID: {cap.capabilityId}</span>
                <span className="text-slate-400">Provider: {cap.providerName}</span>
                <span className="text-emerald-400 text-[10px] border border-emerald-500/30 px-2 py-0.5 rounded">{cap.requiredPermission}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "GIT" && (
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <span className="font-bold text-emerald-300 block">ENGINEERING GIT BRANCHES:</span>
            {service.git.getBranches().map((b) => (
              <div key={b.name} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-emerald-400 font-bold">🌿 {b.name}</span>
                <span className="text-slate-400">Head Commit: {b.headCommitId}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "MARKETPLACE" && (
          <div className="space-y-3 text-xs font-mono">
            <span className="font-bold text-purple-300 block">THIRD-PARTY EXTENSION MARKETPLACE PACKS:</span>
            {service.marketplace.getAvailablePacks().map((pack) => (
              <div key={pack.id} className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-300 text-sm">{pack.name} (v{pack.version})</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400 text-purple-200">{pack.isolationLevel}</span>
                </div>
                <p className="text-[11px] text-slate-400">Author: {pack.author}</p>
                <div className="text-[10px] text-slate-300 pt-1">
                  • Capabilities: <span className="text-cyan-300">{pack.capabilities.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
