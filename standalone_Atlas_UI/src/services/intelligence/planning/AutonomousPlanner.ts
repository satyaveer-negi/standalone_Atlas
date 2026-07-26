import { EngineeringIntent } from "../intent/EngineeringIntent";
import { activePlanGenerator } from "./PlanGenerator";
import { activeWorkflowEvaluator } from "./WorkflowEvaluator";
import { activeTradeoffAnalyzer } from "./TradeoffAnalyzer";
import { activePlanRanker } from "./PlanRanker";
import { activeExecutionAdvisor } from "./ExecutionAdvisor";
import { PlanningResult } from "./PlanningResult";

export class AutonomousPlanner {
  public plan(intent: EngineeringIntent): PlanningResult {
    const candidates = activePlanGenerator.generateCandidates(intent);
    
    // Evaluate, analyze tradeoffs, and rank
    const ranked = activePlanRanker.rank(candidates, intent);
    const advice = activeExecutionAdvisor.formulateAdvice(ranked);

    const tradeoffs = candidates.map(cand => ({
      candidateId: cand.id,
      stats: activeTradeoffAnalyzer.analyze(cand)
    }));

    const rankings = ranked.map(rk => ({
      candidateId: rk.candidate.id,
      scoreVector: rk.scoreVector
    }));

    return {
      intent,
      candidates,
      rankings,
      tradeoffs,
      recommendationAdvice: advice,
      confidence: ranked[0]?.candidate.confidence || 0.9,
      explainabilityEvidenceId: `exp-trace-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  }
}

export const activeAutonomousPlanner = new AutonomousPlanner();
