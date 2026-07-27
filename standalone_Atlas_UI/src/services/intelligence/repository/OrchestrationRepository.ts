import { EnterpriseIntelligenceModel } from "../orchestration/EnterpriseIntelligenceModel";
import { AutonomousDecisionOrchestrator } from "../orchestration/AutonomousDecisionOrchestrator";
import { EnterpriseStateAssessment } from "../orchestration/EnterpriseStateAssessment";
import { EnterpriseSimulation } from "../orchestration/EnterpriseSimulation";
import { ConstitutionalEvolutionRecommendation } from "../orchestration/ConstitutionalEvolutionRecommendation";

export class OrchestrationRepository {
  private models = new Map<string, EnterpriseIntelligenceModel>();
  private orchestrations = new Map<string, AutonomousDecisionOrchestrator>();
  private assessments = new Map<string, EnterpriseStateAssessment>();
  private simulations = new Map<string, EnterpriseSimulation>();
  private recommendations = new Map<string, ConstitutionalEvolutionRecommendation>();

  public saveModel(model: EnterpriseIntelligenceModel): void {
    this.models.set(model.orchestrationId, model);
  }

  public saveOrchestration(orch: AutonomousDecisionOrchestrator): void {
    this.orchestrations.set(orch.decisionId, orch);
  }

  public saveAssessment(ea: EnterpriseStateAssessment): void {
    this.assessments.set(ea.assessmentId, ea);
  }

  public saveSimulation(es: EnterpriseSimulation): void {
    this.simulations.set(es.simulationId, es);
  }

  public saveRecommendation(rec: ConstitutionalEvolutionRecommendation): void {
    this.recommendations.set(rec.recommendationId, rec);
  }

  public getModelsList(): EnterpriseIntelligenceModel[] {
    return Array.from(this.models.values());
  }

  public getOrchestrationsList(): AutonomousDecisionOrchestrator[] {
    return Array.from(this.orchestrations.values());
  }

  public getAssessmentsList(): EnterpriseStateAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getSimulationsList(): EnterpriseSimulation[] {
    return Array.from(this.simulations.values());
  }

  public getRecommendationsList(): ConstitutionalEvolutionRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  public clear(): void {
    this.models.clear();
    this.orchestrations.clear();
    this.assessments.clear();
    this.simulations.clear();
    this.recommendations.clear();
  }
}

export const activeOrchestrationRepository = new OrchestrationRepository();
