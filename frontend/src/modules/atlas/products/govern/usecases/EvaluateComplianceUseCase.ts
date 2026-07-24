import type { PolicyService } from "../../../services/PolicyService";
import type { SemanticKnowledgeGraph } from "../../../engine/scene/SemanticKnowledgeGraph";

export class EvaluateComplianceUseCase {
  private policyService: PolicyService;

  constructor(policyService: PolicyService) {
    this.policyService = policyService;
  }

  execute(graph: SemanticKnowledgeGraph) {
    this.policyService.evaluateGraph(graph);
    return {
      scorecard: this.policyService.getScorecard(),
      violations: this.policyService.getViolations(),
    };
  }
}
