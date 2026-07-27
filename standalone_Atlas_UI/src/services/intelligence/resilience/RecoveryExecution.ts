export interface RecoveryExecution {
  executionId: string;
  strategyReferenceId: string;
  startTime: string;
  completionTime: string;
  successStatus: "Success" | "Failed" | "PartiallySuccessful";
  operatorId: string;
  validationResults: string[];
}
