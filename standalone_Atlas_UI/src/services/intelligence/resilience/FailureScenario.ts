export type FailureScenarioType = 
  | "Hardware" 
  | "Software" 
  | "Communication" 
  | "Cyber" 
  | "Power" 
  | "Environmental" 
  | "Human" 
  | "ThirdPartyDependency";

export interface FailureScenario {
  scenarioId: string;
  trigger: string;
  failureType: FailureScenarioType;
  detectionMethod: string;
  expectedImpact: string;
  recoveryStrategyId: string;
  simulationStatus: "Idle" | "Running" | "Completed";
  validationResult: "Pass" | "Fail";
  affectedAssets: string[];
  estimatedRecoveryTimeMs: number;
  linkedResiliencePlanId: string;
}
