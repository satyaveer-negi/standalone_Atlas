import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtlasStore } from "../../store/atlasStore";
import type { ExplorationMode } from "../../store/atlasStore";
import { MissionControlPalette } from "./MissionControlPalette";
import { ComplianceDashboard } from "../../products/govern/ui/ComplianceDashboard";
import { ObserveDashboard } from "../../products/observe/ui/ObserveDashboard";
import { ExploreDashboard } from "../../products/explore/ui/ExploreDashboard";
import { AIDashboard } from "../../products/ai/ui/AIDashboard";
import { SimulateDashboard } from "../../products/simulate/ui/SimulateDashboard";
import { LearnDashboard } from "../../products/learn/ui/LearnDashboard";
import { StudioDashboard } from "../../products/studio/ui/StudioDashboard";
import { CollaborationOverlay } from "../../products/collaborate/ui/CollaborationOverlay";
import { ConnectorsDashboard } from "../../products/connectors/ui/ConnectorsDashboard";
import { LivingArchDashboard } from "../../products/living/ui/LivingArchDashboard";
import { WorkflowsDashboard } from "../../products/workflows/ui/WorkflowsDashboard";
import { DeployDashboard } from "../../products/deploy/ui/DeployDashboard";
import { AnalyticsDashboard } from "../../products/analytics/ui/AnalyticsDashboard";
import { AgentDashboard } from "../../products/agent/ui/AgentDashboard";
import { EcosystemDashboard } from "../../products/ecosystem/ui/EcosystemDashboard";
import { EnterpriseDashboard } from "../../products/enterprise/ui/EnterpriseDashboard";
import { DigitalTwinDashboard } from "../../products/twin/ui/DigitalTwinDashboard";
import { DeveloperSDKPortal } from "../../products/twin/ui/DeveloperSDKPortal";
import { PlatformMissionControlDashboard } from "../../products/twin/ui/PlatformMissionControlDashboard";

interface Props {
  sprintName?: string;
  tasksCount?: number;
  filesCount?: number;
}

const EXPLORATION_MODES: { id: ExplorationMode; label: string; icon: string }[] = [
  { id: "architecture", label: "Arch", icon: "🌍" },
  { id: "dependency", label: "Deps", icon: "🔀" },
  { id: "git", label: "Git", icon: "🌳" },
  { id: "activity", label: "Activity", icon: "📈" },
  { id: "ai", label: "AI", icon: "🤖" },
  { id: "runtime", label: "APIs", icon: "🚀" },
  { id: "timeline", label: "Time", icon: "⏳" },
];

