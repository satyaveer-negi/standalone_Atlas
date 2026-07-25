import { NodeDescriptor, activeNodeRegistry } from "./nodeRegistry";

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

// 🛡️ Runtime Scheduler Controller
export class RuntimeScheduler {
  private currentPolicy: SchedulerPolicy = new LeastLoadedPolicy();

  public getPolicyName(): string {
    return this.currentPolicy.name;
  }

  public setPolicy(policy: SchedulerPolicy): void {
    this.currentPolicy = policy;
    console.log(`[Scheduler] Switched scheduling policy to: "${policy.name}"`);
  }

  public scheduleTask(capability: string): NodeDescriptor {
    const nodes = activeNodeRegistry.getNodesList();
    const candidateNodes = nodes.filter(n => n.capabilities.includes(capability));

    if (candidateNodes.length === 0) {
      throw new Error(`[Scheduler] No node supports capability: "${capability}"`);
    }

    const selected = this.currentPolicy.select(candidateNodes);
    console.log(`[Scheduler] Selected node "${selected.name}" via policy "${this.currentPolicy.name}"`);
    return selected;
  }
}

export const activeRuntimeScheduler = new RuntimeScheduler();
