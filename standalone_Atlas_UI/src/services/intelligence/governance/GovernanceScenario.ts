export interface WorkflowStage {
  id: string;
  stage: string;
  approverRole: string;
  expectedDurationDays: number;
}

export type GovernanceScenarioStatus = "Draft" | "Simulated" | "Archived";

export interface GovernanceScenario {
  scenarioId: string;
  name: string;
  description: string;
  workflowStages: WorkflowStage[];
  simulatedThroughput: number;
  simulatedApprovalDelayDays: number;
  riskIndex: number;
  scenarioStatus: GovernanceScenarioStatus;
}
