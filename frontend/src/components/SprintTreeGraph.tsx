import { useMemo } from "react";

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

interface SprintTreeGraphProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

export const SprintTreeGraph = ({ sprintName, tasksGroup }: SprintTreeGraphProps) => {
    const layout = useMemo(() => {
        const taskKeys = Object.keys(tasksGroup);

        // Proportional structural columns 
        const sprintX = 40;
        const taskX = 260;
        const fileX = 460;
        const versionX = 640; // Placed perfectly next to the file node block

        let totalVerticalBlocks = 0;

        const computedTasks = taskKeys.map((taskTitle, tIdx) => {
            const fileEntries = Object.entries(tasksGroup[taskTitle]);

            const files = fileEntries.map(([filename, versions]) => {
                // Record the anchor Y height baseline for this file track
                const fileTopY = 45 + totalVerticalBlocks * 48;

                // Sort versions DESCENDING (Latest first to oldest last)
                const sortedVersions = [...versions].sort((a, b) => (b.version || 0) - (a.version || 0));

                const versionsData = sortedVersions.map((vFile, vIdx) => {
                    // The first (latest) version aligns side-by-side with file node. 
                    // Subsequent older logs branch progressively downward underneath it.
                    const vY = fileTopY + vIdx * 40;
                    if (vIdx > 0) {
                        totalVerticalBlocks++;
                    }
                    return {
                        ...vFile,
                        x: versionX,
                        y: vY,
                    };
                });

                totalVerticalBlocks++;

                return {
                    filename,
                    versions: versionsData,
                    x: fileX,
                    y: fileTopY,
                };
            });

            // Recalculate task centroid alignments dynamically over computed row lanes
            let tY = 70 + tIdx * 140;
            if (files.length > 0) {
                const firstFileY = files[0].y;
                const lastFileGroup = files[files.length - 1];
                const lastElementY = lastFileGroup.versions.length > 0
                    ? lastFileGroup.versions[lastFileGroup.versions.length - 1].y
                    : lastFileGroup.y;
                tY = (firstFileY + lastElementY) / 2;
            }

            return {
                id: `task-${tIdx}`,
                title: taskTitle,
                x: taskX,
                y: tY,
                files,
            };
        });

        const calculatedHeight = Math.max(totalVerticalBlocks * 48 + 80, 280);
        const sprintY = calculatedHeight / 2;

        return {
            sprint: { x: sprintX, y: sprintY, name: sprintName },
            tasks: computedTasks,
            height: calculatedHeight
        };
    }, [sprintName, tasksGroup]);

    return (
        <div className="relative w-full p-4 overflow-visible bg-transparent z-[100] isolate">
            <div className="overflow-x-auto overflow-y-visible custom-scrollbar">
                <svg
                    width={820}
                    height={layout.height}
                    className="overflow-visible relative z-[100] mx-auto select-none bg-transparent pointer-events-auto"
                >
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.4" />
                        </filter>
                        <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
                        </filter>
                        <linearGradient id="sprintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                    </defs>

                    <style>{`
            @keyframes topoFlow {
              to { stroke-dashoffset: -20; }
            }
            .topo-line-flow {
              animation: topoFlow 1.5s linear infinite;
            }
          `}</style>

                    {/* NETWORK WIRE ROUTING CONNECTIONS */}
                    {layout.tasks.map((task) => {
                        const toTaskCurve = `M ${layout.sprint.x + 130} ${layout.sprint.y} C ${(layout.sprint.x + 130 + task.x) / 2} ${layout.sprint.y}, ${(layout.sprint.x + 130 + task.x) / 2} ${task.y}, ${task.x} ${task.y}`;
                        return (
                            <g key={`links-${task.id}`} className="relative z-10">
                                {/* Sprint Core to Task Circle line */}
                                <path d={toTaskCurve} fill="none" stroke="#4f46e5" strokeWidth={2} className="opacity-30" />
                                <path d={toTaskCurve} fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 6" className="topo-line-flow opacity-60" />

                                {task.files.map((file, fIdx) => {
                                    const toFileCurve = `M ${task.x} ${task.y} C ${(task.x + file.x) / 2} ${task.y}, ${(task.x + file.x) / 2} ${file.y}, ${file.x} ${file.y}`;
                                    return (
                                        <g key={`file-group-links-${fIdx}`}>
                                            {/* Task Circle to Parent File box link path */}
                                            <path d={toFileCurve} fill="none" stroke="#38bdf8" strokeWidth={1.5} className="opacity-40" />

                                            {/* File box out to dropdown nested version sub-nodes paths */}
                                            {file.versions.map((version, vIdx) => {
                                                // The primary entry connects smoothly, underneath logs route down via drop tree paths
                                                const toVersionCurve = vIdx === 0
                                                    ? `M ${file.x + 140} ${file.y} C ${(file.x + 140 + version.x) / 2} ${file.y}, ${(file.x + 140 + version.x) / 2} ${version.y}, ${version.x} ${version.y}`
                                                    : `M ${version.x - 20} ${file.y} L ${version.x - 20} ${version.y} L ${version.x} ${version.y}`;

                                                return (
                                                    <path key={`v-link-${vIdx}`} d={toVersionCurve} fill="none" stroke={vIdx === 0 ? "#10b981" : "#64748b"} strokeWidth={1.2} strokeDasharray={vIdx === 0 ? "none" : "3 3"} className="opacity-60" />
                                                );
                                            })}
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}

                    {/* COLUMN 1: SPRINT SYSTEM IDENTIFIER MODULE */}
                    <g transform={`translate(${layout.sprint.x}, ${layout.sprint.y - 35})`} filter="url(#nodeShadow)" className="relative z-50">
                        <rect width={130} height={70} rx={16} fill="url(#sprintGrad)" filter="url(#glow)" />
                        <rect width={128} height={68} x={1} y={1} rx={15} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
                        <text x={65} y={32} textAnchor="middle" className="fill-white font-sans text-[10px] font-black tracking-widest uppercase">
                            WORKSPACE
                        </text>
                        <text x={65} y={48} textAnchor="middle" className="fill-indigo-100 font-mono text-[13px] font-bold tracking-wide">
                            {layout.sprint.name}
                        </text>
                    </g>

                    {/* COLUMN 2: TASK SYSTEM FLOW NODES */}
                    {layout.tasks.map((task) => (
                        <g key={task.id} transform={`translate(${task.x}, ${task.y})`} filter="url(#nodeShadow)" className="relative z-50">
                            <circle r={32} fill="#0f172a" stroke="#8b5cf6" strokeWidth={2.5} />
                            <circle r={26} fill="none" stroke="#3b82f6" strokeWidth={1} strokeDasharray="2 3" className="opacity-40" />
                            <text textAnchor="middle" y={4} className="fill-slate-100 font-sans text-[11px] font-bold tracking-wide">
                                {task.title.length > 9 ? task.title.slice(0, 7) + "..." : task.title}
                            </text>
                            <title>{task.title}</title>
                        </g>
                    ))}

                    {/* COLUMN 3 & 4: PARENT FILE CONTAINERS & VERTICAL DROPDOWN REVISION CARDS */}
                    {layout.tasks.flatMap(t => t.files).map((file, idx) => (
                        <g key={`file-track-${idx}`} filter="url(#nodeShadow)" className="relative z-50">
                            {/* Column 3 File Block */}
                            <g transform={`translate(${file.x}, ${file.y - 17})`}>
                                <rect width={140} height={34} rx={10} fill="#1e293b" stroke="#38bdf8" strokeWidth={1.5} />
                                <text x={12} y={21} className="fill-sky-100 font-mono text-[10px] font-bold tracking-wide">
                                    📁 {file.filename.length > 14 ? file.filename.slice(0, 11) + "..." : file.filename}
                                </text>
                            </g>

                            {/* Column 4: Versions stacked in vertical dropdown layout under first entry */}
                            {file.versions.map((version, vIdx) => (
                                <g key={`v-box-${vIdx}`} transform={`translate(${version.x}, ${version.y - 15})`}>
                                    <rect width={120} height={30} rx={8} fill="#090d16" stroke={vIdx === 0 ? "#10b981" : "#334155"} strokeWidth={1.2} />
                                    <text x={12} y={19} className={`${vIdx === 0 ? "fill-emerald-400 font-black" : "fill-slate-400 font-bold"} font-mono text-[10px] tracking-wider`}>
                                        v{version.version || 1} {vIdx === 0 && "⭐"}
                                    </text>

                                    {/* Operational File Action triggers */}
                                    <g transform="translate(72, 7)" className="cursor-pointer group/btn">
                                        <a href={version.file} target="_blank" rel="noreferrer">
                                            <rect width={18} height={16} rx={4} fill="#1e293b" className="group-hover/btn:fill-slate-700 transition-colors" />
                                            <text x={9} y={11} textAnchor="middle" className="text-[8px]">👁️</text>
                                        </a>
                                    </g>
                                    <g transform="translate(94, 7)" className="cursor-pointer group/btn">
                                        <a href={version.file} download={version.filename}>
                                            <rect width={18} height={16} rx={4} fill={vIdx === 0 ? "#065f46" : "#1e293b"} className="group-hover/btn:fill-emerald-700 transition-colors" />
                                            <text x={9} y={11} textAnchor="middle" className="text-[8px]">💾</text>
                                        </a>
                                    </g>
                                </g>
                            ))}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};