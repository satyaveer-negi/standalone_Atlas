import type { AtlasPlugin } from "../../sdk/AtlasPlugin";
import type { CapabilityRegistry } from "../registry/CapabilityRegistry";

export class PluginManager {
  private plugins: Map<string, AtlasPlugin> = new Map();
  private activePlugins: Set<string> = new Set();
  private capabilityRegistry: CapabilityRegistry;

  constructor(capabilityRegistry: CapabilityRegistry) {
    this.capabilityRegistry = capabilityRegistry;
  }

  registerPlugin(plugin: AtlasPlugin) {
    if (this.plugins.has(plugin.id)) {
      console.warn(`[PluginManager] Plugin ${plugin.id} already registered.`);
      return;
    }
    this.plugins.set(plugin.id, plugin);
  }

  async activateAll(kernel: any): Promise<void> {
    const sortedPlugins = this.resolveDependencies();
    for (const plugin of sortedPlugins) {
      if (!this.activePlugins.has(plugin.id)) {
        try {
          await plugin.activate(kernel);
          this.activePlugins.add(plugin.id);

          // Register capability contributions
          if (plugin.contributeCapabilities) {
            const caps = plugin.contributeCapabilities();
            caps.forEach((cap) => {
              this.capabilityRegistry.register({
                ...cap,
                provider: plugin.id,
              });
            });
          }
        } catch (err) {
          console.error(`[PluginManager] Failed to activate plugin ${plugin.id}:`, err);
        }
      }
    }
  }

  async deactivateAll(): Promise<void> {
    for (const pluginId of Array.from(this.activePlugins)) {
      const plugin = this.plugins.get(pluginId);
      if (plugin) {
        try {
          await plugin.deactivate();
          this.activePlugins.delete(pluginId);
        } catch (err) {
          console.error(`[PluginManager] Failed to deactivate plugin ${pluginId}:`, err);
        }
      }
    }
  }

  private resolveDependencies(): AtlasPlugin[] {
    const list: AtlasPlugin[] = Array.from(this.plugins.values());
    // Topological sort by dependencies
    const resolved: AtlasPlugin[] = [];
    const visited = new Set<string>();

    const visit = (plugin: AtlasPlugin) => {
      if (visited.has(plugin.id)) return;
      visited.add(plugin.id);

      if (plugin.dependencies) {
        for (const depId of plugin.dependencies) {
          const depPlugin = this.plugins.get(depId);
          if (depPlugin) visit(depPlugin);
        }
      }
      resolved.push(plugin);
    };

    list.forEach(visit);
    return resolved;
  }

  getLoadedPlugins(): { id: string; name: string; active: boolean }[] {
    return Array.from(this.plugins.values()).map((p) => ({
      id: p.id,
      name: p.name,
      active: this.activePlugins.has(p.id),
    }));
  }
}
