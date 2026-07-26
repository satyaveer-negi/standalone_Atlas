export interface WorkflowEvolution {
  evolutionId: string;
  proposalId: string;
  targetTemplateId: string;
  structuralAction: "InsertVerification" | "ReorderSteps" | "UpdateRetries";
  adjustmentDetails: string;
}
