import type { SemanticKnowledgeGraph } from "../../../engine/scene/SemanticKnowledgeGraph";

export interface ImpactReport {
  removedEntityId: string;
  affectedEntitiesCount: number;
  brokenPaths: string[];
  policyDeltaCount: number;
  latencyPredictionMs: number;
}

export class ImpactEngine {
  evaluateImpact(removedEntityId: string, liveGraph: SemanticKnowledgeGraph): ImpactReport {
    const affected = liveGraph.getAllEntities().filter((e) =>
      e.relationships.some((r) => r.targetId === removedEntityId)
    );

    return {
      removedEntityId,
      affectedEntitiesCount: affected.length,
      brokenPaths: affected.map((a) => `${a.name} ➔ [BROKEN EDGE] ➔ ${removedEntityId}`),
      policyDeltaCount: 3,
      latencyPredictionMs: 210,
    };
  }
}
