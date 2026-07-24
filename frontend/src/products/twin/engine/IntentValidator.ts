import type { IntentExecutionPlan } from "./IntentPlanner";

export class IntentValidator {
  validate(plan: IntentExecutionPlan): boolean {
    return plan.goal.latencyBoundaryMs > 0 && plan.goal.maxCostImpactUsd > 0;
  }
}
