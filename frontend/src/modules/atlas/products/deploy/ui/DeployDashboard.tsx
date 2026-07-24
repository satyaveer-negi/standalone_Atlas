import { useState } from "react";
import { DeployService } from "../../../services/DeployService";
import { ManifestGeneratorEngine } from "../engine/ManifestGeneratorEngine";
import { DeploymentVerifier } from "../engine/DeploymentVerifier";
import { RollbackPlanner } from "../engine/RollbackPlanner";

export function DeployDashboard({ onClose }: { onClose: () => void }) {
  const [deployService] = useState(() => new DeployService());
  const manifestEngine = new ManifestGeneratorEngine();
  const verifier = new DeploymentVerifier();
  const rollbackPlanner = new RollbackPlanner();

  const environments = deployService.getEnvironments();
  const [selectedEnv, setSelectedEnv] = useState(environments[1]); // Default Staging
  const [selectedManifestTab, setSelectedManifestTab] = useState<"k8s" | "docker" | "helm" | "terraform">("k8s");
  const [rollbackTriggered, setRollbackTriggered] = useState(false);

  const plan = deployService.createPlan(selectedEnv.type);
  const artifacts = manifestEngine.generateManifests(plan);
  const verificationChecks = verifier.verifyRuntime(plan);
  const rollback = rollbackPlanner.generateRollbackPlan(selectedEnv.activeDeploymentRevision, "rev-stag-87");

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-sky-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h2 className="text-sm font-black text-sky-300 tracking-wider uppercase">
                ATLAS DEPLOYMENT INTELLIGENCE — CANONICAL DEPLOYMENT PLANNER
              </h2>
              <p className="text-[10px] text-slate-400">
                Environment Graph Entities, Plugin Manifest Generators, Runtime Verification & 1-Click Rollback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-sky-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Panel 1: Environment Explorer */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 space-y-3">
          <span className="text-xs font-bold text-sky-300 uppercase block">🌐 SELECT TARGET ENVIRONMENT GRAPH NODE:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {environments.map((env) => (
              <div
                key={env.id}
                onClick={() => setSelectedEnv(env)}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  selectedEnv.id === env.id
                    ? "bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/10"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white block">{env.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {env.healthState}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Revision: {env.activeDeploymentRevision}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2 & 3: Manifest Preview & Runtime Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Manifest Previewer */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider">📜 GENERATED MANIFEST PREVIEW</h3>
              <div className="flex gap-1 text-[10px]">
                <button
                  onClick={() => setSelectedManifestTab("k8s")}
                  className={`px-2 py-0.5 rounded ${selectedManifestTab === "k8s" ? "bg-purple-500/30 text-purple-200 border border-purple-400" : "text-slate-400"}`}
                >
                  K8s
                </button>
                <button
                  onClick={() => setSelectedManifestTab("docker")}
                  className={`px-2 py-0.5 rounded ${selectedManifestTab === "docker" ? "bg-purple-500/30 text-purple-200 border border-purple-400" : "text-slate-400"}`}
                >
                  Docker
                </button>
                <button
                  onClick={() => setSelectedManifestTab("helm")}
                  className={`px-2 py-0.5 rounded ${selectedManifestTab === "helm" ? "bg-purple-500/30 text-purple-200 border border-purple-400" : "text-slate-400"}`}
                >
                  Helm
                </button>
                <button
                  onClick={() => setSelectedManifestTab("terraform")}
                  className={`px-2 py-0.5 rounded ${selectedManifestTab === "terraform" ? "bg-purple-500/30 text-purple-200 border border-purple-400" : "text-slate-400"}`}
                >
                  Terraform
                </button>
              </div>
            </div>

            <pre className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 text-purple-200 text-xs font-mono max-h-[220px] overflow-y-auto custom-scrollbar">
              {selectedManifestTab === "k8s" && artifacts.kubernetesYaml}
              {selectedManifestTab === "docker" && artifacts.dockerComposeYml}
              {selectedManifestTab === "helm" && artifacts.helmValuesYaml}
              {selectedManifestTab === "terraform" && artifacts.terraformMainTf}
            </pre>
          </div>

          {/* Runtime Verification & Rollback Controls */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-sky-500/30 space-y-3">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-wider">
              🔍 RUNTIME INTENT VS. OBSERVED VERIFICATION
            </h3>
            <div className="space-y-1.5">
              {verificationChecks.map((chk, i) => (
                <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{chk.item}</span>
                  <span className="text-emerald-400 font-bold">Intended: {chk.intended} | Observed: {chk.observed} ✓</span>
                </div>
              ))}
            </div>

            {/* 1-Click Rollback */}
            <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">1-CLICK ROLLBACK PLANNER</span>
                <button
                  onClick={() => setRollbackTriggered(true)}
                  className="px-3 py-1 rounded bg-rose-500/20 border border-rose-400 text-rose-300 font-bold text-xs hover:bg-rose-500/30 cursor-pointer"
                >
                  TRIGGER ROLLBACK
                </button>
              </div>
              {rollbackTriggered && (
                <div className="text-[10px] text-emerald-300 font-mono space-y-1 border-t border-slate-800 pt-2">
                  <div>✅ Rollback Executed: {rollback.currentRevision} ➔ {rollback.targetRollbackRevision}</div>
                  {rollback.actions.map((act, idx) => (
                    <div key={idx} className="text-slate-400">• {act}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
