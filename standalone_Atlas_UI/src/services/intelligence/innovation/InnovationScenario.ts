export type InnovationScenarioStatus = "Draft" | "Simulated" | "Archived";

export type TechnicalUncertaintyLevel = "Low" | "Medium" | "High";

export interface InnovationScenario {
  scenarioId: string;
  name: string;
  description: string;
  simulatedAdoptionRate: number; // percentage
  projectedMaturityGainMonths: number;
  coordinationRiskIndex: number; // out of 100
  estimatedInvestmentCost: number;
  technicalUncertainty: TechnicalUncertaintyLevel;
  scenarioStatus: InnovationScenarioStatus;
}
