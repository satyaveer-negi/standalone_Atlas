import { useMemo, useState } from "react";

interface ManagedFile {
    id: number;
    file: string;
    filename: string;
    version?: number;
}

interface PlexiglassHUDProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

export const PlexiglassHUD = ({ sprintName, tasksGroup }: PlexiglassHUDProps) => {
    const [hoveredTask, setHoveredTask] = useState<string | null>(null);
    const [hoveredFile, setHoveredFile] = useState<string | null>(null);

    const [activePopover, setActivePopover] = useState<{
        name: string;
        url: string;
        x: number;
        y: number;
    } | null>(null);

    // Compile structural layout array map
    const dataset = useMemo(() => {
        const taskKeys = Object.keys(tasksGroup);
        let fileLaneCounter = 0;

        const blocks = taskKeys.map((task) => {
            const fileEntries = Object.entries(tasksGroup[task]);

            const fileItems = fileEntries.map(([filename, versions]) => {
                const fileY = 70 + fileLaneCounter * 95;
                fileLaneCounter++;
                const sortedV = [...versions].sort((a, b) => (b.version || 0) - (a.version || 0));

                return {
                    filename,
                    y: fileY,
                    versions: sortedV,
                    parentTaskName: task
                };
            });

            let calculatedTaskY = 60;
            if (fileItems.length > 0) {
                calculatedTaskY = (fileItems[0].y + fileItems[fileItems.length - 1].y) / 2;
            }

            return { taskName: task, taskY: calculatedTaskY, files: fileItems };
        });

        return { blocks, height: Math.max(fileLaneCounter * 95 + 100, 360) };
    }, [tasksGroup]);

    return (
        <div className="w-full p-4 overflow-visible bg-transparent relative flex justify-center">
            <style>{`
        @keyframes hudScan {
          to { stroke-dashoffset: -20; }
        }
        @keyframes gridFlow {
          from { background-position: 0 0; }
          to { background-position: 32px 32px; }
        }
        .hud-scan-pulse {
          animation: hudScan 1.2s linear infinite;
        }
        .cyber-grid-bg {
          background-image: 
            linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
          animation: gridFlow 16s linear infinite;
        }
      `}</style>

            {/* Main Base Station HUD Panel Frame Container (Deep Contrast Obsidian Glass) */}
            <div
                style={{ height: `${dataset.height + 40}px` }}
                className="w-full max-w-[940px] relative bg-gradient-to-b from-slate-950/85 via-slate-900/75 to-slate-950/90 border border-slate-700/40 rounded-[40px] p-6 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl overflow-hidden"
            >
                {/* Vivid Holographic Grid Backing */}
                <div className="absolute inset-0 cyber-grid-bg pointer-events-none opacity-80" />

                {/* Laser Cyan Target Brackets */}
                <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none opacity-70" />
                <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none opacity-70" />
                <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none opacity-70" />
                <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none opacity-70" />

                <div className="absolute top-3.5 left-10 font-mono text-[9px] text-cyan-400 font-bold tracking-[0.25em] uppercase pointer-events-none select-none opacity-80">
                    TACTICAL DATASTREAM FLOW MATRIX // GLASS_HUD_STAGE
                </div>

                <svg width="100%" height={dataset.height} className="overflow-visible relative bg-transparent z-10">
                    <defs>
                        {/* High-Contrast Crisp Glass Shading Gradients */}
                        <linearGradient id="glassBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.18)" />
                            <stop offset="12%" stopColor="rgba(15, 23, 42, 0.75)" />
                            <stop offset="90%" stopColor="rgba(7, 10, 19, 0.95)" />
                            <stop offset="100%" stopColor="rgba(2, 4, 8, 1)" />
                        </linearGradient>

                        <linearGradient id="glassLatestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(52, 211, 153, 0.4)" />
                            <stop offset="15%" stopColor="rgba(16, 185, 129, 0.25)" />
                            <stop offset="90%" stopColor="rgba(4, 120, 87, 0.85)" />
                            <stop offset="100%" stopColor="rgba(6, 78, 59, 1)" />
                        </linearGradient>

                        {/* Fused 3D Thickness Side Fillers */}
                        <linearGradient id="thicknessProfileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(51, 65, 85, 1)" />
                            <stop offset="100%" stopColor="#020617" />
                        </linearGradient>
                        <linearGradient id="thicknessLatestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(16, 185, 129, 1)" />
                            <stop offset="100%" stopColor="#022c22" />
                        </linearGradient>

                        <linearGradient id="hudSprintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
                        </linearGradient>

                        {/* High-Fidelity Shadow and Intense Outer Glow Filters */}
                        <filter id="submergedEmbedding" x="-10%" y="-10%" width="120%" height="120%">
                            <feOffset dx="0" dy="1.5" />
                            <feGaussianBlur stdDeviation="1" result="offset-blur" />
                            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                            <feFlood floodColor="#000000" floodOpacity="0.95" result="color" />
                            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                        </filter>

                        <filter id="slabOuterShadow" x="-20%" y="-20%" width="140%" height="150%">
                            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
                        </filter>
                        <filter id="hudNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#00f0ff" floodOpacity="0.75" />
                        </filter>
                        <filter id="hudPurpleGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#c084fc" floodOpacity="0.75" />
                        </filter>
                    </defs>

                    {/* LAYER 1: DATA PIPELINE CABLES WITH HIGH-VIBRANCY TRACERS */}
                    {dataset.blocks.map((b) => {
                        const isTaskActive = hoveredTask === b.taskName;

                        return b.files.map((f, fIdx) => {
                            const isFileActive = hoveredFile === f.filename;
                            const pathHighlight = isTaskActive || isFileActive;

                            const path = `M 140 ${dataset.height / 2} C 230 ${dataset.height / 2}, 220 ${b.taskY}, 290 ${b.taskY} M 290 ${b.taskY} C 390 ${b.taskY}, 360 ${f.y}, 430 ${f.y}`;

                            return (
                                <g key={`link-${f.filename}-${fIdx}`}>
                                    <path
                                        d={path}
                                        fill="none"
                                        stroke={pathHighlight ? "#00f0ff" : "#1e293b"}
                                        strokeWidth={pathHighlight ? 2.5 : 1.5}
                                        className={`transition-all duration-300 ${pathHighlight ? "opacity-100" : "opacity-40"}`}
                                    />
                                    {pathHighlight && (
                                        <path
                                            d={path}
                                            fill="none"
                                            stroke={isTaskActive ? "#c084fc" : "#00f0ff"}
                                            strokeWidth={2}
                                            strokeDasharray="8 4"
                                            filter={isTaskActive ? "url(#hudPurpleGlow)" : "url(#hudNeonGlow)"}
                                            className="hud-scan-pulse"
                                        />
                                    )}
                                </g>
                            );
                        });
                    })}

                    {/* LAYER 2: MASTER HUB TERMINAL NODE */}
                    <g transform={`translate(15, ${dataset.height / 2 - 25})`} filter="url(#slabOuterShadow)">
                        <rect width={130} height={50} rx={14} fill="url(#hudSprintGrad)" stroke="#6366f1" strokeWidth={1.5} />
                        <path d="M 5 1 L 125 1" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={1} />
                        <text x={65} y={18} textAnchor="middle" className="fill-cyan-300 font-mono text-[9px] font-black tracking-widest">[CORE_HUB]</text>
                        <text x={65} y={35} textAnchor="middle" className="fill-white font-mono text-sm font-bold tracking-wide">
                            {sprintName.toUpperCase()}
                        </text>
                    </g>

                    {/* LAYER 3: VIVID TASK SWITCH CONSOLES */}
                    {dataset.blocks.map((b, idx) => {
                        const isTaskLit = hoveredTask === b.taskName || b.files.some(f => f.filename === hoveredFile);

                        return (
                            <g
                                key={`task-${b.taskName}-${idx}`}
                                transform={`translate(290, ${b.taskY})`}
                                onMouseEnter={() => setHoveredTask(b.taskName)}
                                onMouseLeave={() => setHoveredTask(null)}
                                className="cursor-pointer group"
                                filter={isTaskLit ? "url(#hudPurpleGlow)" : "url(#slabOuterShadow)"}
                            >
                                <circle
                                    r={22}
                                    fill="#02040a"
                                    stroke={isTaskLit ? "#c084fc" : "#334155"}
                                    strokeWidth={2.5}
                                    className="transition-all duration-200"
                                />
                                <circle r={17} fill="none" stroke="rgba(192, 132, 252, 0.25)" strokeWidth={1} strokeDasharray="4 3" />
                                <text textAnchor="middle" y={3} className={`font-mono text-[10px] font-black transition-colors ${isTaskLit ? "fill-purple-300 font-bold" : "fill-slate-400"}`}>
                                    {b.taskName.toUpperCase()}
                                </text>
                            </g>
                        );
                    })}

                    {/* LAYER 4: GLASS SLAB CHASSIS ASSEMBLY LINE */}
                    {dataset.blocks.flatMap(b => b.files).map((f, idx) => {
                        const isFileLit = hoveredFile === f.filename || hoveredTask === f.parentTaskName;
                        const slabWidth = 145;
                        const slabHeight = 36;
                        const thickness = 5;

                        return (
                            <g
                                key={`file-slab-${f.filename}-${idx}`}
                                transform={`translate(425, ${f.y - 18})`}
                                onMouseEnter={() => {
                                    setHoveredFile(f.filename);
                                    setHoveredTask(f.parentTaskName);
                                }}
                                onMouseLeave={() => {
                                    setHoveredFile(null);
                                    setHoveredTask(null);
                                }}
                                filter={isFileLit ? "url(#hudNeonGlow)" : "url(#slabOuterShadow)"}
                            >
                                {/* 3D Lower Bevel Base */}
                                <rect
                                    x={0}
                                    y={thickness}
                                    width={slabWidth}
                                    height={slabHeight}
                                    rx={9}
                                    fill="url(#thicknessProfileGrad)"
                                    stroke={isFileLit ? "rgba(0, 240, 255, 0.5)" : "rgba(30, 41, 59, 0.8)"}
                                    strokeWidth={1}
                                />

                                {/* Main Front Facet Glass Block */}
                                <rect
                                    x={0}
                                    y={0}
                                    width={slabWidth}
                                    height={slabHeight}
                                    rx={9}
                                    fill="url(#glassBodyGrad)"
                                    stroke={isFileLit ? "#00f0ff" : "rgba(148, 163, 184, 0.35)"}
                                    strokeWidth={1.5}
                                    className="transition-all duration-200"
                                />

                                {/* Intense Glare Specular Polish Edge */}
                                <path
                                    d={`M 6 1 L ${slabWidth - 6} 1`}
                                    stroke={isFileLit ? "#ccfbf1" : "rgba(255, 255, 255, 0.4)"}
                                    strokeWidth={1.2}
                                    strokeLinecap="round"
                                />

                                {/* Luminous Submerged Text Label */}
                                <g filter="url(#submergedEmbedding)">
                                    <text
                                        x={14}
                                        y={21}
                                        className={`font-mono text-[10px] font-bold tracking-wide transition-colors ${isFileLit ? "fill-cyan-200" : "fill-slate-100"}`}
                                    >
                                        📂 {f.filename.length > 13 ? f.filename.substring(0, 11) + ".." : f.filename}
                                    </text>
                                </g>

                                {/* --- REVISION VIVID GLASS SWITCH BUTTONS --- */}
                                {f.versions.map((v, vIdx) => {
                                    const isLatest = vIdx === 0;
                                    const btnW = 38;
                                    const btnH = 32;
                                    const btnThickness = 4;
                                    const btnX = 162 + vIdx * 46;

                                    return (
                                        <g
                                            key={`v-slab-${v.id || vIdx}`}
                                            transform={`translate(${btnX}, 0)`}
                                            onClick={() => {
                                                if (v.file) {
                                                    setActivePopover({
                                                        name: `v${v.version}`,
                                                        url: v.file,
                                                        x: 425 + btnX + (btnW / 2),
                                                        y: f.y
                                                    });
                                                }
                                            }}
                                            className="cursor-pointer group/ver active:translate-y-[1px] transition-transform"
                                        >
                                            {/* Key Bevel Depth Footprint */}
                                            <rect
                                                x={0}
                                                y={btnThickness}
                                                width={btnW}
                                                height={btnH}
                                                rx={6}
                                                fill={isLatest ? "url(#thicknessLatestGrad)" : "url(#thicknessProfileGrad)"}
                                                stroke={isLatest ? "rgba(16, 185, 129, 0.4)" : "rgba(30, 41, 59, 0.6)"}
                                                strokeWidth={1}
                                            />

                                            {/* Key Front Active Cap */}
                                            <rect
                                                x={0}
                                                y={0}
                                                width={btnW}
                                                height={btnH}
                                                rx={6}
                                                fill={isLatest ? "url(#glassLatestGrad)" : "url(#glassBodyGrad)"}
                                                stroke={isLatest ? "#10b981" : "rgba(148, 163, 184, 0.4)"}
                                                strokeWidth={1.5}
                                                className="group-hover/ver:stroke-cyan-400 transition-all"
                                            />
                                            <path d={`M 4 1 L ${btnW - 4} 1`} stroke="rgba(255, 255, 255, 0.35)" strokeWidth={0.8} />

                                            {/* High-Contrast Crisp Label Text */}
                                            <g filter="url(#submergedEmbedding)">
                                                <text
                                                    x={19}
                                                    y={19}
                                                    textAnchor="middle"
                                                    className={`font-mono text-[10px] font-black ${isLatest ? "fill-emerald-200" : "fill-slate-100"} group-hover/ver:fill-white transition-colors`}
                                                >
                                                    v{v.version}
                                                </text>
                                            </g>
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}
                </svg>

                {/* LAYER 5: FLOATING ACTION DOCK MENU OVERLAY */}
                {activePopover && (
                    <div
                        style={{ left: `${activePopover.x}px`, top: `${activePopover.y + 24}px` }}
                        className="absolute z-[200] -translate-x-1/2 p-2 bg-slate-950 border border-slate-700 rounded-xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center gap-2 font-mono text-[10px] animate-scaleUp"
                    >
                        <a
                            href={activePopover.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setActivePopover(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold border-t border-slate-600 transition-all active:scale-95 shadow-md"
                        >
                            👁️ VIEW
                        </a>
                        <a
                            href={activePopover.url}
                            download
                            onClick={() => setActivePopover(null)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-b from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold border-t border-cyan-300 transition-all active:scale-95 shadow-md shadow-cyan-950/60"
                        >
                            💾 GET
                        </a>
                        <button
                            onClick={() => setActivePopover(null)}
                            className="p-1 text-slate-400 hover:text-white font-bold text-xs ml-0.5 active:scale-90 transition-transform cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};