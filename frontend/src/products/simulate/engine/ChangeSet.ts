export type OperationType = "REMOVE_ENTITY" | "ADD_ENTITY" | "RECONNECT_EDGE";

export interface SimulationOperation {
  type: OperationType;
  targetEntityId: string;
  newTargetId?: string;
  metadata?: Record<string, string>;
}

export interface ChangeSet {
  id: string;
  name: string;
  operations: SimulationOperation[];
}
