export class AgentPlanner {
  public generatePlan(objective: string): string[] {
    const isCfd = objective.toLowerCase().includes("cfd") || objective.toLowerCase().includes("fluid") || objective.toLowerCase().includes("mesh");
    
    if (isCfd) {
      return [
        "Retrieve RAG templates adjacent context from Knowledge Graph",
        "Construct geometry mesh blocks using exportMesh capability",
        "Execute CFD solver numerical calculations via triggerSolver",
        "Grade metric success scores and write learned feedback edges"
      ];
    }
    
    return [
      "Retrieve math templates from local graph schemas",
      "Execute numerical matrix dot product computations",
      "Log semantic feedback results"
    ];
  }
}
