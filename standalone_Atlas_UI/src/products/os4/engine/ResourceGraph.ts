export interface ComputeResourceNode {
  id: string;
  name: string;
  type: "GPU_CLUSTER" | "CPU_NODE" | "CLOUD_INSTANCE" | "LICENSE_POOL";
  totalCapacity: number;
  availableCapacity: number;
  assignedJob?: string;
}

export class ResourceGraph {
  private nodes = new Map<string, ComputeResourceNode>();

  addResource(node: ComputeResourceNode): void {
    this.nodes.set(node.id, node);
  }

  allocateResource(nodeId: string, capacity: number, jobId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (node && node.availableCapacity >= capacity) {
      node.availableCapacity -= capacity;
      node.assignedJob = jobId;
      return true;
    }
    return false;
  }

  getResources(): ComputeResourceNode[] {
    return Array.from(this.nodes.values());
  }
}
