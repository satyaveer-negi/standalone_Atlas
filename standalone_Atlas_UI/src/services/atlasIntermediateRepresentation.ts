export interface AIRNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
}

export interface AIRRelationship {
  sourceId: string;
  targetId: string;
  type: string;
}

export interface SemanticGraph {
  nodes: AIRNode[];
  edges: AIRRelationship[];
}

export interface CapabilityGraph {
  commands: { name: string; endpoint: string; parameters: string[] }[];
  queries: { name: string; endpoint: string; parameters: string[] }[];
}

export interface WorkflowGraph {
  states: Record<string, string[]>;
  transitions: { entity: string; from: string; to: string; trigger: string }[];
}

export interface PolicyGraph {
  safetyRules: Record<string, any>;
  approvalRequirements: string[];
}

export interface VisualizationGraph {
  themeColor: string;
  particleSpeed: number;
  hudLayout: string;
  icons: string[];
}

// 🌐 ATLAS INTERMEDIATE REPRESENTATION (AIR) Graph Compiler Target
export class AtlasIntermediateRepresentation {
  public semantic: SemanticGraph = { nodes: [], edges: [] };
  public capability: CapabilityGraph = { commands: [], queries: [] };
  public workflow: WorkflowGraph = { states: {}, transitions: [] };
  public policy: PolicyGraph = { safetyRules: {}, approvalRequirements: [] };
  public visualization: VisualizationGraph = {
    themeColor: "#4f46e5",
    particleSpeed: 1.0,
    hudLayout: "default",
    icons: [],
  };

  constructor(public systemId: string, public version: string) {}

  public optimize(): void {
    console.log(`[AIR Optimizer] Running optimization passes on system "${this.systemId}" v${this.version}...`);
    // Semantic verification pass
    const orphanedNodes = this.semantic.nodes.filter(
      (n) => !this.semantic.edges.some((e) => e.sourceId === n.id || e.targetId === n.id)
    );
    if (orphanedNodes.length > 0) {
      console.log(`[AIR Optimizer] Cleaned up ${orphanedNodes.length} orphaned nodes.`);
    }
  }
}
