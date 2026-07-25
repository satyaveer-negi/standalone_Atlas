import { WorkflowNode } from "./WorkflowNode";
import { WorkflowConnection } from "./WorkflowConnection";

export class WorkflowGraph {
  public nodes: WorkflowNode[] = [];
  public connections: WorkflowConnection[] = [];

  public addNode(node: WorkflowNode): void {
    this.nodes.push(node);
  }

  public addConnection(conn: WorkflowConnection): void {
    this.connections.push(conn);
  }

  public sortTopologically(): WorkflowNode[] {
    // Basic topological sort implementation based on node dependencies
    const sorted: WorkflowNode[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (nodeId: string) => {
      if (visiting.has(nodeId)) {
        throw new Error(`[WorkflowGraph] Cyclic dependency detected at node: ${nodeId}`);
      }
      if (!visited.has(nodeId)) {
        visiting.add(nodeId);
        // Find inputs connection nodes
        const parentNodeIds = this.connections
          .filter(c => c.targetNodeId === nodeId)
          .map(c => c.sourceNodeId);

        parentNodeIds.forEach(pId => visit(pId));
        visiting.delete(nodeId);
        visited.add(nodeId);
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) sorted.push(node);
      }
    };

    this.nodes.forEach(n => visit(n.id));
    return sorted;
  }
}
