import type { RuleSeverity } from "./RuleAST";

export type ViolationStatus = "Open" | "Acknowledged" | "Suppressed" | "Resolved" | "Archived";

export interface ManagedViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: RuleSeverity;
  sourceEntityId: string;
  targetEntityId: string;
  graphEvidence: string[];
  status: ViolationStatus;
  timestamp: number;
}

export class ViolationStore {
  private violations: Map<string, ManagedViolation> = new Map();

  addViolation(violation: ManagedViolation) {
    this.violations.set(violation.id, violation);
  }

  updateStatus(id: string, status: ViolationStatus) {
    const existing = this.violations.get(id);
    if (existing) {
      existing.status = status;
    }
  }

  getAllViolations(): ManagedViolation[] {
    return Array.from(this.violations.values());
  }

  getOpenViolations(): ManagedViolation[] {
    return this.getAllViolations().filter((v) => v.status === "Open");
  }
}
