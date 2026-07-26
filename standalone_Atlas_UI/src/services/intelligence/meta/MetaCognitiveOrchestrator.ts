import { MetaCognitiveAssessment, CognitiveComponentType } from "./MetaCognitiveAssessment";
import { activeMetaCognitiveEvaluator } from "./MetaCognitiveEvaluator";

export class MetaCognitiveOrchestrator {
  public runCognitiveAudit(): MetaCognitiveAssessment[] {
    const components: CognitiveComponentType[] = [
      "Planning",
      "Reasoning",
      "Retrieval",
      "Verification",
      "Governance",
      "Learning",
      "KnowledgeSynthesis",
      "Evolution"
    ];

    return components.map(c => activeMetaCognitiveEvaluator.evaluateComponent(c));
  }
}

export const activeMetaCognitiveOrchestrator = new MetaCognitiveOrchestrator();
