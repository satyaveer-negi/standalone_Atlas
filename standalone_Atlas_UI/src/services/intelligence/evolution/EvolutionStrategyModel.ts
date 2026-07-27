export interface CapabilityPathway {
  capabilityName: string;
  targetMaturityLevel: number;
  estimatedTimeframeMonths: number;
  dependencies: string[];
}

export type EvolutionHorizon = "Horizon1" | "Horizon2" | "Horizon3";

export type StrategicFocusArea = "OperationalEfficiency" | "MarketExpansion" | "ProductInnovation" | "EcosystemLeadership";

export type EvolutionStrategyStatus = "Active" | "Completed" | "Suspended";

export interface EvolutionStrategyModel {
  strategyId: string;
  strategyName: string;
  targetStateVision: string;
  evolutionHorizon: EvolutionHorizon;
  capabilityPathways: CapabilityPathway[];
  strategicFocusArea: StrategicFocusArea;
  status: EvolutionStrategyStatus;
}
