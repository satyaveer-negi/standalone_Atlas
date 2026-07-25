export interface ExecutionContext {
  taskId: string;
  workflowId: string;
  goalPrompt: string;
  user: string;
  organization: string;
  timestamp: string;
  permissions: string[];
}

export function createExecutionContext(goal: string): ExecutionContext {
  return {
    taskId: `task-exec-${Date.now()}`,
    workflowId: `flow-${Date.now()}`,
    goalPrompt: goal,
    user: "Platform Operator",
    organization: "Atlas Autonomous Org",
    timestamp: new Date().toISOString(),
    permissions: ["ExecuteCFD", "PublishMetrics", "StateSync"]
  };
}
