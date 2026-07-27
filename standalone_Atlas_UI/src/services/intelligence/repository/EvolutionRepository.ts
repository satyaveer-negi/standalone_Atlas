import { EvolutionStrategyModel } from "../evolution/EvolutionStrategyModel";
import { AdaptiveCapabilityPortfolio } from "../evolution/AdaptiveCapabilityPortfolio";
import { EvolutionAssessment } from "../evolution/EvolutionAssessment";
import { EvolutionScenario } from "../evolution/EvolutionScenario";
import { EvolutionRecommendation } from "../evolution/EvolutionRecommendation";

export class EvolutionRepository {
  private strategies = new Map<string, EvolutionStrategyModel>();
  private portfolios = new Map<string, AdaptiveCapabilityPortfolio>();
  private assessments = new Map<string, EvolutionAssessment>();
  private scenarios = new Map<string, EvolutionScenario>();
  private recommendations = new Map<string, EvolutionRecommendation>();

  public saveStrategy(model: EvolutionStrategyModel): void {
    this.strategies.set(model.strategyId, model);
  }

  public savePortfolio(portfolio: AdaptiveCapabilityPortfolio): void {
    this.portfolios.set(portfolio.portfolioId, portfolio);
  }

  public saveAssessment(ea: EvolutionAssessment): void {
    this.assessments.set(ea.assessmentId, ea);
  }

  public saveScenario(es: EvolutionScenario): void {
    this.scenarios.set(es.scenarioId, es);
  }

  public saveRecommendation(rec: EvolutionRecommendation): void {
    this.recommendations.set(rec.recommendationId, rec);
  }

  public getStrategiesList(): EvolutionStrategyModel[] {
    return Array.from(this.strategies.values());
  }

  public getPortfoliosList(): AdaptiveCapabilityPortfolio[] {
    return Array.from(this.portfolios.values());
  }

  public getAssessmentsList(): EvolutionAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getScenariosList(): EvolutionScenario[] {
    return Array.from(this.scenarios.values());
  }

  public getRecommendationsList(): EvolutionRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  public clear(): void {
    this.strategies.clear();
    this.portfolios.clear();
    this.assessments.clear();
    this.scenarios.clear();
    this.recommendations.clear();
  }
}

export const activeEvolutionRepository = new EvolutionRepository();
