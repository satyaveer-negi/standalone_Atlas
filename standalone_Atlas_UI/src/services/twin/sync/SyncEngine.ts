import { SyncAdapter } from "./SyncAdapter";
import { activeTwinStateEngine } from "../state/TwinStateEngine";
import { activeTwinRepository } from "../core/TwinRepository";

export class SyncEngine {
  public async synchronize(twinId: string, adapter: SyncAdapter): Promise<void> {
    const twin = activeTwinRepository.getTwin(twinId);
    if (!twin) return;

    twin.syncState = "Synchronizing";

    try {
      const updates = await adapter.fetchUpdates();
      
      updates.forEach(upd => {
        activeTwinStateEngine.updateStateProperty(
          twinId,
          upd.entityId,
          upd.propertyName,
          upd.value,
          upd.unit,
          upd.provenance,
          upd.confidence
        );
      });

      twin.syncState = "Synchronized";
      console.log(`[Sync Engine] Successfully synchronized Twin "${twinId}" using adapter "${adapter.name}". Updates: ${updates.length}`);
    } catch (err) {
      twin.syncState = "Error";
      console.error(`[Sync Engine] Sync failed for Twin "${twinId}":`, err);
    }
  }
}

export const activeSyncEngine = new SyncEngine();
