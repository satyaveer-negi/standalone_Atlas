export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  signatureVerified: boolean;
}

// 🛠️ PROGRAM H2 / L MOCK SDK CLI PACKAGE VALIDATOR
export class PackageValidator {
  public validatePackage(manifest: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    console.log(`[SDK CLI] Running "atlas validate" on package manifest: ${manifest?.id || "unnamed"}`);

    if (!manifest.id) {
      errors.push("Missing required field 'id' in manifest header.");
    }
    if (!manifest.version) {
      errors.push("Missing required field 'version' in manifest header.");
    }
    if (!manifest.ontology) {
      errors.push("Missing required 'ontology' layer specification.");
    }

    if (manifest.version && !manifest.version.match(/^\d+\.\d+(\.\d+)?$/)) {
      warnings.push(`Version '${manifest.version}' does not follow semver conventions.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      signatureVerified: manifest.signature !== "unsigned",
    };
  }

  public runDoctorDiagnostics(systemId: string): string[] {
    console.log(`[SDK CLI] Running "atlas doctor" diagnostics for system: "${systemId}"`);
    return [
      `[doctor] Checking Kernel Bus connections... OK`,
      `[doctor] Resolving Package dependencies... OK`,
      `[doctor] Validating AIR graph integrity... OK`,
      `[doctor] No compilation or runtime conflicts detected. System is healthy.`
    ];
  }
}

export const activePackageValidator = new PackageValidator();
