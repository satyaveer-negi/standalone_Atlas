import type { AtlasPlugin, PluginCapabilityContribution } from "../../sdk/AtlasPlugin";

export class TypeScriptPlugin implements AtlasPlugin {
  id = "plugin-typescript";
  name = "Native TypeScript & React AST Plugin";
  apiVersion = "1.0" as const;

  async activate(kernel: any): Promise<void> {
    console.log(`[TypeScriptPlugin] ⚡ Activated TypeScript AST language plugin.`);
  }

  async deactivate(): Promise<void> {
    console.log(`[TypeScriptPlugin] 🛑 Deactivated TypeScript plugin.`);
  }

  contributeCapabilities(): PluginCapabilityContribution[] {
    return [
      {
        id: "cap-ts-ast-analyzer",
        name: "TypeScript AST Symbol Extractor",
        category: "analyzer",
        version: "1.0",
      },
    ];
  }
}
