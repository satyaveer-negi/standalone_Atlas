import { WorkflowPackage } from "./workflowRepository";

export type UserRole = "Author" | "Reviewer" | "Publisher";

export type ApprovalState = "Draft" | "InReview" | "Approved" | "ReadyToPublish" | "Published";

export interface AuditRecord {
  recordId: string;
  packageId: string;
  action: string;
  actor: string;
  role: UserRole;
  status: "SUCCESS" | "DENIED";
  timestamp: string;
  details: string;
}

// 🛡️ PROGRAM III.5: GOVERNANCE ENGINE (APPROVAL GATES & COMPLIANCE TIMELINES)
export class GovernanceEngine {
  private packageStates = new Map<string, ApprovalState>();
  private auditHistory: AuditRecord[] = [];

  public getPackageState(packageId: string): ApprovalState {
    if (!this.packageStates.has(packageId)) {
      this.packageStates.set(packageId, "Draft");
    }
    return this.packageStates.get(packageId)!;
  }

  public getAuditHistory(packageId?: string): AuditRecord[] {
    if (packageId) {
      return this.auditHistory.filter(r => r.packageId === packageId);
    }
    return [...this.auditHistory];
  }

  public submitForReview(packageId: string, actor: string, role: UserRole): boolean {
    if (role !== "Author") {
      this.logAudit(packageId, "Submit For Review", actor, role, "DENIED", "Only Authors can submit packages for review.");
      return false;
    }

    this.packageStates.set(packageId, "InReview");
    this.logAudit(packageId, "Submit For Review", actor, role, "SUCCESS", "Package submitted for peer reviews.");
    return true;
  }

  public reviewPackage(packageId: string, actor: string, role: UserRole, approve: boolean): boolean {
    if (role !== "Reviewer") {
      this.logAudit(packageId, approve ? "Approve Review" : "Reject Review", actor, role, "DENIED", "Only Reviewers can submit review decisions.");
      return false;
    }

    const state = this.getPackageState(packageId);
    if (state !== "InReview") {
      this.logAudit(packageId, approve ? "Approve Review" : "Reject Review", actor, role, "DENIED", "Package is not currently in review.");
      return false;
    }

    if (approve) {
      this.packageStates.set(packageId, "Approved");
      this.logAudit(packageId, "Approve Review", actor, role, "SUCCESS", "Package approved. Promotion to ReadyToPublish succeeded.");
    } else {
      this.packageStates.set(packageId, "Reject Review", actor, role, "SUCCESS" as any); // fallback mapping
      this.packageStates.set(packageId, "Draft");
      this.logAudit(packageId, "Reject Review", actor, role, "SUCCESS", "Package rejected. Reset to Draft status.");
    }
    return true;
  }

  public promoteToReady(packageId: string, actor: string, role: UserRole): boolean {
    const currentState = this.getPackageState(packageId);
    if (currentState !== "Approved") {
      this.logAudit(packageId, "Promote To Ready", actor, role, "DENIED", "Package must be Approved before readying.");
      return false;
    }

    this.packageStates.set(packageId, "ReadyToPublish");
    this.logAudit(packageId, "Promote To Ready", actor, role, "SUCCESS", "Package marked Ready to Publish.");
    return true;
  }

  public publishPackage(packageId: string, actor: string, role: UserRole): boolean {
    if (role !== "Publisher") {
      this.logAudit(packageId, "Publish Package", actor, role, "DENIED", "Only Publishers are authorized to sign off releases.");
      return false;
    }

    const currentState = this.getPackageState(packageId);
    if (currentState !== "ReadyToPublish") {
      this.logAudit(packageId, "Publish Package", actor, role, "DENIED", "Package must be in ReadyToPublish state.");
      return false;
    }

    this.packageStates.set(packageId, "Published");
    this.logAudit(packageId, "Publish Package", actor, role, "SUCCESS", "Package published to registry catalogs.");
    return true;
  }

  private logAudit(packageId: string, action: string, actor: string, role: UserRole, status: "SUCCESS" | "DENIED", details: string) {
    this.auditHistory.push({
      recordId: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      packageId,
      action,
      actor,
      role,
      status,
      timestamp: new Date().toLocaleTimeString(),
      details
    });
  }
}

export const activeGovernanceEngine = new GovernanceEngine();
