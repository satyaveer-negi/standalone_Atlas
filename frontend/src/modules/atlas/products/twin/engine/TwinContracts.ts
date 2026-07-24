import type { TwinVersionSnapshot } from "./CanonicalTwinSchema";

export interface ITwinEventSource {
  sourceName: string;
  emitEvent(type: string, payload: any): void;
}

export interface ITwinSnapshot {
  getSnapshot(versionId: string): TwinVersionSnapshot;
}

export interface ITwinSimulator {
  simulatorName: string;
  runSimulation(snapshot: TwinVersionSnapshot, scenario: string): any;
}
