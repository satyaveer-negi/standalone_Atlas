export type ScenarioRiskAppetite = "Low" | "Medium" | "High";

export type EconomicScenarioStatus = "Draft" | "Simulated" | "Archived";

export interface EconomicScenario {
  scenarioId: string;
  name: string;
  description: string;
  fundingLevel: number;
  riskAppetite: ScenarioRiskAppetite;
  simulatedNPV: number;
  simulatedROI: number;
  confidenceInterval: string;
  scenarioAssumptions: string[];
  scenarioStatus: EconomicScenarioStatus;
}
