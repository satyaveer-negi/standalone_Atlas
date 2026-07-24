import { useState } from "react";
import { EcosystemService } from "../../../services/EcosystemService";
import { PCKValidator } from "../engine/PCKValidator";
import { PLATFORM_SCHEMA_VERSIONS } from "../engine/PlatformSchemaVersioning";
import { PluginWorkbench } from "../engine/PluginWorkbench";

export function EcosystemDashboard({ onClose }: { onClose: () => void }) {
  const [service] = useState(() => new EcosystemService());
  const runtime = service.getRuntime();
  const validator = new PCKValidator();
  const workbench = new PluginWorkbench();

  const [extensions, setExtensions] = useState(() => runtime.getExtensions());
  const [newExtName, setNewExtName] = useState("");

  const handleToggle = (id: string) => {
    setExtensions(runtime.toggleExtension(id));
  };

  const handleCreatePlugin = () => {
    if (!newExtName.trim()) return;
    const draft = workbench.createDraftExtension(newExtName, "VISUALIZATION");
    setExtensions(runtime.registerNewExtension(draft));
    setNewExtName("");
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-teal-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧩</span>
            <div>
              <h2 className="text-sm font-black text-teal-300 tracking-wider uppercase">
                ATLAS PLATFORM ECOSYSTEM — EXTENSION RUNTIME & SDK V2 MARKETPLACE
              </h2>
              <p className="text-[10px] text-slate-400">
                7 Plugin Extension Contracts, Platform Compatibility Kit (PCK) & Developer Workbench
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

        {/* Platform Schema Versions Banner */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-teal-500/30 flex items-center justify-between text-xs">
          <span className="font-bold text-teal-300">PLATFORM CONTRACT VERSIONS:</span>
          <div className="flex gap-2 text-[10px] text-slate-300 font-mono">
            <span>Command: <span className="text-white font-bold">{PLATFORM_SCHEMA_VERSIONS.commandSchemaVersion}</span></span>
            <span>CAM: <span className="text-white font-bold">{PLATFORM_SCHEMA_VERSIONS.camSchemaVersion}</span></span>
            <span>Deploy: <span className="text-white font-bold">{PLATFORM_SCHEMA_VERSIONS.deploymentPlanSchemaVersion}</span></span>
            <span>SDK: <span className="text-white font-bold">{PLATFORM_SCHEMA_VERSIONS.extensionManifestSchemaVersion}</span></span>
          </div>
        </div>

        {/* Panel 1: Installed Extensions */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-teal-500/30 space-y-3">
          <h3 className="text-xs font-black text-teal-300 uppercase tracking-wider">
            📦 INSTALLED EXTENSIONS & LIFECYCLE CONTROLS
          </h3>
          <div className="space-y-2">
            {extensions.map((ext) => {
              const pckReport = validator.validateExtension(ext);
              return (
                <div key={ext.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{ext.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold font-mono">
                        v{ext.version} ({ext.category})
                      </span>
                      {pckReport.overallPassed && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                          PCK CERTIFIED ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Author: {ext.author} | Permissions: {ext.permissions.join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle(ext.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono cursor-pointer transition-all ${
                      ext.status === "ACTIVATED"
                        ? "bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500/30"
                        : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {ext.status === "ACTIVATED" ? "ACTIVATED ✓" : "DISABLED"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 6: Developer Workbench Scaffolder */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-500/40 space-y-3">
          <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
            🛠️ DEVELOPER WORKBENCH — SCAFFOLD CUSTOM EXTENSION PACK
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter plugin name (e.g., Datadog Custom Telemetry Connector)..."
              value={newExtName}
              onChange={(e) => setNewExtName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={handleCreatePlugin}
              className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 cursor-pointer"
            >
              🚀 SCAFFOLD & REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
