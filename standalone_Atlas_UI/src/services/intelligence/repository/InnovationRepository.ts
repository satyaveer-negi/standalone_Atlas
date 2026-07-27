import { KnowledgeNetworkModel } from "../innovation/KnowledgeNetworkModel";
import { InnovationProgram } from "../innovation/InnovationProgram";
import { KnowledgeExchangeAssessment } from "../innovation/KnowledgeExchangeAssessment";
import { InnovationScenario } from "../innovation/InnovationScenario";
import { InnovationRecommendation } from "../innovation/InnovationRecommendation";

export class InnovationRepository {
  private domains = new Map<string, KnowledgeNetworkModel>();
  private programs = new Map<string, InnovationProgram>();
  private assessments = new Map<string, KnowledgeExchangeAssessment>();
  private scenarios = new Map<string, InnovationScenario>();
  private recommendations = new Map<string, InnovationRecommendation>();

  public saveDomain(model: KnowledgeNetworkModel): void {
    this.domains.set(model.domainId, model);
  }

  public saveProgram(prog: InnovationProgram): void {
    this.programs.set(prog.programId, prog);
  }

  public saveAssessment(ka: KnowledgeExchangeAssessment): void {
    this.assessments.set(ka.assessmentId, ka);
  }

  public saveScenario(es: InnovationScenario): void {
    this.scenarios.set(es.scenarioId, es);
  }

  public saveRecommendation(rec: InnovationRecommendation): void {
    this.recommendations.set(rec.recommendationId, rec);
  }

  public getDomainsList(): KnowledgeNetworkModel[] {
    return Array.from(this.domains.values());
  }

  public getProgramsList(): InnovationProgram[] {
    return Array.from(this.programs.values());
  }

  public getAssessmentsList(): KnowledgeExchangeAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getScenariosList(): InnovationScenario[] {
    return Array.from(this.scenarios.values());
  }

  public getRecommendationsList(): InnovationRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  public clear(): void {
    this.domains.clear();
    this.programs.clear();
    this.assessments.clear();
    this.scenarios.clear();
    this.recommendations.clear();
  }
}

export const activeInnovationRepository = new InnovationRepository();
