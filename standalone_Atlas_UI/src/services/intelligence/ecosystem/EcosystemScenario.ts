export type EcosystemScenarioStatus = "Draft" | "Simulated" | "Archived";

export type DisruptionSeverity = "None" | "Minor" | "Major";

export interface EcosystemScenario {
  scenarioId: string;
  name: string;
  description: string;
  simulatedPartnersCount: number;
  projectedThroughputDelta: number; // percentage
  coordinationRiskIndex: number; // out of 100
  expectedLatencyReductionDays: number;
  estimatedCollaborationCost: number;
  disruptionSeverity: DisruptionSeverity;
  scenarioStatus: EcosystemScenarioStatus;
}
