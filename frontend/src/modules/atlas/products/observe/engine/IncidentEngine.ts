import type { DetectedAnomaly } from "./AnomalyEngine";

export interface IncidentRecord {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  affectedEntityId: string;
  anomalies: DetectedAnomaly[];
  correlatedCommit: string;
  rootCauseSummary: string;
  timestamp: number;
}

export class IncidentEngine {
  createIncidentFromAnomaly(anomaly: DetectedAnomaly): IncidentRecord {
    return {
      id: `inc-${anomaly.id}`,
      title: `Production Incident: ${anomaly.metric} on ${anomaly.entityId}`,
      severity: "CRITICAL",
      affectedEntityId: anomaly.entityId,
      anomalies: [anomaly],
      correlatedCommit: "Commit df38906 by Alex [Django Core] (12 mins ago)",
      rootCauseSummary: `High database CPU surge correlated with unindexed task_manager_task table query.`,
      timestamp: anomaly.timestamp,
    };
  }
}
