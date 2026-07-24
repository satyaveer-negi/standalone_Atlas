import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../../../features/projects/api/projects";
import { getWorkspaces } from "../../../../features/workspaces/api/workspaces";
import { useAtlasStore } from "../../store/atlasStore";

function SpatialRadarMinimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomLevel = useAtlasStore((state) => state.zoomLevel);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 55;

      // Radar Outer Rings
      ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Sweeping Radar Scanner
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, "rgba(0, 240, 255, 0.4)");
      gradient.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Core Target Dot
      ctx.fillStyle = "#00f0ff";
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Target Dots (Simulated Sector Portals)
      const portalDots = [
        { r: 35, a: angle * 0.8 },
        { r: 48, a: angle * 0.5 + 2 },
        { r: 25, a: -angle * 0.6 },
      ];
      portalDots.forEach((pt) => {
        const px = cx + Math.cos(pt.a) * pt.r;
        const py = cy + Math.sin(pt.a) * pt.r;
        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      angle += 0.03;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex flex-col items-center gap-1.5">
      <div className="flex items-center justify-between w-full text-[10px] font-mono">
        <span className="text-cyan-400 font-bold">RADAR MINIMAP</span>
        <span className="text-slate-400 font-bold">L{zoomLevel} SECTOR</span>
      </div>
      <canvas ref={canvasRef} width={110} height={110} className="rounded-full bg-slate-950/80 shadow-inner" />
    </div>
  );
}

export default function LeftPanel() {
  const [search, setSearch] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const setSelectedNode = useAtlasStore((state) => state.setSelectedNode);
  const selectedNodeId = useAtlasStore((state) => state.selectedNodeId);

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  const filteredProjects = projects.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <div className="pointer-events-auto p-2">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-xl bg-slate-950/85 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-lg hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-1"
        >
          <span>📡 Navigator</span>
          <span>&rarr;</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 h-full pointer-events-auto p-3 flex flex-col gap-3 font-mono">
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-xl p-3.5 shadow-2xl flex-1 flex flex-col overflow-hidden gap-2.5">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
          <span className="text-xs font-black text-cyan-300 tracking-wider flex items-center gap-1.5">
            <span>📡</span> NAVIGATOR
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold">
              {projects.length} PROJS
            </span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-[10px] text-slate-400 hover:text-cyan-300 font-bold px-1.5 cursor-pointer"
            >
              &larr;
            </button>
          </div>
        </div>

        {/* 2D Circular Spatial Radar Minimap */}
        <SpatialRadarMinimap />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Filter spatial nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-200 px-2.5 py-1 text-xs font-mono placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400"
        />

        {/* Tree List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
          {workspaces.map((ws: any) => {
            const wsProjects = filteredProjects.filter((p: any) => {
              const wsId = typeof p.workspace === "object" && p.workspace !== null ? p.workspace.id : p.workspace;
              return String(wsId) === String(ws.id);
            });

            return (
              <div key={ws.id} className="space-y-1">
                <div className="text-[9px] font-bold text-cyan-500/80 uppercase tracking-widest flex items-center justify-between">
                  <span>🏢 {ws.name}</span>
                  <span>({wsProjects.length})</span>
                </div>

                <div className="space-y-1 pl-1.5 border-l border-cyan-500/20">
                  {wsProjects.map((proj: any) => {
                    const isSelected = selectedNodeId === proj.name || selectedNodeId === String(proj.id);
                    return (
                      <button
                        key={proj.id}
                        onClick={() => setSelectedNode(proj.name)}
                        className={`w-full text-left rounded-lg px-2 py-1 text-[11px] font-mono transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 font-bold"
                            : "bg-slate-900/40 border border-slate-800/80 text-slate-300 hover:border-cyan-500/30 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{proj.name}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold shrink-0">
                          {proj.key || "PROJ"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
