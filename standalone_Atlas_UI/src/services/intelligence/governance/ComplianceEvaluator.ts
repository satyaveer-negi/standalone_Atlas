import { EngineeringAction } from "./EngineeringAction";
import { ComplianceReport } from "./ComplianceReport";

export class ComplianceEvaluator {
  public evaluateCompliance(action: EngineeringAction): ComplianceReport {
    const temp = action.triggerSituation.twinSnapshot.temperature;
    const isSafe = temp < 350;

    return {
      reportId: `cmp-rep-${Date.now()}`,
      constitutionalStatus: "Passed",
      safetyStatus: isSafe ? "Passed" : "Failed",
      operationalStatus: "Passed",
      regulatoryStatus: "Passed",
      exceptions: isSafe ? [] : ["Safety temperature limit ceiling boundary breached."],
      evidenceSnapshot: `Temperature observed at: ${temp}°C`,
      overallStatus: isSafe ? "Compliant" : "NonCompliant",
      timestamp: new Date().toISOString()
    };
  }
}

export const activeComplianceEvaluator = new ComplianceEvaluator();
