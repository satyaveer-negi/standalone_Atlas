import { useMemo, useState } from "react";

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

interface CodeWaterfallProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

export const CodeWaterfall = ({ sprintName, tasksGroup }: CodeWaterfallProps) => {
    const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

    const layoutData = useMemo(() => {
        const taskKeys = Object.keys(tasksGroup);

        return taskKeys.flatMap((task) => {
            const fileEntries = Object.entries(tasksGroup[task]);

            return fileEntries.map(([filename, versions]) => {
                const sortedV = [...versions].sort((a, b) => (b.version || 0) - (a.version || 0));

                return {
                    task,
                    filename,
                    latest: sortedV[0],
                    history: sortedV.slice(1),
                };
            });
        });
    }, [tasksGroup]);

    return (
        <div className="w-full p-4 bg-transparent relative z-50">
            {/* Sci-Fi Ambient Styling Overrides */}
            <style>{`
        @keyframes cyberPulse {
          0% { border-color: rgba(99, 102, 241, 0.2); box-shadow: 0 0 0px rgba(99, 102, 241, 0); }
          50% { border-color: rgba(0, 240, 255, 0.4); box-shadow: 0 0 15px rgba(0, 240, 255, 0.15); }
          100% { border-color: rgba(99, 102, 241, 0.2); box-shadow: 0 0 0px rgba(99, 102, 241, 0); }
        }
        .cyber-panel-active {
          animation: cyberPulse 2s infinite ease-in-out;
        }
      `}</style>

            {/* Main Row Container */}
            <div className="flex flex-col gap-3 w-full max-w-full">
                {layoutData.map((card, idx) => {
                    const isRowHovered = hoveredRowIndex === idx;

                    return (
                        /* Each row gets its own isolated perspective and 3D stage. 
                          This prevents scrolling clipping and ensures every row transforms uniformly.
                        */
                        <div
                            key={idx}
                            className="w-full [perspective:1000px] [transform-style:preserve-3d] py-1"
                            onMouseEnter={() => setHoveredRowIndex(idx)}
                            onMouseLeave={() => setHoveredRowIndex(null)}
                        >
                            <div
                                style={{
                                    transform: isRowHovered
                                        ? "translateZ(30px) rotateX(-3deg)"
                                        : "translateZ(0px) rotateX(0deg)",
                                }}
                                className={`w-full min-h-[68px] rounded-2xl px-6 flex flex-wrap md:flex-nowrap items-center justify-between backdrop-blur-xl transition-all duration-300 ease-out border font-mono select-none gap-4 md:gap-0 ${isRowHovered
                                        ? "bg-slate-900/90 border-cyan-400/60 text-white shadow-[0_15px_30px_rgba(0,240,255,0.15)] relative z-20"
                                        : "bg-slate-950/30 border-slate-800/80 text-slate-300 relative z-10"
                                    }`}
                            >
                                {/* Tech Laser Pack Scan Line Decorator */}
                                {isRowHovered && (
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                                )}

                                {/* 01 // SYSTEM MODULE CORE */}
                                <div className="w-full md:w-[20%] flex flex-col justify-center">
                                    <span className={`text-[8px] tracking-[0.2em] font-black ${isRowHovered ? "text-cyan-400" : "text-slate-500"}`}>
                                        [01_SYS_MODULE]
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs ${isRowHovered ? "text-purple-400 animate-spin" : "text-purple-500"}`}>
                                            ⚙️
                                        </span>
                                        <span className="text-xs font-bold font-sans tracking-wide text-slate-100 truncate max-w-[150px]">
                                            {card.task}
                                        </span>
                                    </div>
                                </div>

                                {/* 02 // DATASTREAM PIPELINE */}
                                <div className="w-full md:w-[30%] flex flex-col justify-center px-0 md:px-2">
                                    <span className={`text-[8px] tracking-[0.2em] font-black ${isRowHovered ? "text-cyan-400" : "text-slate-500"}`}>
                                        [02_DATA_STREAM]
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-sky-400">📄</span>
                                        <span className={`text-xs font-bold truncate max-w-xs ${isRowHovered ? "text-cyan-300" : "text-sky-400"}`}>
                                            {card.filename}
                                        </span>
                                    </div>
                                </div>

                                {/* 03 // HOVER CONTROL TERMINAL HEAD */}
                                <div className="w-full md:w-[28%] flex items-center md:pl-4 [transform-style:preserve-3d]">
                                    {card.latest && (
                                        <div
                                            className={`px-4 py-1.5 rounded-xl border flex items-center justify-between w-full transition-all duration-300 ${isRowHovered
                                                    ? "bg-slate-950 border-emerald-400 shadow-md shadow-emerald-950/50 [transform:translateZ(10px)]"
                                                    : "bg-slate-950/60 border-emerald-500/20"
                                                }`}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-[10px] font-black text-emerald-400 tracking-widest">
                                                    HEAD v{card.latest.version}
                                                </span>
                                            </div>

                                            {/* Operational Action Anchors */}
                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={card.latest.file}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-slate-400 hover:text-white text-xs transition-transform hover:scale-125"
                                                >
                                                    👁️
                                                </a>
                                                <a
                                                    href={card.latest.file}
                                                    download={card.filename}
                                                    className="text-emerald-400 hover:text-emerald-300 text-xs transition-transform hover:scale-125"
                                                >
                                                    💾
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 04 // DEEP TIMELINE REVISION STACK */}
                                <div className="w-full md:w-[22%] flex gap-1.5 items-center overflow-x-auto custom-scrollbar md:pl-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0">
                                    {card.history.map((hist, hIdx) => (
                                        <a
                                            key={hIdx}
                                            href={hist.file}
                                            download={card.filename}
                                            className={`px-2 py-0.5 rounded border text-[9px] font-bold tracking-tighter transition-all duration-200 shrink-0 ${isRowHovered
                                                    ? "bg-slate-950 border-slate-600 text-slate-200 hover:border-cyan-400 hover:text-cyan-400 [transform:translateZ(5px)]"
                                                    : "bg-slate-950/20 border-slate-900 text-slate-500"
                                                }`}
                                        >
                                            v{hist.version}
                                        </a>
                                    ))}
                                    {card.history.length === 0 && (
                                        <span className="text-[9px] font-mono text-slate-600 italic tracking-wider">
                                            EMPTY_CACHE
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};