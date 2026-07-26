import { EngineeringIntent } from "../intent/EngineeringIntent";
import { WorkflowGraph } from "../../../workflow/model/WorkflowGraph";

export interface PlanningCandidate {
  id: string;
  name: string;
  graph: WorkflowGraph;
  costEstimateUSD: number;
  complexityScore: number; // 1-10
  expectedAccuracy: number; // percentage
}

export class PlanGenerator {
  public generateCandidates(intent: EngineeringIntent): PlanningCandidate[] {
    const candidates: PlanningCandidate[] = [];

    // Candidate 1: High Fidelity / High Cost
    const graphHigh = new WorkflowGraph();
    graphHigh.addNode({
      id: "node-high-1",
      name: "High-Res Solar Yield Feed",
      category: "Twin",
      type: "TwinNode",
      inputs: [],
      outputs: [{ name: "Irradiance", type: "PowerModel" }],
      properties: { twinId: intent.entities[0] || "pv-twin-01" }
    });
    graphHigh.addNode({
      id: "node-high-2",
      name: "Ansys Fluent CFD Solver",
      category: "Simulation",
      type: "SimulationNode",
      inputs: [{ name: "Irradiance", type: "PowerModel" }],
      outputs: [{ name: "SimulationResult", type: "SimulationResult" }],
      properties: { solverName: "AnsysFluentCFD" }
    });
    graphHigh.addNode({
      id: "node-high-3",
      name: "Regulatory Compliance Audit",
      category: "Verification",
      type: "VerificationNode",
      inputs: [{ name: "SimulationResult", type: "SimulationResult" }],
      outputs: [{ name: "PassedReport", type: "Report" }],
      properties: { safetyLimitPercent: 15 }
    });
    graphHigh.addConnection({
      id: "conn-high-1",
      sourceNodeId: "node-high-1",
      sourcePortName: "Irradiance",
      targetNodeId: "node-high-2",
      targetPortName: "Irradiance"
    });
    graphHigh.addConnection({
      id: "conn-high-2",
      sourceNodeId: "node-high-2",
      sourcePortName: "SimulationResult",
      targetNodeId: "node-high-3",
      targetPortName: "SimulationResult"
    });

    candidates.push({
      id: "cand-high-fidelity",
      name: "Plan Alpha: High-Fidelity Ansys CFD Analysis",
      graph: graphHigh,
      costEstimateUSD: 450,
      complexityScore: 8,
      expectedAccuracy: 98
    });

    // Candidate 2: Fast Heuristics / Low Cost
    const graphFast = new WorkflowGraph();
    graphFast.addNode({
      id: "node-fast-1",
      name: "Linear Interpolated Yield Feed",
      category: "Twin",
      type: "TwinNode",
      inputs: [],
      outputs: [{ name: "Irradiance", type: "PowerModel" }],
      properties: { twinId: intent.entities[0] || "pv-twin-01" }
    });
    graphFast.addNode({
      id: "node-fast-2",
      name: "Analytical Solver (Matlab)",
      category: "Simulation",
      type: "SimulationNode",
      inputs: [{ name: "Irradiance", type: "PowerModel" }],
      outputs: [{ name: "SimulationResult", type: "SimulationResult" }],
      properties: { solverName: "MatlabLinear" }
    });
    graphFast.addNode({
      id: "node-fast-3",
      name: "Fast Threshold Validator",
      category: "Verification",
      type: "VerificationNode",
      inputs: [{ name: "SimulationResult", type: "SimulationResult" }],
      outputs: [{ name: "PassedReport", type: "Report" }],
      properties: { safetyLimitPercent: 20 }
    });
    graphFast.addConnection({
      id: "conn-fast-1",
      sourceNodeId: "node-fast-1",
      sourcePortName: "Irradiance",
      targetNodeId: "node-fast-2",
      targetPortName: "Irradiance"
    });
    graphFast.addConnection({
      id: "conn-fast-2",
      sourceNodeId: "node-fast-2",
      sourcePortName: "SimulationResult",
      targetNodeId: "node-fast-3",
      targetPortName: "SimulationResult"
    });

    candidates.push({
      id: "cand-fast-heuristics",
      name: "Plan Beta: Fast Analytical Solver Profile",
      graph: graphFast,
      costEstimateUSD: 50,
      complexityScore: 3,
      expectedAccuracy: 85
    });

    return candidates;
  }
}

export const activePlanGenerator = new PlanGenerator();
