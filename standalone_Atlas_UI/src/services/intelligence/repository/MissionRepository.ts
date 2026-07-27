import { MissionDefinition } from "../mission/MissionDefinition";
import { MissionObjective } from "../mission/MissionObjective";
import { MissionState } from "../mission/MissionState";
import { AdaptiveExecutionPlan } from "../mission/AdaptiveExecutionPlan";
import { MissionAssuranceAssessment } from "../mission/MissionAssuranceAssessment";

export class MissionRepository {
  private definitions = new Map<string, MissionDefinition>();
  private objectives = new Map<string, MissionObjective>();
  private states = new Map<string, MissionState>();
  private plans = new Map<string, AdaptiveExecutionPlan>();
  private assessments = new Map<string, MissionAssuranceAssessment>();

  public saveDefinition(md: MissionDefinition): void {
    this.definitions.set(md.missionId, md);
  }

  public saveObjective(mo: MissionObjective): void {
    this.objectives.set(mo.objectiveId, mo);
  }

  public saveState(ms: MissionState): void {
    this.states.set(ms.stateId, ms);
  }

  public savePlan(ap: AdaptiveExecutionPlan): void {
    this.plans.set(ap.planId, ap);
  }

  public saveAssessment(ma: MissionAssuranceAssessment): void {
    this.assessments.set(ma.assessmentId, ma);
  }

  public getDefinitionsList(): MissionDefinition[] {
    return Array.from(this.definitions.values());
  }

  public getObjectivesList(): MissionObjective[] {
    return Array.from(this.objectives.values());
  }

  public getStatesList(): MissionState[] {
    return Array.from(this.states.values());
  }

  public getPlansList(): AdaptiveExecutionPlan[] {
    return Array.from(this.plans.values());
  }

  public getAssessmentsList(): MissionAssuranceAssessment[] {
    return Array.from(this.assessments.values());
  }

  public clear(): void {
    this.definitions.clear();
    this.objectives.clear();
    this.states.clear();
    this.plans.clear();
    this.assessments.clear();
  }
}

export const activeMissionRepository = new MissionRepository();
