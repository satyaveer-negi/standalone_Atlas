export interface TaskEdge {
  fromNodeId: string;
  toNodeId: string;
  variableMappings: { fromVar: string; toVar: string }[];
}
