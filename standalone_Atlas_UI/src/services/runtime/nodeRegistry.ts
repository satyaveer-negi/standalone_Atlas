export type NodeState = "ONLINE" | "STANDBY" | "OFFLINE";

export interface NodeDescriptor {
  nodeId: string;
  name: string;
  endpoint: string;
  version: string;
  capabilities: string[];
  state: NodeState;
  latency: number;
  currentLoad: number;
  maxCapacity: number;
  lastHeartbeat: string;
  healthScore: number;
}

// 🖥️ PROGRAM II.3: NODE REGISTRY (MONITORS LOAD & HEALTH)
export class NodeRegistry {
  private nodes = new Map<string, NodeDescriptor>();

  constructor() {
    this.seedNodes();
  }

  private seedNodes() {
    this.nodes.set("node-local", {
      nodeId: "node-local",
      name: "UKOP Local Master Node",
      endpoint: "127.0.0.1:8001",
      version: "1.2.0",
      capabilities: ["RegistryQuery", "TaskExecution", "LocalStateStore"],
      state: "ONLINE",
      latency: 2,
      currentLoad: 12,
      maxCapacity: 100,
      lastHeartbeat: "Just now",
      healthScore: 99
    });

    this.nodes.set("node-alpha", {
      nodeId: "node-alpha",
      name: "UKOP Remote Node Alpha",
      endpoint: "10.0.0.84:8002",
      version: "1.2.0",
      capabilities: ["MeshSolver", "RemoteCompute"],
      state: "ONLINE",
      latency: 48,
      currentLoad: 45,
      maxCapacity: 150,
      lastHeartbeat: "3 seconds ago",
      healthScore: 95
    });

    this.nodes.set("node-beta", {
      nodeId: "node-beta",
      name: "UKOP Remote Node Beta",
      endpoint: "10.0.0.102:8002",
      version: "1.1.8",
      capabilities: ["ThemeAnalysis", "LitScanner"],
      state: "STANDBY",
      latency: 84,
      currentLoad: 0,
      maxCapacity: 80,
      lastHeartbeat: "12 seconds ago",
      healthScore: 88
    });
  }

  public getNodesList(): NodeDescriptor[] {
    return Array.from(this.nodes.values());
  }

  public registerNode(node: NodeDescriptor): void {
    console.log(`[Node Registry] Registering node: "${node.nodeId}"`);
    this.nodes.set(node.nodeId, node);
  }

  public getLeastLoadedNode(capability: string): NodeDescriptor | undefined {
    return Array.from(this.nodes.values())
      .filter(n => n.state === "ONLINE" && n.capabilities.includes(capability))
      .sort((a, b) => a.currentLoad - b.currentLoad)[0];
  }
}

export const activeNodeRegistry = new NodeRegistry();
