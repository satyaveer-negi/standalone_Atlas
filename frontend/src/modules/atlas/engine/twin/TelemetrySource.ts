export interface TelemetryEvent {
  sourceId: string;
  targetEntityId: string;
  metricType: "latency" | "cpu" | "memory" | "request" | "error";
  value: number;
  timestamp: number;
}

export interface TelemetrySource {
  id: string;
  name: string;
  subscribe(onEvent: (event: TelemetryEvent) => void): () => void;
}
