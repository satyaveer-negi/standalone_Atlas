import { EngineeringRecommendation } from "../decision/EngineeringRecommendation";

export type SituationSeverity = "Normal" | "Advisory" | "Warning" | "Critical" | "Emergency";
export type SituationLifecycle = "Detected" | "Validated" | "Correlated" | "Assessed" | "RecommendationUpdated" | "Resolved" | "Archived";

export interface TelemetrySnapshot {
  voltage: number;
  temperature: number;
  loadKW: number;
}

export interface EngineeringSituation {
  id: string;
  twinSnapshot: TelemetrySnapshot;
  activeRecommendation: EngineeringRecommendation | null;
  activeWorkflowId: string;
  liveConstraintsChecked: string[];
  safetyStatus: "Passed" | "Viated";
  severity: SituationSeverity;
  lifecycle: SituationLifecycle;
  alerts: string[];
  runtimeMetrics: {
    cpuPercent: number;
    memoryMb: number;
  };
  timestamp: string;
  situationVersion: number;
}
