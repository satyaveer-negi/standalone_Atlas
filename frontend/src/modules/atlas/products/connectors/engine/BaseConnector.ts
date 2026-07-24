export interface ExternalNormalizedEvent {
  id: string;
  source: "GitHub" | "GitLab" | "Jira" | "Prometheus";
  eventType: string;
  payload: Record<string, any>;
  timestamp: number;
}

export interface BaseConnector {
  id: string;
  name: string;
  category: "SourceControl" | "Planning" | "Observability";
  status: "CONNECTED" | "SYNCING" | "ERROR";
  healthScore: number;
  syncEvents(): ExternalNormalizedEvent[];
}
