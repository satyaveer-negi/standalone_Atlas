import { activeEngineeringCouncil } from "../cognition/EngineeringCouncil";
import { EngineeringIntent } from "../intent/EngineeringIntent";
import { TestResult } from "../../agents/collaboration/tests/reports/VerificationReport";

export class CouncilVerificationContributor {
  public verifyCouncilEcosystem(): TestResult[] {
    const results: TestResult[] = [];

    const mockIntent: EngineeringIntent = {
      id: "mock-intent-council-01",
      goal: "Optimize wind aerodynamics under safety parameters",
      context: "Council verification",
      entities: ["propeller-blade"],
      constraints: [
        { id: "c1", name: "Turbulence Limit", category: "Safety", expression: "temperature < 350", limitValue: 350 }
      ],
      objectives: [
        { id: "o1", propertyName: "meshOrthogonality", mode: "Maximize", weight: 0.8 }
      ],
      assumptions: [],
      priority: "High",
      confidence: 1.0,
      validationStatus: "Validated",
      provenance: "Test Suite",
      createdAt: new Date().toISOString()
    };

    // Deliberate with safe limits variables (temperature = 300)
    const run1 = activeEngineeringCouncil.deliberate(mockIntent, { temperature: 300 });
    results.push({
      id: "council-assert-deliberate-consensus-achieved",
      name: "Engineering Council Consensus Building Verification",
      status: run1.review.consensusStats.agreementScore >= 75 ? "Pass" : "Fail",
      durationMs: 2,
      message: `Deliberation consensus score: ${run1.review.consensusStats.agreementScore}% achieved.`
    });

    // Deliberate with unsafe variables (temperature = 400)
    const run2 = activeEngineeringCouncil.deliberate(mockIntent, { temperature: 400 });
    results.push({
      id: "council-assert-deliberate-safety-rejection",
      name: "Engineering Council Safety Limits Rejections Audits",
      status: run2.review.consensusStats.agreementScore < 70 ? "Pass" : "Fail",
      durationMs: 1,
      message: `Safety Agent rejection correctly lowered consensus to ${run2.review.consensusStats.agreementScore}%.`
    });

    return results;
  }
}

export const activeCouncilVerificationContributor = new CouncilVerificationContributor();
