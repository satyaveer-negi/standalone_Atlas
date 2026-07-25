import type { WorkflowPackage } from "../../../services/workflow/workflowRepository";

export interface AgentContext {
  objective: string;
  plan: string[];
  retrievedKnowledge: string;
  generatedWorkflowPkg?: WorkflowPackage;
  observations: string[];
  evaluationScore?: number;
  safetyCheckPassed: boolean;
}
