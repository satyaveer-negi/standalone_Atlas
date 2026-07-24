import type { ExtensionManifest } from "./ExtensionContracts";

export class PluginWorkbench {
  createDraftExtension(name: string, category: any): ExtensionManifest {
    return {
      id: `ext-custom-${Date.now()}`,
      name: name || "Custom Atlas Extension Pack",
      version: "1.0.0",
      sdkVersion: "v2.0",
      author: "Local Developer Workbench",
      category: category || "VISUALIZATION",
      capabilities: ["render:custom_3d_widget"],
      permissions: ["read:knowledge_graph"],
      dependencies: [],
      minimumPlatformVersion: "v5.8.0",
      status: "ACTIVATED",
    };
  }
}
