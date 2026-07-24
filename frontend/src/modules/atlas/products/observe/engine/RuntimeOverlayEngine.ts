import { DigitalTwinStateStore } from "../../../engine/twin/DigitalTwinStateStore";
import type { NormalizedTelemetryEvent } from "./TelemetryEvent";

export class RuntimeOverlayEngine {
  private stateStore: DigitalTwinStateStore;

  constructor(stateStore?: DigitalTwinStateStore) {
    this.stateStore = stateStore || new DigitalTwinStateStore();
  }

  processEvents(events: NormalizedTelemetryEvent[]) {
    events.forEach((evt) => {
      const currentState = this.stateStore.getEntityState(evt.entityId);
      const existingRuntime = currentState?.runtime || { status: "running" };

      let updatedStatus = existingRuntime.status;
      if (evt.severity === "CRITICAL") updatedStatus = "error";
      else if (evt.severity === "WARNING" && updatedStatus !== "error") updatedStatus = "warning";

      this.stateStore.setEntityState(evt.entityId, {
        runtime: {
          ...existingRuntime,
          status: updatedStatus as any,
          cpuPercent: evt.metric === "cpu" ? evt.value : existingRuntime.cpuPercent,
          lastLatencyMs: evt.metric === "latency" ? evt.value : existingRuntime.lastLatencyMs,
        },
      });
    });
  }

  getStateStore(): DigitalTwinStateStore {
    return this.stateStore;
  }
}
