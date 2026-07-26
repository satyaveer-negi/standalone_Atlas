export interface ExecutionIntent {
  intentId: string;
  actionId: string;
  executionParameters: Record<string, any>;
  timeoutMs: number;
  retriesAllowed: number;
  rollbackTriggerConditions: string[];
  verificationCriteria: string[];
}
