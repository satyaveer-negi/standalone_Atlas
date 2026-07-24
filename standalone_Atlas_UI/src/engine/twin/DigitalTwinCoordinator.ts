import { DigitalTwinStateStore } from "./DigitalTwinStateStore";
import type { TelemetryEvent } from "./TelemetrySource";

export class DigitalTwinCoordinator {
  readonly stateStore: DigitalTwinStateStore;

  constructor(stateStore?: DigitalTwinStateStore) {
    this.stateStore = stateStore || new DigitalTwinStateStore();
  }

  processTelemetryEvent(event: TelemetryEvent) {
    const currentState = this.stateStore.getEntityState(event.targetEntityId);
    const existingRuntime = currentState?.runtime || { status: "running" };

    let updatedRuntime = { ...existingRuntime };

    if (event.metricType === "latency") updatedRuntime.lastLatencyMs = event.value;
    else if (event.metricType === "cpu") updatedRuntime.cpuPercent = event.value;
    else if (event.metricType === "memory") updatedRuntime.memoryMb = event.value;
    else if (event.metricType === "error") updatedRuntime.status = "error";

    this.stateStore.setEntityState(event.targetEntityId, {
      runtime: updatedRuntime,
    });
  }
}
