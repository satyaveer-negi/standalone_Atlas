import type { AtlasPlugin, PluginCapabilityContribution } from "../../sdk/AtlasPlugin";

export class PythonPlugin implements AtlasPlugin {
  id = "plugin-python";
  name = "Native Python & Django AST Plugin";
  apiVersion = "1.0" as const;

  async activate(kernel: any): Promise<void> {
    console.log(`[PythonPlugin] 🐍 Activated Python/Django AST language plugin.`);
  }

  async deactivate(): Promise<void> {
    console.log(`[PythonPlugin] 🛑 Deactivated Python plugin.`);
  }

  contributeCapabilities(): PluginCapabilityContribution[] {
    return [
      {
        id: "cap-py-ast-analyzer",
        name: "Python/Django AST Symbol Extractor",
        category: "analyzer",
        version: "1.0",
      },
    ];
  }
}
