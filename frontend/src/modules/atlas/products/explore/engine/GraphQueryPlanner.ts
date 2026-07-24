export interface TraversalPlan {
  queryId: string;
  entryEntityId: string;
  targetEntityId?: string;
  maxDepth: number;
  estimatedCost: number;
}

export class GraphQueryPlanner {
  createPlan(entryEntityId: string, targetEntityId?: string, maxDepth: number = 3): TraversalPlan {
    const cost = targetEntityId ? 15 : 5;
    return {
      queryId: `plan-${Date.now()}`,
      entryEntityId,
      targetEntityId,
      maxDepth,
      estimatedCost: cost,
    };
  }
}