export default function TopBar({
  sprintName = "Sprint 1",
  tasksCount = 14,
  filesCount = 12,
}: Props) {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showGovern, setShowGovern] = useState(false);
  const [showObserve, setShowObserve] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showSimulate, setShowSimulate] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [showCollaborate, setShowCollaborate] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const [showLivingArch, setShowLivingArch] = useState(false);
  const [showWorkflows, setShowWorkflows] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [showEnterprise, setShowEnterprise] = useState(false);
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);
  const [showDevPortal, setShowDevPortal] = useState(false);
  const [showMissionControl, setShowMissionControl] = useState(false);

  const autoRotate = useAtlasStore((state) => state.autoRotate);
  const toggleAutoRotate = useAtlasStore((state) => state.toggleAutoRotate);
  const showParticles = useAtlasStore((state) => state.showParticles);
  const toggleParticles = useAtlasStore((state) => state.toggleParticles);
  const showGrid = useAtlasStore((state) => state.showGrid);
  const toggleGrid = useAtlasStore((state) => state.toggleGrid);
  const zoomLevel = useAtlasStore((state) => state.zoomLevel);
  const timelineOffset = useAtlasStore((state) => state.timelineOffset);
  const setTimelineOffset = useAtlasStore((state) => state.setTimelineOffset);
  const explorationMode = useAtlasStore((state) => state.explorationMode);
  const setExplorationMode = useAtlasStore((state) => state.setExplorationMode);

  const breadcrumbTrail = useAtlasStore((state) => state.breadcrumbTrail);
  const navigationStack = useAtlasStore((state) => state.navigationStack);
  const stackPointer = useAtlasStore((state) => state.stackPointer);
  const stepBackPortal = useAtlasStore((state) => state.stepBackPortal);
  const forwardPortal = useAtlasStore((state) => state.forwardPortal);
  const navigateToBreadcrumb = useAtlasStore((state) => state.navigateToBreadcrumb);
  const setSearchOpen = useAtlasStore((state) => state.setSearchOpen);

  const activeProtocolFilters = useAtlasStore((state) => state.activeProtocolFilters);
  const toggleProtocolFilter = useAtlasStore((state) => state.toggleProtocolFilter);

  const canGoBack = stackPointer > 0;
  const canGoForward = stackPointer < navigationStack.length - 1;

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-auto p-3 font-mono">
      {/* Sleek 1-Line Floating Glass Spine */}
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-xl px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Section: Exit, Brand, Level Badge, Stack Back/Forward */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-2 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            &larr; Exit
          </button>

          <span className="font-black text-sm tracking-widest text-cyan-300">
            ATLAS
          </span>

          <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
            L{zoomLevel}
          </span>

          {/* Navigation Stack Back & Forward */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={stepBackPortal}
              disabled={!canGoBack}
              className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                canGoBack
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30"
                  : "bg-slate-900/40 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
            >
              &larr;
            </button>
            <button
              onClick={forwardPortal}
              disabled={!canGoForward}
              className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                canGoForward
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30"
                  : "bg-slate-900/40 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
            >
              &rarr;
            </button>
          </div>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-[400px] custom-scrollbar border-l border-slate-800 pl-2">
            {breadcrumbTrail.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-1">
                {idx > 0 && <span className="text-cyan-500/40 text-[10px]">&rarr;</span>}
                <button
                  onClick={() => navigateToBreadcrumb(idx)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    idx === breadcrumbTrail.length - 1
                      ? "bg-cyan-500 text-slate-950 font-black shadow-xs"
                      : "bg-slate-900/60 text-slate-300 hover:text-cyan-300"
                  }`}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Search Trigger & Mission Mode & Govern & Lenses Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGovern(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/30 to-rose-500/30 border border-amber-500/50 text-amber-200 text-[11px] font-mono font-bold hover:from-amber-500/40 hover:to-rose-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🛡️ GOVERN</span>
          </button>

          <button
            onClick={() => setShowObserve(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 text-cyan-200 text-[11px] font-mono font-bold hover:from-cyan-500/40 hover:to-blue-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>📈 OBSERVE</span>
          </button>

          <button
            onClick={() => setShowExplore(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-purple-200 text-[11px] font-mono font-bold hover:from-purple-500/40 hover:to-pink-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🧭 EXPLORE</span>
          </button>

          <button
            onClick={() => setShowAI(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 text-emerald-200 text-[11px] font-mono font-bold hover:from-emerald-500/40 hover:to-teal-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🤖 AI COPILOT</span>
          </button>

          <button
            onClick={() => setShowSimulate(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500/30 to-amber-500/30 border border-rose-500/50 text-rose-200 text-[11px] font-mono font-bold hover:from-rose-500/40 hover:to-amber-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🧪 SIMULATE</span>
          </button>

          <button
            onClick={() => setShowLearn(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-500/50 text-blue-200 text-[11px] font-mono font-bold hover:from-blue-500/40 hover:to-indigo-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>📖 LEARN</span>
          </button>

          <button
            onClick={() => setShowStudio(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-pink-500/50 text-pink-200 text-[11px] font-mono font-bold hover:from-pink-500/40 hover:to-rose-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🎨 STUDIO</span>
          </button>

          <button
            onClick={() => setShowCollaborate(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500/30 to-cyan-500/30 border border-sky-500/50 text-sky-200 text-[11px] font-mono font-bold hover:from-sky-500/40 hover:to-cyan-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>👥 COLLABORATE</span>
          </button>

          <button
            onClick={() => setShowConnectors(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-teal-500/30 to-emerald-500/30 border border-teal-500/50 text-teal-200 text-[11px] font-mono font-bold hover:from-teal-500/40 hover:to-emerald-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🔌 CONNECTORS</span>
          </button>

          <button
            onClick={() => setShowLivingArch(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/30 to-green-500/30 border border-emerald-500/50 text-emerald-200 text-[11px] font-mono font-bold hover:from-emerald-500/40 hover:to-green-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🔄 LIVING ARCH</span>
          </button>

          <button
            onClick={() => setShowWorkflows(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-500/50 text-amber-200 text-[11px] font-mono font-bold hover:from-amber-500/40 hover:to-orange-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>⚡ WORKFLOWS</span>
          </button>

          <button
            onClick={() => setShowDeploy(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500/30 to-blue-500/30 border border-sky-500/50 text-sky-200 text-[11px] font-mono font-bold hover:from-sky-500/40 hover:to-blue-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🚀 DEPLOY</span>
          </button>

          <button
            onClick={() => setShowAnalytics(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-500/50 text-indigo-200 text-[11px] font-mono font-bold hover:from-indigo-500/40 hover:to-purple-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>📊 ANALYTICS</span>
          </button>

          <button
            onClick={() => setShowAgent(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-pink-500/50 text-pink-200 text-[11px] font-mono font-bold hover:from-pink-500/40 hover:to-rose-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🤖 AGENT</span>
          </button>

          <button
            onClick={() => setShowEcosystem(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-teal-500/30 to-emerald-500/30 border border-teal-500/50 text-teal-200 text-[11px] font-mono font-bold hover:from-teal-500/40 hover:to-emerald-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🧩 ECOSYSTEM</span>
          </button>

          <button
            onClick={() => setShowEnterprise(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-500/50 text-blue-200 text-[11px] font-mono font-bold hover:from-blue-500/40 hover:to-indigo-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🏢 ENTERPRISE</span>
          </button>

          <button
            onClick={() => setShowDigitalTwin(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/30 to-teal-500/30 border border-cyan-500/50 text-cyan-200 text-[11px] font-mono font-bold hover:from-cyan-500/40 hover:to-teal-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🌐 DIGITAL TWIN</span>
          </button>

          <button
            onClick={() => setShowDevPortal(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-500/30 to-pink-500/30 border border-indigo-500/50 text-indigo-200 text-[11px] font-mono font-bold hover:from-indigo-500/40 hover:to-pink-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>⚡ DEV PORTAL</span>
          </button>

          <button
            onClick={() => setShowMissionControl(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-teal-500/30 to-emerald-500/30 border border-teal-500/50 text-teal-200 text-[11px] font-mono font-bold hover:from-teal-500/40 hover:to-emerald-500/40 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🎯 MISSION CONTROL</span>
          </button>

          <MissionControlPalette onStartSimulation={(flowId) => {
            const evt = new CustomEvent("atlas-start-simulation", { detail: flowId });
            window.dispatchEvent(evt);
          }} />

          <button
            onClick={() => setSearchOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔍 Search</span>
            <kbd className="px-1 py-0.2 rounded bg-slate-900 text-[9px] text-cyan-300 border border-cyan-500/40">
              Ctrl+K
            </kbd>
          </button>

          {/* Exploration Mode Lens Pills */}
          <div className="flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-cyan-500/20">
            {EXPLORATION_MODES.map((mode) => {
              const isActive = explorationMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setExplorationMode(mode.id)}
                  className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-black shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span className="hidden xl:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Settings Drawer Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            ⚙️ Controls
          </button>
        </div>
      </div>

      {/* Collapsible Settings Drawer */}
      {showSettings && (
        <div className="mt-2 rounded-2xl border border-cyan-500/30 bg-slate-950/90 backdrop-blur-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-xs animate-fadeIn">
          {/* Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoRotate}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border cursor-pointer ${
                autoRotate
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-slate-900/60 text-slate-400 border-slate-700"
              }`}
            >
              {autoRotate ? "🔄 ROTATE: ON" : "⏸️ ROTATE: OFF"}
            </button>
            <button
              onClick={toggleParticles}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border cursor-pointer ${
                showParticles
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-slate-900/60 text-slate-400 border-slate-700"
              }`}
            >
              {showParticles ? "✨ STARS: ON" : "✨ STARS: OFF"}
            </button>
            <button
              onClick={toggleGrid}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border cursor-pointer ${
                showGrid
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                  : "bg-slate-900/60 text-slate-400 border-slate-700"
              }`}
            >
              {showGrid ? "🌐 GRID: ON" : "🌐 GRID: OFF"}
            </button>
          </div>

          {/* Protocol Filters */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-cyan-500/20 text-[10px]">
            <span className="text-cyan-400 font-bold px-1 text-[9px]">FILTERS:</span>
            {(["HTTP", "SQL", "Redis", "WebSocket", "AI"] as const).map((proto) => {
              const active = activeProtocolFilters[proto];
              return (
                <button
                  key={proto}
                  onClick={() => toggleProtocolFilter(proto)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/50"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {active ? `✓ ${proto}` : proto}
                </button>
              );
            })}
          </div>

          {/* Time Machine Slider */}
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-[10px] text-cyan-400 font-bold shrink-0">⏳ TIME MACHINE:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={timelineOffset}
              onChange={(e) => setTimelineOffset(Number(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
            <span className="text-[10px] text-cyan-300 font-bold shrink-0">
              {timelineOffset === 0 ? "LIVE" : `-${timelineOffset}D`}
            </span>
          </div>

          {/* Hotkey Legend */}
          <div className="flex items-center gap-1.5 text-[9px] text-cyan-400/80 font-bold">
            <span>[I] Zoom In</span>
            <span>[O] Zoom Out</span>
            <span>[ESC] Step Back</span>
          </div>
        </div>
      )}

      {/* Atlas Govern Compliance Dashboard */}
      {showGovern && <ComplianceDashboard onClose={() => setShowGovern(false)} />}

      {/* Atlas Observe Operational Dashboard */}
      {showObserve && <ObserveDashboard onClose={() => setShowObserve(false)} />}

      {/* Atlas Explore Codebase Comprehension Dashboard */}
      {showExplore && <ExploreDashboard onClose={() => setShowExplore(false)} />}

      {/* Atlas AI Copilot Workspace */}
      {showAI && <AIDashboard onClose={() => setShowAI(false)} />}

      {/* Atlas Simulate Predictive Sandbox Dashboard */}
      {showSimulate && <SimulateDashboard onClose={() => setShowSimulate(false)} />}

      {/* Atlas Learn Onboarding Workspace */}
      {showLearn && <LearnDashboard onClose={() => setShowLearn(false)} />}

      {/* Atlas Studio Visual Authoring & Generation Workspace */}
      {showStudio && <StudioDashboard onClose={() => setShowStudio(false)} />}

      {/* Atlas V5 Collaboration Real-Time Overlay */}
      {showCollaborate && <CollaborationOverlay onClose={() => setShowCollaborate(false)} />}

      {/* Atlas V5 Enterprise Connectors Ingestion Workspace */}
      {showConnectors && <ConnectorsDashboard onClose={() => setShowConnectors(false)} />}

      {/* Atlas V5 Living Architecture Continuous Reconciliation Workspace */}
      {showLivingArch && <LivingArchDashboard onClose={() => setShowLivingArch(false)} />}

      {/* Atlas V5 Engineering Workflow Automation Workspace */}
      {showWorkflows && <WorkflowsDashboard onClose={() => setShowWorkflows(false)} />}

      {/* Atlas V5 Deployment Intelligence Workspace */}
      {showDeploy && <DeployDashboard onClose={() => setShowDeploy(false)} />}

      {/* Atlas V5 Engineering Analytics Workspace */}
      {showAnalytics && <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />}

      {/* Atlas V5 AI Engineering Agent Autonomous Workspace */}
      {showAgent && <AgentDashboard onClose={() => setShowAgent(false)} />}

      {/* Atlas V5 Platform Ecosystem Extension Runtime Workspace */}
      {showEcosystem && <EcosystemDashboard onClose={() => setShowEcosystem(false)} />}

      {/* Atlas V5.9 Enterprise Foundation Workspace */}
      {showEnterprise && <EnterpriseDashboard onClose={() => setShowEnterprise(false)} />}

      {/* Atlas V6 Living Engineering Digital Twin Platform Workspace */}
      {showDigitalTwin && <DigitalTwinDashboard onClose={() => setShowDigitalTwin(false)} />}

      {/* Atlas Operationalization & Developer SDK Portal Workspace */}
      {showDevPortal && <DeveloperSDKPortal onClose={() => setShowDevPortal(false)} />}

      {/* Atlas Platform Governance & Mission Control Workspace */}
      {showMissionControl && <PlatformMissionControlDashboard onClose={() => setShowMissionControl(false)} />}
    </div>
  );
}