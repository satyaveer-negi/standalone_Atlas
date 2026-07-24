import type { SemanticKnowledgeGraph } from "../../../engine/scene/SemanticKnowledgeGraph";
import type { NavigationResult } from "./NavigationResult";

export interface ArchitecturalPerspective {
  id: string;
  name: string;
  description: string;
  includeTypes: string[];
}

export const PREDEFINED_PERSPECTIVES: ArchitecturalPerspective[] = [
  {
    id: "persp-clean-arch",
    name: "Clean Architecture View",
    description: "Filters UI components, Django ViewSets, Services, and DB tables.",
    includeTypes: ["file", "component", "api", "service", "database"],
  },
  {
    id: "persp-db-models",
    name: "Database Models & Schemas",
    description: "Highlights PostgreSQL tables, migrations, and serializers.",
    includeTypes: ["database", "table", "schema"],
  },
  {
    id: "persp-security",
    name: "Security & Authentication Layer",
    description: "Filters permission classes, token viewsets, and auth services.",
    includeTypes: ["auth", "security", "permission"],
  },
];

export class PerspectiveEngine {
  applyPerspective(perspective: ArchitecturalPerspective, graph: SemanticKnowledgeGraph): NavigationResult {
    const startTime = Date.now();
    const entities = graph.getAllEntities();

    const filtered = entities.filter((e) =>
      perspective.includeTypes.some((t) => e.type.toLowerCase().includes(t) || e.name.toLowerCase().includes(t))
    );

    return {
      navigationMode: "Perspective",
      visitedEntities: filtered,
      highlightedPathEntityIds: filtered.map((e) => e.id),
      metadata: {
        executionTimeMs: Date.now() - startTime,
        totalMatches: filtered.length,
        queryPrompt: `Perspective: ${perspective.name}`,
      },
    };
  }
}
