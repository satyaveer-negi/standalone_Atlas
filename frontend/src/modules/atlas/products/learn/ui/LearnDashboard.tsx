import { useState } from "react";
import { PREDEFINED_LEARNING_MISSIONS } from "../engine/MissionTemplate";
import { LearningMissionEngine } from "../engine/LearningMissionEngine";
import { MasteryModel } from "../engine/MasteryModel";
import { DocumentationService } from "../../../services/DocumentationService";

export function LearnDashboard({ onClose }: { onClose: () => void }) {
  const missionEngine = new LearningMissionEngine();
  const masteryModel = new MasteryModel();
  const docService = new DocumentationService();

  const [activeMission, setActiveMission] = useState(PREDEFINED_LEARNING_MISSIONS[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completedMissionsCount, setCompletedMissionsCount] = useState(1);

  const mastery = masteryModel.computeMastery(completedMissionsCount);
  const linkedAdrs = docService.getAllADRs();

  const handleOptionClick = (idx: number) => {
    setSelectedOption(idx);
    const isCorrect = missionEngine.evaluateCheckpoint(activeMission, idx);
    if (isCorrect) {
      setCompletedMissionsCount((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS LEARN — DEVELOPER ONBOARDING & CONCEPT MASTERY
              </h2>
              <p className="text-[10px] text-slate-400">
                Interactive Graph Walkthroughs, ADR Document Linkage & Checkpoint Evaluation
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

        {/* Multi-Dimensional Mastery Meter */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 space-y-1">
            <span className="text-[9px] text-cyan-300 font-bold block uppercase">OVERALL MASTERY</span>
            <span className="text-2xl font-black text-white">{mastery.overallMastery}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">ARCH</span>
            <span className="text-xl font-bold text-cyan-200">{mastery.architecture}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">NAV</span>
            <span className="text-xl font-bold text-purple-300">{mastery.navigation}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">DOCS</span>
            <span className="text-xl font-bold text-blue-300">{mastery.documentation}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">POLICIES</span>
            <span className="text-xl font-bold text-amber-300">{mastery.policies}%</span>
          </div>
        </div>

        {/* Workspace: Mission Walkthrough & Interactive Checkpoint */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Mission Walkthrough & Linked ADRs */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              🚀 ACTIVE ONBOARDING MISSION: {activeMission.title}
            </h3>
            <p className="text-[11px] text-slate-300">{activeMission.description}</p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-cyan-300 font-bold block uppercase">3D GRAPH WALKTHROUGH STOPS</span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-200">
                {activeMission.stops.map((stop, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40">
                    {stop}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked ADRs */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold block uppercase">LINKED ADR KNOWLEDGE ENTITY</span>
              {linkedAdrs.map((adr) => (
                <div key={adr.id} className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/30 space-y-1">
                  <span className="text-xs font-bold text-purple-300 block">{adr.title}</span>
                  <p className="text-[10px] text-slate-400">{adr.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Checkpoint Question */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/30 space-y-3">
            <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider">
              ❓ INTERACTIVE CHECKPOINT QUESTION
            </h3>
            <p className="text-xs text-white font-bold">{activeMission.checkpoint.question}</p>

            <div className="space-y-2">
              {activeMission.checkpoint.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    selectedOption === idx
                      ? idx === activeMission.checkpoint.correctOptionIndex
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-rose-500/20 border-rose-400 text-rose-300"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {selectedOption !== null && (
              <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs text-cyan-300">
                {selectedOption === activeMission.checkpoint.correctOptionIndex
                  ? "✅ Checkpoint Passed! Concept Mastery +30%."
                  : "❌ Incorrect option. Review linked ADR-001 for correct architecture boundary."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
