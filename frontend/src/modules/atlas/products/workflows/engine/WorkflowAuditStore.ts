export interface StepAuditLog {
  id: string;
  stepId: string;
  stepName: string;
  category: string;
  runtimeMs: number;
  status: "PASSED" | "FAILED";
  timestamp: number;
}

export const DEMO_AUDIT_LOGS: StepAuditLog[] = [
  {
    id: "log-1",
    stepId: "step-govern",
    stepName: "Govern Policy Check",
    category: "ACTION",
    runtimeMs: 42,
    status: "PASSED",
    timestamp: Date.now() - 30000,
  },
  {
    id: "log-2",
    stepId: "step-simulate",
    stepName: "Simulate Risk Predictor",
    category: "PARALLEL",
    runtimeMs: 88,
    status: "PASSED",
    timestamp: Date.now() - 28000,
  },
  {
    id: "log-3",
    stepId: "step-ai-review",
    stepName: "AI Design Review",
    category: "ACTION",
    runtimeMs: 120,
    status: "PASSED",
    timestamp: Date.now() - 25000,
  },
];
