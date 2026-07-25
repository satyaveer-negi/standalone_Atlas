import type { WorkflowPackage } from "../../workflowRepository";

export class WorkflowGenerator {
  public generate(prompt: string): WorkflowPackage {
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    const packageId = `ai-pkg-${Date.now()}`;
    
    return {
      packageId,
      metadata: {
        packageName: isCfd ? "AI-Generated CFD Solver Pipeline" : "AI-Generated Computation Pipeline",
        author: "AI-Copilot-Agent",
        domain: isCfd ? "Fluid Dynamics" : "Numerical Computation",
        version: "1.0.0",
        status: "Draft",
        requiredCapabilities: isCfd ? ["exportMesh", "triggerSolver"] : ["executeScript"],
        created: new Date().toLocaleDateString()
      },
      definition: {
        workflowId: `ai-wf-${Date.now()}`,
        name: isCfd ? "AI-Generated CFD Solver Pipeline" : "AI-Generated Computation Pipeline",
        description: `Automated DAG configuration generated from instruction: "${prompt}"`,
        version: "1.0.0",
        tags: isCfd ? ["CFD", "AI-Generated"] : ["Math", "AI-Generated"],
        steps: isCfd ? [
          { stepId: "mesh", name: "Construct geometry mesh blocks", capability: "exportMesh", state: "Ready", retries: 0 },
          { stepId: "solve", name: "Numerical simulation calculations", capability: "triggerSolver", state: "Pending", retries: 0 }
        ] : [
          { stepId: "calc", name: "Compute matrix dot products", capability: "executeScript", state: "Ready", retries: 0 }
        ],
        dependencies: isCfd ? [
          { from: "mesh", to: "solve" }
        ] : []
      },
      validationPassed: true
    };
  }
}
