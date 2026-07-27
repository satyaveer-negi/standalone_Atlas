export type OrganizationalScenarioStatus = "Draft" | "Simulated" | "Archived";

export interface OrganizationalScenario {
  scenarioId: string;
  name: string;
  description: string;
  simulatedTeamsCount: number;
  reportingLayers: number;
  estimatedOperatingCost: number;
  expectedExecutionVelocity: number;
  coordinationRiskIndex: number;
  simulatedApprovalDelayDays: number;
  scenarioStatus: OrganizationalScenarioStatus;
}
