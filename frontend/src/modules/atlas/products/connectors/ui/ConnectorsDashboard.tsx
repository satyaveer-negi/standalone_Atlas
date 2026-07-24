import { useState } from "react";
import { ConnectorService } from "../../../services/ConnectorService";

export function ConnectorsDashboard({ onClose }: { onClose: () => void }) {
  const [service] = useState(() => new ConnectorService());
  const pipeline = service.getPipeline();
  const translator = service.getTranslator();

  const [events, setEvents] = useState(() => pipeline.runFullSync());

  const handleSyncNow = () => {
    setEvents(pipeline.runFullSync());
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-teal-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔌</span>
            <div>
              <h2 className="text-sm font-black text-teal-300 tracking-wider uppercase">
                ATLAS CONNECTORS — ENTERPRISE TOOLING INGESTION LAYER
              </h2>
              <p className="text-[10px] text-slate-400">
                Source Control, Planning & Observability Normalization into Append-Only Command Stream
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncNow}
              className="px-3 py-1 rounded-lg bg-teal-500/20 border border-teal-400 text-teal-300 hover:bg-teal-500/30 text-xs font-bold cursor-pointer transition-all"
            >
              🔄 SYNC NOW
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-teal-300 text-xs font-bold cursor-pointer transition-all"
            >
              ESC [X]
            </button>
          </div>
        </div>

        {/* Integration Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pipeline.getConnectors().map((conn) => (
            <div key={conn.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white block">{conn.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {conn.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Category: {conn.category}</span>
                <span className="font-bold text-teal-300">Health: {conn.healthScore}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ingested Webhook Feed & Command Translation Log */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-teal-500/30 space-y-3">
          <h3 className="text-xs font-black text-teal-400 uppercase tracking-wider">
            📥 INGESTED WEBHOOK EVENTS & COMMAND TRANSLATIONS
          </h3>
          <div className="space-y-2">
            {events.map((evt) => {
              const cmd = translator.translateEvent(evt);
              return (
                <div key={evt.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-teal-300">[{evt.source}] Event: {evt.eventType}</span>
                    <span className="text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-purple-500/30 text-[11px] font-mono text-purple-300">
                    ➡️ Translated Command: <span className="font-bold text-emerald-400">{cmd.commandType}</span> by <span className="font-bold text-white">{cmd.actorId}</span> ({JSON.stringify(cmd.payload)})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
