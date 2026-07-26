import { EngineeringIntent } from "../intent/EngineeringIntent";
import { WorkflowGraph } from "../../../workflow/model/WorkflowGraph";
import { WorkflowCandidate } from "./WorkflowCandidate";

export class PlanGenerator {
  public generateCandidates(intent: EngineeringIntent): WorkflowCandidate[] {
    const candidates: WorkflowCandidate[] = [];

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
      estimatedDurationMs: 3600000,
      estimatedResources: ["gpu-node-01", "ansys-license-01"],
      estimatedCostUSD: 450,
      estimatedRiskScore: 8,
      verificationScore: 98,
      confidence: 0.98,
      explanation: "Uses Ansys Fluent CFD for high-resolution fluid drag validation, yielding highly reliable results at higher compute costs."
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
      estimatedDurationMs: 60000,
      estimatedResources: ["cpu-node-01"],
      estimatedCostUSD: 50,
      estimatedRiskScore: 3,
      verificationScore: 85,
      confidence: 0.85,
      explanation: "Applies linear heuristics simulation via Matlab script, yielding rapid approximations suitable for fast validation."
    });

    return candidates;
  }
}

export const activePlanGenerator = new PlanGenerator();
