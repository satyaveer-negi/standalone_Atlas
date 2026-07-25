import { WorkflowGraph } from "../model/WorkflowGraph";
import { EngineeringGoal } from "./GoalPlanner";

export class WorkflowGenerator {
  public generateWorkflowFromGoals(goals: EngineeringGoal[]): WorkflowGraph {
    const graph = new WorkflowGraph();
    
    goals.forEach((goal, index) => {
      const nodeId = `node-${index + 1}`;
      graph.addNode({
        id: nodeId,
        name: goal.description,
        category: goal.domain === "Simulation" ? "Simulation" : "Data",
        type: goal.domain === "Simulation" ? "SimulationNode" : "TwinNode",
        inputs: [{ name: "InputData", type: "DataFlow" }],
        outputs: [{ name: "OutputResult", type: "DataFlow" }],
        properties: {}
      });

      if (index > 0) {
        // Link consecutive nodes
        graph.addConnection({
          id: `conn-${index}`,
          sourceNodeId: `node-${index}`,
          sourcePortName: "OutputResult",
          targetNodeId: nodeId,
          targetPortName: "InputData"
        });
      }
    });

    return graph;
  }
}

export const activeWorkflowGenerator = new WorkflowGenerator();
