import { OrganizationalCapabilityModel } from "../organization/OrganizationalCapabilityModel";
import { TransformationProgram } from "../organization/TransformationProgram";
import { OperatingModelAssessment } from "../organization/OperatingModelAssessment";
import { OrganizationalScenario } from "../organization/OrganizationalScenario";
import { TransformationRecommendation } from "../organization/TransformationRecommendation";

export class OrganizationRepository {
  private capabilities = new Map<string, OrganizationalCapabilityModel>();
  private programs = new Map<string, TransformationProgram>();
  private assessments = new Map<string, OperatingModelAssessment>();
  private scenarios = new Map<string, OrganizationalScenario>();
  private recommendations = new Map<string, TransformationRecommendation>();

  public saveCapability(cm: OrganizationalCapabilityModel): void {
    this.capabilities.set(cm.capabilityId, cm);
  }

  public saveProgram(prog: TransformationProgram): void {
    this.programs.set(prog.programId, prog);
  }

  public saveAssessment(oma: OperatingModelAssessment): void {
    this.assessments.set(oma.assessmentId, oma);
  }

  public saveScenario(os: OrganizationalScenario): void {
    this.scenarios.set(os.scenarioId, os);
  }

  public saveRecommendation(rec: TransformationRecommendation): void {
    this.recommendations.set(rec.recommendationId, rec);
  }

  public getCapabilitiesList(): OrganizationalCapabilityModel[] {
    return Array.from(this.capabilities.values());
  }

  public getProgramsList(): TransformationProgram[] {
    return Array.from(this.programs.values());
  }

  public getAssessmentsList(): OperatingModelAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getScenariosList(): OrganizationalScenario[] {
    return Array.from(this.scenarios.values());
  }

  public getRecommendationsList(): TransformationRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  public clear(): void {
    this.capabilities.clear();
    this.programs.clear();
    this.assessments.clear();
    this.scenarios.clear();
    this.recommendations.clear();
  }
}

export const activeOrganizationRepository = new OrganizationRepository();
