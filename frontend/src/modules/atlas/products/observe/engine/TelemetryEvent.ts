export type TelemetrySeverity = "INFO" | "WARNING" | "CRITICAL";

export interface NormalizedTelemetryEvent {
  id: string;
  sourceConnectorId: string;
  entityId: string;
  metric: "latency" | "cpu" | "memory" | "requests" | "errors" | "availability";
  value: number;
  severity: TelemetrySeverity;
  timestamp: number;
  labels?: Record<string, string>;
}
