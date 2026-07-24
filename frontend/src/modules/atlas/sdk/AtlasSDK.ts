import type { AtlasKernel } from "../engine/kernel/AtlasKernel";
import type { GraphQueryEngine } from "../engine/scene/GraphQueryEngine";
import type { DigitalTwinStateStore } from "../engine/twin/DigitalTwinStateStore";
import type { AtlasEventBus } from "../engine/events/AtlasEventBus";
import type { CapabilityRegistry } from "../engine/registry/CapabilityRegistry";

export class AtlasSDK {
  readonly kernel: AtlasKernel;

  constructor(kernel: AtlasKernel) {
    this.kernel = kernel;
  }

  get graph(): GraphQueryEngine {
    return new GraphQueryEngine(this.kernel.pluginManager as any);
  }

  get events(): AtlasEventBus {
    return this.kernel.eventBus;
  }

  get capabilities(): CapabilityRegistry {
    return this.kernel.capabilityRegistry;
  }

  get workspace() {
    return this.kernel.workspaceManager.getWorkspace();
  }
}
