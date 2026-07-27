import { OptimizationProgram } from "../optimization/OptimizationProgram";
import { OptimizationRecommendation } from "../optimization/OptimizationRecommendation";
import { OptimizationExperiment } from "../optimization/OptimizationExperiment";
import { StrategyEvaluator } from "../optimization/StrategyEvaluator";
import { PortfolioEvolutionPlan } from "../optimization/PortfolioEvolutionPlan";

export class OptimizationRepository {
  private programs = new Map<string, OptimizationProgram>();
  private recommendations = new Map<string, OptimizationRecommendation>();
  private experiments = new Map<string, OptimizationExperiment>();
  private evaluators = new Map<string, StrategyEvaluator>();
  private evolutionPlans = new Map<string, PortfolioEvolutionPlan>();

  public saveProgram(op: OptimizationProgram): void {
    this.programs.set(op.optimizationProgramId, op);
  }

  public saveRecommendation(or: OptimizationRecommendation): void {
    this.recommendations.set(or.recommendationId, or);
  }

  public saveExperiment(oe: OptimizationExperiment): void {
    this.experiments.set(oe.experimentId, oe);
  }

  public saveEvaluator(se: StrategyEvaluator): void {
    this.evaluators.set(se.evaluationId, se);
  }

  public saveEvolutionPlan(pe: PortfolioEvolutionPlan): void {
    this.evolutionPlans.set(pe.evolutionPlanId, pe);
  }

  public getProgramsList(): OptimizationProgram[] {
    return Array.from(this.programs.values());
  }

  public getRecommendationsList(): OptimizationRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  public getExperimentsList(): OptimizationExperiment[] {
    return Array.from(this.experiments.values());
  }

  public getEvaluatorsList(): StrategyEvaluator[] {
    return Array.from(this.evaluators.values());
  }

  public getEvolutionPlansList(): PortfolioEvolutionPlan[] {
    return Array.from(this.evolutionPlans.values());
  }

  public clear(): void {
    this.programs.clear();
    this.recommendations.clear();
    this.experiments.clear();
    this.evaluators.clear();
    this.evolutionPlans.clear();
  }
}

export const activeOptimizationRepository = new OptimizationRepository();
