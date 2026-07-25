import { activeTwinRegistry } from "./TwinRegistry";

export class HeartbeatService {
  private healthTimes = new Map<string, string>(); // twinId -> timestamp

  public pulse(twinId: string): void {
    const timestamp = new Date().toISOString();
    this.healthTimes.set(twinId, timestamp);
    
    const desc = activeTwinRegistry.getDescriptor(twinId);
    if (desc) {
      desc.status = "Online";
    }
  }

  public getHeartbeat(twinId: string): string | null {
    return this.healthTimes.get(twinId) ?? null;
  }
}

export const activeHeartbeatService = new HeartbeatService();
