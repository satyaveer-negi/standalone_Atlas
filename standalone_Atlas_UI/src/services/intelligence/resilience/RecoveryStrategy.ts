export interface RecoveryStrategy {
  strategyId: string;
  detectionSteps: string[];
  isolationSteps: string[];
  containmentSteps: string[];
  recoverySteps: string[];
  validationSteps: string[];
  returnToNormalSteps: string[];
}
