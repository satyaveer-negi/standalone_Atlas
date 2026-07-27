import { EnterpriseNetworkModel } from "../ecosystem/EnterpriseNetworkModel";
import { CollaborationProgram } from "../ecosystem/CollaborationProgram";
import { EcosystemAssessment } from "../ecosystem/EcosystemAssessment";
import { EcosystemScenario } from "../ecosystem/EcosystemScenario";
import { CollaborationRecommendation } from "../ecosystem/CollaborationRecommendation";

export class EcosystemRepository {
  private networks = new Map<string, EnterpriseNetworkModel>();
  private programs = new Map<string, CollaborationProgram>();
  private assessments = new Map<string, EcosystemAssessment>();
  private scenarios = new Map<string, EcosystemScenario>();
  private recommendations = new Map<string, CollaborationRecommendation>();

  public saveNetwork(model: EnterpriseNetworkModel): void {
    this.networks.set(model.networkId, model);
  }

  public saveProgram(prog: CollaborationProgram): void {
    this.programs.set(prog.programId, prog);
  }

  public saveAssessment(ea: EcosystemAssessment): void {
    this.assessments.set(ea.assessmentId, ea);
  }

  public saveScenario(es: EcosystemScenario): void {
    this.scenarios.set(es.scenarioId, es);
  }

  public saveRecommendation(rec: CollaborationRecommendation): void {
    this.recommendations.set(rec.recommendationId, rec);
  }

  public getNetworksList(): EnterpriseNetworkModel[] {
    return Array.from(this.networks.values());
  }

  public getProgramsList(): CollaborationProgram[] {
    return Array.from(this.programs.values());
  }

  public getAssessmentsList(): EcosystemAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getScenariosList(): EcosystemScenario[] {
    return Array.from(this.scenarios.values());
  }

  public getRecommendationsList(): CollaborationRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  public clear(): void {
    this.networks.clear();
    this.programs.clear();
    this.assessments.clear();
    this.scenarios.clear();
    this.recommendations.clear();
  }
}

export const activeEcosystemRepository = new EcosystemRepository();
