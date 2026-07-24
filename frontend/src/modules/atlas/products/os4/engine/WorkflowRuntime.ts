export interface WorkflowNode {
  id: string;
  name: string;
  type: "IMPORT_CAD" | "MESH_GEN" | "RUN_SIMULATION" | "OPTIMIZE" | "GENERATE_REPORT";
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
}

export class WorkflowRuntime {
  private nodes: WorkflowNode[] = [
    { id: "wf-1", name: "Import CAD STEP Geometry", type: "IMPORT_CAD", status: "COMPLETED" },
    { id: "wf-2", name: "Generate FEA Mesh Grid", type: "MESH_GEN", status: "COMPLETED" },
    { id: "wf-3", name: "Run ANSYS CFD Simulation", type: "RUN_SIMULATION", status: "COMPLETED" },
    { id: "wf-4", name: "Synthesize Generative Lattice Optimization", type: "OPTIMIZE", status: "COMPLETED" },
    { id: "wf-5", name: "Publish Verification Report", type: "GENERATE_REPORT", status: "COMPLETED" },
  ];

  getWorkflowNodes(): WorkflowNode[] {
    return [...this.nodes];
  }
}
