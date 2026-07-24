import type { EntityRuntimeData, EntityDiagnostics } from "../entity/Entity";

export interface EntityState {
  entityId: string;
  runtime?: EntityRuntimeData;
  diagnostics?: EntityDiagnostics;
  isSelected?: boolean;
  isHovered?: boolean;
  lastUpdated: number;
}

export class DigitalTwinStateStore {
  private states: Map<string, EntityState> = new Map();

  setEntityState(entityId: string, patch: Partial<EntityState>) {
    const existing = this.states.get(entityId) || {
      entityId,
      lastUpdated: Date.now(),
    };
    this.states.set(entityId, {
      ...existing,
      ...patch,
      lastUpdated: Date.now(),
    });
  }

  getEntityState(entityId: string): EntityState | undefined {
    return this.states.get(entityId);
  }

  getAllStates(): EntityState[] {
    return Array.from(this.states.values());
  }
}
