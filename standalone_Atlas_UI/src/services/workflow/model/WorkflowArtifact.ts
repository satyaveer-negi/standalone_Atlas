import { WorkflowDefinition } from "./WorkflowDefinition";

export interface WorkflowArtifact {
  id: string;
  version: string;
  author: string;
  signature: string;
  definition: WorkflowDefinition;
  verified: boolean;
}
