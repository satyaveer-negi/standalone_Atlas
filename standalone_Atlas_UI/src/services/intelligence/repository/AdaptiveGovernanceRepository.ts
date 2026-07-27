import { AdaptivePolicyModel } from "../governance/AdaptivePolicyModel";
import { GovernancePerformanceAssessment } from "../governance/GovernancePerformanceAssessment";
import { PolicyImpactAssessment } from "../governance/PolicyImpactAssessment";
import { GovernanceScenario } from "../governance/GovernanceScenario";
import { PolicyEvolutionRecommendation } from "../governance/PolicyEvolutionRecommendation";

export class AdaptiveGovernanceRepository {
  private policies = new Map<string, AdaptivePolicyModel>();
  private assessments = new Map<string, GovernancePerformanceAssessment>();
  private impacts = new Map<string, PolicyImpactAssessment>();
  private scenarios = new Map<string, GovernanceScenario>();
  private recommendations = new Map<string, PolicyEvolutionRecommendation>();

  public savePolicy(policy: AdaptivePolicyModel): void {
    this.policies.set(policy.policyId, policy);
  }

  public saveAssessment(pa: GovernancePerformanceAssessment): void {
    this.assessments.set(pa.assessmentId, pa);
  }

  public saveImpact(ia: PolicyImpactAssessment): void {
    this.impacts.set(ia.impactAssessmentId, ia);
  }

  public saveScenario(gs: GovernanceScenario): void {
    this.scenarios.set(gs.scenarioId, gs);
  }

  public saveRecommendation(rec: PolicyEvolutionRecommendation): void {
    this.recommendations.set(rec.recommendationId, rec);
  }

  public getPoliciesList(): AdaptivePolicyModel[] {
    return Array.from(this.policies.values());
  }

  public getAssessmentsList(): GovernancePerformanceAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getImpactsList(): PolicyImpactAssessment[] {
    return Array.from(this.impacts.values());
  }

  public getScenariosList(): GovernanceScenario[] {
    return Array.from(this.scenarios.values());
  }

  public getRecommendationsList(): PolicyEvolutionRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  public clear(): void {
    this.policies.clear();
    this.assessments.clear();
    this.impacts.clear();
    this.scenarios.clear();
    this.recommendations.clear();
  }
}

export const activeAdaptiveGovernanceRepository = new AdaptiveGovernanceRepository();
