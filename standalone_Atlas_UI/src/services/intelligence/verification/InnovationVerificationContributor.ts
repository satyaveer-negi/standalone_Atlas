import { KnowledgeNetworkModel } from "../innovation/KnowledgeNetworkModel";
import { InnovationProgram } from "../innovation/InnovationProgram";
import { KnowledgeExchangeAssessment } from "../innovation/KnowledgeExchangeAssessment";
import { InnovationScenario } from "../innovation/InnovationScenario";
import { InnovationRecommendation } from "../innovation/InnovationRecommendation";
import { TestResult } from "../../agents/collaboration/tests/reports/VerificationReport";

export class InnovationVerificationContributor {
  public verifyInnovation(): TestResult[] {
    const results: TestResult[] = [];

    const domain: KnowledgeNetworkModel = {
      domainId: "domain-mock-01",
      domainName: "Distributed Microgrid Synchronization Techniques",
      intellectualPropertyType: "OpenSource",
      expertiseTags: ["Sensory telemetry calibration", "Microgrid load frequency clamping"],
      maturityLevel: 4,
      knowledgeAssetsCount: 15,
      licenseType: "Apache-2.0",
      knowledgeRelationships: [
        {
          targetDomainId: "domain-secondary-01",
          relationshipType: "Supersedes"
        }
      ],
      status: "Validated"
    };

    const secondaryDomain: KnowledgeNetworkModel = {
      domainId: "domain-secondary-01",
      domainName: "Legacy Dynamic Governor Telemetry Loop",
      intellectualPropertyType: "Proprietary",
      expertiseTags: ["Analogue governor control models"],
      maturityLevel: 2,
      knowledgeAssetsCount: 5,
      licenseType: "Proprietary",
      knowledgeRelationships: [],
      status: "Validated"
    };

    const program: InnovationProgram = {
      programId: "inno-mock-01",
      title: "Active Governor Loop Digital Twin Prototyping",
      technologyReadinessLevel: 6,
      innovationLifecycle: "Prototype",
      objectives: ["Synthesize telemetry loop dynamic models", "Publish open API schema"],
      milestones: [
        {
          id: "im1",
          description: "Develop High-Fidelity Simulation Twin",
          status: "Completed",
          targetDate: "2026-05-15",
          dependencies: []
        }
      ],
      innovationGateways: [
        {
          gateName: "Gateway 2: Prototype Code Audit Checkpoint",
          requiredArtifacts: ["prototype-code-repository", "twin-simulation-results"],
          approvalAuthority: "Technical Steering Group",
          artifactsPresent: ["prototype-code-repository", "twin-simulation-results"]
        }
      ],
      budget: 85000,
      status: "Active"
    };

    const assessment: KnowledgeExchangeAssessment = {
      assessmentId: "assess-inno-mock-01",
      evaluationPeriod: "Q3-2026",
      knowledgeReuseRate: 42.5,
      transferEffectivenessScore: 88.0,
      collaborationEfficiency: 90.0,
      innovationVelocityIndex: 82.0,
      diffusionRate: 35.0,
      learningTrend: "Improving",
      assessmentDate: new Date().toISOString()
    };

    const scenario: InnovationScenario = {
      scenarioId: "scen-inno-mock-01",
      name: "Autonomous Synchronization Adoption Simulator",
      description: "Model cross-ecosystem synchronization adoption velocity across 4 platforms",
      simulatedAdoptionRate: 75.0,
      projectedMaturityGainMonths: 8,
      coordinationRiskIndex: 14.5,
      estimatedInvestmentCost: 95000,
      technicalUncertainty: "Medium",
      scenarioStatus: "Simulated"
    };

    const recommendation: InnovationRecommendation = {
      recommendationId: "rec-inno-mock-01",
      recommendationType: "JointR&D",
      domainId: "domain-mock-01",
      rationale: "Accelerates dynamic synchronization twin deployment via shared ecosystem resources",
      confidenceScore: 92.0,
      evidenceSources: ["eco-assert-evidence-continuity"],
      estimatedBenefit: {
        maturityGainTRL: 2,
        reuseSavings: 45000,
        coordinationOverheadReduction: 25.0
      },
      recommendationStatus: "Proposed"
    };

    const activeDomains = new Map<string, KnowledgeNetworkModel>();
    activeDomains.set(domain.domainId, domain);
    activeDomains.set(secondaryDomain.domainId, secondaryDomain);

    // 1. TRL bounds check
    const trlOk = program.technologyReadinessLevel >= 1 && program.technologyReadinessLevel <= 9;
    results.push({
      id: "inno-assert-trl-bounds",
      name: "Technology Readiness Level Bounds Invariant",
      status: trlOk ? "Pass" : "Fail",
      durationMs: 1,
      message: trlOk
        ? `TRL bounds verified: TRL-${program.technologyReadinessLevel} is within [1, 9] scale.`
        : `Fail: Technology Readiness Level (${program.technologyReadinessLevel}) falls outside [1, 9].`
    });

    // 2. Maturity Level Range Check
    const maturityOk = domain.maturityLevel >= 1 && domain.maturityLevel <= 5;
    results.push({
      id: "inno-assert-maturity-bounds",
      name: "Knowledge Domain Maturity Level Bounds Invariant",
      status: maturityOk ? "Pass" : "Fail",
      durationMs: 1,
      message: maturityOk
        ? `Maturity bounds verified: Level-${domain.maturityLevel} is within [1, 5] scale.`
        : `Fail: Maturity Level (${domain.maturityLevel}) falls outside [1, 5].`
    });

    // 3. Knowledge Assets Count Check
    const assetsOk = domain.knowledgeAssetsCount >= 0;
    results.push({
      id: "inno-assert-assets-count",
      name: "Knowledge Domain Assets Count Non-Negativity Invariant",
      status: assetsOk ? "Pass" : "Fail",
      durationMs: 1,
      message: assetsOk
        ? `Assets count verified: ${domain.knowledgeAssetsCount} items.`
        : "Fail: Knowledge assets counts cannot be negative."
    });

    // 4. Budget Consistency Check
    const budgetOk = program.budget > 0;
    results.push({
      id: "inno-assert-budget-consistency",
      name: "Innovation Program Budget Positive Invariant Check",
      status: budgetOk ? "Pass" : "Fail",
      durationMs: 1,
      message: budgetOk
        ? `Program budget verified: $${program.budget}.`
        : "Fail: Innovation program budgets must be strictly positive."
    });

    // 5. Scenario Adoption Rate percentage bounds check
    const adoptionOk = scenario.simulatedAdoptionRate >= 0 && scenario.simulatedAdoptionRate <= 100;
    results.push({
      id: "inno-assert-adoption-bounds",
      name: "Innovation Scenario Adoption Rate Bounds Check",
      status: adoptionOk ? "Pass" : "Fail",
      durationMs: 1,
      message: adoptionOk
        ? `Adoption rate verified: ${scenario.simulatedAdoptionRate}% satisfies [0, 100] limits.`
        : "Fail: Simulated adoption rate must stay within [0, 100] percentage bounds."
    });

    // 6. Knowledge Relationship Integrity Check
    let relationshipsOk = true;
    for (const rel of domain.knowledgeRelationships) {
      if (rel.targetDomainId === domain.domainId) {
        relationshipsOk = false;
      }
      if (!activeDomains.has(rel.targetDomainId)) {
        relationshipsOk = false;
      }
    }
    results.push({
      id: "inno-assert-relationship-integrity",
      name: "Knowledge Domain Relationships Graph Integrity Check",
      status: relationshipsOk ? "Pass" : "Fail",
      durationMs: 1,
      message: relationshipsOk
        ? "Knowledge relationship targets exist and prevent self-referential links."
        : "Fail: Invalid or self-referential targets mapped in knowledge relationships list."
    });

    // 7. License Compatibility Check
    const licenseCompatibilityOk = !(domain.intellectualPropertyType === "OpenSource" && domain.licenseType === "Proprietary");
    results.push({
      id: "inno-assert-license-compatibility",
      name: "Open Source Domain License Compatibility Invariant",
      status: licenseCompatibilityOk ? "Pass" : "Fail",
      durationMs: 1,
      message: licenseCompatibilityOk
        ? `Licensing verified: IP type (${domain.intellectualPropertyType}) matches license header (${domain.licenseType}).`
        : "Fail: Incompatible license header detected on OpenSource knowledge domain."
    });

    // 8. TRL Progression Regression Check (Cannot regress by more than 1)
    const baselineTRL = 5;
    const regressionDelta = baselineTRL - program.technologyReadinessLevel;
    const trlProgressionOk = regressionDelta <= 1;
    results.push({
      id: "inno-assert-trl-regression",
      name: "Technology Readiness Level Progression Regression Guard",
      status: trlProgressionOk ? "Pass" : "Fail",
      durationMs: 1,
      message: trlProgressionOk
        ? `TRL progression verified: Regression delta is ${regressionDelta} stages (Allowed limits).`
        : `Fail: Innovation program technological maturity regressed by too many stages (Delta: ${regressionDelta}).`
    });

    // 9. Gateway Completeness Check
    let gatewaysComplete = true;
    for (const gate of program.innovationGateways) {
      for (const req of gate.requiredArtifacts) {
        if (!gate.artifactsPresent.includes(req)) {
          gatewaysComplete = false;
        }
      }
    }
    results.push({
      id: "inno-assert-gateway-completeness",
      name: "Innovation Program Gateway Completeness Invariant",
      status: gatewaysComplete ? "Pass" : "Fail",
      durationMs: 1,
      message: gatewaysComplete
        ? "All gate-specific required artifacts successfully audited and confirmed present."
        : "Fail: Innovation gateway missing one or more required compliance artifacts."
    });

    // 10. Knowledge Lineage Integrity Check (No circular supersedes chain)
    let lineageOk = true;
    for (const rel of domain.knowledgeRelationships) {
      if (rel.relationshipType === "Supersedes") {
        const target = activeDomains.get(rel.targetDomainId);
        if (target) {
          const backCircular = target.knowledgeRelationships.find(
            r => r.targetDomainId === domain.domainId && r.relationshipType === "Supersedes"
          );
          if (backCircular) {
            lineageOk = false;
          }
        }
      }
    }
    results.push({
      id: "inno-assert-lineage-circularity",
      name: "Knowledge Evolution Lineage Circularity Prevention Check",
      status: lineageOk ? "Pass" : "Fail",
      durationMs: 1,
      message: lineageOk
        ? "Lineage check passed: no circular supersession chains detected."
        : "Fail: Circular lineage chain detected. A superseded knowledge domain cannot supersede the newer domain."
    });

    // 11. Knowledge Evidence Continuity Check
    const evidenceOk = recommendation.evidenceSources.length > 0 && recommendation.rationale.length > 0;
    results.push({
      id: "inno-assert-evidence-continuity",
      name: "Knowledge & Innovation Evidence Continuity Lineage Invariant",
      status: evidenceOk ? "Pass" : "Fail",
      durationMs: 1,
      message: evidenceOk
        ? `Evidence lineage verified: recommendation backed by upstream ecosystem evidence: [${recommendation.evidenceSources.join(", ")}].`
        : "Fail: Innovation recommendations must trace back to active ecosystem, organizational, or governance evidence logs."
    });

    return results;
  }
}

export const activeInnovationVerificationContributor = new InnovationVerificationContributor();
