import { useState } from "react";
import { AgentService } from "../../../services/AgentService";
import { EvidenceCollector } from "../engine/EvidenceCollector";
import { ExplanationEngine } from "../engine/ExplanationEngine";
import { AIWorkflowComposer } from "../engine/AIWorkflowComposer";

export function AgentDashboard({ onClose }: { onClose: () => void }) {
  const [agentService] = useState(() => new AgentService());
  const evidenceCollector = new EvidenceCollector();
  const explanationEngine = new ExplanationEngine();
  const composer = new AIWorkflowComposer();

  const [prompt, setPrompt] = useState("Resolve Redis cache architectural drift and deploy verified architecture to Staging");
  const goal = agentService.getInterpreter().interpretGoal(prompt);
  const plans = agentService.getPlanner().generateCandidatePlans(goal);
  const selectedPlan = plans.find((p) => p.selected) || plans[0];

  const evidence = evidenceCollector.collectEvidenceForGoal(goal.id);
  const explanation = explanationEngine.explainPlan(plans, evidence);
  const risk = composer.evaluatePlanRisk(selectedPlan);

  const [approvalReq, setApprovalReq] = useState(() => composer.submitPlanForHumanApproval(selectedPlan));

  const handleApprovePlan = () => {
    setApprovalReq((prev) => ({ ...prev, status: "APPROVED" }));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-pink-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-sm font-black text-pink-300 tracking-wider uppercase">
                ATLAS AI ENGINEERING AGENT — AUTONOMOUS ORCHESTRATOR
              </h2>
              <p className="text-[10px] text-slate-400">
                Multi-Stage Goal Interpreter, Evidence Collector, Risk Assessment & Human Verification Gates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-pink-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Panel 1: Goal Workspace Input */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-pink-500/30 space-y-2">
          <span className="text-xs font-bold text-pink-300 uppercase block">💬 ENTER ENGINEERING OBJECTIVE:</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-pink-400"
            />
            <button className="px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-400 text-pink-300 text-xs font-bold hover:bg-pink-500/30 cursor-pointer">
              ⚡ REPLAN
            </button>
          </div>
        </div>

        {/* Panel 2 & 5: Execution Plan DAG Visualizer & Risk Assessment */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-pink-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-pink-300 uppercase tracking-wider">
              📊 GENERATED AI EXECUTION PLAN DAG ({selectedPlan.title})
            </h3>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase font-mono">
              OVERALL RISK: {risk.overallRiskCategory} (Deploy: {risk.deploymentRiskPercent}%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {selectedPlan.dagNodes.map((node) => (
              <div
                key={node.id}
                className={`p-3 rounded-xl border space-y-1 ${
                  node.status === "PASSED"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                    : node.status === "WAITING_APPROVAL"
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <span className="text-[9px] font-bold uppercase block">{node.category}</span>
                <span className="text-xs font-bold block text-white">{node.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3 & 4: Evidence Inspector & Rejected Alternatives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Evidence Inspector */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
            <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
              🔍 FIRST-CLASS EVIDENCE INSPECTOR
            </h3>
            <div className="space-y-2">
              {evidence.map((ev) => (
                <div key={ev.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-cyan-300">[{ev.source}]</span>
                    <span className="text-emerald-400 font-bold">{(ev.confidence * 100).toFixed(0)}% Confidence</span>
                  </div>
                  <p className="text-slate-300 text-[11px] font-mono">{ev.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Alternatives */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/30 space-y-3">
            <h3 className="text-xs font-black text-rose-300 uppercase tracking-wider">
              🚫 REJECTED ALTERNATIVE CANDIDATE PLANS
            </h3>
            <div className="space-y-2">
              {explanation.rejectedAlternatives.map((rej, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                  <span className="font-bold text-rose-300 block">{rej.title}</span>
                  <p className="text-[10px] text-slate-400">Reason: {rej.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 6: Human Approval Status & Trigger */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              👥 MANDATORY HUMAN VERIFICATION GATE
            </h3>
            <span className="text-xs font-bold text-white font-mono">Status: {approvalReq.status}</span>
          </div>

          {approvalReq.status === "OPEN" ? (
            <button
              onClick={handleApprovePlan}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 cursor-pointer transition-all"
            >
              ✓ APPROVE AI EXECUTION PLAN & EMIT COMMAND STREAM
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs text-emerald-300 font-bold font-mono">
              ✅ Plan Approved by Lead Architect! Workflow DAG Engine executing steps into append-only command stream.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
