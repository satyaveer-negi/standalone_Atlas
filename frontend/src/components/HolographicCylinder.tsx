import { useMemo, useEffect, useRef, useState } from "react";

interface ManagedFile {
    id: number;
    file: string;
    filename: string;
    version?: number;
    is_latest?: boolean;
}

interface HolographicCylinderProps {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

interface ProjectedNode {
    type: "sprint" | "task" | "file" | "version";
    name: string;
    fileUrl?: string;
    x3d: number;
    y3d: number;
    z3d: number;
    px: number;
    py: number;
    scale: number;
    alpha: number;
    color: string;
    parentIndex: number | null;
}

export const HolographicCylinder = ({ sprintName, tasksGroup }: HolographicCylinderProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Speed multiplier state linked directly to rotation logic
    const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

    // Track ongoing angular turntable state variables safely
    const rotationRef = useRef({ angle: 0, baseSpeed: 0.003, isDragging: false, lastX: 0 });
    const projectedNodesRef = useRef<ProjectedNode[]>([]);

    // Floating action popover menu visibility triggers
    const [activeMenu, setActiveMenu] = useState<{
        filename: string;
        url: string;
        x: number;
        y: number;
    } | null>(null);

    // Compile raw hierarchical files layout data maps into absolute 3D coordinate grids
    const nodes3D = useMemo(() => {
        const list: Omit<ProjectedNode, "px" | "py" | "scale" | "alpha">[] = [];
        const taskKeys = Object.keys(tasksGroup);

        // Core Root Node: Active Sprint sits right in the center vertical axis hub
        list.push({
            type: "sprint",
            name: sprintName,
            x3d: 0,
            y3d: 40,
            z3d: 0,
            color: "#6366f1",
            parentIndex: null
        });
        const sprintIdx = 0;

        taskKeys.forEach((task, tIdx) => {
            const taskAngle = (tIdx / Math.max(1, taskKeys.length)) * Math.PI * 2;
            const taskRadius = 110;

            list.push({
                type: "task",
                name: task,
                x3d: Math.cos(taskAngle) * taskRadius,
                y3d: 20,
                z3d: Math.sin(taskAngle) * taskRadius,
                color: "#a855f7",
                parentIndex: sprintIdx
            });
            const taskIdx = list.length - 1;

            const fileEntries = Object.entries(tasksGroup[task]);
            fileEntries.forEach(([filename, versions], fIdx) => {
                const fileAngle = taskAngle + ((fIdx - (fileEntries.length - 1) / 2) * 0.4);
                const fileRadius = 200;

                list.push({
                    type: "file",
                    name: filename,
                    x3d: Math.cos(fileAngle) * fileRadius,
                    y3d: -20,
                    z3d: Math.sin(fileAngle) * fileRadius,
                    color: "#38bdf8",
                    parentIndex: taskIdx
                });
                const fileIdx = list.length - 1;

                const sortedVersions = [...versions].sort((a, b) => (a.version || 0) - (b.version || 0));
                sortedVersions.forEach((v, vIdx) => {
                    const vAngle = fileAngle + ((vIdx - (sortedVersions.length - 1) / 2) * 0.12);
                    const vRadius = 280;

                    list.push({
                        type: "version",
                        name: `v${v.version}`,
                        fileUrl: v.file,
                        x3d: Math.cos(vAngle) * vRadius,
                        y3d: -60 + vIdx * 30, // Uniform vertical cascade spacing split
                        z3d: Math.sin(vAngle) * vRadius,
                        color: vIdx === sortedVersions.length - 1 ? "#10b981" : "#059669",
                        parentIndex: fileIdx
                    });
                });
            });
        });

        return list;
    }, [sprintName, tasksGroup]);

    // Mouse Interactivity Event Managers (Manual Rotate)
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        rotationRef.current.isDragging = true;
        rotationRef.current.lastX = e.clientX;
        setActiveMenu(null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!rotationRef.current.isDragging) return;
        const deltaX = e.clientX - rotationRef.current.lastX;
        rotationRef.current.angle += deltaX * 0.007; // Fine manual drag sensitivity tuning
        rotationRef.current.lastX = e.clientX;
    };

    const handleMouseUpOrLeave = () => {
        rotationRef.current.isDragging = false;
    };

    // Node Boundary Target Selection Handler
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (rotationRef.current.isDragging) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Check hit radius boundaries of interactive revision blocks (Sorted back-to-front)
        const interactableNodes = projectedNodesRef.current
            .filter(n => n.type === "version")
            .sort((a, b) => a.z3d - b.z3d);

