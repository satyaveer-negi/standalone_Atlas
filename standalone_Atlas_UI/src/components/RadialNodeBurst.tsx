import { useMemo, useEffect, useRef, useState } from "react";

interface ManagedFile {
    id: number;
    file: string;
    filename: string;
    version?: number;
    is_latest?: boolean;
}

interface RadialNodeBurstProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

interface BurstNode {
    id: string;
    type: "sprint" | "task" | "file" | "version";
    name: string;
    fileUrl?: string;
    x3d: number;
    y3d: number;
    parentIndex: number | null;
    color: string;
    baseSize: number;
}

export const RadialNodeBurst = ({ sprintName, tasksGroup }: RadialNodeBurstProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
    const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);
    const [activeTrackingLabel, setActiveTrackingLabel] = useState<string>("SYSTEM CORE STANDBY");

    const rotationRef = useRef({ angle: 0, baseSpeed: 0.004, isDragging: false, lastX: 0 });
    const projectedNodesRef = useRef<any[]>([]);
    const stateRef = useRef({ pulse: 0, hoveredNode: null as any });

    const [activeHUDMenu, setActiveHUDMenu] = useState<{
        name: string;
        url: string;
        x: number;
        y: number;
    } | null>(null);

    const nodes3D = useMemo(() => {
        const list: Omit<BurstNode, "px" | "py">[] = [];
        const taskKeys = Object.keys(tasksGroup);
        const totalTasks = taskKeys.length;

        list.push({
            id: "root-sprint",
            type: "sprint",
            name: sprintName,
            x3d: 0,
            y3d: 0,
            parentIndex: null,
            color: "#6366f1",
            baseSize: 26
        });
        const sprintIdx = 0;

        taskKeys.forEach((task, tIdx) => {
            const taskAngle = totalTasks === 1 ? -Math.PI / 4 : (tIdx / totalTasks) * Math.PI * 2;
            const taskRadius = 110;

            list.push({
                id: `t-${tIdx}`,
                type: "task",
                name: task,
                x3d: Math.cos(taskAngle) * taskRadius,
                y3d: Math.sin(taskAngle) * taskRadius,
                parentIndex: sprintIdx,
                color: "#a855f7",
                baseSize: 18
            });
            const taskIdx = list.length - 1;

            const fileEntries = Object.entries(tasksGroup[task]);
            const totalFiles = fileEntries.length;

            fileEntries.forEach(([filename, versions], fIdx) => {
                const fileArcSpread = 0.6;
                const fileAngle = totalFiles === 1
                    ? taskAngle
                    : taskAngle + ((fIdx - (totalFiles - 1) / 2) * (fileArcSpread / (totalFiles - 1 || 1)));

                const fileRadius = 195;
                const fx = Math.cos(fileAngle) * fileRadius;
                const fy = Math.sin(fileAngle) * fileRadius;

                list.push({
                    id: `f-${tIdx}-${fIdx}`,
                    type: "file",
                    name: filename,
                    x3d: fx,
                    y3d: fy,
                    parentIndex: taskIdx,
                    color: "#00f0ff",
                    baseSize: 12
                });
                const fileIdx = list.length - 1;

                const totalVersions = versions.length;
                const sortedVersions = [...versions].sort((a, b) => (b.version || 0) - (a.version || 0));

                sortedVersions.forEach((v, vIdx) => {
                    const versionArcSpread = 0.4;
                    const vAngle = totalVersions === 1
                        ? fileAngle
                        : fileAngle + ((vIdx - (totalVersions - 1) / 2) * (versionArcSpread / (totalVersions - 1 || 1)));

                    const versionRadius = 275 + (vIdx * 18);
                    const vx = Math.cos(vAngle) * versionRadius;
                    const vy = Math.sin(vAngle) * versionRadius;

                    list.push({
                        id: `v-${v.id || Math.random()}`,
                        type: "version",
                        name: `v${v.version}`,
                        fileUrl: v.file,
                        x3d: vx,
                        y3d: vy,
                        parentIndex: fileIdx,
                        color: vIdx === 0 ? "#10b981" : "#059669",
                        baseSize: 10
                    });
                });
            });
        });

        return list;
    }, [tasksGroup, sprintName]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        rotationRef.current.isDragging = true;
        rotationRef.current.lastX = e.clientX;
        setActiveHUDMenu(null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const currentMouseX = e.clientX - rect.left;
        const currentMouseY = e.clientY - rect.top;

        if (rotationRef.current.isDragging) {
            const deltaX = e.clientX - rotationRef.current.lastX;
            rotationRef.current.angle += deltaX * 0.007;
            rotationRef.current.lastX = e.clientX;
            return;
        }

        let matchedNode = null;
        for (const node of projectedNodesRef.current) {
            const distance = Math.hypot(currentMouseX - node.px, currentMouseY - node.py);
            const hitRadius = node.size + 8;

            if (distance <= hitRadius) {
                matchedNode = node;
                break;
            }
        }

        stateRef.current.hoveredNode = matchedNode;
        canvas.style.cursor = matchedNode ? "pointer" : "default";

        if (matchedNode) {
            setActiveTrackingLabel(`LOCKED // [${matchedNode.type.toUpperCase()}] : ${matchedNode.name.toUpperCase()}`);
        } else {
            setActiveTrackingLabel("SYSTEM HUB SCANNING...");
        }
    };

    const handleMouseUpOrLeave = () => {
        rotationRef.current.isDragging = false;
    };

    const handleCanvasClick = () => {
        if (rotationRef.current.isDragging) return;
        const activeHover = stateRef.current.hoveredNode;

        if (activeHover && activeHover.type === "version" && activeHover.fileUrl) {
            setActiveHUDMenu({ name: activeHover.name, url: activeHover.fileUrl, x: activeHover.px, y: activeHover.py });
        } else {
            setActiveHUDMenu(null);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const resize = () => {
            const parentWidth = canvas.parentElement?.clientWidth || 800;
            canvas.width = Math.max(parentWidth, 600);
            canvas.height = 540;
        };
        resize();
        window.addEventListener("resize", resize);

        const renderLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const mx = canvas.width / 2;
            const my = canvas.height / 2;

            stateRef.current.pulse += 0.02;

            if (!rotationRef.current.isDragging) {
                rotationRef.current.angle += rotationRef.current.baseSpeed * speedMultiplier;
            }

            const cosA = Math.cos(rotationRef.current.angle);
            const sinA = Math.sin(rotationRef.current.angle);

            const projected = nodes3D.map((node) => {
                const isRoot = node.type === "sprint";
                const rotX = isRoot ? node.x3d : node.x3d * cosA - node.y3d * sinA;
                const rotY = isRoot ? node.y3d : node.x3d * sinA + node.y3d * cosA;

                return { ...node, px: mx + rotX * scaleMultiplier, py: my + rotY * scaleMultiplier, size: node.baseSize * (scaleMultiplier * 0.12 + 0.88) };
            });

            projectedNodesRef.current = projected;

            const concentricShells = [110, 195, 275];
            concentricShells.forEach((radius) => {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
                ctx.beginPath();
                ctx.arc(mx, my, radius * scaleMultiplier, 0, Math.PI * 2);
                ctx.stroke();
            });

            projected.forEach((node) => {
                if (node.parentIndex === null) return;
                const parent = projected[node.parentIndex];
                if (!parent) return;

                const isLineHighlighted = stateRef.current.hoveredNode?.id === node.id || stateRef.current.hoveredNode?.id === parent.id;
                ctx.strokeStyle = node.color;
                ctx.lineWidth = isLineHighlighted ? 2.5 : 1.2;
                ctx.globalAlpha = isLineHighlighted ? 0.95 : node.type === "version" ? 0.3 : 0.55;
                ctx.beginPath();
                ctx.moveTo(parent.px, parent.py);
                ctx.lineTo(node.px, node.py);
                ctx.stroke();
            });
            ctx.globalAlpha = 1.0;

            projected.forEach((node) => {
                const isTargeted = stateRef.current.hoveredNode?.id === node.id;

                ctx.fillStyle = node.color;
                ctx.shadowBlur = isTargeted ? 24 : 12;
                ctx.shadowColor = node.color;

                ctx.beginPath();
                if (node.type === "sprint") {
                    ctx.arc(node.px, node.py, node.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "#020617";
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.arc(node.px, node.py, node.size - 4, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 9px monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(node.name.toUpperCase(), node.px, node.py);

                    ctx.fillStyle = "rgba(165, 180, 252, 0.8)";
                    ctx.font = "bold 7px monospace";
                    ctx.fillText("[WORKSPACE]", node.px, node.py - node.size - 6);
                } else if (node.type === "task") {
                    ctx.arc(node.px, node.py, node.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "#090d16";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(node.px, node.py, node.size - 4, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 9px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    const clippedTask = node.name.length > 6 ? node.name.substring(0, 4) + ".." : node.name;
                    ctx.fillText(clippedTask, node.px, node.py);
                } else if (node.type === "file") {
                    ctx.fillRect(node.px - node.size / 2, node.py - node.size / 2, node.size, node.size);
                } else {
                    ctx.arc(node.px, node.py, node.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (node.type !== "sprint") {
                    ctx.shadowBlur = 0;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "alphabetic";

                    let cleanLabelString = node.name;
                    if (node.type === "file" && cleanLabelString.length > 13) {
                        cleanLabelString = cleanLabelString.substring(0, 10) + "..";
                    }

                    ctx.font = "bold 10px monospace";
                    const textWidth = ctx.measureText(cleanLabelString).width;
                    const blockWidth = Math.max(45, textWidth + 12);
                    const blockHeight = 28;
                    const blockY = node.py - node.size - 18;

                    ctx.fillStyle = isTargeted ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.82)";
                    ctx.strokeStyle = node.color;
                    ctx.lineWidth = isTargeted ? 2 : 1;
                    ctx.beginPath();
                    ctx.roundRect(node.px - blockWidth / 2, blockY - 10, blockWidth, blockHeight, 6);
                    ctx.fill();
                    ctx.stroke();

                    ctx.font = "bold 7px monospace";
                    ctx.fillStyle = node.color;
                    ctx.fillText(node.type.toUpperCase(), node.px, blockY - 2);

                    ctx.font = "bold 10px monospace";
                    ctx.fillStyle = "#000000";
                    ctx.fillText(cleanLabelString, node.px, blockY + 11);
                }
            });

            animationId = requestAnimationFrame(renderLoop);
        };

        renderLoop();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, [nodes3D, speedMultiplier, scaleMultiplier]);

    return (
        <div ref={containerRef} className="w-full relative overflow-visible bg-transparent rounded-[32px] p-2">
            <div className="absolute top-4 left-6 flex flex-col gap-1 font-mono text-[9px] tracking-widest uppercase pointer-events-none select-none z-20">
                <span className="text-purple-400/60 font-bold">[RADIAL_TARGET_BURST_SYSTEM_ACTIVE]</span>
                <span className="text-white bg-slate-950/60 border border-slate-800/40 px-2 py-1 rounded-md mt-1 font-black shadow-inner">
                    🛰️ TRACKING_METRIC // {activeTrackingLabel}
                </span>
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onClick={handleCanvasClick}
                className="w-full block bg-transparent cursor-grab active:cursor-grabbing pointer-events-auto relative z-10"
                style={{ height: "520px" }}
            />

            <div className="absolute bottom-4 left-6 z-30 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-950/80 border border-slate-800/80 px-4 py-3 rounded-2xl backdrop-blur-xs font-mono text-[9px] tracking-tight text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="text-slate-500">ORBIT_VELOCITY:</span>
                    <input type="range" min="0" max="4" step="0.1" value={speedMultiplier} onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))} className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 outline-none" />
                    <span className="text-purple-400 font-bold w-7 text-right">{speedMultiplier === 0 ? "STOP" : `${speedMultiplier}x`}</span>
                </div>
                <span className="hidden sm:inline text-slate-700">|</span>
                <div className="flex items-center gap-2">
                    <span className="text-slate-500">BURST_RADIUS:</span>
                    <input type="range" min="0.5" max="1.5" step="0.05" value={scaleMultiplier} onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))} className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 outline-none" />
                    <span className="text-sky-400 font-bold w-8 text-right">{Math.round(scaleMultiplier * 100)}%</span>
                </div>
            </div>

            {activeHUDMenu && (
                <div style={{ left: `${activeHUDMenu.x}px`, top: `${activeHUDMenu.y + 16}px` }} className="absolute z-[200] -translate-x-1/2 p-1.5 bg-slate-950/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-1.5 font-mono text-[10px]">
                    <a href={activeHUDMenu.url} target="_blank" rel="noreferrer" onClick={() => setActiveHUDMenu(null)} className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors">👁️ VIEW</a>
                    <a href={activeHUDMenu.url} download onClick={() => setActiveHUDMenu(null)} className="px-2.5 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors">💾 GET</a>
                    <button onClick={() => setActiveHUDMenu(null)} className="p-1 text-slate-500 hover:text-white font-bold text-xs">✕</button>
                </div>
            )}
        </div>
    );
};