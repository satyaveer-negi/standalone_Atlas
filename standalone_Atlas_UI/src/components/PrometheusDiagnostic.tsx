import React, { useState, useEffect, useRef } from "react";

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

interface PrometheusDiagnosticProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

// --- SCI-FI POLISH: RUNTIME TEXT DECODER COMPONENT ---
function DecodedText({ text, trigger }: { text: string; trigger: any }) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        let iterations = 0;
        const chars = "0123456789ABCDEFxX_[]//--";
        const targetArray = text.split("");

        const interval = setInterval(() => {
            setDisplayText(
                targetArray
                    .map((char, index) => {
                        if (index < iterations) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iterations >= text.length) {
                clearInterval(interval);
            }
            iterations += Math.ceil(text.length / 8);
        }, 30);

        return () => clearInterval(interval);
    }, [text, trigger]);

    return <span className="font-mono tracking-wide">{displayText}</span>;
}

export function PrometheusDiagnostic({ sprintName, tasksGroup }: PrometheusDiagnosticProps) {
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const [scanTrigger, setScanTrigger] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const flatFilesAll = Object.values(tasksGroup)
        .flatMap(filesMap => Object.values(filesMap))
        .flatMap(versions => [...versions].sort((a, b) => (b.version || 1) - (a.version || 1)));

    // Fire the scanline sweep sweep animation trigger
    const handleNodeFocus = (id: number) => {
        setActiveNodeId(id);
        setScanTrigger(prev => prev + 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Tab") {
            const currentIdx = flatFilesAll.findIndex(f => f.id === activeNodeId);
            let nextIdx = e.shiftKey ? currentIdx - 1 : currentIdx + 1;

            if (nextIdx >= flatFilesAll.length) nextIdx = 0;
            if (nextIdx < 0) nextIdx = flatFilesAll.length - 1;

            const nextFile = flatFilesAll[nextIdx];
            if (nextFile) {
                e.preventDefault();
                const nextEl = containerRef.current?.querySelector(`[data-node-id="${nextFile.id}"]`) as HTMLElement;
                nextEl?.focus();
            }
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-950 border border-slate-800 rounded-[32px] p-8 text-cyan-500 font-mono overflow-hidden relative shadow-2xl min-h-[600px] select-none"
        >
            {/* PROMETHEUS DIAGNOSTIC STYLE ARCHITECTURE */}
            <style>{`
                @keyframes laserSweep {
                    0% { top: -5%; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    100% { top: 105%; opacity: 0; }
                }
                @keyframes gridPulse {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.25; }
                }
                .diagnostic-scanline {
                    height: 6px;
                    background: linear-gradient(to bottom, transparent, #22d3ee, transparent);
                    box-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4);
                    animation: laserSweep 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                .prometheus-grid {
                    background-image: linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
                    background-size: 20px 24px;
                    animation: gridPulse 4s ease-in-out infinite;
                }
                .crt-mesh {
                    background: linear-gradient(rgba(18, 24, 27, 0) 50%, rgba(0, 0, 0, 0.3) 50%);
                    background-size: 100% 4px;
                }
            `}</style>

            {/* CRT Glass Filter Layers */}
            <div className="absolute inset-0 crt-mesh pointer-events-none z-40" />
            <div className="absolute inset-0 prometheus-grid pointer-events-none z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-slate-950/40 pointer-events-none z-10" />

            {/* THE SCANLINE SWEEP BEAM (Fires dynamically via state changes) */}
            <div key={`sweep-${scanTrigger}`} className="absolute left-0 right-0 pointer-events-none z-30 diagnostic-scanline" />

            {/* Header Spine Readout */}
            <div className="relative z-20 flex justify-between items-center border-b border-slate-800 pb-4 mb-8">
                <div>
                    <span className="text-[10px] text-cyan-600/70 tracking-widest block mb-1">
                        // PROMETHEUS_DIAGNOSTIC_SYS_MAP // TELEMETRY_ONLINE
                    </span>
                    <h4 className="text-sm font-black tracking-widest text-slate-200 uppercase">
                        Telemetry Viewport: {sprintName}
                    </h4>
                </div>
                <div className="text-right font-mono text-[9px] text-cyan-600/60 flex items-center gap-4">
                    <span>GRID_SCALE: 20x24_HZ</span>
                    <span className="text-slate-800">|</span>
                    <span className="text-cyan-400 font-bold animate-pulse">● SYS_READY</span>
                </div>
            </div>

            {/* Grid Map Stream layout */}
            <div className="relative z-20 flex flex-col gap-8">
                {Object.entries(tasksGroup).map(([taskTitle, filesMap]) => (
                    <div
                        key={taskTitle}
                        className="w-full bg-slate-900/30 border border-slate-900 rounded-2xl p-6 backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-500 animate-pulse text-xs">▰</span>
                                <h5 className="text-xs font-black text-slate-300 tracking-wider uppercase">
                                    MODULE_UNIT: {taskTitle}
                                </h5>
                            </div>
                            <span className="text-[9px] text-slate-600">0x{getHashCode(taskTitle).toString(16).toUpperCase().slice(0, 4)}</span>                        </div>

                        <div className="flex flex-col gap-6">
                            {Object.entries(filesMap).map(([filename, versions]) => {
                                const sortedVersions = [...versions].sort((a, b) => (b.version || 1) - (a.version || 1));

                                return (
                                    <div key={filename} className="flex flex-col gap-3 border-b border-slate-900/40 pb-5 last:border-0 last:pb-0">
                                        <div className="text-[10px] text-cyan-600 flex items-center gap-2">
                                            <span>▶</span>
                                            <span>NODE_STRAND:</span>
                                            <span className="text-slate-400 font-sans font-semibold text-[11px] truncate max-w-sm">
                                                {filename}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {sortedVersions.map((file, index) => {
                                                const isLatest = index === 0;
                                                const isCurrentFocal = activeNodeId === file.id;

                                                return (
                                                    <div
                                                        key={file.id}
                                                        data-node-id={file.id}
                                                        tabIndex={0}
                                                        onMouseEnter={() => handleNodeFocus(file.id)}
                                                        onFocus={() => handleNodeFocus(file.id)}
                                                        onBlur={() => setActiveNodeId(null)}
                                                        onClick={() => file.file && window.open(file.file, "_blank")}
                                                        className={`p-3.5 rounded-xl border text-[11px] transition-all duration-200 cursor-pointer focus:outline-none flex flex-col justify-between h-[105px] relative ${isCurrentFocal
                                                            ? "bg-slate-900 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.01]"
                                                            : isLatest
                                                                ? "bg-slate-950/80 border-cyan-900/60 text-cyan-400"
                                                                : "bg-slate-950/40 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300"
                                                            }`}
                                                    >
                                                        {/* Blueprint Cross Decal Details */}
                                                        {isCurrentFocal && (
                                                            <>
                                                                <div className="absolute top-1 left-1 text-[7px] text-cyan-400/50">+</div>
                                                                <div className="absolute bottom-1 right-1 text-[7px] text-cyan-400/50">+</div>
                                                            </>
                                                        )}

                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className={`font-black text-[10px] ${isCurrentFocal ? 'text-cyan-300' : ''}`}>
                                                                [REV_0{file.version || 1}]
                                                            </span>
                                                            {isLatest && (
                                                                <span className="text-[7px] bg-cyan-950 border border-cyan-500/30 text-cyan-400 px-1.5 py-0.5 rounded tracking-widest font-bold">
                                                                    SYS_CORE
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="font-mono text-[10px] opacity-80 truncate my-2">
                                                            {/* Fire the hexadecimal noise decoder sequence on state triggers */}
                                                            <DecodedText
                                                                text={file.filename || file.file.split("/").pop() || ""}
                                                                trigger={isCurrentFocal}
                                                            />
                                                        </p>

                                                        <div className="flex justify-between items-center text-[8px] text-slate-600 pt-1.5 border-t border-slate-900 font-mono tracking-tight">
                                                            <span>ANL_0{index + 1}</span>
                                                            {file.file_size && (
                                                                <span>{(file.file_size / 1024).toFixed(0)}kb</span>
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

// Global prototype polyfill injection script to avoid component structure crashes
// Hyper-precise cypher hash function for corporate telemetry mapping
function getHashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash); // Returns absolute integer values safely
}