        for (const node of interactableNodes) {
            const hitRadius = 14 * node.scale;
            const dist = Math.hypot(clickX - node.px, clickY - node.py);

            if (dist <= hitRadius && node.fileUrl) {
                setActiveMenu({
                    filename: node.name,
                    url: node.fileUrl,
                    x: node.px,
                    y: node.py
                });
                return;
            }
        }
        setActiveMenu(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const resizeCanvas = () => {
            const parentWidth = canvas.parentElement?.clientWidth || 800;
            canvas.width = Math.max( parentWidth, 600 );
            canvas.height = 420;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const renderLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const cameraDepth = 450;

            // Apply dynamic velocity rotation drift based on multiplier when not dragged manually
            if (!rotationRef.current.isDragging) {
                rotationRef.current.angle += rotationRef.current.baseSpeed * speedMultiplier;
            }

            const cosA = Math.cos(rotationRef.current.angle);
            const sinA = Math.sin(rotationRef.current.angle);

            // Pass 1: Translate and compute 3D projections over vector space matrices
            const projected: ProjectedNode[] = nodes3D.map((node) => {
                const rotX = node.x3d * cosA - node.z3d * sinA;
                const rotZ = node.x3d * sinA + node.z3d * cosA;

                const finalZ = rotZ + 360;
                const scale = cameraDepth / Math.max(1, finalZ);
                const alpha = Math.max(0.15, Math.min(1, 1.2 - finalZ / 600));

                return {
                    ...node,
                    px: cx + rotX * scale,
                    py: cy + node.y3d * scale,
                    scale,
                    alpha
                };
            });

            // Synchronize data context references to allow clicks handlers access to the latest projection math
            projectedNodesRef.current = projected;

            // Pass 2: Render isometric base telemetry tracking rings
            for (let r = 80; r <= 290; r += 70) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 * (cameraDepth / (r + 200))})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(cx, cy + 40 * (cameraDepth / 360), r, r * 0.32, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Pass 3: Draw data flow path connections sorted cleanly behind card nodes
            projected.forEach((node) => {
                if (node.parentIndex === null) return;
                const parent = projected[node.parentIndex];
                if (!parent) return;

                ctx.globalAlpha = Math.min(node.alpha, parent.alpha) * 0.4;
                ctx.strokeStyle = node.color;
                ctx.lineWidth = node.type === "version" ? 1 : 1.5;

                ctx.beginPath();
                ctx.moveTo(parent.px, parent.py);
                const controlX = (parent.px + node.px) / 2;
                ctx.bezierCurveTo(controlX, parent.py, controlX, node.py, node.px, node.py);
                ctx.stroke();
            });
            ctx.globalAlpha = 1.0;

            // Pass 4: Render active nodes via painter's depth layers ordering
            const depthSortedNodes = [...projected].sort((a, b) => b.z3d - a.z3d);

            depthSortedNodes.forEach((n) => {
                ctx.globalAlpha = n.alpha;
                ctx.shadowBlur = Math.max(2, 12 * n.scale);
                ctx.shadowColor = n.color;

                if (n.type === "sprint") {
                    const w = 110 * n.scale;
                    const h = 36 * n.scale;
                    ctx.fillStyle = "#1e1b4b";
                    ctx.strokeStyle = n.color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(n.px - w / 2, n.py - h / 2, w, h, 6 * n.scale);
                    ctx.fill();
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#ffffff";
                    ctx.font = `bold ${Math.max(9, 11 * n.scale)}px monospace`;
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(n.name, n.px, n.py);

                } else if (n.type === "task") {
                    ctx.fillStyle = "#0f172a";
                    ctx.strokeStyle = n.color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(n.px, n.py, 24 * n.scale, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#e2e8f0";
                    ctx.font = `bold ${Math.max(8, 9 * n.scale)}px sans-serif`;
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(n.name.length > 7 ? n.name.substring(0, 5) + ".." : n.name, n.px, n.py);

                } else if (n.type === "file") {
                    const w = 115 * n.scale;
                    const h = 26 * n.scale;
                    ctx.fillStyle = "#0f172a";
                    ctx.strokeStyle = n.color;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.roundRect(n.px - w / 2, n.py - h / 2, w, h, 6 * n.scale);
                    ctx.fill();
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#bae6fd";
                    ctx.font = `bold ${Math.max(8, 9 * n.scale)}px monospace`;
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(`📁 ${n.name.length > 11 ? n.name.substring(0, 9) + ".." : n.name}`, n.px, n.py);

                } else if (n.type === "version") {
                    const size = 22 * n.scale;
                    ctx.fillStyle = "#020617";
                    ctx.strokeStyle = n.color;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.roundRect(n.px - size / 2, n.py - size / 2, size, size, 4 * n.scale);
                    ctx.fill();
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = n.color;
                    ctx.font = `bold ${Math.max(7, 9 * n.scale)}px monospace`;
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(n.name, n.px, n.py);
                }
            });

            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(renderLoop);
        };

        renderLoop();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [nodes3D, speedMultiplier]);

    return (
        <div ref={containerRef} className="w-full relative overflow-visible bg-transparent rounded-[32px] p-2">
            <div className="absolute top-4 left-6 font-mono text-[9px] text-indigo-400/60 tracking-[0.2em] uppercase pointer-events-none select-none z-20">
                SYS_STATUS: RADAR_DRAG_TO_ROTATE // CORE: {sprintName}
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onClick={handleCanvasClick}
                className="w-full block bg-transparent cursor-grab active:cursor-grabbing pointer-events-auto relative z-10"
                style={{ height: "420px" }}
            />

            {/* SCI-FI ROTATION SPEED CONTROLLER LAYOVER BAR */}
            <div className="absolute bottom-4 left-6 z-30 flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-xs font-mono text-[10px]">
                <span className="text-slate-500 tracking-tight">ROTATION_SPEED:</span>
                <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={speedMultiplier}
                    onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none"
                />
                <span className="text-indigo-400 font-bold min-w-[24px] text-right">
                    {speedMultiplier === 0 ? "STOP" : `${speedMultiplier}x`}
                </span>
            </div>

            {/* FLOATING CONTEXT HUD POPOVER OVERLAY */}
            {activeMenu && (
                <div
                    style={{ left: `${activeMenu.x}px`, top: `${activeMenu.y + 20}px` }}
                    className="absolute z-[200] -translate-x-1/2 p-2 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md animate-scaleUp flex items-center gap-1.5"
                >
                    <a
                        href={activeMenu.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setActiveMenu(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[10px] font-bold transition-colors"
                    >
                        👁️ View
                    </a>
                    <a
                        href={activeMenu.url}
                        download
                        onClick={() => setActiveMenu(null)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold transition-colors"
                    >
                        💾 Get
                    </a>
                    <button
                        onClick={() => setActiveMenu(null)}
                        className="p-1.5 text-slate-500 hover:text-white text-[10px] ml-1 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};