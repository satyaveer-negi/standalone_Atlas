import { activeConflictResolver, ConflictResolutionPolicy } from "./ConflictResolver";
import { activeTwinStateEngine } from "../../state/TwinStateEngine";

export class TwinSynchronizationCoordinator {
  private locks = new Map<string, boolean>(); // twinId -> isLocked

  public acquireLock(twinId: string): boolean {
    if (this.locks.get(twinId) === true) {
      return false; // Already locked
    }
    this.locks.set(twinId, true);
    return true;
  }

  public releaseLock(twinId: string): void {
    this.locks.set(twinId, false);
  }

  public synchronizeTwinProperty(
    twinId: string,
    entityId: string,
    propName: string,
    incomingValue: any,
    incomingVer: number,
    incomingConf: number,
    incomingProv: "Observed" | "Simulated" | "Predicted" | "Estimated",
    policy: ConflictResolutionPolicy = "ObservedWins"
  ): void {
    if (!this.acquireLock(twinId)) {
      console.warn(`[Sync Coordinator] Synchronization locked for twin: ${twinId}. Retrying...`);
      return;
    }

    try {
      const current = activeTwinStateEngine.getLatestProperty(twinId, entityId, propName);
      
      let finalValue = incomingValue;
      if (current) {
        finalValue = activeConflictResolver.resolveConflict(
          current.value,
          current.versionInfo.version,
          current.versionInfo.confidence,
          current.versionInfo.provenance,
          incomingValue,
          incomingVer,
          incomingConf,
          incomingProv,
          policy
        );
      }

      // Commit resolved value
      activeTwinStateEngine.updateStateProperty(
        twinId,
        entityId,
        propName,
        finalValue,
        current?.unit ?? "Percent",
        incomingProv,
        incomingConf
      );
    } finally {
      this.releaseLock(twinId);
    }
  }
}

export const activeTwinSynchronizationCoordinator = new TwinSynchronizationCoordinator();
