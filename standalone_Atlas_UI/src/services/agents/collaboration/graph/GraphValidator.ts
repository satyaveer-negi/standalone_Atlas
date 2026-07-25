import { TaskNode } from "./TaskNode";
import { TaskEdge } from "./TaskEdge";

export class GraphValidator {
  public validateDAG(nodes: TaskNode[], edges: TaskEdge[]): boolean {
    // 1. Check for Cycles using DFS
    const adjacencyList = new Map<string, string[]>();
    nodes.forEach(n => adjacencyList.set(n.id, []));
    
    edges.forEach(e => {
      const list = adjacencyList.get(e.fromNodeId);
      if (list) {
        list.push(e.toNodeId);
      }
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adjacencyList.get(nodeId) ?? [];
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (hasCycle(node.id)) {
        console.warn(`[Graph Validator] Cycle detected starting at node "${node.id}"`);
        return false;
      }
    }

    console.log(`[Graph Validator] DAG Validation passed. Nodes: ${nodes.length}, Edges: ${edges.length}`);
    return true;
  }
}
