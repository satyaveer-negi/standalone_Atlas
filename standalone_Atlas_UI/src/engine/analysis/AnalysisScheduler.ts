import type { Analyzer } from "./Analyzer";
import type { SemanticKnowledgeGraph } from "../scene/SemanticKnowledgeGraph";

export class AnalysisScheduler {
  private analyzers: Map<string, Analyzer> = new Map();

  registerAnalyzer(analyzer: Analyzer) {
    this.analyzers.set(analyzer.id, analyzer);
  }

  runAll(graph: SemanticKnowledgeGraph): void {
    this.analyzers.forEach((analyzer) => {
      try {
        analyzer.analyze(graph);
      } catch (err) {
        console.error(`[AnalysisScheduler] Error running analyzer ${analyzer.id}:`, err);
      }
    });
  }
}
