import { createExecutionContext } from "./ExecutionContext";
import { GoalParser } from "./GoalParser";
import { TaskPlanner } from "./Planner";
import { TaskScheduler } from "./Scheduler";
import { ReportBuilder } from "./ReportBuilder";
import { activeSharedTaskGraph } from "../graph/SharedTaskGraph";
import { activeVariableStore } from "../graph/VariableStore";

export class CoordinatorAgent {
  private parser = new GoalParser();
  private planner = new TaskPlanner();
  private scheduler = new TaskScheduler();
  private reportBuilder = new ReportBuilder();

  public async orchestrate(goalPrompt: string): Promise<string> {
    // 1. Initialize Context
    const context = createExecutionContext(goalPrompt);
    
    // Clear dynamic blackboard store for fresh run
    activeVariableStore.clear();

    // 2. Parse Sub-Goals
    const subGoals = this.parser.parseGoal(context);

    // 3. Populate and Link DAG Nodes/Edges
    this.planner.plan(subGoals, activeSharedTaskGraph);

    // 4. Execute Scheduler loop
    await this.scheduler.executeScheduler(subGoals, activeSharedTaskGraph);

    // 5. Compile Final Summary
    return this.reportBuilder.compileReport(context, activeSharedTaskGraph);
  }
}

export const activeCoordinatorAgent = new CoordinatorAgent();
