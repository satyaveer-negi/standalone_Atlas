import { useEffect, useState } from "react";
import { useAtlasStore } from "../../store/atlasStore";

interface LogEntry {
  id: string;
  time: string;
  level: "INFO" | "SUCCESS" | "WARN";
  message: string;
}

export default function BottomConsole() {
  const selectedNodeId = useAtlasStore((state) => state.selectedNodeId);
  const [isMinimized, setIsMinimized] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      time: new Date().toLocaleTimeString(),
      level: "SUCCESS",
      message: "ATLAS 3D GRAPH ENGINE INITIALIZED // COMPILER STACK ONLINE",
    },
    {
      id: "2",
      time: new Date().toLocaleTimeString(),
      level: "INFO",
      message: "REALTIME SSE NOTIFICATIONS CONNECTED",
    },
  ]);

  useEffect(() => {
    if (selectedNodeId) {
      setLogs((prev) => [
        {
          id: String(Date.now()),
          time: new Date().toLocaleTimeString(),
          level: "SUCCESS",
          message: `NODE TARGET ACQUIRED: ${selectedNodeId}`,
        },
        ...prev.slice(0, 15),
      ]);
    }
  }, [selectedNodeId]);

  if (isMinimized) {
    return (
      <div className="absolute bottom-4 left-6 pointer-events-auto z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold hover:bg-slate-900 transition-all cursor-pointer shadow-lg"
        >
          💻 OPEN TELEMETRY LOGS [{logs.length}]
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pointer-events-auto p-4 sm:px-6">
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-xl p-3.5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2 font-mono text-xs">
          <span className="font-black text-cyan-300 tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            REALTIME SYSTEM TELEMETRY CONSOLE
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-[10px] text-cyan-500 hover:text-cyan-300 font-bold cursor-pointer"
          >
            MINIMIZE [_]
          </button>
        </div>

        <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[11px] custom-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 text-slate-300">
              <span className="text-slate-500 text-[10px]">{log.time}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                  log.level === "SUCCESS"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : log.level === "WARN"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-cyan-500/20 text-cyan-400"
                }`}
              >
                {log.level}
              </span>
              <span className="truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
