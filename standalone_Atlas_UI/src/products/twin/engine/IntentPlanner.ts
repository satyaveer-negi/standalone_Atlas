import type { ParsedIntentGoal } from "./IntentParser";

export interface IntentExecutionPlan {
  goal: ParsedIntentGoal;
  recommendedOptimization: string;
  handOffDecisionPackageId: string;
}

export class IntentPlanner {
  createPlan(parsed: ParsedIntentGoal): IntentExecutionPlan {
    return {
      goal: parsed,
      recommendedOptimization: "Add db_index=True & Provision PostgreSQL Read Replica",
      handOffDecisionPackageId: `pkg-dec-${Date.now()}`,
    };
  }
}
