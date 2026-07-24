import { useState } from "react";
import { MetricsEngine } from "../engine/MetricsEngine";
import { CorrelationEngine } from "../engine/CorrelationEngine";
import { TrendEngine } from "../engine/TrendEngine";
import { RecommendationEngine, type ActionableRecommendation } from "../engine/RecommendationEngine";

export function AnalyticsDashboard({ onClose }: { onClose: () => void }) {
  const metricsEngine = new MetricsEngine();
  const correlationEngine = new CorrelationEngine();
  const trendEngine = new TrendEngine();
  const recommendationEngine = new RecommendationEngine();

  const metrics = metricsEngine.collectDomainMetrics();
  const correlations = correlationEngine.computeCorrelations();
  const forecasts = trendEngine.computeForecasts();
  const recommendations = recommendationEngine.generateRecommendations();

  const [selectedRec, setSelectedRec] = useState<ActionableRecommendation>(recommendations[0]);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-indigo-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-sm font-black text-indigo-300 tracking-wider uppercase">
                ATLAS ENGINEERING ANALYTICS — EXECUTIVE INTELLIGENCE ENGINE
              </h2>
              <p className="text-[10px] text-slate-400">
                8-Domain Metric Aggregations, Cross-Domain Correlation Graphs & Evidence-Backed Recommendations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-indigo-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Panel 1: 8 Domain Health Scorecards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div key={m.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[9px] text-indigo-300 font-bold uppercase block">{m.domain}</span>
              <span className="text-lg font-black text-white block">{m.value} <span className="text-xs text-slate-400 font-normal">{m.unit}</span></span>
              <span className="text-[9px] text-slate-400 block font-mono">{m.name}</span>
            </div>
          ))}
        </div>

        {/* Panel 2 & 3: Cross-Domain Correlation Explorer & Trend Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Correlation Explorer */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-500/30 space-y-3">
            <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
              🕸️ CROSS-DOMAIN CORRELATION GRAPH
            </h3>
            <div className="space-y-2">
              {correlations.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-300">{c.sourceDomain} ➔ {c.targetDomain}</span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      Coef: {c.coefficient > 0 ? `+${c.coefficient}` : c.coefficient}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] font-mono">{c.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Forecasting */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
            <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
              📈 HEALTH TREND FORECASTING (30-DAY PROJECTION)
            </h3>
            <div className="space-y-2">
              {forecasts.map((f, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{f.metricName}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase font-mono">
                      {f.healthDirection}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Historical: {f.historicalValue} ➔ Current: {f.currentValue} ➔ <span className="font-bold text-cyan-300">Projected: {f.projected30DayValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 4 & 6: Actionable Recommendations & Evidence Inspector */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/40 space-y-3">
          <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
            💡 ACTIONABLE ENGINEERING RECOMMENDATIONS & EVIDENCE INSPECTOR
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedRec.id === rec.id
                    ? "bg-emerald-500/20 border-emerald-400 shadow-md"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rec.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {rec.confidencePercent}% Confidence
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono">Evidence: {rec.supportingEvidence}</p>
                <div className="p-2 rounded bg-slate-900 border border-emerald-500/30 text-[10px] text-emerald-300 font-bold">
                  Suggested Action: {rec.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
