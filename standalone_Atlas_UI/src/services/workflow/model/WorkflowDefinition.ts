import { WorkflowGraph } from "./WorkflowGraph";

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  graph: WorkflowGraph;
  author: string;
  updatedAt: string;
}
