export interface DigitalTwinState {
  twinId: string;
  entityName: string;
  domain: string;
  telemetryMetrics: Record<string, number>;
  syncStatus: "SYNCHRONIZED" | "PENDING_TELEMETRY" | "DESYNCHRONIZED";
  lastUpdated: number;
}

export class DigitalTwinRuntime {
  private twins = new Map<string, DigitalTwinState>();

  registerTwin(twin: DigitalTwinState): void {
    this.twins.set(twin.twinId, twin);
  }

  updateTelemetry(twinId: string, metrics: Record<string, number>): DigitalTwinState | undefined {
    const twin = this.twins.get(twinId);
    if (twin) {
      twin.telemetryMetrics = { ...twin.telemetryMetrics, ...metrics };
      twin.lastUpdated = Date.now();
      twin.syncStatus = "SYNCHRONIZED";
      return twin;
    }
    return undefined;
  }

  getTwins(): DigitalTwinState[] {
    return Array.from(this.twins.values());
  }
}
