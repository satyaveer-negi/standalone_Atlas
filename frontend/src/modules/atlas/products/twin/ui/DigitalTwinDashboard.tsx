import { useState } from "react";
import { DigitalTwinService } from "../../../services/DigitalTwinService";
import { TwinQueryEngine } from "../engine/TwinQueryEngine";
import { SimulationSandboxEngine } from "../engine/SimulationSandboxEngine";
import { PredictiveEngine } from "../engine/PredictiveEngine";
import { MultiAgentSystem } from "../engine/MultiAgentSystem";
import { EnterpriseFederation } from "../engine/EnterpriseFederation";

export function DigitalTwinDashboard({ onClose }: { onClose: () => void }) {
  const [twinService] = useState(() => new DigitalTwinService());
  const kernel = twinService.getStateManager().getKernel();
  const queryEngine = new TwinQueryEngine();
  const simulator = new SimulationSandboxEngine();
  const predictiveEngine = new PredictiveEngine();
  const agentSystem = new MultiAgentSystem();
  const federation = new EnterpriseFederation();

  const [versions, setVersions] = useState(() => kernel.getVersions());
  const activeVersion = kernel.getActiveVersion();

  const [tqlQuery, setTqlQuery] = useState("FIND Services WHERE risk > 0.5");
  const filteredEntities = queryEngine.executeQuery(tqlQuery, activeVersion.entities);
  const simulationResult = simulator.runScenario("Split TaskViewSet into Microservices");
  const decisionPkg = predictiveEngine.generateDecisionPackage("PostgreSQL Read Latency");
  const blackboard = agentSystem.getBlackboardPipeline();
  const agreements = federation.getAgreements();

  const handlePromote = (versionId: string) => {
    setVersions(kernel.promoteVersion(versionId));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS V6 LIVING ENGINEERING DIGITAL TWIN PLATFORM
              </h2>
              <p className="text-[10px] text-slate-400">
                CTS Schema, Twin Kernel (Version Promotion), TQL Query Engine, Decision Packages & Blackboard Agents
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

        {/* Panel 1: Twin Version Manager */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase">🌐 DIGITAL TWIN VERSIONS & STATE MANAGER (13 DOMAINS):</span>
            <span className="text-[10px] text-slate-400">Active Version: <span className="text-emerald-400 font-bold">{activeVersion.versionId}</span></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {versions.map((v) => (
              <div
                key={v.versionId}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  v.promoted
                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="space-y-1">
                  <span className="font-bold block">{v.versionId}</span>
                  <span className="text-[10px] text-slate-400">Entities: {v.entityCount} | Status: {v.promoted ? "PROMOTED ✓" : "CANDIDATE"}</span>
                </div>
                {!v.promoted && (
                  <button
                    onClick={() => handlePromote(v.versionId)}
                    className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/30 cursor-pointer"
                  >
                    PROMOTE TO LIVE
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: TQL Query Engine & Decision Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* TQL Query Engine */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-teal-500/30 space-y-3">
            <h3 className="text-xs font-black text-teal-300 uppercase tracking-wider">
              🔎 TWIN QUERY LANGUAGE (TQL) ENGINE
            </h3>
            <input
              type="text"
              value={tqlQuery}
              onChange={(e) => setTqlQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-teal-400"
            />
            <div className="space-y-2">
              {filteredEntities.map((e) => (
                <div key={e.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span>{e.name} ({e.domain})</span>
                  <span className="text-rose-400 font-bold">Risk: {e.riskScore}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Package */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-500/30 space-y-3">
            <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
              📦 PREDICTIVE DECISION PACKAGE
            </h3>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
              <span className="font-bold text-indigo-300 block">{decisionPkg.recommendedAction}</span>
              <p className="text-[10px] text-slate-300">Estimated Impact: {decisionPkg.estimatedImpact}</p>
              <p className="text-[10px] text-slate-400">Confidence: {decisionPkg.confidence}% | Risk: {decisionPkg.riskScore}</p>
            </div>
          </div>
        </div>

        {/* Panel 4: Blackboard Multi-Agent Reasoning Pipeline */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/30 space-y-3">
          <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider">
            🧠 BLACKBOARD MULTI-AGENT REASONING PIPELINE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 block">FACTS:</span>
              {blackboard.facts.map((f, i) => <div key={i} className="text-[10px] text-slate-300">• {f}</div>)}
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-300 block">HYPOTHESES:</span>
              {blackboard.hypotheses.map((h, i) => <div key={i} className="text-[10px] text-slate-300">• {h}</div>)}
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-300 block">SELECTED PLAN:</span>
              <div className="text-[10px] text-emerald-400 font-bold">{blackboard.selectedPlan}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
