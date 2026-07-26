import { PlanningCandidate } from "./PlanGenerator";
import { EngineeringIntent } from "../intent/EngineeringIntent";

export interface EvaluationReport {
  feasible: boolean;
  violations: string[];
}

export class WorkflowEvaluator {
  public evaluate(candidate: PlanningCandidate, intent: EngineeringIntent): EvaluationReport {
    const violations: string[] = [];

    // Operational limits verification checks
    intent.constraints.forEach(c => {
      if (c.category === "Safety" && candidate.complexityScore > 9) {
        violations.push(`Constraint violation: Candidate complexity ${candidate.complexityScore} exceeds safe ceiling limit.`);
      }
    });

    return {
      feasible: violations.length === 0,
      violations
    };
  }
}

export const activeWorkflowEvaluator = new WorkflowEvaluator();
