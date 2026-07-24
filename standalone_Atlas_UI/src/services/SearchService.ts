import { SemanticSearchEngine } from "../products/explore/engine/SemanticSearchEngine";
import type { SemanticKnowledgeGraph } from "../engine/scene/SemanticKnowledgeGraph";

export class SearchService {
  private searchEngine: SemanticSearchEngine;

  constructor() {
    this.searchEngine = new SemanticSearchEngine();
  }

  executeSearch(query: string, graph: SemanticKnowledgeGraph) {
    return this.searchEngine.search(query, graph);
  }
}
