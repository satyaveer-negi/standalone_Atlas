export type WorkflowStepCategory =
  | "ACTION"
  | "APPROVAL"
  | "DECISION"
  | "PARALLEL"
  | "CONDITION"
  | "NOTIFICATION";

export interface DAGStepNode {
  id: string;
  name: string;
  category: WorkflowStepCategory;
  productTarget?: "Govern" | "Simulate" | "AI" | "Studio" | "Observe";
  dependencies: string[]; // Node IDs executed before this step (DAG edges)
  status: "PENDING" | "RUNNING" | "PASSED" | "FAILED" | "WAITING_APPROVAL";
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  triggerEvent: string;
  dagNodes: DAGStepNode[];
}

export interface WorkflowInstance {
  instanceId: string;
  workflowId: string;
  status: "RUNNING" | "PAUSED_APPROVAL" | "COMPLETED" | "FAILED";
  startedAt: number;
  completedAt?: number;
  activeNodeIds: string[];
}
