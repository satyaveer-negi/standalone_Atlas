import type { NormalizedTelemetryEvent } from "./TelemetryEvent";

export interface DetectedAnomaly {
  id: string;
  entityId: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  description: string;
}

export class AnomalyEngine {
  detectAnomalies(events: NormalizedTelemetryEvent[]): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = [];

    events.forEach((evt) => {
      if (evt.metric === "cpu" && evt.value > 90) {
        anomalies.push({
          id: `anom-${evt.id}`,
          entityId: evt.entityId,
          metric: "CPU Surge",
          value: evt.value,
          threshold: 90,
          timestamp: evt.timestamp,
          description: `Container CPU spike detected at ${evt.value.toFixed(1)}% (Threshold: 90%).`,
        });
      }
    });

    return anomalies;
  }
}
