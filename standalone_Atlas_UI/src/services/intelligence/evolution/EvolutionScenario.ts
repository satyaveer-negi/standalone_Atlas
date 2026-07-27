export type EvolutionScenarioStatus = "Draft" | "Simulated" | "Archived";

export type MarketShiftSeverity = "Low" | "Medium" | "High";

export type RegulatoryVolatilityLevel = "Low" | "Medium" | "High";

export interface EvolutionScenario {
  scenarioId: string;
  name: string;
  description: string;
  simulatedTechConvergenceRate: number; // percentage
  projectedMarketShiftSeverity: MarketShiftSeverity;
  regulatoryVolatility: RegulatoryVolatilityLevel;
  organizationalAdaptationTimeMonths: number;
  transitionRiskIndex: number; // out of 100
  expectedCostSaving: number;
  scenarioStatus: EvolutionScenarioStatus;
}
