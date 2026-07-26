import { EngineeringIntent } from "../intent/EngineeringIntent";
import { activePlanGenerator, PlanningCandidate } from "./PlanGenerator";
import { activeWorkflowEvaluator } from "./WorkflowEvaluator";
import { activeTradeoffAnalyzer, TradeoffMetrics } from "./TradeoffAnalyzer";
import { activePlanRanker, RankedCandidate } from "./PlanRanker";
import { activeExecutionAdvisor } from "./ExecutionAdvisor";

export interface PlanEvaluationNode {
  candidate: PlanningCandidate;
  feasible: boolean;
  score: number;
  tradeoffs: TradeoffMetrics;
}

export interface PlanningResult {
  intentId: string;
  evaluations: PlanEvaluationNode[];
  recommendationAdvice: string;
}

export class AutonomousPlanner {
  public plan(intent: EngineeringIntent): PlanningResult {
    const candidates = activePlanGenerator.generateCandidates(intent);
    
    // Evaluate, analyze tradeoffs, and rank
    const ranked = activePlanRanker.rank(candidates, intent);
    const evaluations: PlanEvaluationNode[] = ranked.map(rk => {
      const evalReport = activeWorkflowEvaluator.evaluate(rk.candidate, intent);
      const tradeoffs = activeTradeoffAnalyzer.analyze(rk.candidate);

      return {
        candidate: rk.candidate,
        feasible: evalReport.feasible,
        score: rk.score,
        tradeoffs
      };
    });

    const advice = activeExecutionAdvisor.formulateAdvice(ranked);

    return {
      intentId: intent.id,
      evaluations,
      recommendationAdvice: advice
    };
  }
}

export const activeAutonomousPlanner = new AutonomousPlanner();
