import { WorkflowDefinition } from "../model/WorkflowDefinition";

export interface Scenario {
  id: string;
  name: string;
  workflowDef: WorkflowDefinition;
  parameters: Record<string, any>;
  variables: Record<string, any>;
  executionTimeMs?: number;
  verificationReportStatus?: "Passed" | "Failed";
}
