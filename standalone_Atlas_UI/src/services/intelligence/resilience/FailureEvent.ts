export interface FailureEvent {
  eventId: string;
  linkedFailureScenarioId: string;
  detectionTimestamp: string;
  impactedAssets: string[];
  severity: number;
  recoveryOutcome: "Success" | "Failed" | "Degraded";
}
