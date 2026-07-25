import { activeTwinRegistry } from "./TwinRegistry";
import { TwinDescriptor } from "../core/TwinDescriptor";

export class DiscoveryService {
  public findTwinsByCapability(capabilityName: string): TwinDescriptor[] {
    return activeTwinRegistry.getDescriptorsList().filter(desc =>
      desc.capabilities.some(cap => cap.name === capabilityName)
    );
  }

  public findTwinsByDomain(domain: string): TwinDescriptor[] {
    return activeTwinRegistry.getDescriptorsList().filter(desc => desc.domain === domain);
  }
}

export const activeDiscoveryService = new DiscoveryService();
