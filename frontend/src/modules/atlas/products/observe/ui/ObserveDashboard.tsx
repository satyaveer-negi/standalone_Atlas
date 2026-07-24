import { useState } from "react";
import { DockerConnector } from "../connectors/DockerConnector";
import { RuntimeOverlayEngine } from "../engine/RuntimeOverlayEngine";
import { AnomalyEngine } from "../engine/AnomalyEngine";
import { IncidentEngine } from "../engine/IncidentEngine";

export function ObserveDashboard({ onClose }: { onClose: () => void }) {
  const dockerConn = new DockerConnector();
  const sampleEvents = dockerConn.getSampleEvents();

  const overlayEngine = new RuntimeOverlayEngine();
  overlayEngine.processEvents(sampleEvents);

  const anomalyEngine = new AnomalyEngine();
  const anomalies = anomalyEngine.detectAnomalies(sampleEvents);

  const incidentEngine = new IncidentEngine();
  const incident = anomalies.length > 0 ? incidentEngine.createIncidentFromAnomaly(anomalies[0]) : null;

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <h2 className="text-sm font-black text-cyan-300 tracking-wider uppercase">
                ATLAS OBSERVE — OPERATIONAL TELEMETRY & INCIDENT DASHBOARD
              </h2>
              <p className="text-[10px] text-slate-400">
                Live Microservices Telemetry, Anomaly Detection & Root Cause Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Operational Telemetry Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 space-y-1">
            <span className="text-[9px] text-cyan-300 font-bold block uppercase">ACTIVE CONNECTORS</span>
            <span className="text-2xl font-black text-white">3 Active</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-1">
            <span className="text-[9px] text-rose-300 font-bold block uppercase">INCIDENTS</span>
            <span className="text-2xl font-black text-rose-400">{incident ? "1 CRITICAL" : "HEALTHY"}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">DB CPU SURGE</span>
            <span className="text-xl font-bold text-amber-300">94.2%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">LATENCY AVG</span>
            <span className="text-xl font-bold text-emerald-300">42ms</span>
          </div>
        </div>

        {/* Hot Containers Table & Incident Root Cause Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Microservices Container Metrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              MICROSERVICES CONTAINERS ({sampleEvents.length})
            </h3>
            <div className="space-y-2">
              {sampleEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">
                      🐳 {evt.labels?.container || evt.entityId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Metric: {evt.metric.toUpperCase()} = {evt.value}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      evt.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {evt.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Root Cause Incident Analysis Panel */}
          {incident && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span>🚨</span> INCIDENT ROOT CAUSE TIMELINE
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  {incident.severity}
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">TITLE</span>
                  <p className="text-white font-bold">{incident.title}</p>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">CORRELATED GIT COMMIT</span>
                  <p className="text-cyan-200 font-mono bg-slate-950 p-1.5 rounded border border-cyan-500/20">
                    {incident.correlatedCommit}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">ROOT CAUSE SUMMARY</span>
                  <p className="text-slate-300">{incident.rootCauseSummary}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
