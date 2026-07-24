import { useState } from "react";
import { WorkflowOrchestrator } from "../engine/WorkflowOrchestrator";
import { ApprovalEngine, type ApprovalRequest } from "../engine/ApprovalEngine";
import { DEMO_AUDIT_LOGS } from "../engine/WorkflowAuditStore";
import type { WorkflowDefinition } from "../engine/DeclarativeWorkflow";

const DEMO_PR_WORKFLOW: WorkflowDefinition = {
  id: "wf-pr-review-dag",
  name: "Pull Request Architectural Review DAG Workflow",
  triggerEvent: "pull_request.opened",
  dagNodes: [
    { id: "step-govern", name: "🛡️ Govern Policy Check", category: "PARALLEL", productTarget: "Govern", dependencies: [], status: "PASSED" },
    { id: "step-simulate", name: "🧪 Simulate Risk Predictor", category: "PARALLEL", productTarget: "Simulate", dependencies: [], status: "PASSED" },
    { id: "step-ai-review", name: "🤖 AI Copilot Review", category: "ACTION", productTarget: "AI", dependencies: ["step-govern", "step-simulate"], status: "PASSED" },
    { id: "step-approval", name: "👥 Human Lead Approval Gate", category: "APPROVAL", dependencies: ["step-ai-review"], status: "WAITING_APPROVAL" },
    { id: "step-deploy", name: "🚀 Deploy Preview Environment", category: "ACTION", productTarget: "Studio", dependencies: ["step-approval"], status: "PENDING" },
  ],
};

export function WorkflowsDashboard({ onClose }: { onClose: () => void }) {
  const orchestrator = new WorkflowOrchestrator();
  const approvalEngine = new ApprovalEngine();

  const [activeWorkflow] = useState(DEMO_PR_WORKFLOW);
  const [approvalReq, setApprovalReq] = useState<ApprovalRequest>({
    id: "appr-101",
    workflowInstanceId: "inst-99",
    stepId: "step-approval",
    title: "Approve Pull Request #104 Deployment to Staging",
    policy: "SINGLE_REVIEWER",
    reviewers: ["Alex Dev (Lead)", "Sarah Architect"],
    votes: [],
    status: "OPEN",
  });

  const handleVote = (approved: boolean) => {
    const updated = approvalEngine.castVote({ ...approvalReq }, "Alex Dev (Lead)", approved);
    setApprovalReq(updated);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-amber-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h2 className="text-sm font-black text-amber-300 tracking-wider uppercase">
                ATLAS WORKFLOWS — ENGINEERING WORKFLOW AUTOMATION ENGINE
              </h2>
              <p className="text-[10px] text-slate-400">
                Declarative DAG Execution Graphs, Reusable Approval Gates & Audit Timelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Workflow Title & Trigger */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">{activeWorkflow.name}</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase font-mono">
              TRIGGER: {activeWorkflow.triggerEvent}
            </span>
          </div>
        </div>

        {/* DAG Execution Graph Visualizer */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-3">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
            📊 DAG EXECUTION GRAPH STEPS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {activeWorkflow.dagNodes.map((node) => (
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
                <span className="text-[9px] font-mono block">Status: {node.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Human Approval Gate & Audit History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Human Approval Gate Panel */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-3">
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              👥 HUMAN APPROVAL GATE ({approvalReq.policy})
            </h3>
            <p className="text-xs text-white font-bold">{approvalReq.title}</p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div>Reviewers: <span className="font-bold text-amber-300">{approvalReq.reviewers.join(", ")}</span></div>
              <div>Status: <span className="font-bold text-emerald-400">{approvalReq.status}</span></div>
            </div>

            {approvalReq.status === "OPEN" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleVote(true)}
                  className="flex-1 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 cursor-pointer"
                >
                  ✓ APPROVE DEPLOYMENT
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className="flex-1 py-2 rounded-lg bg-rose-500/20 border border-rose-400 text-rose-300 text-xs font-bold hover:bg-rose-500/30 cursor-pointer"
                >
                  ✕ REJECT
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs text-emerald-300 font-bold">
                ✅ Approval Gate Passed! Workflow Resuming Step: Deploy Preview.
              </div>
            )}
          </div>

          {/* Audit History Log */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              📜 EXECUTION AUDIT TIMELINE LOGS
            </h3>
            <div className="space-y-2">
              {DEMO_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-cyan-300">{log.stepName}</span>
                    <span className="text-slate-400">{log.runtimeMs}ms</span>
                  </div>
                  <div className="text-[10px] text-emerald-400">Result: {log.status} ({log.category})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
