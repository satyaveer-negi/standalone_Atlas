export interface MemoryRecord {
  id: string;
  category: "DESIGN_DECISION" | "SIMULATION_CACHE" | "FAILURE_INCIDENT" | "OPTIMIZATION_HIST";
  summary: string;
  timestamp: number;
}

export class AtlasMemory {
  private records: MemoryRecord[] = [
    {
      id: "mem-1",
      category: "DESIGN_DECISION",
      summary: "Selected Titanium 6Al-4V Alloy over Aluminum 7075 for Aerospace Bracket (35% weight reduction)",
      timestamp: Date.now() - 86400000 * 5,
    },
    {
      id: "mem-2",
      category: "SIMULATION_CACHE",
      summary: "CFD Thermal Simulation sim-run-102 verified max temperature 42.5°C under 12V inverter load",
      timestamp: Date.now() - 86400000 * 2,
    },
  ];

  getMemoryRecords(): MemoryRecord[] {
    return [...this.records];
  }
}
