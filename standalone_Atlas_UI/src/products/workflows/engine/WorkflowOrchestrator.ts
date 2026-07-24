import type { WorkflowDefinition, WorkflowInstance } from "./DeclarativeWorkflow";

export class WorkflowOrchestrator {
  createInstance(def: WorkflowDefinition): WorkflowInstance {
    // Find DAG root nodes (nodes with 0 dependencies)
    const rootNodes = def.dagNodes.filter((n) => n.dependencies.length === 0);
    return {
      instanceId: `wf-inst-${Date.now()}`,
      workflowId: def.id,
      status: "RUNNING",
      startedAt: Date.now(),
      activeNodeIds: rootNodes.map((n) => n.id),
    };
  }

  executeDAGStep(def: WorkflowDefinition, instance: WorkflowInstance, nodeId: string): WorkflowInstance {
    const targetNode = def.dagNodes.find((n) => n.id === nodeId);
    if (!targetNode) return instance;

    if (targetNode.category === "APPROVAL") {
      instance.status = "PAUSED_APPROVAL";
      targetNode.status = "WAITING_APPROVAL";
    } else {
      targetNode.status = "PASSED";
    }

    return { ...instance };
  }
}
