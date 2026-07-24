export interface PluginCapabilityContribution {
  id: string;
  name: string;
  category: "lens" | "inspectorTab" | "mission" | "command" | "analyzer";
  version: string;
}

export interface AtlasPlugin {
  id: string;
  name: string;
  apiVersion: "1.0";
  dependencies?: string[];

  activate(kernel: any): Promise<void>;
  deactivate(): Promise<void>;

  contributeCapabilities?(): PluginCapabilityContribution[];
}
