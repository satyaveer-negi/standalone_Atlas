import { useState } from "react";
import { DEMO_ONLINE_USERS } from "../engine/UserPresenceStore";
import { DEMO_REVIEW_THREADS } from "../engine/DesignReviewStore";
import { DEMO_BRANCHES, ArchitectureBranchEngine } from "../engine/ArchitectureBranchEngine";

export function CollaborationOverlay({ onClose }: { onClose: () => void }) {
  const branchEngine = new ArchitectureBranchEngine();
  const [selectedBranch, setSelectedBranch] = useState(DEMO_BRANCHES[0]);
  const [commentText, setCommentText] = useState("");
  const [threads, setThreads] = useState(DEMO_REVIEW_THREADS);

  const diff = branchEngine.computeSemanticDiff(selectedBranch.name);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const updated = [...threads];
    updated[0].comments.push({
      id: `c-${Date.now()}`,
      author: "You (Developer)",
      text: commentText,
      timestamp: Date.now(),
    });
    setThreads(updated);
    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-sky-500/40 bg-slate-950/95 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <h2 className="text-sm font-black text-sky-300 tracking-wider uppercase">
                ATLAS COLLABORATE — ENGINEERING OS REAL-TIME COLLABORATION
              </h2>
              <p className="text-[10px] text-slate-400">
                CRDT Command Stream Event Sourcing, Ephemeral Presence & Architecture Branch Merges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-sky-300 text-xs font-bold cursor-pointer transition-all"
          >
            ESC [X]
          </button>
        </div>

        {/* Region 1: Active Online People */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 space-y-3">
          <span className="text-xs font-bold text-sky-300 uppercase block">👥 ACTIVE ONLINE COLLABORATORS:</span>
          <div className="flex flex-wrap items-center gap-3">
            {DEMO_ONLINE_USERS.map((usr) => (
              <div key={usr.userId} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: usr.color }} />
                <span className="text-xs font-bold text-white">{usr.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold uppercase">{usr.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Region 2 & 3: Architecture Branching & Threaded Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Branches & Semantic Diffs */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/40 space-y-3">
            <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider">🌿 ARCHITECTURE BRANCHES</h3>
            <div className="space-y-2">
              {DEMO_BRANCHES.map((br) => (
                <div
                  key={br.id}
                  onClick={() => setSelectedBranch(br)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedBranch.id === br.id
                      ? "bg-purple-500/20 border-purple-400 shadow-md"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold text-white font-mono">{br.name}</span>
                  <span className="text-[10px] text-slate-400">{br.commandCount} commands</span>
                </div>
              ))}
            </div>

            {/* Semantic Graph Diff */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-purple-300 font-bold block uppercase">SEMANTIC GRAPH DIFF ({selectedBranch.name})</span>
              <div className="text-[11px] text-slate-300 space-y-0.5">
                <div>+ Added Services: <span className="font-bold text-emerald-400">{diff.addedServicesCount}</span></div>
                <div>~ Modified APIs: <span className="font-bold text-amber-300">{diff.modifiedApisCount}</span></div>
                <div>! Policy Deltas: <span className="font-bold text-purple-300">{diff.policyChangesCount}</span></div>
              </div>
            </div>
          </div>

          {/* Threaded Review Discussions */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-sky-500/30 space-y-3">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-wider">💬 THREADED DESIGN REVIEWS</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
              {threads[0].comments.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-sky-300">{c.author}</span>
                    <span>{new Date(c.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-200">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write review comment..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
              <button
                onClick={handleAddComment}
                className="px-3 py-1.5 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-300 text-xs font-bold hover:bg-sky-500/30 cursor-pointer"
              >
                POST
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
