export type WorkflowState = "Draft" | "Queued" | "Running" | "Paused" | "Completed" | "Failed" | "Cancelled";
export type StepState = "Pending" | "Ready" | "Running" | "Completed" | "Skipped" | "Retrying" | "Failed";

export interface WorkflowStep {
  stepId: string;
  name: string;
  capability: string;
  state: StepState;
  assignedNode?: string;
  elapsedTimeMs?: number;
  retries: number;
}

// 🕸️ FROZEN WORKFLOW DEFINITION (DESIGN-TIME SCHEMA)
export interface WorkflowDefinition {
  workflowId: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  steps: WorkflowStep[];
  dependencies: { from: string; to: string }[];
}

// 🕸️ WORKFLOW INSTANCE (RUN-TIME STATE)
export interface WorkflowInstance {
  instanceId: string;
  definitionId: string;
  state: WorkflowState;
  startTime?: number;
  endTime?: number;
  steps: WorkflowStep[];
  activeNodeCount: number;
}
