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

// 🌐 FROZEN ATLAS INTERMEDIATE REPRESENTATION (AIR) CONTRACT
export interface AIRSpecification {
  systemId: string;
  version: string;
  semantic: SemanticGraph;
  capability: CapabilityGraph;
  workflow: WorkflowGraph;
  policy: PolicyGraph;
  visualization: VisualizationGraph;
}
