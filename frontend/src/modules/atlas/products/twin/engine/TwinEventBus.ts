export interface NormalizedTwinEvent {
  eventId: string;
  sourceAdapter: "Git" | "CI" | "Workflow" | "Deploy" | "Telemetry";
  payload: Record<string, any>;
  timestamp: number;
}

export class TwinEventBus {
  private events: NormalizedTwinEvent[] = [];

  publishEvent(adapter: "Git" | "CI" | "Workflow" | "Deploy" | "Telemetry", payload: Record<string, any>) {
    this.events.push({
      eventId: `evt-twin-${Date.now()}`,
      sourceAdapter: adapter,
      payload,
      timestamp: Date.now(),
    });
  }

  getEvents(): NormalizedTwinEvent[] {
    return this.events;
  }
}
