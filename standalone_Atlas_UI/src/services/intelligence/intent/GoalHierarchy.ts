export interface GoalNode {
  id: string;
  label: string;
  childrenIds: string[];
}

export class GoalHierarchy {
  private nodes = new Map<string, GoalNode>();

  public addNode(node: GoalNode): void {
    this.nodes.set(node.id, node);
  }

  public getNodes(): GoalNode[] {
    return Array.from(this.nodes.values());
  }

  public clear(): void {
    this.nodes.clear();
  }
}

export const activeGoalHierarchy = new GoalHierarchy();
