export type DebuggerState = "RUNNING" | "PAUSED" | "STEPPING";
export type BreakpointType = "Event" | "Runtime" | "Workflow" | "AIR" | "AKG" | "Policy";

export interface DebugEvent {
  name: string;
  status: "COMPLETED" | "PAUSED" | "PENDING";
  timestamp: number;
}

export interface DebugTransaction {
  id: number;
  packageName: string;
  mutations: string[];
  timestamp: string;
}

// 🎛️ PROGRAM D1: KNOWLEDGE FLOW DEBUGGER SERVICE
export class PlatformDebugger {
  private static instance: PlatformDebugger;
  public state: DebuggerState = "RUNNING";
  public activeBreakpointType: BreakpointType = "Event";
  public activeBreakpointTarget: string = "simulation.completed";

  public timeline: DebugEvent[] = [
    { name: "simulation.started", status: "COMPLETED", timestamp: Date.now() - 5000 },
    { name: "mesh.generated", status: "COMPLETED", timestamp: Date.now() - 4000 },
    { name: "solver.executed", status: "COMPLETED", timestamp: Date.now() - 3000 },
    { name: "simulation.completed", status: "PAUSED", timestamp: Date.now() - 1000 },
  ];

  public transactions: DebugTransaction[] = [
    {
      id: 482,
      packageName: "openfoam",
      mutations: ["Created Mesh node", "Created BoundaryCondition node", "Created SimulationRun node"],
      timestamp: "12:43:22 UTC"
    },
    {
      id: 483,
      packageName: "openfoam",
      mutations: ["Linked Mesh -> SimulationRun", "Linked BoundaryCondition -> SimulationRun"],
      timestamp: "12:43:24 UTC"
    }
  ];

  private constructor() {}

  public static getInstance(): PlatformDebugger {
    if (!PlatformDebugger.instance) {
      PlatformDebugger.instance = new PlatformDebugger();
    }
    return PlatformDebugger.instance;
  }

  public setBreakpoint(type: BreakpointType, target: string): void {
    this.activeBreakpointType = type;
    this.activeBreakpointTarget = target;
    console.log(`[Debugger] Breakpoint set on [${type}] match targets: "${target}"`);
  }

  public triggerBreakpointHit(): void {
    this.state = "PAUSED";
    this.timeline = this.timeline.map(e => e.name === this.activeBreakpointTarget ? { ...e, status: "PAUSED" } : e);
    console.log(`[Debugger] Breakpoint HIT on event type: "${this.activeBreakpointTarget}"`);
  }

  public resumeExecution(): void {
    this.state = "RUNNING";
    this.timeline = this.timeline.map(e => e.name === this.activeBreakpointTarget ? { ...e, status: "COMPLETED" } : e);
    console.log(`[Debugger] Execution cycle resumed.`);
  }

  public stepEvent(): void {
    this.state = "STEPPING";
    console.log(`[Debugger] Command dispatched: Step Event.`);
  }

  public stepRuntime(): void {
    this.state = "STEPPING";
    console.log(`[Debugger] Command dispatched: Step Runtime.`);
  }

  public stepCommit(): void {
    this.state = "STEPPING";
    console.log(`[Debugger] Command dispatched: Step Commit.`);
  }
}

export const activePlatformDebugger = PlatformDebugger.getInstance();
