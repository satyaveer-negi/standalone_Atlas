import type { TelemetryConnector } from "./TelemetryConnector";
import type { NormalizedTelemetryEvent } from "../engine/TelemetryEvent";

export class DockerConnector implements TelemetryConnector {
  id = "conn-docker";
  name = "Docker Microservices Container Telemetry";
  private isConnected = false;

  connect(): void {
    this.isConnected = true;
  }

  disconnect(): void {
    this.isConnected = false;
  }

  getSampleEvents(): NormalizedTelemetryEvent[] {
    return [
      {
        id: "evt-dock-1",
        sourceConnectorId: this.id,
        entityId: "cnt-postgres",
        metric: "cpu",
        value: 94.2, // High CPU surge!
        severity: "CRITICAL",
        timestamp: Date.now() - 120000,
        labels: { container: "postgresql-db" },
      },
      {
        id: "evt-dock-2",
        sourceConnectorId: this.id,
        entityId: "sys-backend",
        metric: "memory",
        value: 520,
        severity: "INFO",
        timestamp: Date.now() - 60000,
        labels: { container: "django-web-api" },
      },
    ];
  }
}
