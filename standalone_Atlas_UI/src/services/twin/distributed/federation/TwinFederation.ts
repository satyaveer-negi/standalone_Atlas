import { activeTwinRegistry } from "../registry/TwinRegistry";
import { activeTwinRepository } from "../../core/TwinRepository";

export class TwinFederation {
  public queryRemoteTwin(twinId: string): Record<string, any> | null {
    const desc = activeTwinRegistry.getDescriptor(twinId);
    if (!desc) return null;

    // Retrieve from our repository database simulation
    const twin = activeTwinRepository.getTwin(twinId);
    if (!twin) return null;

    const data: Record<string, any> = {};
    twin.entities.forEach(ent => {
      data[ent.id] = { ...ent.properties };
    });
    return data;
  }
}

export const activeTwinFederation = new TwinFederation();
