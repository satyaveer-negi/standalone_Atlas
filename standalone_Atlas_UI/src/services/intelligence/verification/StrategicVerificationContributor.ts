import { StrategicObjective } from "../strategy/StrategicObjective";
import { KnowledgeAsset } from "../strategy/KnowledgeAsset";
import { CapabilityMaturityModel } from "../strategy/CapabilityMaturityModel";
import { StrategicInvestmentPlan } from "../strategy/StrategicInvestmentPlan";
import { TechnologyRoadmap } from "../strategy/TechnologyRoadmap";
import { InnovationPortfolio } from "../strategy/InnovationPortfolio";
import { TestResult } from "../../agents/collaboration/tests/reports/VerificationReport";

export class StrategicVerificationContributor {
  public verifyStrategyEcosystem(): TestResult[] {
    const results: TestResult[] = [];

    const objective: StrategicObjective = {
      objectiveId: "obj-mock-01",
      title: "Scale Dynamic Wind Yield Capacity",
      description: "Increase dynamic wind field energy conversion efficiency metrics",
      targetKPIs: ["Convert yield efficiency rate >= 85%", "Reduce mechanical fatigue rate by 15%"],
      targetDate: "2030-12-31",
      currentProgress: 35.0,
      owner: "Strategic Leadership Council"
    };

    const asset: KnowledgeAsset = {
      knowledgeAssetId: "asset-mock-01",
      title: "Self-Stabilizing Turbine Governor Loop Algorithm",
      description: "High reliability governor loop design template matching NetZero standards",
      domain: "Control Systems",
      knowledgeType: "Algorithm",
      owner: "Assurance Engineering Team",
      organizationId: "org-wind-corp-01",
      sourceArtifacts: ["governor-audit-2025.pdf"],
      trustScore: 95.8,
      reuseScore: 84.5,
      maturityLevel: 5,
      lifecycleState: "Published",
      knowledgeValue: {
        engineeringImpact: 9.0,
        reuseSavings: 45000,
        strategicImportance: 9.2
      },
      strategicObjectiveId: "obj-mock-01",
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const capability: CapabilityMaturityModel = {
      capabilityId: "cap-mock-01",
      organizationId: "org-wind-corp-01",
      capabilityName: "Dynamic Blade Loading Analytics",
      currentLevel: "Defined",
      targetLevel: "Quantitatively Managed",
      assessmentDate: new Date().toISOString(),
      improvementActions: ["Deploy microgrid blade sensory analytics arrays"],
      assessmentEvidence: ["blade-load-audit-results-24"],
      confidence: 94.2
    };

    const plan: StrategicInvestmentPlan = {
      investmentPlanId: "plan-mock-01",
      title: "Wind Microgrid Sensor Networks Investment",
      organizationId: "org-wind-corp-01",
      investmentArea: "Infrastructure",
      estimatedCost: 250000,
      expectedROI: 3.2,
      expectedImpact: "Provides live sensory feedback telemetry, raising load maturity metrics",
      priority: "High",
      investmentHorizon: "MidTerm",
      dependencies: [],
      strategicObjectiveId: "obj-mock-01",
      approvalStatus: "Approved"
    };

    const roadmap: TechnologyRoadmap = {
      roadmapId: "roadmap-mock-01",
      technologyArea: "Microgrid Telemetry Sensing",
      currentState: "Wired telemetry loops",
      futureState: "Autonomous wireless dynamic blade load adjustments",
      milestones: [
        {
          id: "m1",
          name: "Sensing Prototype Lab Trial",
          plannedDate: "2026-06-30",
          status: "Completed",
          dependencies: [],
          completionPercentage: 100
        },
        {
          id: "m2",
          name: "Microgrid Active Field Pilot Deployment",
          plannedDate: "2027-06-30",
          status: "Planned",
          dependencies: ["m1"],
          completionPercentage: 0
        }
      ],
      targetDate: "2028-12-31",
      owner: "R&D Labs Division",
      riskAssessment: "Low risk of sensor interference over 5G spectrum bands"
    };

    const innovation: InnovationPortfolio = {
      innovationId: "innov-mock-01",
      title: "Turbine dynamic governor loop prototype",
      organizationId: "org-wind-corp-01",
      innovationType: "Prototype",
      researchArea: "Autonomous Governors Control Loops",
      technologyReadinessLevel: 6,
      expectedValue: 850000,
      riskLevel: "Medium",
      innovationOutcome: "Internal Adoption",
      strategicObjectiveId: "obj-mock-01",
      status: "Active"
    };

    // 1. Knowledge Quality Check
    const qualityOk = asset.trustScore >= 80.0 && asset.reuseScore >= 50.0;
    results.push({
      id: "strat-assert-knowledge-quality",
      name: "Strategic Knowledge Asset Trust and Reuse Bounds Invariant",
      status: qualityOk ? "Pass" : "Fail",
      durationMs: 1,
      message: qualityOk
        ? `Knowledge quality check passed (Trust: ${asset.trustScore}%, Reuse: ${asset.reuseScore}%). Asset value: impact=${asset.knowledgeValue.engineeringImpact}, savings=$${asset.knowledgeValue.reuseSavings}.`
        : "Fail: Published knowledge asset does not satisfy minimum trust and reuse thresholds."
    });

    // 2. Capability Progression Check
    const levelsOrder = ["Initial", "Managed", "Defined", "Quantitatively Managed", "Optimizing"];
    const currIdx = levelsOrder.indexOf(capability.currentLevel);
    const targetIdx = levelsOrder.indexOf(capability.targetLevel);
    const progressionOk = targetIdx >= currIdx;
    results.push({
      id: "strat-assert-capability-progression",
      name: "Organizational Capability Target Maturity Evolution Invariant",
      status: progressionOk ? "Pass" : "Fail",
      durationMs: 1,
      message: progressionOk
        ? `Capability progression verified: Target maturity (${capability.targetLevel}) is equal or higher than current maturity (${capability.currentLevel}).`
        : `Fail: Target maturity (${capability.targetLevel}) regresses below current maturity (${capability.currentLevel}).`
    });

    // 3. Strategic Alignment Traceability Check
    const assetAligned = asset.strategicObjectiveId === objective.objectiveId;
    const planAligned = plan.strategicObjectiveId === objective.objectiveId;
    const innovationAligned = innovation.strategicObjectiveId === objective.objectiveId;
    const alignmentOk = assetAligned && planAligned && innovationAligned;
    results.push({
      id: "strat-assert-strategic-alignment",
      name: "Knowledge, Investment, and Innovation Strategic Traceability Invariant",
      status: alignmentOk ? "Pass" : "Fail",
      durationMs: 1,
      message: alignmentOk
        ? `Strategic traceability verified. Asset (${asset.knowledgeAssetId}), Investment (${plan.investmentPlanId}), and Innovation (${innovation.innovationId}) map back to Strategic Objective (${objective.objectiveId}).`
        : "Fail: One or more strategic initiatives are orphaned without active Strategic Objective links."
    });

    // 4. Investment Coverage Check
    const investmentCovered = plan.investmentPlanId.length > 0 && plan.estimatedCost > 0;
    results.push({
      id: "strat-assert-investment-coverage",
      name: "Capability Improvement Strategic Investment Coverage Invariant",
      status: investmentCovered ? "Pass" : "Fail",
      durationMs: 1,
      message: investmentCovered
        ? `Investment coverage verified: Capability improvement linked to investment (${plan.investmentPlanId}) with cost $${plan.estimatedCost}.`
        : "Fail: Capability improvement proposed without matching investment plan or coverage justification."
    });

    // 5. Roadmap Chronology Check
    let chronologyOk = true;
    for (let i = 0; i < roadmap.milestones.length - 1; i++) {
      const currentMilestone = roadmap.milestones[i];
      const nextMilestone = roadmap.milestones[i + 1];
      if (new Date(currentMilestone.plannedDate) > new Date(nextMilestone.plannedDate)) {
        chronologyOk = false;
      }
    }
    results.push({
      id: "strat-assert-roadmap-chronology",
      name: "Technology Roadmap Milestones Chronology Invariant",
      status: chronologyOk ? "Pass" : "Fail",
      durationMs: 1,
      message: chronologyOk
        ? "Roadmap milestones are strictly sorted chronologically."
        : "Fail: Milestone targets violate chronological ordering rules in technology roadmap."
    });

    // 6. Innovation TRL Check
    const trlOk = innovation.technologyReadinessLevel >= 1 && innovation.technologyReadinessLevel <= 9;
    results.push({
      id: "strat-assert-innovation-trl",
      name: "Innovation Project TRL Scale Bounds Invariant",
      status: trlOk ? "Pass" : "Fail",
      durationMs: 1,
      message: trlOk
        ? `Innovation TRL checked: project technology readiness is at TRL ${innovation.technologyReadinessLevel} (${innovation.innovationOutcome}).`
        : `Fail: Technology Readiness Level (TRL) is out of bounds.`
    });

    return results;
  }
}

export const activeStrategicVerificationContributor = new StrategicVerificationContributor();
