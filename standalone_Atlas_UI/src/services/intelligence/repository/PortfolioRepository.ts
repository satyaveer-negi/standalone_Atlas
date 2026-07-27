import { MissionPortfolio } from "../portfolio/MissionPortfolio";
import { CrossMissionDependency } from "../portfolio/CrossMissionDependency";
import { ResourceAllocationPlan } from "../portfolio/ResourceAllocationPlan";
import { SystemOrchestrator } from "../portfolio/SystemOrchestrator";
import { PortfolioAssessment } from "../portfolio/PortfolioAssessment";

export class PortfolioRepository {
  private portfolios = new Map<string, MissionPortfolio>();
  private dependencies = new Map<string, CrossMissionDependency>();
  private resourcePlans = new Map<string, ResourceAllocationPlan>();
  private orchestrators = new Map<string, SystemOrchestrator>();
  private assessments = new Map<string, PortfolioAssessment>();

  public savePortfolio(mp: MissionPortfolio): void {
    this.portfolios.set(mp.portfolioId, mp);
  }

  public saveDependency(cmd: CrossMissionDependency): void {
    this.dependencies.set(cmd.dependencyId, cmd);
  }

  public saveResourcePlan(rap: ResourceAllocationPlan): void {
    this.resourcePlans.set(rap.allocationId, rap);
  }

  public saveOrchestrator(so: SystemOrchestrator): void {
    this.orchestrators.set(so.orchestratorId, so);
  }

  public saveAssessment(pa: PortfolioAssessment): void {
    this.assessments.set(pa.assessmentId, pa);
  }

  public getPortfoliosList(): MissionPortfolio[] {
    return Array.from(this.portfolios.values());
  }

  public getDependenciesList(): CrossMissionDependency[] {
    return Array.from(this.dependencies.values());
  }

  public getResourcePlansList(): ResourceAllocationPlan[] {
    return Array.from(this.resourcePlans.values());
  }

  public getOrchestratorsList(): SystemOrchestrator[] {
    return Array.from(this.orchestrators.values());
  }

  public getAssessmentsList(): PortfolioAssessment[] {
    return Array.from(this.assessments.values());
  }

  public clear(): void {
    this.portfolios.clear();
    this.dependencies.clear();
    this.resourcePlans.clear();
    this.orchestrators.clear();
    this.assessments.clear();
  }
}

export const activePortfolioRepository = new PortfolioRepository();
