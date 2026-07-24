export interface ExecutionStep {
  stepNumber: number;
  title: string;
  skillId?: string;
  status: "PENDING" | "EXECUTING" | "COMPLETED";
}

export interface ExecutionPlan {
  planId: string;
  intent: string;
  steps: ExecutionStep[];
}
