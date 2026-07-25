export interface EngineeringGoal {
  id: string;
  description: string;
  domain: string;
}

export class GoalPlanner {
  public parseGoal(prompt: string): EngineeringGoal[] {
    console.log(`[Goal Planner] Decomposing prompt goal: "${prompt}"`);
    return [
      { id: "goal-1", description: "Fetch Grid Load Parameters", domain: "Electrical" },
      { id: "goal-2", description: "Simulate Power Outflow", domain: "Simulation" },
      { id: "goal-3", description: "Audit Battery Charge SoC Constraints", domain: "Verification" }
    ];
  }
}

export const activeGoalPlanner = new GoalPlanner();
