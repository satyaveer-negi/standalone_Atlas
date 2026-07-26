import { WorkflowCandidate } from "./WorkflowCandidate";
import { EngineeringIntent } from "../intent/EngineeringIntent";

export interface EvaluationReport {
  feasible: boolean;
  violations: string[];
}

export class WorkflowEvaluator {
  public evaluate(candidate: WorkflowCandidate, intent: EngineeringIntent): EvaluationReport {
    const violations: string[] = [];

    // Complete checking safety limits
    intent.constraints.forEach(c => {
      if (c.category === "Safety" && candidate.estimatedRiskScore > 9) {
        violations.push(`Constraint violation: Candidate risk ${candidate.estimatedRiskScore} exceeds safety ceiling limits.`);
      }
    });

    return {
      feasible: violations.length === 0,
      violations
    };
  }
}

export const activeWorkflowEvaluator = new WorkflowEvaluator();
