import { useState } from "react";
import { ProjectAdapter } from "../../../adapters/ProjectAdapter";
import { PREDEFINED_SCENARIOS } from "../engine/ScenarioLibrary";
import { ScenarioCompiler } from "../engine/ScenarioCompiler";
import { ImpactEngine } from "../engine/ImpactEngine";
import { RiskEngine } from "../engine/RiskEngine";

export function SimulateDashboard({ onClose }: { onClose: () => void }) {
  const semGraph = ProjectAdapter.buildSemanticGraphFromERP();
  const compiler = new ScenarioCompiler();
  const impactEngine = new ImpactEngine();
  const riskEngine = new RiskEngine();

  const [selectedScenario, setSelectedScenario] = useState(PREDEFINED_SCENARIOS[0]);

  const changeSet = compiler.compileRemoveEntityScenario(selectedScenario.targetEntityId);
  const impact = impactEngine.evaluateImpact(selectedScenario.targetEntityId, semGraph);
  const risk = riskEngine.calculateRisk(impact.affectedEntitiesCount);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧪</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS SIMULATE — PREDICTIVE ARCHITECTURE IMPACT ENGINE
              </h2>
              <p className="text-[10px] text-slate-400">
                Isolated Sandbox Experimentation, Weighted Risk Scoring & Disrupted Path Analysis
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

        {/* Workspace 1: Scenario Selector */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
          <span className="text-xs font-bold text-cyan-300 uppercase block">🧪 SELECT SIMULATION SCENARIO:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PREDEFINED_SCENARIOS.map((scen) => (
              <div
                key={scen.id}
                onClick={() => setSelectedScenario(scen)}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  selectedScenario.id === scen.id
                    ? "bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/10"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span className="text-xs font-bold text-white block">{scen.name}</span>
                <p className="text-[10px] text-slate-400">{scen.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace 2: Risk Meter & Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Weighted Risk Scorecard */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-rose-300 uppercase">PREDICTED RISK SCORECARD</span>
              <span className="text-xs font-black text-rose-400 px-2 py-0.5 rounded bg-rose-500/20">
                {risk.overallRisk}% — {risk.riskCategory} RISK
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">RELIABILITY</span>
                <span className="font-bold text-rose-300">{risk.reliability}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">RUNTIME</span>
                <span className="font-bold text-amber-300">{risk.runtime}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">ARCH</span>
                <span className="font-bold text-purple-300">{risk.architecture}</span>
              </div>
            </div>

            {/* Disrupted Paths */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold block uppercase">DISRUPTED DEPENDENCY PATHS</span>
              <div className="space-y-1">
                {impact.brokenPaths.map((path, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950 border border-rose-500/30 text-rose-300 text-[10px] font-mono">
                    ⚠️ {path}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side-by-Side Architecture Comparison */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              ⚖️ CURRENT VS. SIMULATED ARCHITECTURE
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-cyan-300 font-bold block uppercase">LIVE SYSTEM</span>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>Risk: <span className="font-bold text-emerald-400">12 (LOW)</span></div>
                  <div>Broken Paths: <span className="font-bold text-emerald-400">0</span></div>
                  <div>Policy Violations: <span className="font-bold text-amber-300">1</span></div>
                  <div>Est Latency: <span className="font-bold text-cyan-300">42ms</span></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/40 space-y-2">
                <span className="text-[10px] text-rose-300 font-bold block uppercase">SIMULATED SYSTEM</span>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>Risk: <span className="font-bold text-rose-400">{risk.overallRisk} ({risk.riskCategory})</span></div>
                  <div>Broken Paths: <span className="font-bold text-rose-400">{impact.affectedEntitiesCount}</span></div>
                  <div>Policy Violations: <span className="font-bold text-rose-400">4</span></div>
                  <div>Est Latency: <span className="font-bold text-amber-300">{impact.latencyPredictionMs}ms</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
