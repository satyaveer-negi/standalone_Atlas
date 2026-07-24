import type { SemanticKnowledgeGraph } from "../../../engine/scene/SemanticKnowledgeGraph";
import type { Entity } from "../../../engine/entity/Entity";
import type { NavigationResult } from "./NavigationResult";

export interface RankedSearchResult {
  entity: Entity;
  score: number;
  semanticMatch: number;
  graphDistance: number;
}

export class SemanticSearchEngine {
  search(query: string, graph: SemanticKnowledgeGraph): NavigationResult {
    const startTime = Date.now();
    const all = graph.getAllEntities();
    const matches: RankedSearchResult[] = [];

    all.forEach((e) => {
      const isNameMatch = e.name.toLowerCase().includes(query.toLowerCase());
      const isTypeMatch = e.type.toLowerCase().includes(query.toLowerCase());

      if (isNameMatch || isTypeMatch) {
        const semanticScore = isNameMatch ? 0.9 : 0.6;
        const distanceScore = 0.8;
        const totalScore = semanticScore * 0.6 + distanceScore * 0.4;

        matches.push({
          entity: e,
          score: totalScore,
          semanticMatch: semanticScore,
          graphDistance: 1,
        });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    const sortedEntities = matches.map((m) => m.entity);

    return {
      navigationMode: "Search",
      visitedEntities: sortedEntities,
      highlightedPathEntityIds: sortedEntities.map((e) => e.id),
      metadata: {
        executionTimeMs: Date.now() - startTime,
        totalMatches: sortedEntities.length,
        queryPrompt: query,
      },
    };
  }
}
