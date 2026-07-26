export interface ConstitutionalViolation {
  violationId: string;
  principleId: string;
  component: string;
  severity: "High" | "Critical";
  description: string;
  rootCause: string;
  suggestedRemedy: string;
  status: "Compliant" | "Degraded" | "Violated" | "Waived";
  timestamp: string;
}
