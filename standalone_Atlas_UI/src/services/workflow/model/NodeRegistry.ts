import { WorkflowNode } from "./WorkflowNode";

export class NodeRegistry {
  private nodes = new Map<string, WorkflowNode>();

  public registerNode(node: WorkflowNode): void {
    this.nodes.set(node.id, node);
  }

  public getNodesByCategory(category: string): WorkflowNode[] {
    return Array.from(this.nodes.values()).filter(n => n.category === category);
  }

  public getNodes(): WorkflowNode[] {
    return Array.from(this.nodes.values());
  }

  public clear(): void {
    this.nodes.clear();
  }
}

export const activeNodeRegistry = new NodeRegistry();
