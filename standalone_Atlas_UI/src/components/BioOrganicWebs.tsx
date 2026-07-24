import React, { useEffect, useState, useRef } from "react";

interface ManagedFile {
    id: number;
    file: string;
    filename: string;
    file_size?: number;
    version?: number;
    is_latest?: boolean;
    preview_type?: string;
    sprint_name?: string;
    task_title?: string;
    uploaded_by?: {
        username: string;
    };
}

interface BioOrganicWebsProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

interface WebConnection {
    id: string;
    pathData: string;
    type: "task-to-file" | "file-to-history";
    isJitter: boolean;
}

// Standalone type-safe hash index generator to replace proto extensions safely
function getHashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export function BioOrganicWebs({ sprintName, tasksGroup }: BioOrganicWebsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgLayerRef = useRef<SVGSVGElement>(null);
    const [connections, setConnections] = useState<WebConnection[]>([]);
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

    // Flatten all nodes for unified keyboard focus navigation
    const flatFilesAll = Object.entries(tasksGroup).flatMap(([taskTitle, filesMap]) => {
        const list: { id: number; isTask?: boolean; stringId: string }[] = [];
        const taskHash = getHashCode(taskTitle);
        list.push({ id: taskHash, isTask: true, stringId: taskTitle });

        Object.values(filesMap).forEach(versions => {
            const sorted = [...versions].sort((a, b) => (b.version || 1) - (a.version || 1));
            sorted.forEach(v => list.push({ id: v.id, stringId: String(v.id) }));
        });
        return list;
    });

    const calculateWebPaths = () => {
        if (!containerRef.current || !svgLayerRef.current) return;

        const newConnections: WebConnection[] = [];
        const svgRect = svgLayerRef.current.getBoundingClientRect();

        Object.entries(tasksGroup).forEach(([taskTitle, filesMap]) => {
            const taskHashId = getHashCode(taskTitle);
            const taskEl = containerRef.current?.querySelector(`[data-task-id="${taskHashId}"]`);
            if (!taskEl) return;

            const taskRect = taskEl.getBoundingClientRect();
            // Origin point: Center-Right edge of the Task Hub block
            const taskX = taskRect.right - svgRect.left;
            const taskY = taskRect.top - svgRect.top + taskRect.height / 2;

            Object.entries(filesMap).forEach(([filename, versions]) => {
                const sortedVersions = [...versions].sort((a, b) => (b.version || 1) - (a.version || 1));
                const latestNode = sortedVersions[0];
                if (!latestNode) return;

                const latestEl = containerRef.current?.querySelector(`[data-node-id="${latestNode.id}"]`);
                if (!latestEl) return;

                const latestRect = latestEl.getBoundingClientRect();
                // Target points for Master Node
                const fileLeftX = latestRect.left - svgRect.left;
                const fileRightX = latestRect.right - svgRect.left;
                const fileY = latestRect.top - svgRect.top + latestRect.height / 2;

                // 1. LINK TYPE A: Task Hub -> Latest Master File Node (Cyan Trunk Lines)
                const tfControlX1 = taskX + (fileLeftX - taskX) * 0.4;
                const tfControlX2 = taskX + (fileLeftX - taskX) * 0.6;
                const taskToFileLine = `M ${taskX} ${taskY} C ${tfControlX1} ${taskY}, ${tfControlX2} ${fileY}, ${fileLeftX} ${fileY}`;

                newConnections.push({
                    id: `edge-task-file-${taskHashId}-${latestNode.id}`,
                    pathData: taskToFileLine,
                    type: "task-to-file",
                    isJitter: activeNodeId === latestNode.id
                });

                // 2. LINK TYPE B: Latest Master File Node -> Historical Versions Stack (Teal Synapses)
                sortedVersions.slice(1).forEach((historyNode) => {
                    const historyEl = containerRef.current?.querySelector(`[data-node-id="${historyNode.id}"]`);
                    if (!historyEl) return;

                    const historyRect = historyEl.getBoundingClientRect();
                    const histLeftX = historyRect.left - svgRect.left;
                    const histY = historyRect.top - svgRect.top + historyRect.height / 2;

                    const deltaX = histLeftX - fileRightX;
                    const fhControlX = fileRightX + deltaX * 0.45;
                    const fhControlY = (fileY + histY) / 2 + (histY > fileY ? -15 : 15);

                    newConnections.push({
                        id: `edge-file-hist-${latestNode.id}-${historyNode.id}`,
                        pathData: `M ${fileRightX} ${fileY} Q ${fhControlX} ${fhControlY}, ${histLeftX} ${histY}`,
                        type: "file-to-history",
                        isJitter: activeNodeId === historyNode.id || activeNodeId === latestNode.id
                    });
                });
            });
        });

        setConnections(newConnections);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Tab") {
            const currentIdx = flatFilesAll.findIndex(f => f.id === activeNodeId);
            let nextIdx = e.shiftKey ? currentIdx - 1 : currentIdx + 1;

            if (nextIdx >= flatFilesAll.length) nextIdx = 0;
            if (nextIdx < 0) nextIdx = flatFilesAll.length - 1;

            const nextTarget = flatFilesAll[nextIdx];
            if (nextTarget) {
                e.preventDefault();
                const selector = nextTarget.isTask ? `[data-task-id="${nextTarget.id}"]` : `[data-node-id="${nextTarget.id}"]`;
                const nextEl = containerRef.current?.querySelector(selector) as HTMLElement;
                nextEl?.focus();
            }
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;

        let frameId: number;
        const runLoop = () => {
            calculateWebPaths();
            frameId = requestAnimationFrame(runLoop);
        };
        frameId = requestAnimationFrame(runLoop);

        const observer = new ResizeObserver(() => calculateWebPaths());
        observer.observe(containerRef.current);
        window.addEventListener("resize", calculateWebPaths);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener("resize", calculateWebPaths);
        };
    }, [tasksGroup, activeNodeId]);

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-950/20 border border-emerald-500/10 rounded-[32px] p-8 text-emerald-400 font-mono relative overflow-hidden shadow-[0_0_50px_rgba(4,120,87,0.1)] focus:outline-none select-none min-h-[650px]"
        >
            {/* COMPONENT CSS KEYFRAMES */}
            <style>{`
                @keyframes matrixRain {
                    0% { transform: translateY(-30%); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(80%); opacity: 0; }
                }
                @keyframes webPulse { to { stroke-dashoffset: -20; } }
                @keyframes structuralJitter {
                    0%, 100% { transform: translate(0, 0); opacity: 0.7; }
                    50% { transform: translate(-0.5px, 0.5px); opacity: 1; }
                }
                .matrix-stream {
                    animation: matrixRain 12s linear infinite;
                    text-shadow: 0 0 8px rgba(52, 211, 153, 0.6), 0 0 15px rgba(16, 185, 129, 0.3);
                    background: linear-gradient(to bottom, transparent 0%, #10b981 70%, transparent 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .link-trunk {
                    stroke-dasharray: 4 8;
                    animation: webPulse 1.8s linear infinite;
                    filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.6));
                }
                .link-history {
                    stroke-dasharray: 6 3;
                    animation: webPulse 1.2s linear infinite;
                    filter: drop-shadow(0 0 4px #047857);
                }
                .link-jitter {
                    animation: structuralJitter 0.1s ease-in-out infinite;
                    filter: drop-shadow(0 0 8px #ef4444);
                }
                .crt-scanlines {
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
                    background-size: 100% 4px;
                }
            `}</style>

            {/* Matrix Scanlines CRT Screen Layer */}
            <div className="absolute inset-0 crt-scanlines pointer-events-none z-40 opacity-30" />

            {/* Falling Digital Code Waterfall Background Panel */}
            <div className="absolute inset-0 opacity-25 pointer-events-none flex justify-between px-2 overflow-hidden text-[11px] select-none font-bold mix-blend-screen z-0">
                {[...Array(20)].map((_, i) => {
                    const variations = [
                        "0110101001\n1001101011\n0011010101\n1110010110",
                        "A9F2C10D4B\n8E7301AF6C\n5D2B84E910\n0F1A2B3C4D",
                        "SYS_INIT_O\nLOAD_MOD_3\nCONN_PORT_\nBUFF_OVER_"
                    ];
                    const sequence = variations[i % variations.length];
                    return (
                        <div
                            key={i}
                            className="matrix-stream flex flex-col whitespace-pre tracking-widest text-center"
                            style={{
                                animationDelay: `${i * -0.4}s`,
                                animationDuration: `${8 + (i % 5)}s`,
                            }}
                        >
                            {sequence.repeat(5)}
                        </div>
                    );
                })}
            </div>

            {/* Header Readout Spine */}
            <div className="relative z-30 flex justify-between items-center border-b border-emerald-500/20 pb-4 mb-8">
                <div>
                    <span className="text-[10px] text-emerald-500/40 tracking-widest block mb-1 animate-pulse">
                        // END-TO-END_NEURAL_ROUTING // CORE_SYNAPSE_ARRAY
                    </span>
                    <h4 className="text-sm font-black tracking-widest text-emerald-200 uppercase">
                        NEURAL NODE MATRIX: {sprintName}
                    </h4>
                </div>
                <div className="flex items-center gap-4 font-sans text-[10px] text-emerald-500/50 font-semibold tracking-wider">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-cyan-400 inline-block" /> TRUNK</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-emerald-400 inline-block" /> HISTORY</span>
                </div>
            </div>

            {/* Main Multi-Column Frame Wrapper */}
            <div className="relative w-full overflow-y-auto max-h-[750px] pr-2">

                {/* FIXED SYSTEM OVERLAY SVG LAYER */}
                <svg
                    ref={svgLayerRef}
                    className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-visible mix-blend-screen"
                >
                    {connections.map((conn) => (
                        <g key={conn.id}>
                            <path d={conn.pathData} fill="none" stroke="#011409" strokeWidth={4} />
                            <path
                                d={conn.pathData}
                                fill="none"
                                stroke={
                                    conn.isJitter
                                        ? "#ef4444"
                                        : conn.type === "task-to-file"
                                            ? "#06b6d4"
                                            : "#047857"
                                }
                                strokeWidth={conn.isJitter ? 2.5 : conn.type === "task-to-file" ? 1.8 : 1.2}
                                className={
                                    conn.isJitter
                                        ? "link-jitter"
                                        : conn.type === "task-to-file"
                                            ? "link-trunk"
                                            : "link-history"
                                }
                            />
                        </g>
                    ))}
                </svg>

                {/* Hierarchical Structure Grid Columns Layout */}
                <div className="relative z-20 flex flex-col gap-14 pb-8">
                    {Object.entries(tasksGroup).map(([taskTitle, filesMap]) => {
                        const taskHashId = getHashCode(taskTitle);

                        return (
                            <div key={taskTitle} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative border-b border-slate-900/60 pb-10 last:border-0 last:pb-0">

                                {/* COLUMN 1 (lg:span-3): Parent Task Hub */}
                                <div className="lg:col-span-3 sticky top-2">
                                    <span className="text-[9px] text-emerald-500/40 tracking-wider font-bold mb-1 uppercase block">
                                        📁 [01] TASK_ROOT_GATEWAY
                                    </span>
                                    <div
                                        data-task-id={taskHashId}
                                        tabIndex={0}
                                        onFocus={() => setActiveNodeId(taskHashId)}
                                        onBlur={() => setActiveNodeId(null)}
                                        className="p-4 rounded-xl border border-emerald-500/10 bg-slate-900/90 text-left backdrop-blur-sm shadow-inner transition-all duration-300 group focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                    >
                                        <div className="text-[8px] text-slate-500 mb-1 font-mono tracking-tight">// ADDR_0x{taskHashId.toString(16).toUpperCase().slice(0, 4)}</div>
                                        <h5 className="text-xs font-black text-emerald-400 tracking-wider uppercase truncate group-hover:text-cyan-300">
                                            {taskTitle}
                                        </h5>
                                        <div className="text-[9px] text-slate-600 mt-2 font-sans">
                                            Payload Count: {Object.keys(filesMap).length} Units
                                        </div>
                                    </div>
                                </div>

                                {/* FILE AND VERSION STRUCTURE ENGULFED CONTAINERS (lg:span-9) */}
                                <div className="lg:col-span-9 flex flex-col gap-8">
                                    {Object.entries(filesMap).map(([filename, versions]) => {
                                        const sortedVersions = [...versions].sort((a, b) => (b.version || 1) - (a.version || 1));
                                        const latestVersionFile = sortedVersions[0];
                                        const historicalVersions = sortedVersions.slice(1);

                                        return (
                                            <div key={filename} className="grid grid-cols-1 md:grid-cols-10 gap-6 items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">

                                                {/* COLUMN 2 (md:span-4): Central Master Nodes Array */}
                                                <div className="md:col-span-4 flex flex-col gap-1">
                                                    <span className="text-[9px] text-emerald-500/30 tracking-wider font-bold mb-1 uppercase block">
                                                        ▶ [02] SYSTEM_TRUNK_NODE
                                                    </span>
                                                    {latestVersionFile && (
                                                        <div
                                                            data-node-id={latestVersionFile.id}
                                                            tabIndex={0}
                                                            onMouseEnter={() => setActiveNodeId(latestVersionFile.id)}
                                                            onMouseLeave={() => setActiveNodeId(null)}
                                                            onFocus={() => setActiveNodeId(latestVersionFile.id)}
                                                            onBlur={() => setActiveNodeId(null)}
                                                            onClick={() => latestVersionFile.file && window.open(latestVersionFile.file, "_blank")}
                                                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left focus:outline-none ${activeNodeId === latestVersionFile.id
                                                                    ? "bg-slate-900 border-emerald-400 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                                                                    : "bg-slate-950/80 border-emerald-500/20 text-emerald-300"
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-[10px] font-black tracking-widest text-emerald-400">
                                                                    [REV_0{latestVersionFile.version || 1}]
                                                                </span>
                                                                <span className="text-[7px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black tracking-wide">
                                                                    LATEST
                                                                </span>
                                                            </div>
                                                            <p className="font-sans text-[11px] font-semibold text-slate-200 truncate">
                                                                {latestVersionFile.filename || filename}
                                                            </p>
                                                            <div className="flex justify-between items-center text-[8px] text-emerald-600/60 mt-3 pt-2 border-t border-emerald-500/10 font-sans">
                                                                <span>AUTH // {latestVersionFile.uploaded_by?.username?.toUpperCase() || "CORE"}</span>
                                                                {latestVersionFile.file_size && <span>{(latestVersionFile.file_size / 1024).toFixed(0)}kb</span>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Line Alignment Void Space Lane Grid Splitter */}
                                                <div className="hidden md:col-span-1" />

                                                {/* COLUMN 3 (md:span-5): Historical Archive Node Recessions */}
                                                <div className="md:col-span-5 flex flex-col gap-2">
                                                    <span className="text-[9px] text-slate-500 tracking-wider font-bold uppercase mb-1 block">
                                                        ⇩ [03] ARCHIVE_MATRIX_HISTORY
                                                    </span>

                                                    {historicalVersions.length > 0 ? (
                                                        <div className="flex flex-col gap-2 max-h-[145px] overflow-y-auto pr-1 custom-scrollbar">
                                                            {historicalVersions.map((file) => {
                                                                const isActiveFocus = activeNodeId === file.id;
                                                                return (
                                                                    <div
                                                                        key={file.id}
                                                                        data-node-id={file.id}
                                                                        tabIndex={0}
                                                                        onMouseEnter={() => setActiveNodeId(file.id)}
                                                                        onMouseLeave={() => setActiveNodeId(null)}
                                                                        onFocus={() => setActiveNodeId(file.id)}
                                                                        onBlur={() => setActiveNodeId(null)}
                                                                        onClick={() => file.file && window.open(file.file, "_blank")}
                                                                        className={`p-2 rounded-xl border text-[10px] transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 focus:outline-none ${isActiveFocus
                                                                                ? "bg-red-950/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                                                                                : "bg-slate-950/70 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-400"
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-2.5 truncate">
                                                                            <span className={`font-black tracking-widest ${isActiveFocus ? 'text-red-400' : 'text-slate-600'}`}>
                                                                                [R_0{file.version}]
                                                                            </span>
                                                                            <p className="font-sans truncate opacity-80 text-slate-400">
                                                                                {file.filename || file.file.split("/").pop()}
                                                                            </p>
                                                                        </div>
                                                                        <span className="text-[7px] uppercase px-1.5 py-0.5 rounded bg-black/40 border border-slate-900 shrink-0 font-bold tracking-tight text-slate-600">
                                                                            LOG
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-[9px] text-slate-600 border border-dashed border-slate-900 p-4 rounded-xl text-center font-bold tracking-tight">
                                                            // NO TIMELINE RECORDS CACHED
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
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