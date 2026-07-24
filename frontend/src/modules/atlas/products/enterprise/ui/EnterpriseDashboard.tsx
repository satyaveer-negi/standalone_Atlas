import { useState } from "react";
import { EnterpriseService } from "../../../services/EnterpriseService";
import { NotificationEngine } from "../engine/NotificationEngine";
import { EnterpriseSearchEngine } from "../engine/EnterpriseSearchEngine";

export function EnterpriseDashboard({ onClose }: { onClose: () => void }) {
  const [enterpriseService] = useState(() => new EnterpriseService());
  const notifEngine = new NotificationEngine();
  const searchEngine = new EnterpriseSearchEngine();

  const orgs = enterpriseService.getOrganizations();
  const policies = enterpriseService.getRBACEngine().getPolicies();

  const [selectedOrg, setSelectedOrg] = useState(orgs[0]);
  const [searchQuery, setSearchQuery] = useState("Redis TaskViewSet");
  const searchResults = searchEngine.searchEnterpriseKnowledge(searchQuery);
  const notifications = notifEngine.getNotifications();

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-blue-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <div>
              <h2 className="text-sm font-black text-blue-300 tracking-wider uppercase">
                ATLAS ENTERPRISE FOUNDATION — MULTI-TENANCY, SECURITY & SEARCH
              </h2>
              <p className="text-[10px] text-slate-400">
                Organization/BU Hierarchy, Hybrid ABAC/RBAC Policies, Multi-Channel Notifications & Semantic Search
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-blue-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Panel 1: Organization Explorer */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-3">
          <span className="text-xs font-bold text-blue-300 uppercase block">🏢 SELECT ENTERPRISE ORGANIZATION & BUSINESS UNIT:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {orgs.map((o) => (
              <div
                key={o.id}
                onClick={() => setSelectedOrg(o)}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedOrg.id === o.id
                    ? "bg-blue-500/20 border-blue-400 shadow-md"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white block">{o.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
                    {o.tier}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                  {o.businessUnits.map((bu) => (
                    <div key={bu.id}>• {bu.name} ({bu.workspacesCount} workspaces)</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 5: Enterprise Semantic Search */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
          <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
            🔎 ENTERPRISE SEMANTIC SEARCH (KNOWLEDGE GRAPH & REPOSITORIES)
          </h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
          />
          <div className="space-y-2">
            {searchResults.map((res) => (
              <div key={res.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-cyan-300">[{res.category}] {res.title}</span>
                  <span className="text-emerald-400 font-bold">Match Score: {res.score}%</span>
                </div>
                <p className="text-[11px] text-slate-300">Evidence: {res.evidence}</p>
                <p className="text-[10px] text-slate-400">Entities: {res.relatedEntities.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3 & 4: Permission Inspector & Multi-Channel Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Permission Inspector */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/30 space-y-3">
            <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider">
              🛡️ HYBRID ABAC/RBAC PERMISSIONS INSPECTOR
            </h3>
            <div className="space-y-2">
              {policies.map((p, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-purple-300">Role: {p.role}</span>
                    <span className="text-slate-400">Scope: {p.scope}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">Allowed: {p.allowedActions.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-3">
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              🔔 MULTI-CHANNEL UNIFIED NOTIFICATION CENTER
            </h3>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-300">[{n.source}] {n.title}</span>
                    <span className="text-slate-400">{n.channels.join(" | ")}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
