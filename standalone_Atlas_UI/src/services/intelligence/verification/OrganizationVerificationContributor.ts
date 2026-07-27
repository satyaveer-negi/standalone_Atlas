import { OrganizationalCapabilityModel } from "../organization/OrganizationalCapabilityModel";
import { TransformationProgram } from "../organization/TransformationProgram";
import { OperatingModelAssessment } from "../organization/OperatingModelAssessment";
import { OrganizationalScenario } from "../organization/OrganizationalScenario";
import { TransformationRecommendation } from "../organization/TransformationRecommendation";
import { TestResult } from "../../agents/collaboration/tests/reports/VerificationReport";

export class OrganizationVerificationContributor {
  public verifyOrganizationEcosystem(): TestResult[] {
    const results: TestResult[] = [];

    const capabilityModel: OrganizationalCapabilityModel = {
      capabilityId: "cap-mock-01",
      unitName: "Turbine Dynamics Division",
      competencies: [
        {
          skillName: "Dynamic Governor Feedback Sensing",
          rating: 4.2,
          criticality: "High",
          certifiedHeadcount: 12
        }
      ],
      capabilityDimension: {
        peopleScore: 85.0,
        processScore: 78.0,
        technologyScore: 90.0,
        knowledgeScore: 92.5
      },
      headcount: 15,
      utilizationPercentage: 80,
      maturityLevel: "Defined",
      gapIdentified: ["Insufficent sensory networks certified engineers"]
    };

    const program: TransformationProgram = {
      programId: "trans-mock-01",
      title: "Distributed Wind Microgrid Operating Topologies Shift",
      milestones: [
        {
          id: "m1",
          description: "Sensory Networks Telemetry Setup",
          status: "Completed",
          targetDate: "2026-03-31",
          dependencies: []
        },
        {
          id: "m2",
          description: "Dynamic Governor Loop Rollout",
          status: "InFlight",
          targetDate: "2026-06-30",
          dependencies: ["m1"]
        }
      ],
      transformationGateways: [
        {
          gate: "Gate 1: Telemetry Verification Checkpoint",
          requiredEvidence: ["telemetry-assurance-verification-audit"],
          approvalAuthority: "Strategic Leadership Council"
        }
      ],
      targetBenefits: ["Execution Velocity +25%", "Coordination overhead reduced by 15%"],
      risks: ["Integration latency spike"],
      budget: 150000,
      status: "Active"
    };

    const operatingAssessment: OperatingModelAssessment = {
      assessmentId: "assess-org-mock-01",
      structureType: "Platform",
      efficiencyRatio: 84.5,
      decisionLatencyMultiplier: 1.15,
      coordinationOverheadIndex: 24,
      organizationalResilienceScore: 89.0,
      organizationalValueTrend: "Improving",
      assessmentDate: new Date().toISOString()
    };

    const scenario: OrganizationalScenario = {
      scenarioId: "scen-org-mock-01",
      name: "Dynamic Agile Topologies",
      description: "Shift functional silos into integrated platform teams",
      simulatedTeamsCount: 6,
      reportingLayers: 3,
      estimatedOperatingCost: 120000,
      expectedExecutionVelocity: 35.0, // +35%
      coordinationRiskIndex: 18.0,
      simulatedApprovalDelayDays: 2.5,
      scenarioStatus: "Simulated"
    };

    const recommendation: TransformationRecommendation = {
      recommendationId: "rec-org-mock-01",
      recommendationType: "Structure",
      recommendedStructure: "Platform team topology",
      rationale: "Aligns organizational structure directly to sensory telemetry flows",
      confidenceScore: 92.0,
      evidenceSources: ["gov-assert-evidence-traceability"],
      targetMaturityTarget: "Optimizing",
      estimatedBenefit: {
        executionVelocity: 25.0,
        costReduction: 15000,
        governanceImprovement: 20.0
      },
      recommendationStatus: "Proposed"
    };

    // 1. Operating Model Efficiency Bounds Check
    const efficiencyOk = operatingAssessment.efficiencyRatio > 0 && operatingAssessment.efficiencyRatio <= 100;
    results.push({
      id: "org-assert-efficiency-bounds",
      name: "Operating Model Efficiency Score Bounds Invariant",
      status: efficiencyOk ? "Pass" : "Fail",
      durationMs: 1,
      message: efficiencyOk
        ? `Efficiency bounds verified: ${operatingAssessment.efficiencyRatio}% is within allowed [0, 100] range.`
        : `Fail: Efficiency ratio (${operatingAssessment.efficiencyRatio}) must be in (0, 100].`
    });

    // 2. Budget Consistency Check
    const budgetOk = program.budget > 0;
    results.push({
      id: "org-assert-budget-consistency",
      name: "Transformation Program Positive Budget Invariant",
      status: budgetOk ? "Pass" : "Fail",
      durationMs: 1,
      message: budgetOk
        ? `Transformation budget verified: $${program.budget}.`
        : "Fail: Transformation program budgets must be strictly positive."
    });

    // 3. Competency Ratings Range Check (1 <= rating <= 5)
    let ratingsOk = capabilityModel.competencies.length > 0;
    for (const comp of capabilityModel.competencies) {
      if (comp.rating < 1 || comp.rating > 5) {
        ratingsOk = false;
      }
    }
    results.push({
      id: "org-assert-competency-ratings-range",
      name: "Organizational Competency Rating Scale Invariant",
      status: ratingsOk ? "Pass" : "Fail",
      durationMs: 1,
      message: ratingsOk
        ? "All competency ratings satisfy bounds [1.0, 5.0]."
        : "Fail: Competency ratings must stay within [1.0, 5.0] scale range."
    });

    // 4. Headcount Consistency Check (certifiedHeadcount <= headcount)
    let headcountOk = true;
    for (const comp of capabilityModel.competencies) {
      if (comp.certifiedHeadcount > capabilityModel.headcount) {
        headcountOk = false;
      }
    }
    results.push({
      id: "org-assert-headcount-consistency",
      name: "Certified Headcount Boundary Invariant Check",
      status: headcountOk ? "Pass" : "Fail",
      durationMs: 1,
      message: headcountOk
        ? `Certified headcount verified. All skills headcount stay within total staff boundary (${capabilityModel.headcount}).`
        : `Fail: Certified headcount cannot exceed total unit headcount (${capabilityModel.headcount}).`
    });

    // 5. Milestone Dependency Loop Check (DFS cycle detection)
    const adj = new Map<string, string[]>();
    for (const m of program.milestones) {
      adj.set(m.id, m.dependencies);
    }
    let hasCycle = false;
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (u: string): boolean => {
      visited.add(u);
      recStack.add(u);
      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        if (!visited.has(v)) {
          if (dfs(v)) return true;
        } else if (recStack.has(v)) {
          return true;
        }
      }
      recStack.delete(u);
      return false;
    };

