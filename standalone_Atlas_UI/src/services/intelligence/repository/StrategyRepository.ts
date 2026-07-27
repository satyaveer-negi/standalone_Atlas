import { StrategicObjective } from "../strategy/StrategicObjective";
import { KnowledgeAsset } from "../strategy/KnowledgeAsset";
import { CapabilityMaturityModel } from "../strategy/CapabilityMaturityModel";
import { StrategicInvestmentPlan } from "../strategy/StrategicInvestmentPlan";
import { TechnologyRoadmap } from "../strategy/TechnologyRoadmap";
import { InnovationPortfolio } from "../strategy/InnovationPortfolio";

export class StrategyRepository {
  private objectives = new Map<string, StrategicObjective>();
  private assets = new Map<string, KnowledgeAsset>();
  private models = new Map<string, CapabilityMaturityModel>();
  private plans = new Map<string, StrategicInvestmentPlan>();
  private roadmaps = new Map<string, TechnologyRoadmap>();
  private innovations = new Map<string, InnovationPortfolio>();

  public saveObjective(so: StrategicObjective): void {
    this.objectives.set(so.objectiveId, so);
  }

  public saveAsset(ka: KnowledgeAsset): void {
    this.assets.set(ka.knowledgeAssetId, ka);
  }

  public saveModel(cm: CapabilityMaturityModel): void {
    this.models.set(cm.capabilityId, cm);
  }

  public savePlan(sip: StrategicInvestmentPlan): void {
    this.plans.set(sip.investmentPlanId, sip);
  }

  public saveRoadmap(tr: TechnologyRoadmap): void {
    this.roadmaps.set(tr.roadmapId, tr);
  }

  public saveInnovation(ip: InnovationPortfolio): void {
    this.innovations.set(ip.innovationId, ip);
  }

  public getObjectivesList(): StrategicObjective[] {
    return Array.from(this.objectives.values());
  }

  public getAssetsList(): KnowledgeAsset[] {
    return Array.from(this.assets.values());
  }

  public getModelsList(): CapabilityMaturityModel[] {
    return Array.from(this.models.values());
  }

  public getPlansList(): StrategicInvestmentPlan[] {
    return Array.from(this.plans.values());
  }

  public getRoadmapsList(): TechnologyRoadmap[] {
    return Array.from(this.roadmaps.values());
  }

  public getInnovationsList(): InnovationPortfolio[] {
    return Array.from(this.innovations.values());
  }

  public clear(): void {
    this.objectives.clear();
    this.assets.clear();
    this.models.clear();
    this.plans.clear();
    this.roadmaps.clear();
    this.innovations.clear();
  }
}

export const activeStrategyRepository = new StrategyRepository();
