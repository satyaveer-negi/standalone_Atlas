export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  isolationLevel: "TRUSTED" | "NATIVE" | "SANDBOXED" | "REMOTE";
  capabilities: string[];
  providedEntities?: string[];
  providedSimulations?: string[];
  providedAgents?: string[];
}

export class PluginSDK {
  validateManifest(manifest: PluginManifest): boolean {
    return !!(manifest.id && manifest.name && manifest.version && manifest.isolationLevel);
  }
}
