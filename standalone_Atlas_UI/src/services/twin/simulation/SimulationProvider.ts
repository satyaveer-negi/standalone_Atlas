export interface SimulationOutput {
  propertyName: string;
  value: any;
  unit: string;
  confidence: number;
}

export interface SimulationProvider {
  id: string;
  name: string;
  runSolver(inputs: Record<string, any>): Promise<SimulationOutput[]>;
}
