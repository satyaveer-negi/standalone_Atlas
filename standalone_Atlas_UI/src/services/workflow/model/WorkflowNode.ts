export interface PortDefinition {
  name: string;
  type: "Number" | "String" | "Boolean" | "CADModel" | "CFDResult" | "DataFlow" | "PowerModel" | "SimulationResult" | "Report";
}

export interface WorkflowNode {
  id: string;
  name: string;
  category: "Simulation" | "Twin" | "Optimization" | "Control" | "Verification" | "Data";
  type: "SimulationNode" | "VerificationNode" | "TwinNode" | "AgentNode" | "OptimizationNode";
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  properties: Record<string, any>;
}
