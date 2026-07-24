import { useState } from "react";
import { StudioDesignerEngine } from "../engine/StudioDesignerEngine";
import { StudioValidationEngine } from "../engine/StudioValidationEngine";
import { CodeGeneratorEngine } from "../engine/CodeGeneratorEngine";

export function StudioDashboard({ onClose }: { onClose: () => void }) {
  const [designer] = useState(() => new StudioDesignerEngine("ERP Enterprise Microservices Architecture"));
  const validator = new StudioValidationEngine();
  const generator = new CodeGeneratorEngine();

  const [activeTab, setActiveTab] = useState<"canvas" | "validation" | "code">("canvas");
  const [selectedCodeTab, setSelectedCodeTab] = useState<"openapi" | "django" | "react" | "terraform">("django");
  const [nodeName, setNodeName] = useState("");

  const model = designer.getModel();
  const findings = validator.validateModel(model);
  const artifacts = generator.generateCode(model);

  const handleAddNode = () => {
    if (!nodeName.trim()) return;
    designer.addService(nodeName, "microservice");
    setNodeName("");
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS STUDIO — VISUAL ARCHITECTURE DESIGNER & CODE GENERATOR
              </h2>
              <p className="text-[10px] text-slate-400">
                Visual Graph Authoring, Live Cross-Product Validation & Deterministic Code Generation
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("canvas")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "canvas" ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🎨 DESIGN CANVAS ({model.services.length} NODES)
          </button>
          <button
            onClick={() => setActiveTab("validation")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "validation" ? "bg-amber-500/20 border border-amber-400 text-amber-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🛡️ LIVE VALIDATION ({findings.length} FINDINGS)
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "code" ? "bg-purple-500/20 border border-purple-400 text-purple-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚙️ GENERATED ARTIFACTS
          </button>
        </div>

        {/* Tab Content 1: Design Canvas */}
        {activeTab === "canvas" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="New service name (e.g. Auth Microservice)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAddNode}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 cursor-pointer"
              >
                + ADD SERVICE
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {model.services.map((srv) => (
                <div key={srv.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white block">{srv.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                      {srv.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {srv.id}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Live Model Validation */}
        {activeTab === "validation" && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              CROSS-PRODUCT REAL-TIME MODEL VALIDATION FINDINGS
            </h3>
            <div className="space-y-2">
              {findings.map((f) => (
                <div key={f.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Source: [{f.source}]</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {f.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{f.message}</p>
                  <p className="text-[10px] text-cyan-300 font-mono">Suggested Fix: {f.suggestedFix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Code Generation Viewer */}
        {activeTab === "code" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCodeTab("django")}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                  selectedCodeTab === "django" ? "bg-purple-500/20 text-purple-300 border border-purple-400" : "text-slate-400"
                }`}
              >
                Django views.py
              </button>
              <button
                onClick={() => setSelectedCodeTab("openapi")}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                  selectedCodeTab === "openapi" ? "bg-purple-500/20 text-purple-300 border border-purple-400" : "text-slate-400"
                }`}
              >
                OpenAPI 3.0 JSON
              </button>
              <button
                onClick={() => setSelectedCodeTab("react")}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                  selectedCodeTab === "react" ? "bg-purple-500/20 text-purple-300 border border-purple-400" : "text-slate-400"
                }`}
              >
                React Component.tsx
              </button>
              <button
                onClick={() => setSelectedCodeTab("terraform")}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                  selectedCodeTab === "terraform" ? "bg-purple-500/20 text-purple-300 border border-purple-400" : "text-slate-400"
                }`}
              >
                Terraform main.tf
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 text-purple-200 text-xs font-mono max-h-[350px] overflow-y-auto custom-scrollbar">
              {selectedCodeTab === "django" && artifacts.djangoViewsPy}
              {selectedCodeTab === "openapi" && artifacts.openApiJson}
              {selectedCodeTab === "react" && artifacts.reactComponentTsx}
              {selectedCodeTab === "terraform" && artifacts.terraformMainTf}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
