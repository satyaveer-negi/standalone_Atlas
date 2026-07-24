import type { SemanticKnowledgeGraph } from "../../../engine/scene/SemanticKnowledgeGraph";
import type { NavigationResult } from "./NavigationResult";

export class TraversalEngine {
  findShortestPath(sourceId: string, targetId: string, graph: SemanticKnowledgeGraph): NavigationResult {
    const startTime = Date.now();
    const sourceEnt = graph.getEntity(sourceId);
    const targetEnt = graph.getEntity(targetId);

    const visited = [sourceEnt, targetEnt].filter(Boolean) as any[];
    const pathIds = [sourceId, targetId];

    return {
      navigationMode: "ShortestPath",
      visitedEntities: visited,
      highlightedPathEntityIds: pathIds,
      metadata: {
        executionTimeMs: Date.now() - startTime,
        totalMatches: visited.length,
        queryPrompt: `Shortest path: ${sourceId} -> ${targetId}`,
      },
    };
  }
}
