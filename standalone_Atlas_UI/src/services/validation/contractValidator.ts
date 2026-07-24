export type DiagnosticSeverity = "ERROR" | "WARNING" | "INFO";

export interface Diagnostic {
  id: string;
  severity: DiagnosticSeverity;
  subsystem: string;
  message: string;
  recommendation: string;
  timestamp: number;
}

// 🛡️ PROGRAM H4: CONTRACT VALIDATION ENGINE
export class ContractValidator {
  public validateAIRSpec(manifest: any): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    if (!manifest.systemId) {
      diagnostics.push({
        id: "err-air-sysid",
        severity: "ERROR",
        subsystem: "AIR Compiler",
        message: "Missing 'systemId' declaration in compiled package.",
        recommendation: "Ensure manifest contains a root string id.",
        timestamp: Date.now()
      });
    }

    if (!manifest.ontology || manifest.ontology.entities.length === 0) {
      diagnostics.push({
        id: "warn-air-ontology",
        severity: "WARNING",
        subsystem: "AIR Compiler",
        message: "AIR graph contains 0 compiled semantic entity definitions.",
        recommendation: "Scaffold at least one entity definition schema.",
        timestamp: Date.now()
      });
    }

    return diagnostics;
  }

  public validateLifecycle(componentName: string, state: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    if (state === "FAILED") {
      diagnostics.push({
        id: "err-lifecycle-failed",
        severity: "ERROR",
        subsystem: "Runtime Manager",
        message: `Runtime component "${componentName}" entered FAILED state.`,
        recommendation: "Run 'atlas doctor' to inspect dependency sorting.",
        timestamp: Date.now()
      });
    }

    return diagnostics;
  }
}

export const activeContractValidator = new ContractValidator();
