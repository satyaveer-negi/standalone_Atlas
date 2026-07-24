import { AtlasEventBus } from "../events/AtlasEventBus";
import { WorkspaceManager } from "../workspace/WorkspaceManager";
import { CapabilityRegistry } from "../registry/CapabilityRegistry";
import { PluginManager } from "../plugin/PluginManager";

export interface AtlasKernelConfig {
  eventBus?: AtlasEventBus;
  workspaceManager?: WorkspaceManager;
  capabilityRegistry?: CapabilityRegistry;
  pluginManager?: PluginManager;
}

export type KernelStatus =
  | "UNINITIALIZED"
  | "CONFIGURING"
  | "REGISTERING_PLUGINS"
  | "BUILDING_WORKSPACE"
  | "READY"
  | "SHUTTING_DOWN"
  | "DISPOSED";

export class AtlasKernel {
  readonly eventBus: AtlasEventBus;
  readonly workspaceManager: WorkspaceManager;
  readonly capabilityRegistry: CapabilityRegistry;
  readonly pluginManager: PluginManager;

  private status: KernelStatus = "UNINITIALIZED";

  constructor(config: AtlasKernelConfig = {}) {
    this.eventBus = config.eventBus || new AtlasEventBus();
    this.workspaceManager = config.workspaceManager || new WorkspaceManager();
    this.capabilityRegistry = config.capabilityRegistry || new CapabilityRegistry();
    this.pluginManager =
      config.pluginManager || new PluginManager(this.capabilityRegistry);
  }

  async boot(): Promise<void> {
    try {
      this.status = "CONFIGURING";
      console.log("[AtlasKernel] ⚡ Booting Atlas Operating System Engine...");

      this.status = "REGISTERING_PLUGINS";
      await this.pluginManager.activateAll(this);

      this.status = "BUILDING_WORKSPACE";
      const ws = this.workspaceManager.getWorkspace();
      console.log(`[AtlasKernel] 📁 Loaded workspace context: ${ws.name}`);

      this.status = "READY";
      console.log("[AtlasKernel] 🟢 Atlas Kernel is READY!");
    } catch (err) {
      console.error("[AtlasKernel] 🔴 Kernel boot failure:", err);
      throw err;
    }
  }

  async shutdown(): Promise<void> {
    this.status = "SHUTTING_DOWN";
    console.log("[AtlasKernel] ⏸️ Shutting down Atlas Kernel...");
    await this.pluginManager.deactivateAll();
    this.status = "DISPOSED";
    console.log("[AtlasKernel] 🛑 Atlas Kernel disposed cleanly.");
  }

  getStatus(): KernelStatus {
    return this.status;
  }

  getDiagnostics() {
    return {
      status: this.status,
      workspace: this.workspaceManager.getWorkspace().name,
      loadedPluginsCount: this.pluginManager.getLoadedPlugins().length,
      capabilitiesCount: this.capabilityRegistry.getAll().length,
      eventBusStats: this.eventBus.getStats(),
    };
  }
}
