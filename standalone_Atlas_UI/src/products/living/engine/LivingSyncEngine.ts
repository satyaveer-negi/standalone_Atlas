import type { EngineeringCommandType } from "../../collaborate/engine/CollaborationEngine";

export interface SyncCommandPayload {
  commandType: EngineeringCommandType;
  actorId: string;
  payload: Record<string, any>;
}

export class LivingSyncEngine {
  translateDriftToCommand(targetComponent: string): SyncCommandPayload {
    return {
      commandType: "CREATE_SERVICE",
      actorId: "living-sync:reconciliation",
      payload: { serviceName: targetComponent, type: "cache" },
    };
  }
}