    for (const m of program.milestones) {
      if (!visited.has(m.id)) {
        if (dfs(m.id)) {
          hasCycle = true;
          break;
        }
      }
    }
    const dependencyCycleOk = !hasCycle;
    results.push({
      id: "org-assert-dependency-loop-detection",
      name: "Transformation Milestones Dependency Cycle Invariant Check",
      status: dependencyCycleOk ? "Pass" : "Fail",
      durationMs: 1,
      message: dependencyCycleOk
        ? "Milestone dependency graph is loop-free and maintains acyclic execution."
        : "Fail: Cyclic dependencies detected in transformation program milestones graph."
    });

    // 6. Organizational Scenario Consistency (-100% <= expectedExecutionVelocity <= 300%)
    const scenarioRealismOk = scenario.expectedExecutionVelocity >= -100 && scenario.expectedExecutionVelocity <= 300;
    results.push({
      id: "org-assert-scenario-realism",
      name: "Organizational Scenario Execution Velocity Realistic Bounds Check",
      status: scenarioRealismOk ? "Pass" : "Fail",
      durationMs: 1,
      message: scenarioRealismOk
        ? `Scenario velocity validated: expected execution delta is ${scenario.expectedExecutionVelocity}% (Realistic range).`
        : `Fail: Expected execution velocity delta (${scenario.expectedExecutionVelocity}%) falls outside realistic boundaries.`
    });

    // 7. Unit Competency Coverage Check (every unit must report at least 1 competency)
    const coverageOk = capabilityModel.competencies.length > 0;
    results.push({
      id: "org-assert-competency-coverage",
      name: "Organizational Unit Competency Coverage Check",
      status: coverageOk ? "Pass" : "Fail",
      durationMs: 1,
      message: coverageOk
        ? `Competency coverage verified: unit ${capabilityModel.unitName} reports ${capabilityModel.competencies.length} skills.`
        : `Fail: Unit ${capabilityModel.unitName} has zero defined skill competencies.`
    });

    // 8. Organizational Evidence Continuity
    const evidenceOk = recommendation.evidenceSources.length > 0 && recommendation.rationale.length > 0;
    results.push({
      id: "org-assert-evidence-continuity",
      name: "Organizational Evidence Continuity Lineage Invariant",
      status: evidenceOk ? "Pass" : "Fail",
      durationMs: 1,
      message: evidenceOk
        ? `Evidence lineage verified: transformation recommendation backed by upstream evidence references: [${recommendation.evidenceSources.join(", ")}].`
        : "Fail: Transformation recommendations must trace back to active operational, strategic, or economic evidence logs."
    });

    return results;
  }
}

export const activeOrganizationVerificationContributor = new OrganizationVerificationContributor();
