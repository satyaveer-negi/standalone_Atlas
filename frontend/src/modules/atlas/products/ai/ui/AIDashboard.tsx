import { useState } from "react";
import { ProjectAdapter } from "../../../adapters/ProjectAdapter";
import { SkillRegistry } from "../engine/SkillRegistry";
import { ExecutionOrchestrator } from "../engine/ExecutionOrchestrator";
import type { AIContext } from "../engine/AIContext";

export function AIDashboard({ onClose }: { onClose: () => void }) {
  const semGraph = ProjectAdapter.buildSemanticGraphFromERP();
  const registry = new SkillRegistry();
  const orchestrator = new ExecutionOrchestrator(registry);

  const skills = registry.getAllSkills();
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0].id);
  const [intent, setIntent] = useState("Explain task creation architecture flow");

  const activePlan = orchestrator.generatePlan(intent, selectedSkillId);

  const sampleContext: AIContext = {
    intent,
    graphContext: {
      targetEntities: semGraph.getAllEntities().slice(0, 3),
      traversalPaths: ["Tasks.tsx ➔ TaskViewSet ➔ Task Model"],
    },
    runtimeContext: {
      activeConnectors: 3,
      anomaliesCount: 1,
    },
    policyContext: {
      openViolationsCount: 1,
      overallScore: 88,
    },
  };

  const output = orchestrator.executeSkill(selectedSkillId, sampleContext);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS AI — GROUNDED ENGINEERING COPILOT & SKILL WORKSPACE
              </h2>
              <p className="text-[10px] text-slate-400">
                Multi-Source Context Assembly, Multi-Step Plan Execution & Grounded Evidence
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

        {/* Workspace 1: Intent Input & Skill Selection */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-cyan-300">💡 USER INTENT:</span>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. Explain task creation flow, Review architecture..."
              className="flex-1 bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">SELECT SKILL:</span>
            {skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSkillId === skill.id
                    ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace 2: Execution Plan & Skill Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Multi-Step Execution Plan */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              📝 MULTI-STEP EXECUTION PLAN
            </h3>
            <div className="space-y-2">
              {activePlan.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs text-slate-200 font-medium">{step.title}</span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      step.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : step.status === "EXECUTING"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grounded Skill Output & Recommendations */}
          {output && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>🤖</span> SKILL OUTPUT: {output.summary}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold">
                  {(output.confidence * 100).toFixed(0)}% Grounded
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">FINDINGS</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {output.findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">GROUNDED RECOMMENDATIONS</span>
                  <div className="space-y-1">
                    {output.recommendations.map((rec, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950 border border-cyan-500/20 text-cyan-200 text-[10px]">
                        👉 {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
