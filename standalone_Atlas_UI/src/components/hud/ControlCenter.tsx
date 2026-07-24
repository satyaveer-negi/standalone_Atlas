import { useState, useEffect } from "react";
import { activePackageRegistry, RegistryPackage } from "../../services/packageRegistry";
import { activeRuntimeManager } from "../../implementations/runtimeManager";

interface ControlCenterProps {
  onClose: () => void;
}

type ActiveWorkspace = "docs" | "registry" | "runtime" | "explorer" | "observability" | "governance";

export function ControlCenter({ onClose }: ControlCenterProps) {
  const [activeTab, setActiveTab] = useState<ActiveWorkspace>("docs");
  const [packages, setPackages] = useState<RegistryPackage[]>([]);
  const [mockLogs, setMockLogs] = useState<string[]>([]);
  const [benchmarks, setBenchmarks] = useState({
    cpu: 18,
    memory: 242,
    eventRate: 11840,
    latency: 18,
    nodes: 8440,
    edges: 21900,
  });

  useEffect(() => {
    setPackages(activePackageRegistry.getPackagesList());

    // Simulated observability metrics fluctuation
    const interval = setInterval(() => {
      setBenchmarks(prev => ({
        cpu: Math.floor(15 + Math.random() * 8),
        memory: Math.floor(238 + Math.random() * 10),
        eventRate: Math.floor(11500 + Math.random() * 800),
        latency: Math.floor(14 + Math.random() * 8),
        nodes: prev.nodes + Math.floor(Math.random() * 3),
        edges: prev.edges + Math.floor(Math.random() * 5),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (id: string, currentStatus: "Installed" | "Active" | "Available") => {
    let nextStatus: "Installed" | "Active" | "Available" = "Available";
    if (currentStatus === "Available") nextStatus = "Installed";
    else if (currentStatus === "Installed") nextStatus = "Active";
    else nextStatus = "Installed";

    activePackageRegistry.updatePackageStatus(id, nextStatus);
    setPackages(activePackageRegistry.getPackagesList());
    setMockLogs(prev => [
      ...prev,
      `[Registry] Package "${id}" transition: ${currentStatus} -> ${nextStatus} succeeded.`
    ]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[400px] border-t border-cyan-500/40 bg-slate-950/95 backdrop-blur-2xl z-50 text-slate-100 flex flex-col font-sans shadow-2xl">
      {/* 🧭 Header Console Spine */}
      <div className="bg-slate-900 px-6 py-2.5 border-b border-cyan-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-black text-cyan-300 tracking-wider">⚙️ ATLAS CONTROL CENTER</span>
          <span className="text-[10px] text-slate-500">v1.2.0-STABLE</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-cyan-300 font-mono transition-colors focus:outline-none"
        >
          [CLOSE]
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 🗂️ Left Workspace Navigation Sidebar */}
        <div className="w-48 bg-slate-900/60 border-r border-slate-800 flex flex-col p-2 gap-1">
          <button
            onClick={() => setActiveTab("docs")}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
              activeTab === "docs"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            📚 Documentation
          </button>
          <button
            onClick={() => setActiveTab("registry")}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
              activeTab === "registry"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            📦 Package Registry
          </button>
          <button
            onClick={() => setActiveTab("runtime")}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
              activeTab === "runtime"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            🔄 Runtime Manager
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
              activeTab === "explorer"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            🕸️ AIR & AKG Explorer
          </button>
          <button
            onClick={() => setActiveTab("observability")}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
              activeTab === "observability"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            📊 Observability telemetry
          </button>
          <button
            onClick={() => setActiveTab("governance")}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
              activeTab === "governance"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            🛡️ Platform Governance
          </button>
        </div>

        {/* 💻 Center Workspace Content Viewer */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-xs">
          {activeTab === "docs" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">BOOKS & SPECIFICATION VOLUMES INDEX</h3>
                <p className="text-[10px] text-slate-500">Official developer reference library for UKOP 2.0</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Volume I: Core Architecture</span>
                  <p className="text-[10px] text-slate-400 mt-1">Explains Layer 1 deterministic kernel and runtime lifecycles.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Volume II: Contract Specification</span>
                  <p className="text-[10px] text-slate-400 mt-1">Freezes AIR Graph nodes, events schemas, and DI service definitions.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Volume III: Package (.atlaskp) System</span>
                  <p className="text-[10px] text-slate-400 mt-1">Rules for catalog mappings, signatures, and scaffolding validators.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Volume VI: CLI & SDK Manual</span>
                  <p className="text-[10px] text-slate-400 mt-1">Scaffold commands (`atlas create`, `atlas test`, `atlas doctor`).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "registry" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">PACKAGE REGISTRY CATALOG</h3>
                  <p className="text-[10px] text-slate-500">Search and manage installed Knowledge System Packs</p>
                </div>
                <button
                  onClick={() => handleAction("astronomy", "Available")}
                  className="bg-cyan-500 text-slate-950 font-bold px-2.5 py-1 rounded hover:bg-cyan-400 transition-colors"
                >
                  Scaffold Astronomy
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2">Package Name</th>
                    <th className="py-2">Author</th>
                    <th className="py-2">Quality Grade</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                      <td className="py-2.5 font-bold text-slate-200">{pkg.title}</td>
                      <td className="py-2.5 text-slate-400">{pkg.author}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pkg.qualityLevel === "Platinum"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        }`}>
                          {pkg.qualityLevel}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className={`h-1.5 w-1.5 rounded-full inline-block mr-2 ${
                          pkg.status === "Active" ? "bg-emerald-400" : "bg-yellow-400"
                        }`}></span>
                        {pkg.status}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleAction(pkg.id, pkg.status)}
                          className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-cyan-400 text-[10px] font-mono border border-slate-700"
                        >
                          [Toggle Status]
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "runtime" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">RUNTIME LIFECYCLE CONTROLLER</h3>
                <p className="text-[10px] text-slate-500">Component loads orders and dependencies verification</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Loaded Component</span>
                  <p className="font-bold text-slate-200 mt-1">knowledgeRuntime</p>
                  <div className="flex justify-between items-center mt-3 text-[10px]">
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                    <span className="text-slate-400 font-mono">1.2 MB</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Unloaded Component</span>
                  <p className="font-bold text-slate-400 mt-1">learningRuntime</p>
                  <div className="flex justify-between items-center mt-3 text-[10px]">
                    <span className="text-slate-500">UNLOADED</span>
                    <span className="text-slate-600 font-mono">0 KB</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Core Dependencies</span>
                  <p className="font-bold text-slate-300 mt-1">eventBus, security</p>
                  <div className="flex justify-between items-center mt-3 text-[10px]">
                    <span className="text-emerald-400">RESOLVED</span>
                    <span className="text-slate-500">Topological Sorted</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "explorer" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">AIR & AKG SCHEMA GRAPHS EXPLORER</h3>
                <p className="text-[10px] text-slate-500">Real-time counts of knowledge graph and transient representation nodes</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded flex flex-col gap-2">
                  <span className="font-bold text-slate-300">Transient AIR Node Distribution</span>
                  <div className="flex justify-between text-[11px] mt-2">
                    <span className="text-slate-400">Semantic Nodes:</span>
                    <span className="text-cyan-400 font-mono">14</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Capability Bindings:</span>
                    <span className="text-cyan-400 font-mono">8</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Workflow States:</span>
                    <span className="text-cyan-400 font-mono">6</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded flex flex-col gap-2">
                  <span className="font-bold text-slate-300">Persistent AKG Graph Stats</span>
                  <div className="flex justify-between text-[11px] mt-2">
                    <span className="text-slate-400">Knowledge Nodes (AtlasObjects):</span>
                    <span className="text-emerald-400 font-mono">{benchmarks.nodes}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Edges & Relationships:</span>
                    <span className="text-emerald-400 font-mono">{benchmarks.edges}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Active Transactions:</span>
                    <span className="text-emerald-400 font-mono">14</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "observability" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">PLATFORM QUALITY TELEMETRY MONITOR</h3>
                <p className="text-[10px] text-slate-500">Live operational benchmarks and latency stats</p>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">Event Bus Throughput</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{benchmarks.eventRate.toLocaleString()} ev/s</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">AKG Query Latency</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{benchmarks.latency} ms</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">Core Memory Space</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{benchmarks.memory} MB</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">Controller CPU Load</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{benchmarks.cpu} %</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "governance" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">PLATFORM GOVERNANCE & POLICIES</h3>
                <p className="text-[10px] text-slate-500">Compliance checklist mapping architecture decisions</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-4 w-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span className="text-slate-300 font-bold">Article I Core Determinism:</span>
                  <span className="text-slate-500">Layer 1 buses and state graphs remain fully immutable and audited.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-4 w-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span className="text-slate-300 font-bold">Article IV Contract Versioning:</span>
                  <span className="text-slate-500">All SDK interfaces and runtime compiler outputs leverage strict semver.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-4 w-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span className="text-slate-300 font-bold">Article VII Pre-validation Check:</span>
                  <span className="text-slate-500">All connections undergo verification checks before mounting to the AKG.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 📜 Right Command Inspector Logs Console */}
        <div className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col p-4 overflow-hidden">
          <span className="font-bold text-[10px] text-slate-400 uppercase border-b border-slate-800 pb-1.5 mb-2">
            📟 OPERATIONAL LOGS STREAM
          </span>
          <div className="flex-1 overflow-y-auto font-mono text-[9px] text-cyan-400 flex flex-col gap-1.5 pr-2">
            <div className="opacity-60">[09:30:11] Kernel event fabric initialized.</div>
            <div className="opacity-60">[09:30:12] Service container dependencies injected.</div>
            <div className="opacity-60">[09:30:14] Runtime Manager booted topology.</div>
            {mockLogs.map((log, index) => (
              <div key={index} className="leading-tight">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
