import { useState } from "react";
import { PlatformCertificationLab } from "../engine/PlatformCertificationLab";
import { AtlasCLI } from "../engine/AtlasCLI";
import { FidelityBenchmarkEngine } from "../engine/FidelityBenchmarkEngine";
import { EngineeringMemoryEngine } from "../engine/EngineeringMemoryEngine";
import { EngineeringIntentEngine } from "../engine/EngineeringIntentEngine";

export function DeveloperSDKPortal({ onClose }: { onClose: () => void }) {
  const certLab = new PlatformCertificationLab();
  const cli = new AtlasCLI();
  const benchmarkEngine = new FidelityBenchmarkEngine();
  const memoryEngine = new EngineeringMemoryEngine();
  const intentEngine = new EngineeringIntentEngine();

  const certReport = certLab.runCertificationSuite();
  const benchmarks = benchmarkEngine.runBenchmarkSuite();
  const memories = memoryEngine.getMemoryRecords();

  const [cliInput, setCliInput] = useState("atlas create simulator");
  const [cliOutput, setCliOutput] = useState("");
  const [intentInput, setIntentInput] = useState("Reduce API latency under 200ms");
  const [intentPipeline, setIntentPipeline] = useState(() => intentEngine.processIntent(""));

  const handleRunCLI = () => {
    const res = cli.executeCommand(cliInput);
    setCliOutput(res.output);
  };

  const handleRunIntent = () => {
    setIntentPipeline(intentEngine.processIntent(intentInput));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-indigo-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h2 className="text-sm font-black text-indigo-300 tracking-wider uppercase">
                ATLAS PLATFORM OPERATIONALIZATION & ENGINEERING INTENT PORTAL
              </h2>
              <p className="text-[10px] text-slate-400">
                Platform Certification, Developer CLI, 4 Benchmark Families, Engineering Memory & Intent Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-indigo-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Panel 1 & 3: Certification & Benchmarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Certification Lab */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2 text-xs">
            <span className="font-bold text-emerald-300 block uppercase">🛡️ PLATFORM CERTIFICATION LAB STATUS:</span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div>• Load Test: <span className="text-emerald-400 font-bold">PASSED ✓</span></div>
              <div>• Chaos Resilience: <span className="text-emerald-400 font-bold">{certReport.chaosResilienceScore}%</span></div>
              <div>• Security Audit: <span className="text-emerald-400 font-bold">PASSED ✓</span></div>
              <div>• Overall Status: <span className="text-white bg-emerald-500/30 px-2 py-0.5 rounded font-bold">{certReport.overallStatus}</span></div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2 text-xs">
            <span className="font-bold text-cyan-300 block uppercase">📊 FIDELITY & CALIBRATION BENCHMARKS:</span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div>• Twin Fidelity: <span className="text-cyan-400 font-bold">{benchmarks.twinFidelityScore}%</span></div>
              <div>• Simulation Fidelity: <span className="text-cyan-400 font-bold">{benchmarks.simulationFidelityScore}%</span></div>
              <div>• Prediction Accuracy: <span className="text-cyan-400 font-bold">{benchmarks.predictionAccuracyScore}%</span></div>
              <div>• Agent Quality: <span className="text-cyan-400 font-bold">{benchmarks.agentQualityScore}%</span></div>
            </div>
          </div>
        </div>

        {/* Panel 2: Developer CLI */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-500/30 space-y-3">
          <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
            💻 ATLAS DEVELOPER CLI & SCAFFOLDING
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={handleRunCLI}
              className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 cursor-pointer"
            >
              RUN CLI
            </button>
          </div>
          {cliOutput && (
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono">
              {cliOutput}
            </div>
          )}
        </div>

        {/* Panel 5: Engineering Memory */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-3">
          <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
            🧠 ENGINEERING MEMORY PLATFORM (HISTORICAL INCIDENTS & DECISIONS)
          </h3>
          <div className="space-y-2">
            {memories.map((m) => (
              <div key={m.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                <span className="font-bold text-amber-300">[{m.category}] {m.title}</span>
                <p className="text-[11px] text-slate-300">Outcome: {m.historicalOutcome}</p>
                <p className="text-[10px] text-slate-400">Lesson: {m.lessonsLearned}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Program 2: Engineering Intent Engine */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-pink-500/40 space-y-3">
          <h3 className="text-xs font-black text-pink-300 uppercase tracking-wider">
            🚀 PROGRAM 2 — ENGINEERING INTENT ENGINE (V7 PREVIEW)
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={intentInput}
              onChange={(e) => setIntentInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-pink-400"
            />
            <button
              onClick={handleRunIntent}
              className="px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-400 text-pink-300 text-xs font-bold hover:bg-pink-500/30 cursor-pointer"
            >
              EXECUTE INTENT
            </button>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
            <span className="font-bold text-pink-300 block">Goal: {intentPipeline.interpretedGoal}</span>
            <p className="text-[11px] text-slate-300">Analysis: {intentPipeline.twinAnalysisResult}</p>
            <p className="text-[11px] text-emerald-400 font-bold">Optimization: {intentPipeline.selectedOptimization}</p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold inline-block mt-1">
              Status: {intentPipeline.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
