import type { EngineeringValueModel } from "../economics/EngineeringValueModel";
import type { BenefitRealizationPlan } from "../economics/BenefitRealizationPlan";
import type { PortfolioValueAssessment } from "../economics/PortfolioValueAssessment";
import type { EconomicScenario } from "../economics/EconomicScenario";
import type { ValueForecast } from "../economics/ValueForecast";

export class EconomicsRepository {
  private valueModels = new Map<string, EngineeringValueModel>();
  private benefitPlans = new Map<string, BenefitRealizationPlan>();
  private portfolioAssessments = new Map<string, PortfolioValueAssessment>();
  private economicScenarios = new Map<string, EconomicScenario>();
  private valueForecasts = new Map<string, ValueForecast>();

  public saveValueModel(ev: EngineeringValueModel): void {
    this.valueModels.set(ev.valueModelId, ev);
  }

  public saveBenefitPlan(bp: BenefitRealizationPlan): void {
    this.benefitPlans.set(bp.planId, bp);
  }

  public savePortfolioAssessment(pa: PortfolioValueAssessment): void {
    this.portfolioAssessments.set(pa.assessmentId, pa);
  }

  public saveEconomicScenario(es: EconomicScenario): void {
    this.economicScenarios.set(es.scenarioId, es);
  }

  public saveValueForecast(vf: ValueForecast): void {
    this.valueForecasts.set(vf.forecastId, vf);
  }

  public getValueModelsList(): EngineeringValueModel[] {
    return Array.from(this.valueModels.values());
  }

  public getBenefitPlansList(): BenefitRealizationPlan[] {
    return Array.from(this.benefitPlans.values());
  }

  public getPortfolioAssessmentsList(): PortfolioValueAssessment[] {
    return Array.from(this.portfolioAssessments.values());
  }

  public getEconomicScenariosList(): EconomicScenario[] {
    return Array.from(this.economicScenarios.values());
  }

  public getValueForecastsList(): ValueForecast[] {
    return Array.from(this.valueForecasts.values());
  }

  public clear(): void {
    this.valueModels.clear();
    this.benefitPlans.clear();
    this.portfolioAssessments.clear();
    this.economicScenarios.clear();
    this.valueForecasts.clear();
  }
}

export const activeEconomicsRepository = new EconomicsRepository();
