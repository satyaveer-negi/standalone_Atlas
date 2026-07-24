import type { SemanticKnowledgeGraph } from "../scene/SemanticKnowledgeGraph";

export interface Analyzer {
  id: string;
  name: string;
  analyze(graph: SemanticKnowledgeGraph): void;
}
