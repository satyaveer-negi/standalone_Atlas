export interface ProposedAction {
  domainName: string;
  recommendationId: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  resourceRequirements: { resourceType: string; amount: number }[];
}

export interface DecisionConstraint {
  constraint: string;
  source: string;
}

export type ReconciliationStatus = "Pending" | "Reconciled" | "Conflicted";

export type DecisionActionStatus = "Draft" | "Executed" | "Aborted";

export interface AutonomousDecisionOrchestrator {
  decisionId: string;
  decisionName: string;
  proposedActions: ProposedAction[];
  decisionConstraints: DecisionConstraint[];
  reconciliationStatus: ReconciliationStatus;
  conflictNotes: string[];
  actionStatus: DecisionActionStatus;
}
