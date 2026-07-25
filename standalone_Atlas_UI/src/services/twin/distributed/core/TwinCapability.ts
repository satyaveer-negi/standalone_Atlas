export interface TwinCapability {
  name: string;
  type: "Sensor" | "Simulation" | "StateSync" | "Diagnostic";
  description: string;
}
