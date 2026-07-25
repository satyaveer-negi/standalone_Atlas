import { ParsedSubGoal } from "./GoalParser";
import { SharedTaskGraph } from "../graph/SharedTaskGraph";
import { TaskNode } from "../graph/TaskNode";
import { TaskEdge } from "../graph/TaskEdge";

export class TaskPlanner {
  public plan(subGoals: ParsedSubGoal[], graph: SharedTaskGraph): void {
    graph.clear();

    const nodesMap = new Map<string, TaskNode>();

    // 1. Generate Task Nodes
    subGoals.forEach(sg => {
      const node: TaskNode = {
        id: sg.id,
        objective: sg.objective,
        status: "Planned",
        inputs: sg.inputs,
        outputs: sg.outputs
      };
      graph.addNode(node);
      nodesMap.set(node.id, node);
    });

    // 2. Generate Dependency Edges based on shared variables inputs/outputs
    for (let i = 0; i < subGoals.length; i++) {
      const current = subGoals[i];
      for (let j = 0; j < subGoals.length; j++) {
        if (i === j) continue;
        const target = subGoals[j];

        // If target requires inputs that are produced by current, link them
        const matchingVars = target.inputs.filter(v => current.outputs.includes(v));
        if (matchingVars.length > 0) {
          const edge: TaskEdge = {
            fromNodeId: current.id,
            toNodeId: target.id,
            variableMappings: matchingVars.map(v => ({ fromVar: v, toVar: v }))
          };
          graph.addEdge(edge);
        }
      }
    }

    // 3. Execute validation check
    graph.validate();
  }
}
