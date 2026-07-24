import { useState } from "react";
import { ProjectAdapter } from "../../../adapters/ProjectAdapter";
import { GraphQueryEngine } from "../../../engine/scene/GraphQueryEngine";
import { GraphService } from "../../../services/GraphService";
import { PolicyService } from "../../../services/PolicyService";
import { AIService } from "../../../services/AIService";
import { EvaluateComplianceUseCase } from "../usecases/EvaluateComplianceUseCase";
import { SuggestFixesUseCase } from "../usecases/SuggestFixesUseCase";

export function ComplianceDashboard({ onClose }: { onClose: () => void }) {
  const semGraph = ProjectAdapter.buildSemanticGraphFromERP();
  const queryEngine = new GraphQueryEngine(semGraph);
  const graphService = new GraphService(queryEngine);
  const policyService = new PolicyService();
  const aiService = new AIService(graphService);

  const evaluateUseCase = new EvaluateComplianceUseCase(policyService);
  const suggestFixesUseCase = new SuggestFixesUseCase(aiService);

  const { scorecard, violations } = evaluateUseCase.execute(semGraph);
  const [selectedViolation, setSelectedViolation] = useState<any | null>(violations[0] || null);

  const activeFix = selectedViolation
    ? suggestFixesUseCase.execute(
        selectedViolation.ruleId,
        selectedViolation.sourceEntityId,
        selectedViolation.targetEntityId
      )
    : null;

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS GOVERN — ARCHITECTURE COMPLIANCE DASHBOARD
              </h2>
              <p className="text-[10px] text-slate-400">
                Continuous Policy Evaluation & Grounded Architecture Scorecards
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

        {/* Multi-Dimensional Compliance Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 space-y-1">
            <span className="text-[9px] text-cyan-300 font-bold block uppercase">OVERALL</span>
            <span className="text-2xl font-black text-white">{scorecard.overall}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">ARCH</span>
            <span className="text-xl font-bold text-cyan-200">{scorecard.architecture}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">SECURITY</span>
            <span className="text-xl font-bold text-amber-300">{scorecard.security}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">LAYERING</span>
            <span className="text-xl font-bold text-purple-300">{scorecard.layering}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">TESTING</span>
            <span className="text-xl font-bold text-emerald-300">{scorecard.testing}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">DOCS</span>
            <span className="text-xl font-bold text-blue-300">{scorecard.documentation}</span>
          </div>
        </div>

        {/* Violation Table & Grounded AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Managed Violations List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              POLICY VIOLATIONS ({violations.length})
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {violations.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedViolation(v)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                    selectedViolation?.id === v.id
                      ? "bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/10"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{v.ruleName}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      {v.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Evidence: {v.graphEvidence[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Grounded AI Fix Recommendation Panel */}
          {activeFix && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>🤖</span> GROUNDED AI FIX SUGGESTION
                </span>
                <span className="text-[9px] text-emerald-400 font-bold">
                  {(activeFix.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">REASON</span>
                  <p className="text-slate-200">{activeFix.reason}</p>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">SUGGESTED REFACTOR</span>
                  <p className="text-cyan-200 font-mono bg-slate-950 p-2 rounded border border-cyan-500/20">
                    {activeFix.suggestedRefactor}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">GRAPH EVIDENCE</span>
                  <ul className="list-disc list-inside text-slate-400 text-[10px] font-mono">
                    {activeFix.graphEvidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
