import { RiskCase } from "../risk/RiskCase";
import { Hazard } from "../risk/Hazard";
import { MitigationPlan } from "../risk/MitigationPlan";
import { SafetyCase } from "../risk/SafetyCase";
import { RiskAssessment } from "../risk/RiskAssessment";
import { ResidualRiskAssessment } from "../risk/ResidualRiskAssessment";
import { IncidentRecord } from "../risk/IncidentRecord";

export class RiskRepository {
  private cases = new Map<string, RiskCase>();
  private assessments = new Map<string, RiskAssessment>();
  private residualAssessments = new Map<string, ResidualRiskAssessment>();
  private hazards = new Map<string, Hazard>();
  private mitigations = new Map<string, MitigationPlan>();
  private safetyCases = new Map<string, SafetyCase>();
  private incidents = new Map<string, IncidentRecord>();

  public saveCase(rc: RiskCase): void {
    this.cases.set(rc.caseId, rc);
  }

  public saveAssessment(ra: RiskAssessment): void {
    this.assessments.set(ra.assessmentId, ra);
  }

  public saveResidualAssessment(rra: ResidualRiskAssessment): void {
    this.residualAssessments.set(rra.residualAssessmentId, rra);
  }

  public saveHazard(h: Hazard): void {
    this.hazards.set(h.hazardId, h);
  }

  public saveMitigation(mp: MitigationPlan): void {
    this.mitigations.set(mp.mitigationPlanId, mp);
  }

  public saveSafetyCase(sc: SafetyCase): void {
    this.safetyCases.set(sc.safetyCaseId, sc);
  }

  public saveIncident(ir: IncidentRecord): void {
    this.incidents.set(ir.incidentId, ir);
  }

  public getCasesList(): RiskCase[] {
    return Array.from(this.cases.values());
  }

  public getAssessmentsList(): RiskAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getResidualAssessmentsList(): ResidualRiskAssessment[] {
    return Array.from(this.residualAssessments.values());
  }

  public getHazardsList(): Hazard[] {
    return Array.from(this.hazards.values());
  }

  public getMitigationsList(): MitigationPlan[] {
    return Array.from(this.mitigations.values());
  }

  public getSafetyCasesList(): SafetyCase[] {
    return Array.from(this.safetyCases.values());
  }

  public getIncidentsList(): IncidentRecord[] {
    return Array.from(this.incidents.values());
  }

  public clear(): void {
    this.cases.clear();
    this.assessments.clear();
    this.residualAssessments.clear();
    this.hazards.clear();
    this.mitigations.clear();
    this.safetyCases.clear();
    this.incidents.clear();
  }
}

export const activeRiskRepository = new RiskRepository();
