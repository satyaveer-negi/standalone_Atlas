export type LevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ArtifactCategory =
  | "repo"
  | "system"
  | "module"
  | "cluster"
  | "file"
  | "class"
  | "function"
  | "variable";

export type HealthStatus =
  | "healthy"
  | "modified"
  | "frequent"
  | "complex"
  | "error"
  | "deprecated";

export interface AIMetadata {
  complexityScore: number; // 0 - 100
  dependencyCount: number;
  couplingRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  aiSummary: string;
  suggestedRefactor?: string;
  documentationScore: number;
}

export interface GraphArtifactNode {
  id: string;
  name: string;
  category: ArtifactCategory;
  level: LevelType;
  health: HealthStatus;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color: string;
  parentId: string | null;
  childrenIds: string[];
  aiMetadata: AIMetadata;
  gitActivity?: {
    lastModified: string;
    author: string;
    commitsCount: number;
  };
  fileUrl?: string;
  codeSnippet?: string;
}

export interface GraphArtifactEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: "imports" | "calls" | "inheritance" | "composition" | "dependency";
  color: string;
  weight?: number;
}

export class SceneGraph {
  private nodes: Map<string, GraphArtifactNode> = new Map();
  private edges: Map<string, GraphArtifactEdge> = new Map();

  public addNode(node: GraphArtifactNode): void {
    this.nodes.set(node.id, node);
  }

  public getNode(id: string): GraphArtifactNode | undefined {
    return this.nodes.get(id);
  }

  public getAllNodes(): GraphArtifactNode[] {
    return Array.from(this.nodes.values());
  }

  public getNodesByLevel(level: LevelType): GraphArtifactNode[] {
    return this.getAllNodes().filter((n) => n.level === level);
  }

  public addEdge(edge: GraphArtifactEdge): void {
    this.edges.set(edge.id, edge);
  }

  public getAllEdges(): GraphArtifactEdge[] {
    return Array.from(this.edges.values());
  }

  public getEdgesForNode(nodeId: string): GraphArtifactEdge[] {
    return this.getAllEdges().filter(
      (e) => e.sourceId === nodeId || e.targetId === nodeId
    );
  }

  public clear(): void {
    this.nodes.clear();
    this.edges.clear();
  }
}
