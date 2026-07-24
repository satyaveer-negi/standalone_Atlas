import type { Entity } from "../../../engine/entity/Entity";

export interface NavigationResult {
  navigationMode: "Search" | "ShortestPath" | "Dependencies" | "Impact" | "Perspective" | "Mission";
  visitedEntities: Entity[];
  highlightedPathEntityIds: string[];
  metadata: {
    executionTimeMs: number;
    totalMatches: number;
    queryPrompt?: string;
  };
}
