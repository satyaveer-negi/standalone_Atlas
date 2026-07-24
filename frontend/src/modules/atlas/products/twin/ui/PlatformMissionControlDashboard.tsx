import { useState } from "react";
import { PlatformHealthMetrics } from "../engine/PlatformHealthMetrics";
import { PlatformGovernance } from "../engine/PlatformGovernance";
import { AtlasCLI } from "../engine/AtlasCLI";

export function PlatformMissionControlDashboard({ onClose }: { onClose: () => void }) {
  const metricsEngine = new PlatformHealthMetrics();
  const governanceEngine = new PlatformGovernance();
  const cli = new AtlasCLI();

  const telemetry = metricsEngine.getPlatformHealth();
  const releaseGate = governanceEngine.evaluateReleaseQualityGates();

  const [cliInput, setCliInput] = useState("atlas twin snapshot");
  const [cliOutput, setCliOutput] = useState("");

  const handleRunCLI = () => {
    const res = cli.executeCommand(cliInput);
    setCliOutput(res.output);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-teal-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-sm font-black text-teal-300 tracking-wider uppercase">
                ATLAS PLATFORM MISSION CONTROL & GOVERNANCE DASHBOARD
              </h2>
              <p className="text-[10px] text-slate-400">
                Operational health instrumentation implemented under project-defined test conditions.
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

        {/* Release Quality Gates Banner */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 flex items-center justify-between text-xs">
          <div className="space-y-1">
            <span className="font-bold text-emerald-300 uppercase block">🛡️ RELEASE GOVERNANCE QUALITY GATES:</span>
            <div className="flex gap-3 text-[10px] text-slate-300 font-mono">
              <span>TypeScript: <span className="text-emerald-400 font-bold">{releaseGate.typescriptCheckPassed ? "PASSED ✓" : "FAIL"}</span></span>
              <span>Django: <span className="text-emerald-400 font-bold">{releaseGate.djangoCheckPassed ? "PASSED ✓" : "FAIL"}</span></span>
              <span>Unit Coverage: <span className="text-emerald-400 font-bold">{telemetry.testHealth.unitTestCoveragePct}%</span></span>
              <span>Twin Latency: <span className="text-emerald-400 font-bold">{telemetry.platformMetrics.twinSyncLatencyMs}ms</span></span>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold">
            {releaseGate.releaseCandidateStatus}
          </span>
        </div>

        {/* Operational Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-cyan-300 block">CODE HEALTH:</span>
            <div className="text-[11px] text-slate-300">• TS Errors: <span className="text-emerald-400 font-bold">{telemetry.codeHealth.typescriptErrors}</span></div>
            <div className="text-[11px] text-slate-300">• Django Issues: <span className="text-emerald-400 font-bold">{telemetry.codeHealth.djangoSystemIssues}</span></div>
            <div className="text-[11px] text-slate-300">• Complexity: <span className="text-emerald-400 font-bold">{telemetry.codeHealth.cyclomaticComplexityStatus}</span></div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-indigo-300 block">TEST COVERAGE:</span>
            <div className="text-[11px] text-slate-300">• Unit: <span className="text-indigo-400 font-bold">{telemetry.testHealth.unitTestCoveragePct}%</span></div>
            <div className="text-[11px] text-slate-300">• Integration: <span className="text-indigo-400 font-bold">{telemetry.testHealth.integrationTestCoveragePct}%</span></div>
            <div className="text-[11px] text-slate-300">• End-to-End: <span className="text-indigo-400 font-bold">{telemetry.testHealth.e2eTestCoveragePct}%</span></div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-300 block">PLATFORM PERFORMANCE:</span>
            <div className="text-[11px] text-slate-300">• Twin Sync Latency: <span className="text-amber-400 font-bold">{telemetry.platformMetrics.twinSyncLatencyMs}ms</span></div>
            <div className="text-[11px] text-slate-300">• TQL Query Latency: <span className="text-amber-400 font-bold">{telemetry.platformMetrics.tqlQueryLatencyMs}ms</span></div>
            <div className="text-[11px] text-slate-300">• Prediction Calibration: <span className="text-amber-400 font-bold">{telemetry.platformMetrics.predictionCalibrationPct}%</span></div>
          </div>
        </div>

        {/* Structured Domain CLI Runner */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-teal-500/30 space-y-3">
          <h3 className="text-xs font-black text-teal-300 uppercase tracking-wider">
            💻 DOMAIN-STRUCTURED ATLAS CLI RUNNER
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-teal-400"
            />
            <button
              onClick={handleRunCLI}
              className="px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-400 text-teal-300 text-xs font-bold hover:bg-teal-500/30 cursor-pointer"
            >
              EXECUTE CLI
            </button>
          </div>
          {cliOutput && (
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono">
              {cliOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
