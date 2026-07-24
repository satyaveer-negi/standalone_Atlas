import { SemanticKnowledgeGraph } from "../../../engine/scene/SemanticKnowledgeGraph";

export class SandboxSession {
  readonly sessionId: string;
  readonly clonedGraph: SemanticKnowledgeGraph;
  readonly timestamp: number;

  constructor(liveGraph: SemanticKnowledgeGraph) {
    this.sessionId = `sim-session-${Date.now()}`;
    this.timestamp = Date.now();
    this.clonedGraph = this.cloneGraph(liveGraph);
  }

  private cloneGraph(source: SemanticKnowledgeGraph): SemanticKnowledgeGraph {
    const copy = new SemanticKnowledgeGraph();
    source.getAllEntities().forEach((e) => {
      copy.addEntity({ ...e, relationships: [...e.relationships] });
    });
    return copy;
  }
}
