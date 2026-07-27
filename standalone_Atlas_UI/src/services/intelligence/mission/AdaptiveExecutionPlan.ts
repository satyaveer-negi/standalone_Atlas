export type AdaptationType = 
  | "LoadShedding" 
  | "RedundancyActivation" 
  | "ParameterOverride" 
  | "AlternativeRouting";

export type AdaptiveExecutionStatus = 
  | "Idle" 
  | "Evaluating" 
  | "Approved" 
  | "Executing" 
  | "Verified" 
  | "Closed";

export interface AdaptiveExecutionPlan {
  planId: string;
  triggerEventId: string;
  adaptationType: AdaptationType;
  actionsList: string[];
  executionStatus: AdaptiveExecutionStatus;
}
