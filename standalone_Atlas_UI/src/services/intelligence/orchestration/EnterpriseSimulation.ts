export type EnterpriseSimulationStatus = "Draft" | "Simulated" | "Archived";

export type ConstitutionalStressLevel = "Low" | "Medium" | "High";

export interface EnterpriseSimulation {
  simulationId: string;
  name: string;
  description: string;
  simulatedMaturityGain: number; // percentage
  coherenceImprovement: number; // percentage
  estimatedTransitionTimeMonths: number;
  coordinationRiskIndex: number; // out of 100
  projectedSavings: number;
  constitutionalStressLevel: ConstitutionalStressLevel;
  simulationStatus: EnterpriseSimulationStatus;
}
