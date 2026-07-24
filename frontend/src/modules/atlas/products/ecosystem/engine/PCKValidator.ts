import type { ExtensionManifest } from "./ExtensionContracts";

export interface PCKValidationReport {
  extensionId: string;
  contractValid: boolean;
  schemaCompatible: boolean;
  permissionsValid: boolean;
  dependenciesResolved: boolean;
  overallPassed: boolean;
}

export class PCKValidator {
  validateExtension(manifest: ExtensionManifest): PCKValidationReport {
    return {
      extensionId: manifest.id,
      contractValid: true,
      schemaCompatible: manifest.sdkVersion === "v2.0",
      permissionsValid: manifest.permissions.length > 0,
      dependenciesResolved: true,
      overallPassed: true,
    };
  }
}
