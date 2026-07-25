import { TaskNode } from "../../graph/TaskNode";
import { TaskEdge } from "../../graph/TaskEdge";
import { ExecutionContext } from "../../coordinator/ExecutionContext";

export class TestAssetsRegistry {
  public getSampleLinearNodes(): TaskNode[] {
    return [
      {
        id: "task-mesh",
        objective: "Verify aerodynamics mesh constraints compliance",
        status: "Created",
        inputs: [],
        outputs: ["meshOutput"]
      },
      {
        id: "task-solve",
        objective: "Execute structural loads calculations",
        status: "Created",
        inputs: ["meshOutput"],
        outputs: ["solvedOutput"]
      }
    ];
  }

  public getSampleLinearEdges(): TaskEdge[] {
    return [
      {
        fromNodeId: "task-mesh",
        toNodeId: "task-solve",
        variableMappings: [{ fromVar: "meshOutput", toVar: "meshOutput" }]
      }
    ];
  }

  public getSampleCycleNodes(): TaskNode[] {
    return [
      { id: "node-a", objective: "First node in loop", status: "Created", inputs: ["var-c"], outputs: ["var-a"] },
      { id: "node-b", objective: "Second node in loop", status: "Created", inputs: ["var-a"], outputs: ["var-b"] },
      { id: "node-c", objective: "Third node in loop", status: "Created", inputs: ["var-b"], outputs: ["var-c"] }
    ];
  }

  public getSampleCycleEdges(): TaskEdge[] {
    return [
      { fromNodeId: "node-a", toNodeId: "node-b", variableMappings: [{ fromVar: "var-a", toVar: "var-a" }] },
      { fromNodeId: "node-b", toNodeId: "node-c", variableMappings: [{ fromVar: "var-b", toVar: "var-b" }] },
      { fromNodeId: "node-c", toNodeId: "node-a", variableMappings: [{ fromVar: "var-c", toVar: "var-c" }] }
    ];
  }

  public getSampleContext(goalPrompt: string): ExecutionContext {
    return {
      taskId: "test-verif-task-id",
      workflowId: "test-verif-workflow-id",
      goalPrompt,
      user: "Verifier Engine",
      organization: "EIOS Test Organization",
      timestamp: new Date().toISOString(),
      permissions: ["ValidateAll", "OverrideGovernance"]
    };
  }
}

export const activeTestAssetsRegistry = new TestAssetsRegistry();
