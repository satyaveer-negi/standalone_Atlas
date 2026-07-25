export type GraphNodeType = "Workflow" | "Capability" | "Tool" | "Domain" | "Reviewer" | "Execution";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  properties: Record<string, string | number>;
}

export interface GraphEdge {
  from: string;
  to: string;
  relationship: string;
}

// 🕸️ PROGRAM III.6.5: SEMANTIC ENGINEERING KNOWLEDGE GRAPH SERVICE
export class EngineeringKnowledgeGraph {
  private nodes = new Map<string, GraphNode>();
  private edges: GraphEdge[] = [];

  constructor() {
    this.preseedGraph();
  }

  public addNode(id: string, type: GraphNodeType, label: string, properties: Record<string, string | number> = {}): void {
    this.nodes.set(id, { id, type, label, properties });
  }

  public addEdge(from: string, to: string, relationship: string): void {
    this.edges.push({ from, to, relationship });
  }

  public getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(): GraphEdge[] {
    return [...this.edges];
  }

  public findRelatedEntities(nodeId: string): { node: GraphNode; rel: string }[] {
    const related: { node: GraphNode; rel: string }[] = [];
    for (const edge of this.edges) {
      if (edge.from === nodeId && this.nodes.has(edge.to)) {
        related.push({ node: this.nodes.get(edge.to)!, rel: edge.relationship });
      } else if (edge.to === nodeId && this.nodes.has(edge.from)) {
        related.push({ node: this.nodes.get(edge.from)!, rel: edge.relationship });
      }
    }
    return related;
  }

  private preseedGraph(): void {
    // Domains
    this.addNode("domain-cfd", "Domain", "Fluid Dynamics", { importance: "High" });
    this.addNode("domain-math", "Domain", "Numerical Computation", { importance: "Medium" });

    // Capabilities
    this.addNode("cap-mesh", "Capability", "exportMesh", { duration: "Seconds" });
    this.addNode("cap-solver", "Capability", "triggerSolver", { duration: "Hours" });
    this.addNode("cap-script", "Capability", "executeScript", { duration: "Milliseconds" });

    // Tools
    this.addNode("tool-openfoam", "Tool", "OpenFOAM Suite", { license: "OpenSource" });
    this.addNode("tool-numpy", "Tool", "NumPy Matrix Solver", { language: "Python" });

    // Reviewers
    this.addNode("rev-negi", "Reviewer", "satyaveer-negi", { trust: "Gold" });
    this.addNode("rev-hp", "Reviewer", "HP", { trust: "Verified" });

    // Define Edges
    this.addEdge("domain-cfd", "cap-mesh", "REQUIRES");
    this.addEdge("domain-cfd", "cap-solver", "REQUIRES");
    this.addEdge("domain-math", "cap-script", "REQUIRES");

    this.addEdge("cap-mesh", "tool-openfoam", "EXECUTED_BY");
    this.addEdge("cap-solver", "tool-openfoam", "EXECUTED_BY");
    this.addEdge("cap-script", "tool-numpy", "EXECUTED_BY");

    this.addEdge("domain-cfd", "rev-negi", "REVIEWED_BY");
    this.addEdge("domain-math", "rev-hp", "REVIEWED_BY");
  }
}

export const activeKnowledgeGraph = new EngineeringKnowledgeGraph();
