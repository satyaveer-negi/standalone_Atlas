export interface ExecutionTrace {
  id: string;
  packageName: string;
  durationMs: number;
  eventsCount: number;
  transactionsCount: number;
  status: "PASSED" | "FAILED" | "PAUSED";
  createdAt: string;
  events: string[];
}

// ⏳ PROGRAM H1: EXECUTION TRACE STORE
export class ExecutionTraceStore {
  private traces = new Map<string, ExecutionTrace>();

  constructor() {
    this.seedTraces();
  }

  private seedTraces() {
    this.traces.set("tr-101", {
      id: "tr-101",
      packageName: "openfoam",
      durationMs: 1440,
      eventsCount: 4,
      transactionsCount: 2,
      status: "PASSED",
      createdAt: "2026-07-24 14:15 UTC",
      events: ["simulation.started", "mesh.generated", "solver.executed", "simulation.completed"]
    });

    this.traces.set("tr-102", {
      id: "tr-102",
      packageName: "literature",
      durationMs: 820,
      eventsCount: 2,
      transactionsCount: 1,
      status: "PASSED",
      createdAt: "2026-07-24 15:30 UTC",
      events: ["manuscript.loaded", "themes.analyzed"]
    });
  }

  public getTracesList(): ExecutionTrace[] {
    return Array.from(this.traces.values());
  }

  public deleteTrace(id: string): void {
    this.traces.delete(id);
    console.log(`[Trace Store] Deleted execution trace: "${id}"`);
  }

  public exportTrace(id: string): string {
    const trace = this.traces.get(id);
    if (!trace) return "";
    console.log(`[Trace Store] Exporting trace: "${id}"`);
    return JSON.stringify(trace, null, 2);
  }
}

export const activeExecutionTraceStore = new ExecutionTraceStore();
