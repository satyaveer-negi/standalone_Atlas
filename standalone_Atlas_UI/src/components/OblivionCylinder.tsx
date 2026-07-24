import React, { useState, useRef, useEffect } from "react";

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

interface OblivionCylinderProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

function getOblivionHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash).toString(16).toUpperCase().slice(0, 4);
}

export function OblivionCylinder({ sprintName, tasksGroup }: OblivionCylinderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [focusedNodeId, setFocusedNodeId] = useState<number | null>(null);

    // Tracks the current active selected index per unique file column stack
    // Key format: "taskTitle:::filename" -> selected version array index
    const [cylinderOffsets, setCylinderOffsets] = useState<Record<string, number>>({});

    const flatFilesAll = Object.values(tasksGroup)
        .flatMap(filesMap => Object.values(filesMap))
        .flatMap(versions => [...versions].sort((a, b) => (b.version || 1) - (a.version || 1)));

    // Central interaction function to smoothly bring any card to the center-front position
    const handleRevolveToIndex = (taskTitle: string, filename: string, targetIndex: number, nodeId: number) => {
        const mapKey = `${taskTitle}:::${filename}`;
        setCylinderOffsets(prev => ({ ...prev, [mapKey]: targetIndex }));
        setFocusedNodeId(nodeId);

        setTimeout(() => {
            const el = containerRef.current?.querySelector(`[data-oblivion-id="${nodeId}"]`) as HTMLElement;
            el?.focus();
        }, 10);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const key = e.key.toLowerCase();

        // --- TAB SELECTION: Jumps across master file stacks ---
        if (e.key === "Tab") {
            const currentIdx = flatFilesAll.findIndex(f => f.id === focusedNodeId);
            let nextIdx = e.shiftKey ? currentIdx - 1 : currentIdx + 1;

            if (nextIdx >= flatFilesAll.length) nextIdx = 0;
            if (nextIdx < 0) nextIdx = flatFilesAll.length - 1;

            const nextFile = flatFilesAll[nextIdx];
            if (nextFile) {
                e.preventDefault();
                const nextEl = containerRef.current?.querySelector(`[data-oblivion-id="${nextFile.id}"]`) as HTMLElement;
                nextEl?.focus();
            }
        }

        // --- F KEY SELECTION: Cyclically rotates the localized drum upward ---
        if (key === "f" && focusedNodeId !== null) {
            e.preventDefault();

            let targetTask = "";
            let targetFilename = "";
            let siblingVersions: ManagedFile[] = [];

            for (const [taskTitle, filesMap] of Object.entries(tasksGroup)) {
                for (const [filename, versions] of Object.entries(filesMap)) {
                    if (versions.some(v => v.id === focusedNodeId)) {
                        targetTask = taskTitle;
                        targetFilename = filename;
                        siblingVersions = [...versions].sort((a, b) => (b.version || 1) - (a.version || 1));
                        break;
                    }
                }
            }

            if (siblingVersions.length > 1) {
                const mapKey = `${targetTask}:::${targetFilename}`;
                const currentOffset = cylinderOffsets[mapKey] || 0;
                const nextOffset = (currentOffset + 1) % siblingVersions.length;

                handleRevolveToIndex(targetTask, targetFilename, nextOffset, siblingVersions[nextOffset].id);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#06090c] border border-cyan-500/15 rounded-[32px] p-8 text-cyan-100 font-mono overflow-hidden relative shadow-[0_0_60px_rgba(6,182,212,0.06)] focus:outline-none select-none"
        >
            {/* OBLIVION HOLOGRAPHIC TRANSFORM COMPILER */}
            <style>{`
                @keyframes ambientConsoleDrift {
                    0% { transform: rotateY(-2.5deg) rotateX(0.5deg); }
                    50% { transform: rotateY(2.5deg) rotateX(-0.5deg); }
                    100% { transform: rotateY(-2.5deg) rotateX(0.5deg); }
                }
                .oblivion-vector-grid {
                    background: 
                        linear-gradient(to right, rgba(6, 182, 212, 0.015) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(6, 182, 212, 0.015) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .cylinder-pivot-mesh {
                    transform-style: preserve-3d;
                    animation: ambientConsoleDrift 20s ease-in-out infinite;
                }
                .glass-shell {
                    background: linear-gradient(135deg, rgba(10, 22, 30, 0.75) 0%, rgba(4, 7, 10, 0.92) 100%);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(6, 182, 212, 0.12);
                    box-shadow: 
                        inset 0 0 25px rgba(6, 182, 212, 0.02),
                        0 20px 40px rgba(0, 0, 0, 0.7);
                }
                .glass-shell:hover, .glass-shell:focus {
                    border-color: rgba(34, 211, 238, 0.5) !important;
                    background: linear-gradient(135deg, rgba(14, 32, 44, 0.85) 0%, rgba(6, 12, 18, 0.95) 100%) !important;
                    box-shadow: 
                        inset 0 0 30px rgba(6, 182, 212, 0.08),
                        0 0 35px rgba(6, 182, 212, 0.25) !important;
                }
            `}</style>

            <div className="absolute inset-0 oblivion-vector-grid pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_80%)] pointer-events-none z-10" />

            {/* Header Telemetry */}
            <div className="relative z-30 flex justify-between items-center border-b border-cyan-500/10 pb-5 mb-10">
                <div>
                    <span className="text-[9px] text-cyan-500/40 tracking-[0.35em] block mb-1 animate-pulse">
                        // SEC_DRONE_TELEMETRY // HUD_COORDINATES_TRUE_3D
                    </span>
                    <h4 className="text-xs font-light tracking-[0.2em] text-cyan-200 uppercase">
                        Holographic Drum: {sprintName}
                    </h4>
                </div>
                <div className="flex items-center gap-5 text-[9px] text-cyan-500/40 font-mono tracking-widest">
                    <div>[<kbd className="text-cyan-300 font-bold px-0.5">Tab</kbd>]: Switch File</div>
                    <div>[<kbd className="text-cyan-300 font-bold px-0.5">F / Click</kbd>]: Rotate Drum</div>
                    <div className="flex items-center gap-2 border-l border-cyan-500/20 pl-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-cyan-400 font-bold">LINK_STREAM_OK</span>
                    </div>
                </div>
            </div>

            {/* 3D VIEWPORT CANVAS */}
            <div
                className="relative w-full flex flex-col gap-14 items-center py-6 px-2 z-20"
                style={{ perspective: "1600px" }}
            >
                <div className="w-full flex flex-col gap-14 cylinder-pivot-mesh">
                    {Object.entries(tasksGroup).map(([taskTitle, filesMap]) => (
                        <div
                            key={taskTitle}
                            className="w-full bg-gradient-to-r from-transparent via-cyan-950/5 to-transparent border-y border-cyan-500/5 py-8 px-6 relative rounded-xl"
                        >
                            <div className="absolute top-3 left-3 text-[9px] text-cyan-500/20">┌ ┐</div>
                            <div className="absolute bottom-3 right-3 text-[9px] text-cyan-500/20">└ ┘</div>

                            <div className="flex items-center gap-3 mb-8 font-mono text-[10px] tracking-[0.25em] text-cyan-400/60 uppercase">
                                <span className="text-cyan-400 font-black">▩ CODE_[{getOblivionHash(taskTitle)}]</span>
                                <span className="text-cyan-500/20">|</span>
                                <span className="text-cyan-100 font-medium tracking-widest">{taskTitle}</span>
                            </div>

                            {/* Task Column Cards Array Container */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {Object.entries(filesMap).map(([filename, versions]) => {
                                    const sortedVersions = [...versions].sort((a, b) => (b.version || 1) - (a.version || 1));

                                    const mapKey = `${taskTitle}:::${filename}`;
                                    const currentCyclicPointer = cylinderOffsets[mapKey] || 0;

                                    return (
                                        <div key={filename} className="flex flex-col gap-2">
                                            <span className="text-[10px] text-cyan-500/40 tracking-widest font-mono mb-4 block uppercase">
                                                ▶ STRAND_MAP // {filename}
                                            </span>

                                            {/* HOLOGRAM CYLINDER ROOT BOUNDS */}
                                            <div
                                                className="relative min-h-[175px] w-full mt-2"
                                                style={{ transformStyle: "preserve-3d" }}
                                            >
                                                {sortedVersions.map((file, originalIndex) => {
                                                    const isRootOriginalLatest = originalIndex === 0;
                                                    const isFocused = focusedNodeId === file.id;

                                                    // --- OBLIVION CYLINDRICAL EQUATION CONPRIPLES ---
                                                    // Calculate the relative index offset based on the active chosen front item
                                                    const totalItems = sortedVersions.length;
                                                    const virtualIndex = (originalIndex - currentCyclicPointer + totalItems) % totalItems;
                                                    const isFrontFacing = virtualIndex === 0;

                                                    // Distribute the elements symmetrically along a circular perimeter belt
                                                    const arcSpanDeg = 110;
                                                    const angularStep = totalItems > 1 ? arcSpanDeg / (totalItems - 1) : 0;
                                                    const elementAngleDeg = - (arcSpanDeg / 2) + (virtualIndex * angularStep);
                                                    const angleRad = (elementAngleDeg * Math.PI) / 180;

                                                    // Trigonometric coordinate offsets
                                                    const radius = 260; // Depth radius anchor
                                                    const cylinderZ = Math.cos(angleRad) * radius - radius;
                                                    const cylinderX = Math.sin(angleRad) * (radius * 0.4);
                                                    const cylinderY = virtualIndex * 38; // Even vertical spacing drop down row

                                                    // Create smooth cinematic transitions
                                                    let transformStyle = `translateZ(${cylinderZ}px) translateX(${cylinderX}px) translateY(${cylinderY}px) rotateY(${-elementAngleDeg * 0.5}deg)`;
                                                    if (isFocused) {
                                                        transformStyle = `translateZ(${cylinderZ + 35}px) translateX(${cylinderX}px) translateY(${cylinderY - 4}px) rotateY(${-elementAngleDeg * 0.3}deg) scale(1.01)`;
                                                    }

                                                    // Fade distant back-facing components organically to give depth
                                                    const dynamicOpacity = isFrontFacing ? 1.0 : Math.max(0.18, 1 - (virtualIndex * 0.28));

                                                    return (
                                                        <div
                                                            key={file.id}
                                                            data-oblivion-id={file.id}
                                                            tabIndex={0}
                                                            onMouseEnter={() => setFocusedNodeId(file.id)}
                                                            onMouseLeave={() => setFocusedNodeId(null)}
                                                            onFocus={() => setFocusedNodeId(file.id)}
                                                            onBlur={() => setFocusedNodeId(null)}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // If it's already in front, download. If it's behind, rotate the cylinder to bring it front!
                                                                if (isFrontFacing) {
                                                                    if (file.file) window.open(file.file, "_blank");
                                                                } else {
                                                                    handleRevolveToIndex(taskTitle, filename, originalIndex, file.id);
                                                                }
                                                            }}
                                                            className={`glass-shell p-4 rounded-xl absolute inset-x-0 top-0 transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-between gap-4 pointer-events-auto`}
                                                            style={{
                                                                transform: transformStyle,
                                                                opacity: isFocused ? 1.0 : dynamicOpacity,
                                                                zIndex: isFrontFacing ? 40 : 10 - virtualIndex,
                                                                borderWidth: isFrontFacing ? '1px' : '1px',
                                                                borderColor: isFrontFacing ? 'rgba(34, 211, 238, 0.25)' : 'rgba(6, 182, 212, 0.05)',
                                                            }}
                                                        >
                                                            {/* HUD Metadata Node Readouts */}
                                                            <div className="flex items-center gap-4 truncate">
                                                                <span className={`text-[10px] font-black tracking-widest font-mono ${isFrontFacing ? 'text-cyan-400' : 'text-cyan-800'}`}>
                                                                    {isRootOriginalLatest ? `[RE_0${file.version}]` : `[LN_0${file.version}]`}
                                                                </span>
                                                                <p className={`font-sans font-light tracking-wide truncate text-[11px] ${isFrontFacing ? 'text-slate-100' : 'text-cyan-700/60'}`}>
                                                                    {file.filename || file.file.split("/").pop()}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3 shrink-0 font-mono">
                                                                {isRootOriginalLatest && (
                                                                    <span className={`text-[6.5px] border px-1.5 py-0.5 rounded font-bold tracking-widest ${isFrontFacing ? 'border-cyan-400/40 text-cyan-400 bg-cyan-950/20' : 'border-cyan-950 text-cyan-900'
                                                                        }`}>
                                                                        //ROOT
                                                                    </span>
                                                                )}
                                                                {isFrontFacing && !isRootOriginalLatest && (
                                                                    <span className="text-[6.5px] border border-cyan-400/40 text-cyan-300 px-1.5 py-0.5 rounded font-bold tracking-widest bg-cyan-950/40 animate-pulse">
                                                                        //MOUNTED
                                                                    </span>
                                                                )}
                                                                {file.file_size && (
                                                                    <span className={`text-[8px] font-mono ${isFrontFacing ? 'text-cyan-600/50' : 'text-cyan-950'}`}>
                                                                        {(file.file_size / 1024).toFixed(0)}kb
                                                                    </span>
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
                    ))}
                </div>
            </div>
        </div>
    );
}