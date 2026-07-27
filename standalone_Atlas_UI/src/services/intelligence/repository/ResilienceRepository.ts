import { ResiliencePlan } from "../resilience/ResiliencePlan";
import { FailureScenario } from "../resilience/FailureScenario";
import { RecoveryStrategy } from "../resilience/RecoveryStrategy";
import { ContinuityPlan } from "../resilience/ContinuityPlan";
import { ResilienceAssessment } from "../resilience/ResilienceAssessment";
import { FailureEvent } from "../resilience/FailureEvent";
import { RecoveryExecution } from "../resilience/RecoveryExecution";
import { DependencyModel } from "../resilience/DependencyModel";

export class ResilienceRepository {
  private plans = new Map<string, ResiliencePlan>();
  private scenarios = new Map<string, FailureScenario>();
  private strategies = new Map<string, RecoveryStrategy>();
  private continuityPlans = new Map<string, ContinuityPlan>();
  private assessments = new Map<string, ResilienceAssessment>();
  private events = new Map<string, FailureEvent>();
  private executions = new Map<string, RecoveryExecution>();
  private dependencies = new Map<string, DependencyModel>();

  public savePlan(rp: ResiliencePlan): void {
    this.plans.set(rp.planId, rp);
  }

  public saveScenario(fs: FailureScenario): void {
    this.scenarios.set(fs.scenarioId, fs);
  }

  public saveStrategy(rs: RecoveryStrategy): void {
    this.strategies.set(rs.strategyId, rs);
  }

  public saveContinuityPlan(cp: ContinuityPlan): void {
    this.continuityPlans.set(cp.continuityPlanId, cp);
  }

  public saveAssessment(ra: ResilienceAssessment): void {
    this.assessments.set(ra.assessmentId, ra);
  }

  public saveEvent(fe: FailureEvent): void {
    this.events.set(fe.eventId, fe);
  }

  public saveExecution(re: RecoveryExecution): void {
    this.executions.set(re.executionId, re);
  }

  public saveDependencyModel(dm: DependencyModel): void {
    this.dependencies.set(dm.modelId, dm);
  }

  public getPlansList(): ResiliencePlan[] {
    return Array.from(this.plans.values());
  }

  public getScenariosList(): FailureScenario[] {
    return Array.from(this.scenarios.values());
  }

  public getStrategiesList(): RecoveryStrategy[] {
    return Array.from(this.strategies.values());
  }

  public getContinuityPlansList(): ContinuityPlan[] {
    return Array.from(this.continuityPlans.values());
  }

  public getAssessmentsList(): ResilienceAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getEventsList(): FailureEvent[] {
    return Array.from(this.events.values());
  }

  public getExecutionsList(): RecoveryExecution[] {
    return Array.from(this.executions.values());
  }

  public getDependenciesList(): DependencyModel[] {
    return Array.from(this.dependencies.values());
  }

  public clear(): void {
    this.plans.clear();
    this.scenarios.clear();
    this.strategies.clear();
    this.continuityPlans.clear();
    this.assessments.clear();
    this.events.clear();
    this.executions.clear();
    this.dependencies.clear();
  }
}

export const activeResilienceRepository = new ResilienceRepository();
