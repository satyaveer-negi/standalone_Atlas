import type { Analyzer } from "../Analyzer";
import type { SemanticKnowledgeGraph } from "../../scene/SemanticKnowledgeGraph";

export class DependencyAnalyzer implements Analyzer {
  id = "analyzer-dependency";
  name = "Dependency & Coupling Analyzer";

  analyze(graph: SemanticKnowledgeGraph): void {
    const entities = graph.getAllEntities();
    entities.forEach((ent) => {
      const depCount = ent.relationships.length;
      let risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
      if (depCount > 5) risk = "CRITICAL";
      else if (depCount > 3) risk = "HIGH";
      else if (depCount > 1) risk = "MEDIUM";

      ent.diagnostics = {
        ...ent.diagnostics,
        couplingRisk: risk,
      };
    });
  }
}
