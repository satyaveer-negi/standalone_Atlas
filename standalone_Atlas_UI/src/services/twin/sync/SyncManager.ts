import { SyncAdapter } from "./SyncAdapter";
import { activeSyncEngine } from "./SyncEngine";
import { activeTwinRepository } from "../core/TwinRepository";

export class SyncManager {
  private adaptersMap = new Map<string, SyncAdapter>(); // key: twinId

  public registerAdapter(twinId: string, adapter: SyncAdapter): void {
    this.adaptersMap.set(twinId, adapter);
  }

  public async triggerSync(twinId: string): Promise<void> {
    const adapter = this.adaptersMap.get(twinId);
    if (!adapter) {
      console.warn(`[Sync Manager] No registered adapter found for twin "${twinId}"`);
      const twin = activeTwinRepository.getTwin(twinId);
      if (twin) {
        twin.syncState = "Disconnected";
      }
      return;
    }

    await activeSyncEngine.synchronize(twinId, adapter);
  }

  public getAdapterForTwin(twinId: string): SyncAdapter | null {
    return this.adaptersMap.get(twinId) ?? null;
  }
}

export const activeSyncManager = new SyncManager();
