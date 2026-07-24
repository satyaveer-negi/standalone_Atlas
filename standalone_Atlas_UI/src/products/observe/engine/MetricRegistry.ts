export interface MetricDefinition {
  id: string;
  name: string;
  unit: "ms" | "%" | "MB" | "req/s" | "errors/s";
  warningThreshold: number;
  criticalThreshold: number;
}

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  latency: { id: "latency", name: "HTTP Request Latency", unit: "ms", warningThreshold: 300, criticalThreshold: 800 },
  cpu: { id: "cpu", name: "Container CPU Utilization", unit: "%", warningThreshold: 75, criticalThreshold: 90 },
  memory: { id: "memory", name: "Container Memory Footprint", unit: "MB", warningThreshold: 450, criticalThreshold: 800 },
  errors: { id: "errors", name: "Error Rate", unit: "errors/s", warningThreshold: 1, criticalThreshold: 5 },
};
