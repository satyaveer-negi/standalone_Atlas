import { NodeDescriptor, activeNodeRegistry } from "./nodeRegistry";

export interface SchedulingDecision {
  selectedNode: NodeDescriptor;
  selectedPolicy: string;
  score: number;
  reasoning: string;
  alternatives: string[];
  timestamp: string;
}

// 🖥️ PLUGGABLE SCHEDULER POLICY CONTRACT
export interface SchedulerPolicy {
  readonly name: string;
  score(node: NodeDescriptor): number;
  select(nodes: NodeDescriptor[]): NodeDescriptor;
}

// 📦 Least Loaded Selector Policy
export class LeastLoadedPolicy implements SchedulerPolicy {
  public readonly name = "Least Loaded Node Selection";

  public score(node: NodeDescriptor): number {
    return 100 - (node.currentLoad / node.maxCapacity) * 100;
  }

  public select(nodes: NodeDescriptor[]): NodeDescriptor {
    return nodes
      .filter(n => n.state === "ONLINE")
      .sort((a, b) => this.score(b) - this.score(a))[0];
  }
}

// ⚡ Lowest Latency Selector Policy
export class LowestLatencyPolicy implements SchedulerPolicy {
  public readonly name = "Lowest Latency Connection";

  public score(node: NodeDescriptor): number {
    return 100 - node.latency;
  }

  public select(nodes: NodeDescriptor[]): NodeDescriptor {
    return nodes
      .filter(n => n.state === "ONLINE")
      .sort((a, b) => this.score(b) - this.score(a))[0];
  }
}

// 🛡️ Runtime Scheduler Controller (REPORTS EXPLAINABLE SCHEDULING DECISONS)
export class RuntimeScheduler {
  private currentPolicy: SchedulerPolicy = new LeastLoadedPolicy();

  public getPolicyName(): string {
    return this.currentPolicy.name;
  }

  public setPolicy(policy: SchedulerPolicy): void {
    this.currentPolicy = policy;
    console.log(`[Scheduler] Switched scheduling policy to: "${policy.name}"`);
  }

  public scheduleTask(capability: string): SchedulingDecision {
    const nodes = activeNodeRegistry.getNodesList();
    const candidateNodes = nodes.filter(n => n.capabilities.includes(capability));

    if (candidateNodes.length === 0) {
      throw new Error(`[Scheduler] No node supports capability: "${capability}"`);
    }

    const selected = this.currentPolicy.select(candidateNodes);
    const score = this.currentPolicy.score(selected);
    const alternatives = candidateNodes
      .filter(n => n.nodeId !== selected.nodeId)
      .map(n => `${n.name} (Score: ${Math.floor(this.currentPolicy.score(n))})`);

    const decision: SchedulingDecision = {
      selectedNode: selected,
      selectedPolicy: this.currentPolicy.name,
      score: Math.floor(score),
      reasoning: `Selected "${selected.name}" due to highest capability compliance match under ${this.currentPolicy.name}.`,
      alternatives,
      timestamp: new Date().toLocaleTimeString()
    };

    console.log(`[Scheduler] Decision made: selected "${selected.name}"`);
    return decision;
  }
}

export const activeRuntimeScheduler = new RuntimeScheduler();
