import type { SemanticKnowledgeGraph } from "./SemanticKnowledgeGraph";
import { GraphQueryEngine } from "./GraphQueryEngine";

export interface SceneArtifactNode {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  metadata: Record<string, any>;
}

export interface SceneArtifactEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
}

export interface SceneDescriptor {
  nodes: SceneArtifactNode[];
  edges: SceneArtifactEdge[];
}

export class SceneBuilder {
  buildSceneFromGraph(graph: SemanticKnowledgeGraph): SceneDescriptor {
    const queryEngine = new GraphQueryEngine(graph);
    const entities = graph.getAllEntities();

    const nodes: SceneArtifactNode[] = entities.map((ent) => ({
      id: ent.id,
      name: ent.name,
      type: ent.type,
      position: ent.position,
      metadata: {
        diagnostics: ent.diagnostics,
        runtime: ent.runtime,
        ...ent.metadata,
      },
    }));

    const edges: SceneArtifactEdge[] = [];
    entities.forEach((ent) => {
      ent.relationships.forEach((rel, idx) => {
        edges.push({
          id: `edge-${ent.id}-${rel.targetId}-${idx}`,
          sourceId: ent.id,
          targetId: rel.targetId,
          relation: rel.relation,
        });
      });
    });

    return { nodes, edges };
  }
}
