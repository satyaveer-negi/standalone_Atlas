export type AtlasNodeType =
  | "project"
  | "sprint"
  | "task"
  | "file"
  | "version"
  | "workspace"
  | "service";

export interface AtlasNode {
  id: string;
  type: AtlasNodeType;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  parentIndex?: number | null;
  children?: string[];
}

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  type?: "hierarchy" | "dependency" | "dataflow";
  color?: string;
  weight?: number;
}

export interface AtlasGraph {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
}
