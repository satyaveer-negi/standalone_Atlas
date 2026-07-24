export interface SecurityPolicy {
  packageName: string;
  allowedCapabilities: string[];
  sandboxMode: boolean;
  signatureVerified: boolean;
}

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  action: string;
  status: "ALLOWED" | "DENIED" | "WARNING";
  details: string;
}

// 🛡️ PROGRAM H5: SECURITY & GOVERNANCE ENGINE
export class SecurityEngine {
  private activePolicies = new Map<string, SecurityPolicy>();
  private auditLogs: SecurityAuditRecord[] = [];

  constructor() {
    this.seedPolicies();
  }

  private seedPolicies() {
    this.activePolicies.set("openfoam", {
      packageName: "openfoam",
      allowedCapabilities: ["triggerSolver", "getResiduals"],
      sandboxMode: true,
      signatureVerified: true,
    });

    this.activePolicies.set("jira", {
      packageName: "jira",
      allowedCapabilities: ["updateTicketStatus", "assignDeveloper"],
      sandboxMode: true,
      signatureVerified: true,
    });

    this.auditLogs.push({
      id: "sec-aud-101",
      timestamp: "12:43:20 UTC",
      action: "Signature Verification",
      status: "ALLOWED",
      details: "Cryptographic check for package openfoam.atlaskp verified successfully."
    });
  }

  public getPoliciesList(): SecurityPolicy[] {
    return Array.from(this.activePolicies.values());
  }

  public getAuditTrail(): SecurityAuditRecord[] {
    return this.auditLogs;
  }

  public evaluateAction(packageName: string, capability: string): boolean {
    const policy = this.activePolicies.get(packageName);
    if (!policy) {
      this.auditLogs.unshift({
        id: `sec-aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "Capability Execution",
        status: "DENIED",
        details: `Access to capability "${capability}" denied: package is unsigned.`
      });
      return false;
    }

    const allowed = policy.allowedCapabilities.includes(capability);
    this.auditLogs.unshift({
      id: `sec-aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Capability Execution",
      status: allowed ? "ALLOWED" : "DENIED",
      details: allowed 
        ? `Access to "${capability}" approved.` 
        : `Access denied for unauthorized capability: "${capability}".`
    });

    return allowed;
  }
}

export const activeSecurityEngine = new SecurityEngine();
