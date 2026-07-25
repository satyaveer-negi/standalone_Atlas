import { activeTwinRegistry } from "./TwinRegistry";
import { TwinDescriptor } from "../core/TwinDescriptor";

export class RegistrationService {
  public registerTwinDescriptor(desc: TwinDescriptor): void {
    activeTwinRegistry.register(desc);
  }

  public unregisterTwinDescriptor(id: string): void {
    activeTwinRegistry.unregister(id);
  }
}

export const activeRegistrationService = new RegistrationService();
