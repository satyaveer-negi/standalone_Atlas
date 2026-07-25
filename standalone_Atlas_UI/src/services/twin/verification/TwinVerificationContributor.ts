import { activeTwinRepository } from "../core/TwinRepository";
import { activeTwinStateEngine } from "../state/TwinStateEngine";
import { TestResult } from "../../agents/collaboration/tests/reports/VerificationReport";

export class TwinVerificationContributor {
  public verifyTwinIntegrity(): TestResult[] {
    const results: TestResult[] = [];

    // Test 1: Twin aggregate instantiation
    activeTwinRepository.clear();
    const twin = activeTwinRepository.createTwin("verif-twin", "Test Propeller Twin", "Aerodynamics");

    results.push({
      id: "twin-assert-instantiation",
      name: "DigitalTwin Aggregate Root Init",
      status: twin && twin.metadata.id === "verif-twin" ? "Pass" : "Fail",
      durationMs: 1,
      message: twin ? "DigitalTwin instance registered correctly." : "Twin creation failed."
    });

    // Test 2: State engine version incrementation and provenance audit
    activeTwinStateEngine.updateStateProperty(
      "verif-twin",
      "blade-01",
      "temperature",
      340,
      "Kelvin",
      "Observed",
      0.95
    );

    const latest = activeTwinStateEngine.getLatestProperty("verif-twin", "blade-01", "temperature");
    results.push({
      id: "twin-assert-state-provenance",
      name: "State Provenance and Version Audit",
      status: latest && latest.versionInfo.version === 1 && latest.versionInfo.provenance === "Observed" ? "Pass" : "Fail",
      durationMs: 1,
      message: latest ? `Version ${latest.versionInfo.version} correctly cataloged under observed provenance.` : "State variable update did not register."
    });

    return results;
  }
}

export const activeTwinVerificationContributor = new TwinVerificationContributor();
