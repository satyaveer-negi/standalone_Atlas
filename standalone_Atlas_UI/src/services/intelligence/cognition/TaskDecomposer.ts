import { EngineeringIntent } from "../intent/EngineeringIntent";

export interface TaskDecompositionNode {
  id: string;
  discipline: string;
  subgoalText: string;
  status: "Assigned" | "Completed";
}

export class TaskDecomposer {
  public decompose(intent: EngineeringIntent): TaskDecompositionNode[] {
    const nodes: TaskDecompositionNode[] = [];

    // Sub-tasks mapping
    nodes.push({
      id: "tsk-cfd-1",
      discipline: "CFD",
      subgoalText: `Perform fluid grid aerodynamics optimization matching ${intent.goal}`,
      status: "Assigned"
    });

    nodes.push({
      id: "tsk-power-1",
      discipline: "PowerSystems",
      subgoalText: "Verify battery state-of-charge operational voltage guidelines",
      status: "Assigned"
    });

    nodes.push({
      id: "tsk-safety-1",
      discipline: "Safety",
      subgoalText: "Evaluate safety limit thermal boundaries checks",
      status: "Assigned"
    });

    return nodes;
  }
}

export const activeTaskDecomposer = new TaskDecomposer();
