import React, { useState, useRef } from "react";

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

interface MatrixWaterfallProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

export function MatrixWaterfall({ sprintName, tasksGroup }: MatrixWaterfallProps) {
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track a shifting positional rotation index for every individual file group column
    // Format key: "taskTitle:::filename" -> current selected local index offset
    const [stackOffsets, setStackOffsets] = useState<Record<string, number>>({});

    // Flatten only the top structural focal layers for global Tab navigation
    const flatLatestFiles = Object.values(tasksGroup)
        .flatMap(filesMap => Object.values(filesMap))
        .map(versions => [...versions].sort((a, b) => (b.version || 1) - (a.version || 1))[0])
        .filter(Boolean);

    // Execute safe file asset distribution down to the system client channel
    const handleNodeDownload = (fileUrl: string) => {
        if (!fileUrl) return;
        window.open(fileUrl, "_blank");
    };

    // Central Keyboard Event Interceptor Engine
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const key = e.key.toLowerCase();

        // --- TAB NAVIGATION: Jumps horizontally/vertically between file nodes ---
        if (e.key === "Tab") {
            const currentLatestIdx = flatLatestFiles.findIndex(f => {
                if (f.id === activeNodeId) return true;
                const parentGroup = Object.values(tasksGroup)
                    .flatMap(m => Object.values(m))
                    .find(versions => versions.some(v => v.id === activeNodeId));
                return parentGroup ? parentGroup.some(v => v.id === f.id) : false;
            });

            let nextIdx = e.shiftKey ? currentLatestIdx - 1 : currentLatestIdx + 1;

            if (nextIdx >= flatLatestFiles.length) nextIdx = 0;
            if (nextIdx < 0) nextIdx = flatLatestFiles.length - 1;

            const nextFile = flatLatestFiles[nextIdx];
            if (nextFile) {
                e.preventDefault();
                const nextEl = containerRef.current?.querySelector(`[data-node-id="${nextFile.id}"]`) as HTMLElement;
                nextEl?.focus();
            }
        }

        // --- F KEY NAVIGATION: Cyclically pushes versions to the absolute front-top slot ---
        if (key === "f" && activeNodeId !== null) {
            e.preventDefault();

            // Locate the unique container target identities
            let foundTaskTitle = "";
            let foundFilename = "";
            let targetStack: ManagedFile[] = [];

            for (const [taskTitle, filesMap] of Object.entries(tasksGroup)) {
                for (const [filename, versions] of Object.entries(filesMap)) {
                    if (versions.some(v => v.id === activeNodeId)) {
                        foundTaskTitle = taskTitle;
                        foundFilename = filename;
                        targetStack = [...versions].sort((a, b) => (b.version || 1) - (a.version || 1));
                        break;
                    }
                }
            }

            if (targetStack.length > 1) {
                const stackKey = `${foundTaskTitle}:::${foundFilename}`;
                const currentOffset = stackOffsets[stackKey] || 0;

                // Shift indices forward by 1, wrapping cyclically around total historical count
                const nextOffset = (currentOffset + 1) % targetStack.length;

                setStackOffsets(prev => ({ ...prev, [stackKey]: nextOffset }));

                // Track and programmatically adjust HTML focus target arrays to match shifts
                const identityNode = targetStack[nextOffset];
                if (identityNode) {
                    setTimeout(() => {
                        const nextEl = containerRef.current?.querySelector(`[data-node-id="${identityNode.id}"]`) as HTMLElement;
                        nextEl?.focus();
                    }, 10);
                }
            }
        }

        // --- ESCAPE KEY: Direct reset back to zero state baseline ---
        if (e.key === "Escape") {
            e.preventDefault();
            setStackOffsets({});
            if (flatLatestFiles[0]) {
                const topEl = containerRef.current?.querySelector(`[data-node-id="${flatLatestFiles[0].id}"]`) as HTMLElement;
                topEl?.focus();
            }
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-950 border border-emerald-500/30 rounded-[32px] p-8 text-emerald-400 font-mono overflow-hidden relative shadow-[0_0_50px_rgba(4,120,87,0.15)] focus:outline-none select-none"
        >
            {/* SCI-FI VISUAL EFFECTS ANCHORS */}
            <style>{`
                @keyframes matrixRain {
                    0% { transform: translateY(-40%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes crtFlicker {
                    0% { opacity: 0.965; }
                    50% { opacity: 1; }
                    100% { opacity: 0.975; }
                }
                @keyframes glitchText {
                    0%, 100% { transform: translate(0); text-shadow: none; }
                    20% { transform: translate(-1px, 1px); text-shadow: -1px 0 #10b981, 1px 0 #047857; }
                    40% { transform: translate(1px, -1px); text-shadow: 1px 0 #34d399, -1px 0 #064e3b; }
                    60% { transform: translate(-0.5px, -0.5px); }
                    80% { transform: translate(0.5px, 0.5px); }
                }
                .matrix-stream-container {
                    mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
                }
                .matrix-stream {
                    animation: matrixRain 15s linear infinite;
                    text-shadow: 0 0 10px rgba(16, 185, 129, 0.8), 0 0 18px rgba(52, 211, 153, 0.4);
                    background: linear-gradient(to bottom, rgba(52, 211, 153, 0.1) 0%, #10b981 75%, transparent 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .crt-monitor {
                    animation: crtFlicker 0.18s infinite;
                }
                .glitch-hover:hover .glitch-target,
                .glitch-hover:focus .glitch-target {
                    animation: glitchText 0.35s steps(2) infinite;
                }
            `}</style>

            {/* CRT Overlay Filters */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,6px_100%] pointer-events-none z-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-emerald-950/20 pointer-events-none z-30 crt-monitor" />

            {/* HIGH-DENSITY MATRIX RAIN LAYER */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10 matrix-stream-container opacity-40 mix-blend-screen">
                <div className="w-full h-full flex justify-between px-2 text-[12px] font-black tracking-widest leading-[1.1]">
                    {[...Array(22)].map((_, i) => {
                        const variations = [
                            "01\n10\n11\n00\n10\n01\n11\n00\n10\n11\n01\n00\n11\n10\n01",
                            "A9\nFC\n20\nD4\n8E\n73\nAF\n6C\n5D\n2B\n84\nE9\n0F\n1A\n3C",
                            "SYS\nRUN\nMOD\nBUFF\nTRAC\nFLOW\nKERN\nPACK\nNODE\nLINK\nPORT\nHYPR",
                        ];
                        const chosenSequence = variations[i % variations.length];
                        const filledVerticalChain = Array(18).fill(chosenSequence).join("\n");

                        return (
                            <div
                                key={i}
                                className="matrix-stream flex flex-col text-center"
                                style={{
                                    animationDelay: `${i * -0.6}s`,
                                    animationDuration: `${9 + (i % 5)}s`,
                                }}
                            >
                                {filledVerticalChain}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Operational Info Spine Header */}
            <div className="relative z-20 flex justify-between items-center border-b border-emerald-500/20 pb-4 mb-8">
                <div>
                    <span className="text-[10px] text-emerald-500/50 tracking-widest block mb-1 animate-pulse">
                        // CYCLIC_CASCADE_ROUTING // VERSION_PULL_ACTIVE
                    </span>
                    <h4 className="text-sm font-black tracking-wider text-emerald-200 uppercase tracking-widest">
                        Waterfall Cascade: {sprintName}
                    </h4>
                </div>
                <div className="flex items-center gap-4 font-mono text-[9px] text-emerald-500/60">
                    <div>
                        [<kbd className="text-emerald-300 font-bold px-0.5">Tab</kbd>]: Next Node
                    </div>
                    <div>
                        [<kbd className="text-emerald-300 font-bold px-0.5">F</kbd>]: Cycle Version Up
                    </div>
                    <div>
                        [<kbd className="text-emerald-300 font-bold px-0.5">Click</kbd>]: Download
                    </div>
                </div>
            </div>

            {/* 3D Core Interaction Engine Canvas Space */}
            <div
                className="relative w-full min-h-[500px] flex flex-col gap-12 items-center py-12 px-4 overflow-y-auto z-20"
                style={{ perspective: "1200px" }}
            >
                {Object.entries(tasksGroup).map(([taskTitle, filesMap]) => (
                    <div
                        key={taskTitle}
                        className="w-full max-w-2xl bg-slate-950/75 border border-emerald-500/10 rounded-2xl p-5 backdrop-blur-md relative shadow-inner shadow-emerald-950/50"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div className="absolute top-2 left-2 text-[8px] text-emerald-500/20">┌ ┐</div>
                        <div className="absolute bottom-2 right-2 text-[8px] text-emerald-500/20">└ ┘</div>

                        <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/10 pb-2">
                            <span className="text-emerald-500/70 animate-pulse text-xs">▧</span>
                            <h5 className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                                {taskTitle}
                            </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {Object.entries(filesMap).map(([filename, versions]) => {
                                const sortedVersions = [...versions].sort(
                                    (a, b) => (b.version || 1) - (a.version || 1)
                                );

                                const stackKey = `${taskTitle}:::${filename}`;
                                // Identify our current cyclic pivot index configuration pointer
                                const currentCyclicOffset = stackOffsets[stackKey] || 0;

                                return (
                                    <div key={filename} className="flex flex-col gap-1">
                                        <span className="text-[10px] text-emerald-500/40 truncate mb-2 block tracking-tight font-semibold">
                                            ▶ SYS_NODE: {filename}
                                        </span>

                                        <div
                                            className="relative min-h-[145px] w-full"
                                            style={{ transformStyle: "preserve-3d" }}
                                        >
                                            {sortedVersions.map((file, originalIndex) => {
                                                const isLatestIdx = originalIndex === 0;

                                                // CRITICAL SCIFI RE-INDEXING MATH:
                                                // Shift layout positions dynamically using our cyclic variable state
                                                const transformedVirtualIndex =
                                                    (originalIndex - currentCyclicOffset + sortedVersions.length) % sortedVersions.length;

                                                const isAtFrontTop = transformedVirtualIndex === 0;
                                                const isActiveFocus = activeNodeId === file.id;

                                                // Depth configuration calculations
                                                const baseZ = -transformedVirtualIndex * 45;
                                                const baseY = transformedVirtualIndex * 26;
                                                const baseOpacity = Math.max(0.12, 1 - transformedVirtualIndex * 0.28);

                                                // Smooth elastic visual transforms matching hardware indicators
                                                let transformStyle = `translateZ(${baseZ}px) translateY(${baseY}px)`;
                                                if (isActiveFocus) {
                                                    transformStyle = `translateZ(${baseZ + 35}px) translateY(${baseY - 5}px) rotateX(-4deg) scale(1.02)`;
                                                }

                                                return (
                                                    <div
                                                        key={file.id}
                                                        data-node-id={file.id}
                                                        tabIndex={0}
                                                        onMouseEnter={() => setActiveNodeId(file.id)}
                                                        onMouseLeave={() => setActiveNodeId(null)}
                                                        onFocus={() => setActiveNodeId(file.id)}
                                                        onBlur={() => setActiveNodeId(null)}
                                                        onClick={() => handleNodeDownload(file.file)}
                                                        title="Click to dispatch transmission download protocol"
                                                        className={`absolute inset-x-0 top-0 p-3 rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer focus:outline-none glitch-hover ${isAtFrontTop
                                                                ? "border-emerald-400 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.4)] z-30 bg-slate-900/95"
                                                                : "bg-emerald-950/15 border-emerald-900/40 text-emerald-700/60 select-none"
                                                            } ${isActiveFocus ? "ring-2 ring-emerald-400/50 border-emerald-300" : ""}`}
                                                        style={{
                                                            transform: transformStyle,
                                                            opacity: isActiveFocus ? 1 : baseOpacity,
                                                            zIndex: isAtFrontTop ? 40 : 10 - transformedVirtualIndex,
                                                        }}
                                                    >
                                                        {/* Technical Header Node */}
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <span className={`font-bold tracking-widest text-[9px] glitch-target ${isAtFrontTop ? 'text-emerald-400 font-extrabold' : ''}`}>
                                                                [REV_0{file.version || 1}]
                                                            </span>
                                                            {isLatestIdx && (
                                                                <span className="text-[6px] bg-emerald-500/10 text-emerald-400/80 px-1 py-0.5 rounded border border-emerald-500/30 tracking-widest font-black">
                                                                    //ORIG_ROOT
                                                                </span>
                                                            )}
                                                            {isAtFrontTop && !isLatestIdx && (
                                                                <span className="text-[6px] bg-indigo-500/10 text-indigo-400 px-1 py-0.5 rounded border border-indigo-500/30 tracking-widest font-black animate-pulse">
                                                                    //MOUNTED_HUD
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="font-sans text-[10px] opacity-70 truncate text-slate-300 group-hover:text-white">
                                                            {file.filename || file.file.split("/").pop()}
                                                        </p>

                                                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-emerald-500/10 text-[9px] text-emerald-600/40 font-sans tracking-tight">
                                                            <span className={isAtFrontTop ? "text-emerald-400/60" : ""}>
                                                                📂 DOWNWARD ⇩
                                                            </span>
                                                            {file.file_size && (
                                                                <span className="text-emerald-500/40">{(file.file_size / 1024).toFixed(0)}kb</span>
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
    );
}