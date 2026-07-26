export interface ComplianceReport {
  reportId: string;
  constitutionalStatus: "Passed" | "Failed";
  safetyStatus: "Passed" | "Failed";
  operationalStatus: "Passed" | "Failed";
  regulatoryStatus: "Passed" | "Failed";
  exceptions: string[];
  evidenceSnapshot: string;
  overallStatus: "Compliant" | "NonCompliant";
  timestamp: string;
}
