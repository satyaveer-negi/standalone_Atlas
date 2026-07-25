import { TwinState } from "./TwinState";
import { StateProvenance } from "./StateVersion";
import { activeCollabEventBus } from "../../agents/collaboration/events/EventBus";
import { activeTwinRepository } from "../core/TwinRepository";

export class TwinStateEngine {
  private statesMap = new Map<string, TwinState[]>(); // key: twinId-entityId-prop

  public updateStateProperty(
    twinId: string,
    entityId: string,
    propertyName: string,
    value: any,
    unit: string,
    provenance: StateProvenance,
    confidence = 1.0
  ): void {
    const key = `${twinId}-${entityId}-${propertyName}`;
    const history = this.statesMap.get(key) ?? [];
    
    const nextVersion = history.length + 1;
    const twinState: TwinState = {
      propertyName,
      value,
      unit,
      versionInfo: {
        version: nextVersion,
        timestamp: new Date().toISOString(),
        provenance,
        confidence
      }
    };

    history.push(twinState);
    this.statesMap.set(key, history);

    // Sync to concrete Entity model properties in the repository
    const twin = activeTwinRepository.getTwin(twinId);
    if (twin) {
      const entity = twin.entities.find(e => e.id === entityId);
      if (entity) {
        entity.properties[propertyName] = value;
      }
    }

    // Publish event logs
    activeCollabEventBus.publish("VariableUpdated", {
      twinId,
      entityId,
      propertyName,
      value,
      unit,
      version: nextVersion,
      provenance
    });
  }

  public getPropertyHistory(twinId: string, entityId: string, propertyName: string): TwinState[] {
    const key = `${twinId}-${entityId}-${propertyName}`;
    return this.statesMap.get(key) ?? [];
  }

  public getLatestProperty(twinId: string, entityId: string, propertyName: string): TwinState | null {
    const history = this.getPropertyHistory(twinId, entityId, propertyName);
    return history.length > 0 ? history[history.length - 1] : null;
  }
}

export const activeTwinStateEngine = new TwinStateEngine();
