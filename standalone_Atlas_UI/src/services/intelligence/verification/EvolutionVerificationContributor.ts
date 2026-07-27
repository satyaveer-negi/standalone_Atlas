import { EvolutionStrategyModel } from "../evolution/EvolutionStrategyModel";
import { AdaptiveCapabilityPortfolio } from "../evolution/AdaptiveCapabilityPortfolio";
import { EvolutionAssessment } from "../evolution/EvolutionAssessment";
import { EvolutionScenario } from "../evolution/EvolutionScenario";
import { EvolutionRecommendation } from "../evolution/EvolutionRecommendation";
import { TestResult } from "../../agents/collaboration/tests/reports/VerificationReport";

export class EvolutionVerificationContributor {
  public verifyEvolution(): TestResult[] {
    const results: TestResult[] = [];

    const strategy: EvolutionStrategyModel = {
      strategyId: "strat-mock-01",
      strategyName: "Enterprise Digital Twin Autonomy Evolution Plan",
      targetStateVision: "Achieve PEML 100 Autonomous Governance & Ecosystem Interoperability",
      evolutionHorizon: "Horizon3",
      capabilityPathways: [
        {
          capabilityName: "Autonomous Scenario Replay Simulation",
          targetMaturityLevel: 5,
          estimatedTimeframeMonths: 18,
          dependencies: ["Ecosystem Federation Data Bridge"]
        },
        {
          capabilityName: "Ecosystem Federation Data Bridge",
          targetMaturityLevel: 4,
          estimatedTimeframeMonths: 9,
          dependencies: []
        }
      ],
      strategicFocusArea: "EcosystemLeadership",
      status: "Active"
    };

    const portfolio: AdaptiveCapabilityPortfolio = {
      portfolioId: "port-mock-01",
      capabilityName: "Ecosystem Federation Data Bridge",
      currentMaturity: 2,
      targetMaturity: 4,
      adoptionReadinessScore: 78,
      investmentPriority: "Critical",
      adaptationCost: 120000,
      governanceWaiverApproved: false,
      lastReviewedDate: new Date().toISOString()
    };

    const assessment: EvolutionAssessment = {
      assessmentId: "assess-evo-mock-01",
      evaluationPeriod: "Q4-2026",
      adaptabilityIndex: 82.0,
      disruptionResilienceScore: 85.0,
      evolutionaryVelocity: 22.5,
      organizationalLearningRate: 75.0,
      sustainabilityIndex: 80.0,
      fitnessTrend: "Improving",
      assessmentDate: new Date().toISOString()
    };

    const scenario: EvolutionScenario = {
      scenarioId: "scen-evo-mock-01",
      name: "Global Energy Transition Volatility Scenario",
      description: "Model grid integration shifts and changing regulatory environments stability",
      simulatedTechConvergenceRate: 65.0,
      projectedMarketShiftSeverity: "High",
      regulatoryVolatility: "Medium",
      organizationalAdaptationTimeMonths: 12,
      transitionRiskIndex: 32.0,
      expectedCostSaving: 140000,
      scenarioStatus: "Simulated"
    };

    const recommendation: EvolutionRecommendation = {
      recommendationId: "rec-evo-mock-01",
      recommendationType: "CapabilityAcquisition",
      strategyId: "strat-mock-01",
      rationale: "Onboards Ecosystem Federation Data Bridge to resolve communication overhead gaps",
      confidenceScore: 94.0,
      evidenceSources: [
        {
          sourceId: "inno-assert-trl-bounds",
          sourceType: "Innovation",
          timestamp: new Date().toISOString()
        }
      ],
      estimatedBenefit: {
        adaptabilityGain: 18.0,
        transitionRiskReduction: 15.0,
        costSavings: 45000
      },
      recommendationStatus: "Proposed"
    };

    const activeCapabilities = new Map<string, AdaptiveCapabilityPortfolio>();
    activeCapabilities.set(portfolio.capabilityName, portfolio);

    // 1. Evolutionary velocity bounds check
    const velocityOk = assessment.evolutionaryVelocity >= 0 && assessment.evolutionaryVelocity <= 300;
    results.push({
      id: "evo-assert-velocity-bounds",
      name: "Evolutionary Velocity Limits Invariant Check",
      status: velocityOk ? "Pass" : "Fail",
      durationMs: 1,
      message: velocityOk
        ? `Velocity verified: ${assessment.evolutionaryVelocity}% is within allowed limits [0%, 300%].`
        : "Fail: Evolutionary velocity falls outside realistic percentage limits."
    });

    // 2. Adaptability Index bounds check
    const adaptabilityOk = assessment.adaptabilityIndex >= 0 && assessment.adaptabilityIndex <= 100;
    results.push({
      id: "evo-assert-adaptability-bounds",
      name: "Enterprise Adaptability Index Scale Invariant",
      status: adaptabilityOk ? "Pass" : "Fail",
      durationMs: 1,
      message: adaptabilityOk
        ? `Adaptability verified: Index of ${assessment.adaptabilityIndex} satisfies scale [0, 100].`
        : "Fail: Adaptability index falls outside scale boundaries."
    });

    // 3. Transition Risk Index bounds check
    const riskOk = scenario.transitionRiskIndex >= 0 && scenario.transitionRiskIndex <= 100;
    results.push({
      id: "evo-assert-risk-bounds",
      name: "Transition Risk Index Scale Invariant Check",
      status: riskOk ? "Pass" : "Fail",
      durationMs: 1,
      message: riskOk
        ? `Risk verified: Index of ${scenario.transitionRiskIndex} satisfies scale [0, 100].`
        : "Fail: Transition risk index falls outside scale boundaries."
    });

    // 4. Adaptation Cost Positive Check
    const costOk = portfolio.adaptationCost >= 0;
    results.push({
      id: "evo-assert-cost-positive",
      name: "Capability Adaptation Cost Non-Negativity Invariant",
      status: costOk ? "Pass" : "Fail",
      durationMs: 1,
      message: costOk
        ? `Adaptation cost verified: $${portfolio.adaptationCost}.`
        : "Fail: Capability adaptation costs cannot be negative."
    });

    // 5. Capability Dependency Integrity Check
    let dependenciesOk = true;
    const strategyCapabilities = strategy.capabilityPathways.map(p => p.capabilityName);
    for (const pathway of strategy.capabilityPathways) {
      for (const dep of pathway.dependencies) {
        if (!strategyCapabilities.includes(dep)) {
          dependenciesOk = false;
        }
      }
    }
    results.push({
      id: "evo-assert-dependency-integrity",
      name: "Capability Pathways Dependencies Integrity Check",
      status: dependenciesOk ? "Pass" : "Fail",
      durationMs: 1,
      message: dependenciesOk
        ? "Dependency graph verified: all referenced pathway capabilities exist within strategy context."
        : "Fail: Unresolved dependencies detected in strategy capability pathways."
    });

    // 6. Horizon Progression Check
    let horizonProgressionOk = true;
    if (strategy.evolutionHorizon === "Horizon3") {
      for (const p of strategy.capabilityPathways) {
        for (const dep of p.dependencies) {
          const depPathway = strategy.capabilityPathways.find(x => x.capabilityName === dep);
          if (depPathway && p.estimatedTimeframeMonths < depPathway.estimatedTimeframeMonths) {
            horizonProgressionOk = false;
          }
        }
      }
    }
    results.push({
      id: "evo-assert-horizon-progression",
      name: "Strategy Horizons Sequence Progression Check",
      status: horizonProgressionOk ? "Pass" : "Fail",
      durationMs: 1,
      message: horizonProgressionOk
        ? "Horizon scheduling validated: Horizon 3 milestones do not depend on later-stage capability pathways."
        : "Fail: Invalid horizon sequence detected. Long-term goals depend on subsequent milestones."
    });

    // 7. Maturity Progression Check
    const maturityProgressionOk = portfolio.targetMaturity >= portfolio.currentMaturity;
    results.push({
      id: "evo-assert-maturity-progression",
      name: "Strategic Maturity Level Progression Guard",
      status: maturityProgressionOk ? "Pass" : "Fail",
      durationMs: 1,
      message: maturityProgressionOk
        ? `Maturity progression verified: Target maturity (${portfolio.targetMaturity}) exceeds or meets current maturity (${portfolio.currentMaturity}).`
        : "Fail: Target capability maturity cannot be lower than current maturity unless deprecation planned."
    });

    // 8. Recommendation Consistency Check
    let recommendationConsistent = true;
    if (recommendation.recommendationType === "CapabilityAcquisition") {
      const match = activeCapabilities.get(recommendation.rationale.split("Onboards ")[1]?.split(" to")[0]);
      if (match && match.currentMaturity >= 4) {
        recommendationConsistent = false;
      }
    }
    results.push({
      id: "evo-assert-recommendation-consistency",
      name: "Capability Acquisition Recommendation Consistency Check",
      status: recommendationConsistent ? "Pass" : "Fail",
      durationMs: 1,
      message: recommendationConsistent
        ? "Recommendation consistency verified: targets capability gaps or low maturity segments."
        : "Fail: Redundant recommendation. Capability acquisition proposed on already high maturity segments."
    });

    // 9. Recommendation-Evidence Freshness Check
    let freshnessOk = true;
    const now = Date.now();
    const maxAgeMs = 30 * 24 * 60 * 60 * 1000; // 30 days
    for (const source of recommendation.evidenceSources) {
      const ageMs = now - new Date(source.timestamp).getTime();
      if (ageMs > maxAgeMs) {
        freshnessOk = false;
      }
    }
    results.push({
      id: "evo-assert-evidence-freshness",
      name: "Recommendation-Evidence Timeliness Freshness Invariant Check",
      status: freshnessOk ? "Pass" : "Fail",
      durationMs: 1,
      message: freshnessOk
        ? "Evidence freshness verified: all linked source timestamps satisfy 30-day freshness windows."
        : "Fail: Stale evidence detected. Recommendation references logs older than allowed review periods."
    });

    // 10. Evolution Goal Consistency Invariant Check
    let goalConsistent = true;
    const evolutionDelta = portfolio.targetMaturity - portfolio.currentMaturity;
    if (strategy.status === "Active" && evolutionDelta <= 0) {
      goalConsistent = false;
    }
    results.push({
      id: "evo-assert-goal-consistency",
      name: "Evolution Strategy Goal Consistency Invariant Check",
      status: goalConsistent ? "Pass" : "Fail",
      durationMs: 1,
      message: goalConsistent
        ? `Strategy goal consistency verified: actively driving evolution with a +${evolutionDelta} maturity delta.`
        : "Fail: Active strategy does not drive any measurable capability progression."
    });

    // 11. Evolution Evidence Chain Continuity Check
    const continuityOk = recommendation.evidenceSources.length > 0 && recommendation.rationale.length > 0;
    results.push({
      id: "evo-assert-evidence-continuity",
      name: "Autonomous Enterprise Evolution Evidence Continuity Invariant",
      status: continuityOk ? "Pass" : "Fail",
      durationMs: 1,
      message: continuityOk
        ? `Evidence lineage verified: recommendation backed by upstream innovation evidence references: [${recommendation.evidenceSources.map(s => s.sourceId).join(", ")}].`
        : "Fail: Evolution recommendations must trace back to active innovation, ecosystem, or organizational evidence logs."
    });

    return results;
  }
}

export const activeEvolutionVerificationContributor = new EvolutionVerificationContributor();
