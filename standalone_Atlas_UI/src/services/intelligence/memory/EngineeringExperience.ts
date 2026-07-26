import { EngineeringIntent } from "../intent/EngineeringIntent";
import { PlanningResult } from "../planning/PlanningResult";
import { EngineeringDecision } from "../cognition/EngineeringDecision";

export interface ExperienceMetrics {
  executionDurationMs: number;
  cpuPeakUsagePercent: number;
  networkLatencyMs: number;
}

export interface EngineeringExperience {
  id: string;
  projectName: string;
  intent: EngineeringIntent;
  planningResult: PlanningResult | null;
  decision: EngineeringDecision | null;
  verificationReportSummary: string;
  outcomeStatus: "Success" | "Failure";
  metrics: ExperienceMetrics;
  createdAt: string;
}
