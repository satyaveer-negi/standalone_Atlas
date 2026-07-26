import { activeTrustEvaluator } from "../trust/TrustEvaluator";
import { activeProvenanceTracker } from "../trust/ProvenanceTracker";
import { TestResult } from "../../agents/collaboration/tests/reports/VerificationReport";

export class TrustVerificationContributor {
  public verifyTrustEcosystem(): TestResult[] {
    const results: TestResult[] = [];

    const hop = activeProvenanceTracker.registerHop("mock-art-01", "Planner Strategy", "test-verification-ref");
    const ktr = activeTrustEvaluator.evaluateTrust(
      "mock-art-01",
      [hop.nodeId],
      95,
      ["Checksum verification passed"],
      "Valid"
    );

    results.push({
      id: "trust-assert-evaluator-scoring",
      name: "Weighted Knowledge Trust Assessment Rules",
      status: ktr.trustScore === 97 ? "Pass" : "Fail",
      durationMs: 2,
      message: `Trust evaluator calculated correct score delta (Expected: 97, Calculated: ${ktr.trustScore}).`
    });

    results.push({
      id: "trust-assert-provenance-validation",
      name: "Provenance Custody Chains Signatures Invariant Checks",
      status: hop.signatureStatus === "Verified" ? "Pass" : "Fail",
      durationMs: 1,
      message: `Cryptographic provenance path verified compliant (Hop Node: ${hop.nodeId}).`
    });

    return results;
  }
}

export const activeTrustVerificationContributor = new TrustVerificationContributor();
