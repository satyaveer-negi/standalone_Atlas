export interface ConstitutionalDecision {
  decisionId: string;
  targetId: string;
  principleId: string;
  decisionStatus: "Authorized" | "Rejected";
  evidenceSnippet: string;
  severity: "High" | "Critical";
  timestamp: string;
  reviewer: string;
}
