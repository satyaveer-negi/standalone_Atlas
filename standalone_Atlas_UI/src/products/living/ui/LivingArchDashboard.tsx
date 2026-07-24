import { useState } from "react";
import { LivingArchService } from "../../../services/LivingArchService";

export function LivingArchDashboard({ onClose }: { onClose: () => void }) {
  const [service] = useState(() => new LivingArchService());
  const driftEngine = service.getDriftEngine();
  const revisions = service.getRevisions();

  const health = driftEngine.computeDomainHealth();
  const alerts = driftEngine.reconcileAndDetectDrift({ version: "1.0", components: [], relations: [] }, { version: "1.0", components: [], relations: [] });

  const [selectedCommit, setSelectedCommit] = useState(revisions[0]);
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);

  const handleApplyCorrection = (alertId: string) => {
    setResolvedAlerts((prev) => [...prev, alertId]);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-emerald-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h2 className="text-sm font-black text-emerald-300 tracking-wider uppercase">
                ATLAS LIVING ARCHITECTURE — CONTINUOUS RECONCILIATION & DRIFT RADAR
              </h2>
              <p className="text-[10px] text-slate-400">
                Canonical Architecture Extraction, Multi-Domain Semantic Reconciliation & Time Travel Scrubbing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Panel 1 & 2: Repository Status & Multi-Domain Health Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-1">
            <span className="text-[9px] text-emerald-300 font-bold block uppercase">HEALTH INDEX</span>
            <span className="text-2xl font-black text-white">{health.overallHealthIndex}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">ARCH SCORE</span>
            <span className="text-xl font-bold text-cyan-200">{health.architectureScore}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">POLICY SCORE</span>
            <span className="text-xl font-bold text-amber-300">{health.policyScore}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">TECH SCORE</span>
            <span className="text-xl font-bold text-purple-300">{health.technologyScore}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">DEPLOY SCORE</span>
            <span className="text-xl font-bold text-blue-300">{health.deploymentScore}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">DOCS SCORE</span>
            <span className="text-xl font-bold text-teal-300">{health.documentationScore}%</span>
          </div>
        </div>

        {/* Panel 3: Architectural Time Travel Scrubber */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
          <span className="text-xs font-bold text-emerald-300 uppercase block">🕒 ARCHITECTURAL TIME TRAVEL REVISION SCRUBBER:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {revisions.map((rev) => (
              <div
                key={rev.commitHash}
                onClick={() => setSelectedCommit(rev)}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  selectedCommit.commitHash === rev.commitHash
                    ? "bg-emerald-500/20 border-emerald-400 shadow-md"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="font-bold text-emerald-300">Commit: {rev.commitHash}</span>
                  <span>{new Date(rev.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-xs font-bold text-white">{rev.message}</p>
                <p className="text-[10px] text-slate-400">Author: {rev.author} | Components: {rev.componentsCount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4, 5, 6: Drift Alerts, Comparison & Suggested Corrections */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/40 space-y-3">
          <h3 className="text-xs font-black text-rose-300 uppercase tracking-wider">
            🚨 RECONCILIATION DRIFT ALERTS & AUTOMATED CORRECTIONS
          </h3>
          <div className="space-y-2">
            {alerts.map((al) => {
              const isResolved = resolvedAlerts.includes(al.id);
              return (
                <div key={al.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">[{al.category}] {al.title}</span>
                    {isResolved ? (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">RESOLVED ✅</span>
                    ) : (
                      <button
                        onClick={() => handleApplyCorrection(al.id)}
                        className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-400 text-rose-300 font-bold text-[10px] hover:bg-rose-500/30 cursor-pointer"
                      >
                        APPLY CORRECTION
                      </button>
                    )}
                  </div>
                  <p className="text-slate-300 text-[11px]">{al.description}</p>
                  <p className="text-[10px] text-emerald-300 font-mono">Suggested Fix: {al.suggestedFix}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
