import type { SemanticKnowledgeGraph } from "./SemanticKnowledgeGraph";
import type { Entity } from "../entity/Entity";

export class FluentGraphQuery {
  private graph: SemanticKnowledgeGraph;
  private currentEntityIds: string[] = [];

  constructor(graph: SemanticKnowledgeGraph, startId?: string) {
    this.graph = graph;
    if (startId) {
      this.currentEntityIds = [startId];
    }
  }

  entity(id: string): FluentGraphQuery {
    return new FluentGraphQuery(this.graph, id);
  }

  neighbors(relationType?: string): FluentGraphQuery {
    const nextIds: string[] = [];
    for (const id of this.currentEntityIds) {
      const ent = this.graph.getEntity(id);
      if (ent) {
        for (const rel of ent.relationships) {
          if (!relationType || rel.relation === relationType) {
            nextIds.push(rel.targetId);
          }
        }
      }
    }
    const query = new FluentGraphQuery(this.graph);
    query.currentEntityIds = Array.from(new Set(nextIds));
    return query;
  }

  impact(): Entity[] {
    return this.currentEntityIds
      .map((id) => this.graph.getEntity(id))
      .filter((e): e is Entity => e !== undefined);
  }

  getEntities(): Entity[] {
    return this.impact();
  }
}

export class GraphQueryEngine {
  private graph: SemanticKnowledgeGraph;

  constructor(graph: SemanticKnowledgeGraph) {
    this.graph = graph;
  }

  query(): FluentGraphQuery {
    return new FluentGraphQuery(this.graph);
  }

  entity(id: string): FluentGraphQuery {
    return new FluentGraphQuery(this.graph, id);
  }
}
