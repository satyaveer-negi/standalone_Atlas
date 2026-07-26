import { EngineeringAction } from "../governance/EngineeringAction";
import { ExecutionIntent } from "../governance/ExecutionIntent";

export interface OperationalOutcome {
  outcomeId: string;
  action: EngineeringAction;
  intent: ExecutionIntent;
  executionResultStatus: "Success" | "Failure";
  verificationResultSummary: string;
  kpiChanges: {
    latencyReductionMs: number;
    safetyComplianceScore: number;
  };
  safetyImpact: "Passed" | "Mitigated" | "Interlocked";
  resourceUsage: {
    cpuSeconds: number;
    peakMemoryMb: number;
  };
  policyCompliancePassed: boolean;
  lessonsLearnedId: string | null;
  confidenceScore: number; // 0-100
  timestamp: string;
}
