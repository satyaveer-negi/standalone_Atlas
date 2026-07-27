export type SystemExecutionMode = "Centralized" | "Distributed" | "Hybrid";

export type OrchestratorHealth = "Normal" | "Degraded" | "CriticallyFailed";

export type OrchestrationStrategy = 
  | "PriorityBased" 
  | "CostOptimized" 
  | "ResilienceOptimized" 
  | "Balanced";

export interface SystemOrchestrator {
  orchestratorId: string;
  managedMissionIds: string[];
  managedTwinIds: string[];
  activePolicies: string[];
  executionMode: SystemExecutionMode;
  healthStatus: OrchestratorHealth;
  orchestrationStrategy: OrchestrationStrategy;
}
